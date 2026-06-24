import type { Metadata } from "next";
import Link from "next/link";
import { BookCover } from "@/components/ui/BookCover";
import { Pagination } from "@/components/catalog/Pagination";
import { StockLevelBadge } from "@/components/admin/StockLevelBadge";
import { StockAdjustForm } from "@/components/admin/StockAdjustForm";
import {
  getInventorySummary,
  listInventory,
  getStockAlerts,
  listRecentMovements,
  type InventoryFilter,
} from "@/lib/admin/inventory";
import { getCategories } from "@/lib/queries";
import { formatPrice, formatCount } from "@/lib/format";

export const metadata: Metadata = { title: "Inventory — Admin" };
export const dynamic = "force-dynamic";

type SP = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const FILTERS: { value: InventoryFilter; label: string }[] = [
  { value: "all", label: "All stock" },
  { value: "in", label: "In stock" },
  { value: "low", label: "Low stock" },
  { value: "out", label: "Out of stock" },
];

function movementDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const q = first(sp.q)?.trim() || undefined;
  const filterRaw = first(sp.filter);
  const filter: InventoryFilter =
    filterRaw === "in" || filterRaw === "low" || filterRaw === "out"
      ? filterRaw
      : "all";
  const category = first(sp.category) || undefined;
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const [summary, list, alerts, movements, categories] = await Promise.all([
    getInventorySummary(),
    listInventory({ q, filter, category, page }),
    getStockAlerts(8),
    listRecentMovements(10),
    getCategories(),
  ]);

  const baseQuery: Record<string, string> = {};
  if (q) baseQuery.q = q;
  if (filter !== "all") baseQuery.filter = filter;
  if (category) baseQuery.category = category;

  const cards = [
    { label: "Titles", value: formatCount(summary.totalTitles) },
    { label: "Units in stock", value: formatCount(summary.totalUnits) },
    { label: "Low stock", value: formatCount(summary.lowStock), warn: summary.lowStock > 0 },
    { label: "Out of stock", value: formatCount(summary.outOfStock), warn: summary.outOfStock > 0 },
    { label: "Inventory value", value: formatPrice(summary.inventoryValue) },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Inventory
        </h1>
        <p className="mt-1 text-muted">Stock levels, alerts and adjustments.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-hairline p-4">
            <p className="text-sm text-muted">{c.label}</p>
            <p
              className={`mt-2 text-2xl font-semibold tracking-tight ${
                c.warn ? "text-amber-700" : "text-ink"
              }`}
            >
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Low stock alerts */}
      {alerts.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
          <h2 className="text-sm font-semibold text-amber-900">
            Low &amp; out-of-stock alerts
          </h2>
          <ul className="mt-3 divide-y divide-amber-200/60">
            {alerts.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-3 py-2 text-sm"
              >
                <Link
                  href={`/admin/books/${a.id}/edit`}
                  className="truncate font-medium text-ink hover:underline"
                >
                  {a.title}
                </Link>
                <span className="shrink-0">
                  <StockLevelBadge stock={a.stock} /> ·{" "}
                  <span className="text-muted">{a.stock} left</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Search + filters */}
      <form
        method="get"
        action="/admin/inventory"
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search title, author or ISBN"
          className="h-11 flex-1 rounded-full border border-hairline bg-bg px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
        />
        <select
          name="filter"
          defaultValue={filter}
          className="h-11 rounded-full border border-hairline bg-bg px-4 text-sm text-ink focus:border-ink focus:outline-none"
        >
          {FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
        <select
          name="category"
          defaultValue={category ?? ""}
          className="h-11 rounded-full border border-hairline bg-bg px-4 text-sm text-ink focus:border-ink focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="h-11 rounded-full border border-hairline px-5 text-sm font-medium text-ink hover:bg-bg-secondary"
        >
          Apply
        </button>
      </form>

      {/* Stock list */}
      {list.items.length === 0 ? (
        <div className="rounded-2xl border border-hairline px-6 py-16 text-center">
          <p className="font-serif text-lg text-ink">No titles found</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {list.items.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-hairline p-4"
            >
              <div className="flex gap-4">
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-hairline bg-bg-secondary">
                  <BookCover
                    title={item.title}
                    coverImage={item.cover_image}
                    variant="mini"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-ink">{item.title}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted">
                        Stock: <span className="font-medium text-ink">{item.stock}</span>
                      </span>
                      <StockLevelBadge stock={item.stock} />
                    </div>
                  </div>
                  <p className="mt-0.5 text-sm text-muted">
                    {item.author_name ?? "—"}
                    {item.category_name ? ` · ${item.category_name}` : ""}
                    {item.isbn ? ` · ${item.isbn}` : ""}
                  </p>
                  <div className="mt-3">
                    <StockAdjustForm bookId={item.id} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={list.page}
        totalPages={list.totalPages}
        baseQuery={baseQuery}
        basePath="/admin/inventory"
      />

      {/* Movement history */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-ink">
          Recent stock movements
        </h2>
        {movements.length === 0 ? (
          <p className="rounded-2xl border border-hairline px-5 py-10 text-center text-sm text-muted">
            No stock movements yet.
          </p>
        ) : (
          <ul className="divide-y divide-hairline rounded-2xl border border-hairline">
            {movements.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between gap-3 px-5 py-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">
                    {m.book_title ?? "—"}
                  </p>
                  <p className="text-muted">
                    {m.reason ?? "Adjustment"} · {movementDate(m.created_at)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <span
                    className={`font-medium ${
                      m.change >= 0 ? "text-green-700" : "text-red-600"
                    }`}
                  >
                    {m.change >= 0 ? `+${m.change}` : m.change}
                  </span>
                  <p className="text-xs text-muted">→ {m.new_stock}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
