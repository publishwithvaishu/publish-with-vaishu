import type { Metadata } from "next";
import Link from "next/link";
import { BarChart } from "@/components/admin/BarChart";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { getReport, type Granularity } from "@/lib/admin/reports";
import { formatPrice, formatCount } from "@/lib/format";

export const metadata: Metadata = { title: "Reports — Admin" };
export const dynamic = "force-dynamic";

type SP = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 29);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const def = defaultRange();
  const fromRaw = first(sp.from);
  const toRaw = first(sp.to);
  const from = fromRaw && DATE_RE.test(fromRaw) ? fromRaw : def.from;
  const to = toRaw && DATE_RE.test(toRaw) ? toRaw : def.to;
  const granularity: Granularity =
    first(sp.granularity) === "monthly" ? "monthly" : "daily";

  const report = await getReport({ from, to, granularity });
  const { summary, series, topBooks, topCustomers, salesByCategory, recentOrders } =
    report;

  const exportQs = `from=${from}&to=${to}&granularity=${granularity}`;
  const cards = [
    { label: "Total revenue", value: formatPrice(summary.totalRevenue) },
    { label: "Total orders", value: formatCount(summary.totalOrders) },
    { label: "Total customers", value: formatCount(summary.totalCustomers) },
    { label: "Total books", value: formatCount(summary.totalBooks) },
  ];
  const maxCatRevenue = Math.max(...salesByCategory.map((c) => c.revenue), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Reports &amp; analytics
        </h1>
        <p className="mt-1 text-muted">
          {formatDate(from)} – {formatDate(to)}
        </p>
      </div>

      {/* Date range + granularity */}
      <form
        method="get"
        action="/admin/reports"
        className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
      >
        <Field label="From">
          <input
            type="date"
            name="from"
            defaultValue={from}
            className="h-11 rounded-xl border border-hairline bg-bg px-3 text-sm text-ink focus:border-ink focus:outline-none"
          />
        </Field>
        <Field label="To">
          <input
            type="date"
            name="to"
            defaultValue={to}
            className="h-11 rounded-xl border border-hairline bg-bg px-3 text-sm text-ink focus:border-ink focus:outline-none"
          />
        </Field>
        <Field label="Group by">
          <select
            name="granularity"
            defaultValue={granularity}
            className="h-11 rounded-xl border border-hairline bg-bg px-3 text-sm text-ink focus:border-ink focus:outline-none"
          >
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
          </select>
        </Field>
        <button
          type="submit"
          className="h-11 rounded-full bg-primary px-5 text-sm font-medium text-white"
        >
          Apply
        </button>
      </form>

      {/* Export buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Revenue CSV", report: "revenue" },
          { label: "Top books CSV", report: "top-books" },
          { label: "Top customers CSV", report: "top-customers" },
          { label: "Sales by category CSV", report: "sales-by-category" },
        ].map((e) => (
          <a
            key={e.report}
            href={`/admin/reports/export?report=${e.report}&${exportQs}`}
            className="inline-flex h-9 items-center rounded-full border border-hairline px-4 text-xs font-medium text-ink hover:bg-bg-secondary"
          >
            ↓ {e.label}
          </a>
        ))}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-hairline p-5">
            <p className="text-sm text-muted">{c.label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-hairline p-6">
          <h2 className="mb-1 text-lg font-semibold text-ink">Revenue</h2>
          <p className="mb-5 text-sm text-muted">
            {granularity === "monthly" ? "Per month" : "Per day"}
          </p>
          <BarChart
            data={series.map((s) => ({ label: s.label, value: s.revenue }))}
            formatValue={(v) => formatPrice(v)}
            ariaLabel="Revenue over time"
          />
        </section>
        <section className="rounded-2xl border border-hairline p-6">
          <h2 className="mb-1 text-lg font-semibold text-ink">Sales trend</h2>
          <p className="mb-5 text-sm text-muted">Orders per period</p>
          <BarChart
            data={series.map((s) => ({ label: s.label, value: s.orders }))}
            formatValue={(v) => `${v} ${v === 1 ? "order" : "orders"}`}
            ariaLabel="Orders over time"
          />
        </section>
      </div>

      {/* Top books + customers */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Top selling books">
          {topBooks.length === 0 ? (
            <Empty>No sales in this period.</Empty>
          ) : (
            <ol className="divide-y divide-hairline">
              {topBooks.map((b, i) => (
                <Rank
                  key={b.title}
                  i={i}
                  title={b.title}
                  sub={`${b.qty} sold`}
                  value={formatPrice(b.revenue)}
                />
              ))}
            </ol>
          )}
        </Panel>

        <Panel title="Top customers">
          {topCustomers.length === 0 ? (
            <Empty>No customers in this period.</Empty>
          ) : (
            <ol className="divide-y divide-hairline">
              {topCustomers.map((c, i) => (
                <Rank
                  key={c.email + i}
                  i={i}
                  title={c.name}
                  sub={`${c.orders} ${c.orders === 1 ? "order" : "orders"}`}
                  value={formatPrice(c.spent)}
                />
              ))}
            </ol>
          )}
        </Panel>
      </div>

      {/* Sales by category + recent orders */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Sales by category">
          {salesByCategory.length === 0 ? (
            <Empty>No sales in this period.</Empty>
          ) : (
            <ul className="space-y-3">
              {salesByCategory.map((c) => (
                <li key={c.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink">{c.name}</span>
                    <span className="font-medium text-ink">
                      {formatPrice(c.revenue)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-bg-secondary">
                    <div
                      className="h-full rounded-full bg-ink"
                      style={{ width: `${(c.revenue / maxCatRevenue) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted">{c.qty} units</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent orders">
          {recentOrders.length === 0 ? (
            <Empty>No orders in this period.</Empty>
          ) : (
            <ul className="divide-y divide-hairline">
              {recentOrders.map((o) => (
                <li key={o.id} className="py-3 first:pt-0 last:pb-0">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-ink">
                          {o.order_number}
                        </span>
                        <OrderStatusBadge status={o.status} />
                      </div>
                      <p className="mt-0.5 text-sm text-muted">
                        {o.customer} · {formatDate(o.created_at)}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-ink">
                      {formatPrice(o.total)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted">{label}</span>
      {children}
    </label>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-hairline p-6">
      <h2 className="mb-4 text-lg font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-muted">{children}</p>;
}

function Rank({
  i,
  title,
  sub,
  value,
}: {
  i: number;
  title: string;
  sub: string;
  value: string;
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
      <span className="flex min-w-0 items-center gap-3">
        <span className="text-sm tabular-nums text-muted">{i + 1}</span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-ink">
            {title}
          </span>
          <span className="text-xs text-muted">{sub}</span>
        </span>
      </span>
      <span className="shrink-0 text-sm font-medium text-ink">{value}</span>
    </li>
  );
}
