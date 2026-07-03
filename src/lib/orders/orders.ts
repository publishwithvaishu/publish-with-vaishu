import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  TAX_RATE,
  computeTotalsForItems,
  type PriceBreakdown,
} from "@/lib/orders/pricing";
import type {
  Order,
  OrderItem,
  OrderStatusHistoryEntry,
  OrderWithDetails,
  ShippingAddressSnapshot,
} from "@/lib/orders/types";

export interface PlaceOrderInput {
  userId: string;
  address: ShippingAddressSnapshot;
  items: { book_id: string; quantity: number }[];
  paymentMethod: string;
}

/**
 * Price a cart server-side from live DB prices and validate stock. Used to
 * compute the authoritative amount for a Razorpay order BEFORE creating the
 * actual order (which only happens after payment verification).
 */
export async function priceCart(
  items: { book_id: string; quantity: number }[],
): Promise<PriceBreakdown> {
  if (items.length === 0) throw new Error("Your cart is empty.");

  const supabase = getSupabaseAdminClient();
  const ids = items.map((i) => i.book_id);
  const { data, error } = await supabase
    .from("books")
    .select("id, price, stock, title, delivery_charge")
    .in("id", ids);
  if (error) throw new Error(error.message);

  const byId = new Map((data ?? []).map((b) => [b.id as string, b]));
  const priced: { price: number; quantity: number; delivery_charge: number | null }[] = [];
  for (const item of items) {
    const book = byId.get(item.book_id);
    if (!book) throw new Error("A book in your cart no longer exists.");
    if (item.quantity < 1) throw new Error("Invalid quantity.");
    if ((book.stock as number) < item.quantity) {
      throw new Error(`Insufficient stock for "${book.title}"`);
    }
    priced.push({
      price: book.price as number,
      quantity: item.quantity,
      delivery_charge: (book.delivery_charge as number | null) ?? null,
    });
  }
  return computeTotalsForItems(priced);
}

/** Mark an order paid and store its Razorpay identifiers. */
export async function markOrderPaid(
  orderId: string,
  refs: { razorpayOrderId: string; razorpayPaymentId: string },
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      razorpay_order_id: refs.razorpayOrderId,
      razorpay_payment_id: refs.razorpayPaymentId,
    })
    .eq("id", orderId);
  if (error) throw new Error(error.message);
}

/** Create an order atomically via the place_order RPC. */
export async function createOrder(
  input: PlaceOrderInput,
): Promise<{ orderId: string; orderNumber: string }> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .rpc("place_order", {
      p_user_id: input.userId,
      p_address: input.address,
      p_items: input.items,
      p_shipping_fee: SHIPPING_FEE,
      p_free_threshold: FREE_SHIPPING_THRESHOLD,
      p_tax_rate: TAX_RATE,
      p_payment_method: input.paymentMethod,
    })
    .single();

  if (error) throw new Error(error.message);
  const row = data as { order_id: string; order_number: string };
  return { orderId: row.order_id, orderNumber: row.order_number };
}

/** Orders for a user, newest first, with item counts. */
export async function listOrders(userId: string): Promise<
  (Order & { item_count: number })[]
> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(count)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const { order_items, ...order } = row as Order & {
      order_items: { count: number }[];
    };
    return { ...(order as Order), item_count: order_items?.[0]?.count ?? 0 };
  });
}

/** A single order (verified by owner) with its items + status history. */
export async function getOrderForUser(
  userId: string,
  orderId: string,
): Promise<OrderWithDetails | null> {
  const supabase = getSupabaseAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!order) return null;

  const [{ data: items }, { data: history }] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", orderId),
    supabase
      .from("order_status_history")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: true }),
  ]);

  return {
    order: order as Order,
    items: (items as OrderItem[]) ?? [],
    history: (history as OrderStatusHistoryEntry[]) ?? [],
  };
}
