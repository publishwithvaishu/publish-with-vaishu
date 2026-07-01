"use server";

import { z } from "zod";
import { requireDbUser } from "@/lib/auth/session";
import { getAddress } from "@/lib/auth/addresses";
import { createOrder } from "@/lib/orders/orders";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const uuid = z.string().regex(UUID_RE, "Invalid id");

const inputSchema = z.object({
  addressId: uuid,
  items: z
    .array(
      z.object({
        bookId: uuid,
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1),
});

export type CreateOrderInput = z.infer<typeof inputSchema>;

export async function createOrderAction(
  input: CreateOrderInput,
): Promise<{ ok: boolean; orderId?: string; error?: string }> {
  const user = await requireDbUser();

  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Your cart or selected address is invalid." };
  }

  const address = await getAddress(user.id, parsed.data.addressId);
  if (!address) {
    return { ok: false, error: "Please select a valid shipping address." };
  }

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
      items: parsed.data.items.map((i) => ({
        book_id: i.bookId,
        quantity: i.quantity,
      })),
      paymentMethod: "cod", // Online payment (Razorpay) arrives in Phase 3C.
    });
    return { ok: true, orderId };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Could not place your order.",
    };
  }
}
