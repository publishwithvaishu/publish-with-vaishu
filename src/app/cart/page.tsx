import type { Metadata } from "next";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review the academic titles in your cart before checkout.",
};

export default function CartPage() {
  return (
    <>
      <Header />

      <main className="pb-24 md:pb-0">
        <Container className="py-10 sm:py-14">
          <h1 className="mb-8 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Your cart
          </h1>
          <CartView />
        </Container>
      </main>

      <Footer />
      <MobileNav />
    </>
  );
}
