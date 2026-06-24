import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderTotals } from "@/components/orders/OrderTotals";
import { PaymentBadge } from "@/components/admin/PaymentBadge";
import { AdminOrderStatusForm } from "@/components/admin/AdminOrderStatusForm";
import { adminGetOrder } from "@/lib/admin/orders";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Order — Admin" };
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function dateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const data = await adminGetOrder(id);
  if (!data) notFound();
  const { order, customer, items, history } = data;
  const addr = order.shipping_address;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        ← All orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            {order.order_number}
          </h1>
          <p className="mt-1 text-sm text-muted">
            Placed {dateTime(order.created_at)}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* Customer */}
          <section className="rounded-2xl border border-hairline p-6">
            <h2 className="mb-3 text-lg font-semibold text-ink">Customer</h2>
            <dl className="space-y-1.5 text-sm">
              <Row label="Name" value={customer?.name ?? addr?.full_name ?? "—"} />
              <Row label="Email" value={customer?.email ?? addr?.email ?? "—"} />
              <Row
                label="Phone"
                value={customer?.phone ?? addr?.mobile ?? "—"}
              />
            </dl>
            {addr && (
              <div className="mt-4 border-t border-hairline pt-4 text-sm">
                <p className="text-muted">Shipping address</p>
                <p className="mt-1 font-medium text-ink">{addr.full_name}</p>
                <p className="text-muted">
                  {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
                </p>
                {addr.mobile && <p className="text-muted">{addr.mobile}</p>}
              </div>
            )}
          </section>

          {/* Items */}
          <section className="rounded-2xl border border-hairline p-6">
            <h2 className="mb-4 text-lg font-semibold text-ink">
              Items ({items.length})
            </h2>
            <ul className="divide-y divide-hairline">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="font-serif text-sm text-ink">
                      {item.title_snapshot}
                    </p>
                    <p className="mt-0.5 text-sm text-muted">
                      Qty {item.quantity} × {formatPrice(item.price_snapshot)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-ink">
                    {formatPrice(item.price_snapshot * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Timeline */}
          <section className="rounded-2xl border border-hairline p-6">
            <h2 className="mb-4 text-lg font-semibold text-ink">
              Order timeline
            </h2>
            {history.length === 0 ? (
              <p className="text-sm text-muted">No history yet.</p>
            ) : (
              <ol className="space-y-4">
                {history.map((h) => (
                  <li key={h.id} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" />
                    <div>
                      <div className="flex items-center gap-2">
                        <OrderStatusBadge status={h.status} />
                        <span className="text-xs text-muted">
                          {dateTime(h.created_at)}
                        </span>
                      </div>
                      {h.note && (
                        <p className="mt-1 text-sm text-muted">{h.note}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>

        {/* Right column */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-hairline p-6">
            <h2 className="mb-4 text-lg font-semibold text-ink">
              Update status
            </h2>
            {/* key on status: remount so the form re-syncs to the current
                status after a successful update (avoids a stale dropdown). */}
            <AdminOrderStatusForm key={order.status} order={order} />
          </section>

          <section className="rounded-2xl border border-hairline p-6">
            <h2 className="mb-4 text-lg font-semibold text-ink">Summary</h2>
            <OrderTotals
              subtotal={order.subtotal}
              shipping={order.shipping_charge}
              tax={order.tax_amount}
              total={order.grand_total}
            />
            <div className="mt-4 border-t border-hairline pt-4">
              <PaymentBadge
                status={order.payment_status}
                method={order.payment_method}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}
