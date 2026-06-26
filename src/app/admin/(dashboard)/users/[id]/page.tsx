import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { ConfirmSubmit } from "@/components/forms/ConfirmSubmit";
import {
  adminGetUser,
  adminUserStats,
  adminUserOrders,
} from "@/lib/admin/users";
import { toggleBlockUserAction } from "@/lib/actions/admin-user-actions";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Customer — Admin" };
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const user = await adminGetUser(id);
  if (!user) notFound();

  const [stats, orders] = await Promise.all([
    adminUserStats(id),
    adminUserOrders(id),
  ]);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        ← All customers
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {user.name}
            </h1>
            {user.blocked && (
              <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                Blocked
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted">
            Joined {formatDate(user.created_at)}
          </p>
        </div>

        {/* Block / unblock */}
        <form action={toggleBlockUserAction}>
          <input type="hidden" name="id" value={user.id} />
          <input
            type="hidden"
            name="blocked"
            value={user.blocked ? "false" : "true"}
          />
          {user.blocked ? (
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-white hover:bg-ink/90"
            >
              Unblock account
            </button>
          ) : (
            <ConfirmSubmit
              message={`Block ${user.name}? They will be unable to sign in.`}
              className="inline-flex h-10 items-center rounded-full border border-red-200 px-5 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Block account
            </ConfirmSubmit>
          )}
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Customer info */}
          <section className="rounded-2xl border border-hairline p-6">
            <h2 className="mb-3 text-lg font-semibold text-ink">Details</h2>
            <dl className="space-y-2 text-sm">
              <Row label="Email" value={user.email} />
              <Row label="Mobile" value={user.phone ?? "—"} />
              <Row
                label="Email verified"
                value={user.email_verified ? "Yes" : "No"}
              />
              <Row
                label="Status"
                value={user.blocked ? "Blocked" : "Active"}
              />
            </dl>
          </section>

          {/* Order history */}
          <section className="rounded-2xl border border-hairline p-6">
            <h2 className="mb-4 text-lg font-semibold text-ink">
              Order history ({orders.length})
            </h2>
            {orders.length === 0 ? (
              <p className="text-sm text-muted">No orders yet.</p>
            ) : (
              <ul className="divide-y divide-hairline">
                {orders.map((o) => (
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
                          {formatDate(o.created_at)} · {o.item_count}{" "}
                          {o.item_count === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm font-medium text-ink">
                        {formatPrice(o.grand_total)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Stats */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-hairline p-6">
            <p className="text-sm text-muted">Total orders</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
              {stats.orderCount}
            </p>
          </div>
          <div className="rounded-2xl border border-hairline p-6">
            <p className="text-sm text-muted">Amount spent</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-ink">
              {formatPrice(stats.totalSpent)}
            </p>
            <p className="mt-1 text-xs text-muted">Excludes cancelled orders</p>
          </div>
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
