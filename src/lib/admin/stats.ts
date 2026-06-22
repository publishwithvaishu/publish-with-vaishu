import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/types";

export interface AdminRecentOrder {
  id: string;
  order_number: string;
  grand_total: number;
  status: OrderStatus;
  created_at: string;
  customer_name: string | null;
}

export interface AdminStats {
  booksCount: number;
  ordersCount: number;
  usersCount: number;
  revenue: number;
  recentOrders: AdminRecentOrder[];
  bestSellers: { title: string; qty: number }[];
  outOfStock: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = getSupabaseAdminClient();

  const [booksRes, usersRes, outOfStockRes, ordersRes, itemsRes] =
    await Promise.all([
      supabase.from("books").select("*", { count: "exact", head: true }),
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase
        .from("books")
        .select("*", { count: "exact", head: true })
        .lte("stock", 0),
      supabase
        .from("orders")
        .select(
          "id, order_number, grand_total, status, created_at, user:users(name)",
        )
        .order("created_at", { ascending: false }),
      supabase.from("order_items").select("title_snapshot, quantity"),
    ]);

  const orders = ordersRes.data ?? [];
  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + Number(o.grand_total ?? 0), 0);

  const recentOrders: AdminRecentOrder[] = orders.slice(0, 6).map((o) => {
    const user = o.user as { name?: string } | { name?: string }[] | null;
    const name = Array.isArray(user) ? user[0]?.name : user?.name;
    return {
      id: o.id as string,
      order_number: o.order_number as string,
      grand_total: Number(o.grand_total ?? 0),
      status: o.status as OrderStatus,
      created_at: o.created_at as string,
      customer_name: name ?? null,
    };
  });

  const counts = new Map<string, number>();
  for (const it of itemsRes.data ?? []) {
    const t = it.title_snapshot as string;
    counts.set(t, (counts.get(t) ?? 0) + Number(it.quantity ?? 0));
  }
  const bestSellers = [...counts.entries()]
    .map(([title, qty]) => ({ title, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  return {
    booksCount: booksRes.count ?? 0,
    usersCount: usersRes.count ?? 0,
    ordersCount: orders.length,
    revenue,
    recentOrders,
    bestSellers,
    outOfStock: outOfStockRes.count ?? 0,
  };
}
