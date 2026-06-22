import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function createPaymentRecord(input: {
  userId: string;
  razorpayOrderId: string;
  amount: number;
}): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("payments").insert({
    user_id: input.userId,
    razorpay_order_id: input.razorpayOrderId,
    amount: input.amount,
    currency: "INR",
    status: "created",
  });
  if (error) throw new Error(error.message);
}

export async function markPaymentPaid(
  razorpayOrderId: string,
  refs: { orderId: string; razorpayPaymentId: string; signature: string },
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("payments")
    .update({
      status: "paid",
      order_id: refs.orderId,
      razorpay_payment_id: refs.razorpayPaymentId,
      razorpay_signature: refs.signature,
      updated_at: new Date().toISOString(),
    })
    .eq("razorpay_order_id", razorpayOrderId);
  if (error) throw new Error(error.message);
}

export async function markPaymentFailed(razorpayOrderId: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("payments")
    .update({ status: "failed", updated_at: new Date().toISOString() })
    .eq("razorpay_order_id", razorpayOrderId);
  if (error) throw new Error(error.message);
}
