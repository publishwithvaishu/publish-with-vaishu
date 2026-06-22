import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Payment failed" };

type SP = Promise<{ [key: string]: string | string[] | undefined }>;
const first = (v: string | string[] | undefined) =>
  Array.isArray(v) ? v[0] : v;

export default async function PaymentFailedPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const sp = await searchParams;
  const reason = first(sp.reason);
  const message =
    reason === "verify"
      ? "We couldn’t verify your payment. If money was deducted, it will be refunded automatically."
      : "Your payment was not completed. No money has been deducted.";

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Container className="py-12 sm:py-16">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="mt-5 font-serif text-3xl text-ink">Payment failed</h1>
            <p className="mt-2 text-muted">{message}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/checkout"
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-white"
              >
                Try again
              </Link>
              <Link
                href="/cart"
                className="inline-flex h-12 items-center justify-center rounded-full border border-hairline px-7 text-sm font-medium text-ink hover:bg-bg-secondary"
              >
                Back to cart
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
