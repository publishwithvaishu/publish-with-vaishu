import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/types";
import type {
  Order,
  OrderItem,
  OrderStatusHistoryEntry,
} from "@/lib/orders/types";

export interface AdminOrderRow extends Order {
  customer_name: string | null;
  customer_email: string | null;
  item_count: number;
}

export interface AdminCustomer {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}

export interface AdminOrderDetail {
  order: Order;
  customer: AdminCustomer | null;
  items: OrderItem[];
  history: OrderStatusHistoryEntry[];
}

export interface AdminOrderList {
  rows: AdminOrderRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 10;

const LIST_SELECT =
  "id, order_number, grand_total, status, payment_status, payment_method, created_at, " +
  "user:users ( name, email ), order_items ( count )";

function pickUser(u: unknown): { name?: string; email?: string } {
  if (Array.isArray(u)) return u[0] ?? {};
  return (u as { name?: string; email?: string }) ?? {};
}

async function userIdsByQuery(term: string): Promise<string[]> {
  const supabase = getSupabaseAdminClient();
  const like = `%${term}%`;
  const { data } = await supabase
    .from("users")
    .select("id")
    .or(`name.ilike.${like},email.ilike.${like}`);
  return (data ?? []).map((u) => u.id as string);
}

export async function adminListOrders(params: {
  q?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminOrderList> {
  const supabase = getSupabaseAdminClient();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("orders").select(LIST_SELECT, { count: "exact" });

  if (params.status) query = query.eq("status", params.status);

  if (params.q && params.q.trim()) {
    const term = params.q.trim().replace(/[,()*]/g, " ").trim();
    if (term) {
      const ors = [`order_number.ilike.%${term}%`];
      const ids = await userIdsByQuery(term);
      if (ids.length) ors.push(`user_id.in.(${ids.join(",")})`);
      query = query.or(ors.join(","));
    }
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const rows: AdminOrderRow[] = (data ?? []).map((row) => {
    const r = row as unknown as Order & {
      user: unknown;
      order_items?: { count: number }[];
    };
    const u = pickUser(r.user);
    return {
      ...(r as Order),
      customer_name: u.name ?? null,
      customer_email: u.email ?? null,
      item_count: r.order_items?.[0]?.count ?? 0,
    };
  });

  const total = count ?? 0;
  return {
    rows,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}

export async function adminGetOrder(
  id: string,
): Promise<AdminOrderDetail | null> {
  const supabase = getSupabaseAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*, user:users ( id, name, email, phone )")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!order) return null;

  const o = order as unknown as Order & { user: unknown };
  const customer = (
    Array.isArray(o.user) ? o.user[0] : o.user
  ) as AdminCustomer | null;

  const [{ data: items }, { data: history }] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase
      .from("order_status_history")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: true }),
  ]);

  return {
    order: o as Order,
    customer: customer ?? null,
    items: (items as OrderItem[]) ?? [],
    history: (history as OrderStatusHistoryEntry[]) ?? [],
  };
}

export async function adminUpdateOrderStatus(
  id: string,
  input: {
    status: OrderStatus;
    note?: string | null;
    courier_name?: string | null;
    tracking_number?: string | null;
    tracking_url?: string | null;
  },
): Promise<void> {
  const supabase = getSupabaseAdminClient();

  const patch: Record<string, unknown> = { status: input.status };
  // Courier details apply when shipping.
  if (input.courier_name !== undefined) patch.courier_name = input.courier_name;
  if (input.tracking_number !== undefined)
    patch.tracking_number = input.tracking_number;
  if (input.tracking_url !== undefined)
    patch.tracking_url = input.tracking_url;

  const { error } = await supabase.from("orders").update(patch).eq("id", id);
  if (error) throw new Error(error.message);

  const { error: histError } = await supabase
    .from("order_status_history")
    .insert({ order_id: id, status: input.status, note: input.note ?? null });
  if (histError) throw new Error(histError.message);
}
