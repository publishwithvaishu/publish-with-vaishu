import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";
import { OrderTotals } from "@/components/orders/OrderTotals";
import { requireUser } from "@/lib/auth/session";
import { getOrderForUser } from "@/lib/orders/orders";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Payment successful" };
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
type SP = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const user = await requireUser();
  const sp = await searchParams;
  const orderId = first(sp.order);
  if (!orderId || !UUID_RE.test(orderId)) redirect("/orders");

  const data = await getOrderForUser(user.id, orderId);
  if (!data) redirect("/orders");
  const { order } = data;

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Container className="py-12 sm:py-16">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500 text-[#06120b]">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4 4 10-10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="mt-5 font-serif text-3xl text-ink">
              Payment successful
            </h1>
            <p className="mt-2 text-muted">
              Thank you! We’ve received your payment and confirmed order{" "}
              <span className="font-medium text-ink">{order.order_number}</span>.
            </p>

            <div className="mt-8 rounded-2xl border border-hairline p-6 text-left">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-muted">Paid</span>
                <span className="text-lg font-semibold text-ink">
                  {formatPrice(order.grand_total)}
                </span>
              </div>
              <OrderTotals
                subtotal={order.subtotal}
                shipping={order.shipping_charge}
                tax={order.tax_amount}
                total={order.grand_total}
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={`/orders/${order.id}`}
                className="inline-flex h-12 items-center justify-center btn-gold rounded-full px-7 text-sm font-semibold"
              >
                View order
              </Link>
              <a
                href={`/orders/${order.id}/invoice`}
                className="inline-flex h-12 items-center justify-center rounded-full border border-hairline px-7 text-sm font-medium text-ink hover:bg-bg-secondary"
              >
                Download invoice
              </a>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
