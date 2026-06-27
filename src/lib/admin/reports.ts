import "server-only";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/types";

export type Granularity = "daily" | "monthly";

export interface ReportParams {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  granularity: Granularity;
}

export interface SeriesPoint {
  key: string;
  label: string;
  revenue: number;
  orders: number;
}

export interface ReportData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalBooks: number;
  };
  series: SeriesPoint[];
  topBooks: { title: string; qty: number; revenue: number }[];
  topCustomers: { name: string; email: string; orders: number; spent: number }[];
  salesByCategory: { name: string; revenue: number; qty: number }[];
  recentOrders: {
    id: string;
    order_number: string;
    customer: string;
    total: number;
    status: OrderStatus;
    created_at: string;
  }[];
}

const dayKey = (d: Date) => d.toISOString().slice(0, 10);
const monthKey = (d: Date) => d.toISOString().slice(0, 7);
const pick = <T,>(v: T | T[] | null): T | null =>
  Array.isArray(v) ? (v[0] ?? null) : v;

function buildPeriods(from: Date, to: Date, g: Granularity) {
  const periods: { key: string; label: string }[] = [];
  if (g === "monthly") {
    const cur = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), 1));
    const end = new Date(Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 1));
    while (cur <= end) {
      periods.push({
        key: monthKey(cur),
        label: cur.toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit",
          timeZone: "UTC",
        }),
      });
      cur.setUTCMonth(cur.getUTCMonth() + 1);
    }
  } else {
    const cur = new Date(
      Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()),
    );
    const end = new Date(
      Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate()),
    );
    while (cur <= end) {
      periods.push({
        key: dayKey(cur),
        label: cur.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          timeZone: "UTC",
        }),
      });
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
  }
  return periods;
}

export async function getReport(params: ReportParams): Promise<ReportData> {
  const supabase = getSupabaseAdminClient();
  const fromDate = new Date(`${params.from}T00:00:00.000Z`);
  const toDate = new Date(`${params.to}T23:59:59.999Z`);

  const { data: ordersRaw, error } = await supabase
    .from("orders")
    .select(
      "id, order_number, user_id, grand_total, status, created_at, user:users ( name, email )",
    )
    .gte("created_at", fromDate.toISOString())
    .lte("created_at", toDate.toISOString())
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  const orders = ordersRaw ?? [];

  const periods = buildPeriods(fromDate, toDate, params.granularity);
  const bucket = new Map(periods.map((p) => [p.key, { revenue: 0, orders: 0 }]));
  const keyOf = params.granularity === "monthly" ? monthKey : dayKey;

  const custMap = new Map<
    string,
    { name: string; email: string; orders: number; spent: number }
  >();
  let totalRevenue = 0;

  for (const o of orders) {
    const live = o.status !== "cancelled";
    const total = Number(o.grand_total ?? 0);
    const b = bucket.get(keyOf(new Date(o.created_at as string)));
    if (b) {
      b.orders += 1;
      if (live) b.revenue += total;
    }
    if (live) totalRevenue += total;

    const u = pick(o.user as { name?: string; email?: string } | null);
    const uid = o.user_id as string | null;
    if (uid) {
      const c =
        custMap.get(uid) ??
        { name: u?.name ?? "—", email: u?.email ?? "", orders: 0, spent: 0 };
      c.orders += 1;
      if (live) c.spent += total;
      custMap.set(uid, c);
    }
  }

  const series: SeriesPoint[] = periods.map((p) => ({
    key: p.key,
    label: p.label,
    revenue: bucket.get(p.key)!.revenue,
    orders: bucket.get(p.key)!.orders,
  }));
  const topCustomers = [...custMap.values()]
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 5);

  // Items for top books + sales by category (non-cancelled orders only).
  const liveOrderIds = orders
    .filter((o) => o.status !== "cancelled")
    .map((o) => o.id as string);

  let topBooks: ReportData["topBooks"] = [];
  let salesByCategory: ReportData["salesByCategory"] = [];
  if (liveOrderIds.length > 0) {
    const { data: items } = await supabase
      .from("order_items")
      .select(
        "quantity, price_snapshot, title_snapshot, book:books ( category:categories ( name ) )",
      )
      .in("order_id", liveOrderIds);

    const bookMap = new Map<string, { title: string; qty: number; revenue: number }>();
    const catMap = new Map<string, { name: string; revenue: number; qty: number }>();
    for (const it of items ?? []) {
      const qty = Number(it.quantity ?? 0);
      const rev = Number(it.price_snapshot ?? 0) * qty;
      const title = it.title_snapshot as string;
      const bk = bookMap.get(title) ?? { title, qty: 0, revenue: 0 };
      bk.qty += qty;
      bk.revenue += rev;
      bookMap.set(title, bk);

      const book = pick(it.book as { category?: unknown } | null);
      const cat = pick((book?.category ?? null) as { name?: string } | null);
      const cname = cat?.name ?? "Uncategorised";
      const cc = catMap.get(cname) ?? { name: cname, revenue: 0, qty: 0 };
      cc.revenue += rev;
      cc.qty += qty;
      catMap.set(cname, cc);
    }
    topBooks = [...bookMap.values()].sort((a, b) => b.qty - a.qty).slice(0, 5);
    salesByCategory = [...catMap.values()].sort((a, b) => b.revenue - a.revenue);
  }

  const [customersRes, booksRes] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("books").select("*", { count: "exact", head: true }),
  ]);

  const recentOrders = orders.slice(0, 8).map((o) => {
    const u = pick(o.user as { name?: string } | null);
    return {
      id: o.id as string,
      order_number: o.order_number as string,
      customer: u?.name ?? "—",
      total: Number(o.grand_total ?? 0),
      status: o.status as OrderStatus,
      created_at: o.created_at as string,
    };
  });

  return {
    summary: {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: customersRes.count ?? 0,
      totalBooks: booksRes.count ?? 0,
    },
    series,
    topBooks,
    topCustomers,
    salesByCategory,
    recentOrders,
  };
}

/** Serialize rows to CSV (RFC-4180-ish). */
export function toCSV(headers: string[], rows: (string | number)[][]): string {
  const esc = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.map(esc).join(","),
    ...rows.map((r) => r.map(esc).join(",")),
  ].join("\n");
}
