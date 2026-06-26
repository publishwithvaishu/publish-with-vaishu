import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { Order } from "@/lib/orders/types";

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  blocked: boolean;
  created_at: string;
  order_count: number;
  total_spent: number;
}

export interface AdminUserDetail {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  blocked: boolean;
  email_verified: string | null;
  created_at: string;
}

export interface AdminUserStats {
  orderCount: number;
  totalSpent: number;
}

export interface AdminUserList {
  rows: AdminUserRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const DEFAULT_PAGE_SIZE = 10;

/** Sum of non-cancelled order totals, grouped by user, for the given ids. */
async function spendByUser(userIds: string[]): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (userIds.length === 0) return map;
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("user_id, grand_total, status")
    .in("user_id", userIds);
  for (const o of data ?? []) {
    if (o.status === "cancelled") continue;
    const uid = o.user_id as string;
    map.set(uid, (map.get(uid) ?? 0) + Number(o.grand_total ?? 0));
  }
  return map;
}

export async function adminListUsers(params: {
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<AdminUserList> {
  const supabase = getSupabaseAdminClient();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("users")
    .select("id, name, email, phone, blocked, created_at, orders ( count )", {
      count: "exact",
    });

  if (params.q && params.q.trim()) {
    const term = params.q.trim().replace(/[,()*]/g, " ").trim();
    if (term) {
      const like = `%${term}%`;
      query = query.or(
        `name.ilike.${like},email.ilike.${like},phone.ilike.${like}`,
      );
    }
  }

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  const ids = (data ?? []).map((u) => u.id as string);
  const spend = await spendByUser(ids);

  const rows: AdminUserRow[] = (data ?? []).map((u) => {
    const orders = u.orders as { count: number }[] | undefined;
    return {
      id: u.id as string,
      name: u.name as string,
      email: u.email as string,
      phone: (u.phone as string) ?? null,
      blocked: !!u.blocked,
      created_at: u.created_at as string,
      order_count: orders?.[0]?.count ?? 0,
      total_spent: spend.get(u.id as string) ?? 0,
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

export async function adminGetUser(id: string): Promise<AdminUserDetail | null> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, phone, blocked, email_verified, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as AdminUserDetail) ?? null;
}

export async function adminUserStats(userId: string): Promise<AdminUserStats> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("grand_total, status")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);

  let orderCount = 0;
  let totalSpent = 0;
  for (const o of data ?? []) {
    orderCount += 1;
    if (o.status !== "cancelled") totalSpent += Number(o.grand_total ?? 0);
  }
  return { orderCount, totalSpent };
}

export async function adminUserOrders(userId: string): Promise<
  (Order & { item_count: number })[]
> {
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items ( count )")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const { order_items, ...order } = row as Order & {
      order_items?: { count: number }[];
    };
    return { ...(order as Order), item_count: order_items?.[0]?.count ?? 0 };
  });
}

export async function setUserBlocked(
  id: string,
  blocked: boolean,
): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const { error } = await supabase
    .from("users")
    .update({ blocked })
    .eq("id", id);
  if (error) throw new Error(error.message);
}
