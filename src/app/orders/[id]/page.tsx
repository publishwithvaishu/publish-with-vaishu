import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { OrderStatusStepper } from "@/components/orders/OrderStatusStepper";
import { OrderTotals } from "@/components/orders/OrderTotals";
import { getCurrentUser } from "@/lib/auth/session";
import { getOrderForUser } from "@/lib/orders/orders";
import { formatPrice } from "@/lib/format";
import { signOut } from "@/auth";

export const metadata: Metadata = { title: "Order details" };
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type SP = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: SP;
}) {
  const { id } = await params;
  if (!UUID_RE.test(id)) notFound();

  const user = await getCurrentUser();
  if (!user) redirect(`/login?callbackUrl=/orders/${id}`);

  const data = await getOrderForUser(user.id, id);
  if (!data) {
    // Signed in, but this order isn't linked to the current account (e.g. a
    // confirmation-email link opened while signed in as a different
    // customer). A plain 404 here is misleading — guide them instead.
    async function switchAccount() {
      "use server";
      await signOut({ redirectTo: `/login?callbackUrl=/orders/${id}` });
    }

    return (
      <>
        <Header />
        <main className="pb-24 md:pb-0">
          <Container className="py-16 text-center sm:py-24">
            <h1 className="font-serif text-2xl text-ink sm:text-3xl">
              We couldn&apos;t find this order on your account
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">
              You&apos;re signed in as{" "}
              <span className="text-ink">{user.email}</span>. This order link
              belongs to a different account — sign in with the email you used
              at checkout, or check your order confirmation email again.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <form action={switchAccount}>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-white"
                >
                  Sign in with a different account
                </button>
              </form>
              <Link
                href="/orders"
                className="inline-flex h-11 items-center rounded-full border border-hairline px-6 text-sm font-medium text-ink hover:bg-bg-secondary"
              >
                Your orders
              </Link>
            </div>
          </Container>
        </main>
        <Footer />
        <MobileNav />
      </>
    );
  }

  const { order, items, history } = data;
  const sp = await searchParams;
  const justPlaced = sp.placed === "1";
  const addr = order.shipping_address;
  const hasShippingInfo =
    (order.status === "shipped" || order.status === "delivered") &&
    !!(order.courier_name || order.tracking_number || order.tracking_url);

  const placed = new Date(order.created_at).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Container className="py-8 sm:py-12">
          {justPlaced && (
            <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="mt-3 font-serif text-xl text-ink">
                Thank you! Your order is confirmed.
              </h2>
              <p className="mt-1 text-sm text-green-700">
                We’ve placed order {order.order_number}. A confirmation is on
                its way.
              </p>
            </div>
          )}

          <Link
            href="/orders"
            className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
          >
            ← All orders
          </Link>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
                {order.order_number}
              </h1>
              <p className="mt-1 text-sm text-muted">Placed {placed}</p>
            </div>
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <a
                href={`/orders/${order.id}/invoice`}
                className="inline-flex h-10 items-center rounded-full border border-hairline px-4 text-sm font-medium text-ink hover:bg-bg-secondary"
              >
                Invoice (PDF)
              </a>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="space-y-8">
              {/* Tracking */}
              <section className="rounded-2xl border border-hairline p-6">
                <h2 className="mb-5 text-lg font-semibold text-ink">
                  Order tracking
                </h2>
                <OrderStatusStepper status={order.status} history={history} />
                {hasShippingInfo && (
                  <div className="mt-5 border-t border-hairline pt-5 text-sm">
                    {order.courier_name && (
                      <p className="text-muted">
                        Courier:{" "}
                        <span className="text-ink">{order.courier_name}</span>
                      </p>
                    )}
                    {order.tracking_number && (
                      <p className="mt-1 text-muted">
                        Tracking no.:{" "}
                        <span className="text-ink">
                          {order.tracking_number}
                        </span>
                      </p>
                    )}
                    {order.tracking_url && (
                      <a
                        href={order.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-medium text-white"
                      >
                        Track shipment →
                      </a>
                    )}
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
            </div>

            {/* Summary + address */}
            <aside className="space-y-6">
              <div className="rounded-2xl border border-hairline p-6">
                <h2 className="mb-4 text-lg font-semibold text-ink">Summary</h2>
                <OrderTotals
                  subtotal={order.subtotal}
                  shipping={order.shipping_charge}
                  tax={order.tax_amount}
                  total={order.grand_total}
                />
                <p className="mt-4 border-t border-hairline pt-4 text-sm text-muted">
                  Payment:{" "}
                  <span className="text-ink">
                    {order.payment_method === "cod"
                      ? "Pay on delivery"
                      : (order.payment_method ?? "—")}
                  </span>
                </p>
              </div>

              {addr && (
                <div className="rounded-2xl border border-hairline p-6">
                  <h2 className="mb-3 text-lg font-semibold text-ink">
                    Shipping address
                  </h2>
                  <p className="text-sm font-medium text-ink">
                    {addr.full_name}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {addr.address}, {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                  {addr.mobile && (
                    <p className="mt-1 text-sm text-muted">{addr.mobile}</p>
                  )}
                </div>
              )}
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
