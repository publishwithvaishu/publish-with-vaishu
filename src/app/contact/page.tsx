import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact — Publish With Vaishu, Chennai",
  description:
    "Contact Publish With Vaishu for academic book enquiries, availability and bulk/department orders. Based in Chennai, India.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · Publish With Vaishu",
    description:
      "Get in touch with Publish With Vaishu — academic book publisher in Chennai, India.",
    url: "/contact",
  },
};

// Public support address. Replace with the publisher's real inbox before launch.
const SUPPORT_EMAIL =
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@publishwithvaishu.in";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="pb-24 md:pb-0">
        <Container className="py-12 sm:py-16">
          <div className="mx-auto max-w-2xl">
            <h1 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
              Contact us
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted">
              For enquiries about orders, availability or bulk purchases for
              your department, we’d be glad to help.
            </p>

            <div className="mt-8 space-y-4">
              <div className="card-dark rounded-2xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Email
                </h2>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="mt-2 inline-block text-lg font-medium text-primary hover:text-primary-hover"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>

              <div className="card-dark rounded-2xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Location
                </h2>
                <p className="mt-2 text-lg font-medium text-ink">
                  Chennai, India
                </p>
              </div>

              <div className="card-dark rounded-2xl p-6">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Your orders
                </h2>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  You can track every order from your{" "}
                  <Link
                    href="/orders"
                    className="font-medium text-primary hover:text-primary-hover"
                  >
                    order history
                  </Link>{" "}
                  once signed in. Order and delivery updates are also sent to
                  your registered email.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
