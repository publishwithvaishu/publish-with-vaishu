import type { Metadata } from "next";
import Link from "next/link";
import { getAdminStats } from "@/lib/admin/stats";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { formatPrice, formatCount } from "@/lib/format";

export const metadata: Metadata = { title: "Admin dashboard" };
export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "Revenue", value: formatPrice(stats.revenue), hint: "Excl. cancelled" },
    { label: "Orders", value: formatCount(stats.ordersCount) },
    { label: "Books", value: formatCount(stats.booksCount) },
    { label: "Customers", value: formatCount(stats.usersCount) },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Dashboard
        </h1>
        <p className="mt-1 text-muted">Overview of your store.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-hairline p-5">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {c.value}
            </p>
            {c.hint && <p className="mt-1 text-xs text-muted">{c.hint}</p>}
          </div>
        ))}
      </div>

      {stats.outOfStock > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {stats.outOfStock}{" "}
          {stats.outOfStock === 1 ? "title is" : "titles are"} out of stock.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Recent orders */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-ink">Recent orders</h2>
          {stats.recentOrders.length === 0 ? (
            <p className="rounded-2xl border border-hairline px-5 py-10 text-center text-sm text-muted">
              No orders yet.
            </p>
          ) : (
            <ul className="divide-y divide-hairline rounded-2xl border border-hairline">
              {stats.recentOrders.map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{o.order_number}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      {o.customer_name ?? "—"} · {formatDate(o.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={o.status} />
                    <span className="text-sm font-medium text-ink">
                      {formatPrice(o.grand_total)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Best sellers */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-ink">Best sellers</h2>
          {stats.bestSellers.length === 0 ? (
            <p className="rounded-2xl border border-hairline px-5 py-10 text-center text-sm text-muted">
              No sales yet.
            </p>
          ) : (
            <ol className="divide-y divide-hairline rounded-2xl border border-hairline">
              {stats.bestSellers.map((b, i) => (
                <li
                  key={b.title}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="text-sm tabular-nums text-muted">
                      {i + 1}
                    </span>
                    <span className="truncate font-serif text-sm text-ink">
                      {b.title}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm text-muted">
                    {b.qty} sold
                  </span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <p className="text-sm text-muted">
        Book, order, user, category and report management arrive in the next
        admin modules. <Link href="/" className="text-ink underline">View store ↗</Link>
      </p>
    </div>
  );
}
