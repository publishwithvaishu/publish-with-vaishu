import "server-only";
import crypto from "crypto";

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

/** Whether Razorpay credentials are configured. */
export function razorpayConfigured(): boolean {
  return !!(KEY_ID && KEY_SECRET);
}

/** Public key id (safe to expose to the browser checkout). */
export function getRazorpayKeyId(): string | undefined {
  return KEY_ID;
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

/** Create a Razorpay order for the given amount (in paise) via the REST API. */
export async function createRazorpayOrder(
  amountPaise: number,
  receipt: string,
): Promise<RazorpayOrder> {
  if (!KEY_ID || !KEY_SECRET) {
    throw new Error("Razorpay is not configured.");
  }
  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");
  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt,
      payment_capture: 1,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Razorpay order creation failed (${res.status}): ${body}`);
  }
  return (await res.json()) as RazorpayOrder;
}

/**
 * Verify the Razorpay payment signature (HMAC-SHA256 of
 * "order_id|payment_id" keyed with the secret). Timing-safe comparison.
 */
export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string,
): boolean {
  if (!KEY_SECRET) return false;
  const expected = crypto
    .createHmac("sha256", KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
