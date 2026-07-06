"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { whatsappLink } from "@/lib/site-config";

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "How long does delivery take?",
    a: "Orders are printed to order and delivered across Tamil Nadu in 3–5 working days. You'll receive an order confirmation by email, and you can track the status from your account.",
  },
  {
    q: "Is cash on delivery available?",
    a: "Yes. You can pay cash on delivery, or pay securely online via Razorpay (UPI, cards or net banking) at checkout.",
  },
  {
    q: "Do you take bulk or college orders?",
    a: "We do — for department sets and bulk student orders, contact us with the titles and quantities and we'll arrange a quote and delivery schedule.",
  },
  {
    q: "What is your returns policy?",
    a: "If a book arrives damaged or you received the wrong title, contact us within 7 days of delivery and we'll replace it at no cost.",
  },
  {
    q: "How do I order on WhatsApp?",
    a: (
      <>
        Message us on{" "}
        <a
          href={whatsappLink("Hi Publish With Vaishu, I'd like to order a book.")}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary hover:text-primary-hover"
        >
          WhatsApp
        </a>{" "}
        with the book title (or a photo of your reading list) and we&apos;ll
        confirm availability, price and delivery.
      </>
    ),
  },
];

/** FAQ — simple accordion, plain +/− toggle, hairline dividers. */
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="eyebrow">Questions</span>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-12 border-t border-hairline">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="border-b border-hairline">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left tap-target"
                  >
                    <span className="font-serif text-lg font-medium text-ink">
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className="shrink-0 text-2xl font-light leading-none text-ink"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-muted">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
