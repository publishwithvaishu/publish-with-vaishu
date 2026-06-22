import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD, TAX_RATE } from "@/lib/orders/pricing";
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
