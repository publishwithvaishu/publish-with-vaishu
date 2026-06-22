import type { Metadata } from "next";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";
import { requireUser } from "@/lib/auth/session";
import { listAddresses } from "@/lib/auth/addresses";
import { razorpayConfigured } from "@/lib/payments/razorpay";

export const metadata: Metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await requireUser();
  const addresses = await listAddresses(user.id);

  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Container className="py-10 sm:py-14">
          <h1 className="mb-8 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Checkout
          </h1>
          <CheckoutClient
            addresses={addresses}
            razorpayEnabled={razorpayConfigured()}
            prefill={{
              name: user.name ?? undefined,
              email: user.email ?? undefined,
            }}
          />
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
