import type { Metadata } from "next";
import Link from "next/link";
import { Pagination } from "@/components/catalog/Pagination";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { PaymentBadge } from "@/components/admin/PaymentBadge";
import { adminListOrders } from "@/lib/admin/orders";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Orders — Admin" };
export const dynamic = "force-dynamic";

type SP = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

const STATUSES = [
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const q = first(sp.q)?.trim() || undefined;
  const status = first(sp.status) || undefined;
  const page = Math.max(1, Number(first(sp.page)) || 1);

  const result = await adminListOrders({ q, status, page });

  const baseQuery: Record<string, string> = {};
  if (q) baseQuery.q = q;
  if (status) baseQuery.status = status;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          Orders
        </h1>
        <p className="mt-1 text-muted">
          {result.total} {result.total === 1 ? "order" : "orders"}
        </p>
      </div>

      {/* Search + status filter (GET form) */}
      <form
        method="get"
        action="/admin/orders"
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          name="q"
          defaultValue={q ?? ""}
          placeholder="Search order number, customer name or email"
          className="h-11 flex-1 rounded-full border border-hairline bg-bg px-4 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-11 rounded-full border border-hairline bg-bg px-4 text-sm capitalize text-ink focus:border-ink focus:outline-none"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">
              {s}
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

      {result.rows.length === 0 ? (
        <div className="rounded-2xl border border-hairline px-6 py-16 text-center">
          <p className="font-serif text-lg text-ink">No orders found</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {result.rows.map((o) => (
            <li key={o.id}>
              <Link
                href={`/admin/orders/${o.id}`}
                className="block rounded-2xl border border-hairline p-4 transition-colors hover:border-ink/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-ink">
                        {o.order_number}
                      </span>
                      <OrderStatusBadge status={o.status} />
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {o.customer_name ?? "—"}
                      {o.customer_email ? ` · ${o.customer_email}` : ""}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {formatDate(o.created_at)} · {o.item_count}{" "}
                      {o.item_count === 1 ? "item" : "items"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-ink">
                      {formatPrice(o.grand_total)}
                    </p>
                    <div className="mt-1.5">
                      <PaymentBadge
                        status={o.payment_status}
                        method={o.payment_method}
                      />
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        baseQuery={baseQuery}
        basePath="/admin/orders"
      />
    </div>
  );
}
