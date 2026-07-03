"use server";

import { z } from "zod";
import { requireDbUser } from "@/lib/auth/session";
import { getAddress } from "@/lib/auth/addresses";
import {
  createOrder,
  markOrderPaid,
  priceCart,
  getOrderForUser,
} from "@/lib/orders/orders";
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  getRazorpayKeyId,
  razorpayConfigured,
} from "@/lib/payments/razorpay";
import {
  createPaymentRecord,
  markPaymentPaid,
  markPaymentFailed,
} from "@/lib/payments/payments";
import {
  sendEmail,
  orderConfirmationContent,
  ownerOrderNotificationContent,
} from "@/lib/email/mailer";
import { getSiteUrl } from "@/lib/site-url";
import { OWNER_NOTIFICATION_EMAIL } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";

const siteUrl = () => getSiteUrl();

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const uuid = z.string().regex(UUID_RE, "Invalid id");

const cartSchema = z.object({
  addressId: uuid,
  items: z
    .array(z.object({ bookId: uuid, quantity: z.number().int().min(1).max(99) }))
    .min(1),
});

/**
 * Step 1 — create a Razorpay order for the authoritative amount (computed
 * server-side from live prices). The actual DB order is NOT created yet; it
 * is created only after the payment signature is verified.
 */
export async function createRazorpayOrderAction(input: {
  addressId: string;
  items: { bookId: string; quantity: number }[];
}): Promise<{
  ok: boolean;
  error?: string;
  keyId?: string;
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
}> {
  const user = await requireDbUser();
  if (!razorpayConfigured()) {
    return { ok: false, error: "Online payment is not available right now." };
  }

  const parsed = cartSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Your cart or address is invalid." };
  }

  const address = await getAddress(user.id, parsed.data.addressId);
  if (!address) return { ok: false, error: "Select a valid shipping address." };

  try {
    const breakdown = await priceCart(
      parsed.data.items.map((i) => ({
        book_id: i.bookId,
        quantity: i.quantity,
      })),
    );
    const amountPaise = Math.round(breakdown.total * 100);
    const rzpOrder = await createRazorpayOrder(
      amountPaise,
      `rcpt_${Date.now()}`,
    );
    await createPaymentRecord({
      userId: user.id,
      razorpayOrderId: rzpOrder.id,
      amount: breakdown.total,
    });

    return {
      ok: true,
      keyId: getRazorpayKeyId(),
      razorpayOrderId: rzpOrder.id,
      amount: amountPaise,
      currency: "INR",
    };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not start payment.",
    };
  }
}

const verifySchema = cartSchema.extend({
  razorpayOrderId: z.string().min(6),
  razorpayPaymentId: z.string().min(6),
  razorpaySignature: z.string().min(6),
});

/**
 * Step 2 — verify the signature server-side, then create the order (paid) and
 * record the payment. Never trusts the client for payment confirmation.
 */
export async function verifyPaymentAction(input: {
  addressId: string;
  items: { bookId: string; quantity: number }[];
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<{ ok: boolean; orderId?: string; error?: string }> {
  const user = await requireDbUser();

  const parsed = verifySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid payment data." };
  }
  const d = parsed.data;

  const valid = verifyRazorpaySignature(
    d.razorpayOrderId,
    d.razorpayPaymentId,
    d.razorpaySignature,
  );
  if (!valid) {
    await markPaymentFailed(d.razorpayOrderId).catch(() => {});
    return { ok: false, error: "Payment verification failed." };
  }

  const address = await getAddress(user.id, d.addressId);
  if (!address) return { ok: false, error: "Shipping address not found." };

  const snapshot = {
    full_name: address.full_name ?? "",
    mobile: address.mobile ?? "",
    email: address.email ?? null,
    address: address.address ?? "",
    city: address.city ?? "",
    state: address.state ?? "",
    pincode: address.pincode ?? "",
  };

  try {
    const { orderId } = await createOrder({
      userId: user.id,
      address: snapshot,
      items: d.items.map((i) => ({ book_id: i.bookId, quantity: i.quantity })),
      paymentMethod: "razorpay",
    });
    await markOrderPaid(orderId, {
      razorpayOrderId: d.razorpayOrderId,
      razorpayPaymentId: d.razorpayPaymentId,
    });
    await markPaymentPaid(d.razorpayOrderId, {
      orderId,
      razorpayPaymentId: d.razorpayPaymentId,
      signature: d.razorpaySignature,
    });

    // Confirmation email (best-effort — uses the existing mailer; if Resend
    // isn't configured it's logged to the server console). Never block the
    // confirmed, paid order on an email failure.
    try {
      const detail = await getOrderForUser(user.id, orderId);
      const to = user.email ?? snapshot.email;
      if (detail && to) {
        await sendEmail({
          to,
          ...orderConfirmationContent({
            orderNumber: detail.order.order_number,
            amount: formatPrice(detail.order.grand_total),
            orderUrl: `${siteUrl()}/orders/${orderId}`,
          }),
        });
      }

      // Also notify the store owner of the new (paid) order.
      if (detail) {
        const itemsSummary = detail.items
          .map((i) => `${i.quantity}x ${i.title_snapshot}`)
          .join(", ");
        await sendEmail({
          to: OWNER_NOTIFICATION_EMAIL,
          ...ownerOrderNotificationContent({
            orderNumber: detail.order.order_number,
            amount: formatPrice(detail.order.grand_total),
            paymentMethod: "razorpay",
            customerName: snapshot.full_name,
            customerEmail: to ?? null,
            itemsSummary,
            orderUrl: `${siteUrl()}/admin/orders/${orderId}`,
          }),
        });
      }
    } catch (e) {
      console.error("Order confirmation email failed:", e);
    }

    return { ok: true, orderId };
  } catch (e) {
    return {
      ok: false,
      error:
        e instanceof Error ? e.message : "Order could not be created after payment.",
    };
  }
}
