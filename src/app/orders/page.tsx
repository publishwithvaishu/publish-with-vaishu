import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";
import { OrderStatusBadge } from "@/components/orders/OrderStatusBadge";
import { requireUser } from "@/lib/auth/session";
import { listOrders } from "@/lib/orders/orders";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Your orders" };
export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function OrdersPage() {
  const user = await requireUser();
  const orders = await listOrders(user.id);

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Container className="py-10 sm:py-14">
          <h1 className="mb-8 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Your orders
          </h1>

          {orders.length === 0 ? (
            <div className="rounded-2xl border border-hairline px-6 py-16 text-center">
              <p className="font-serif text-lg text-ink">No orders yet</p>
              <p className="mt-2 text-sm text-muted">
                When you place an order, it’ll show up here.
              </p>
              <Link
                href="/books"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-white tap-target"
              >
                Browse books
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-hairline p-5 transition-colors hover:border-ink/30"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-medium text-ink">
                          {order.order_number}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="mt-1.5 text-sm text-muted">
                        {formatDate(order.created_at)} · {order.item_count}{" "}
                        {order.item_count === 1 ? "item" : "items"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-ink">
                        {formatPrice(order.grand_total)}
                      </p>
                      <span className="text-sm text-muted">View →</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
