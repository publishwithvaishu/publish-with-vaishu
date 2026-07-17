import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/home/Header";
import { Footer } from "@/components/home/Footer";
import { MobileNav } from "@/components/MobileNav";
import { Container } from "@/components/ui/Container";
import { whatsappLink, EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Publishing Services — Editing, Design, ISBN, Printing & Distribution",
  description:
    "End-to-end academic and book publishing services from Publish With Vaishu — manuscript editing, cover design, ISBN registration, typesetting, eBook & Amazon KDP publishing, printing, and distribution across India.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Publishing Services · Publish With Vaishu",
    description:
      "Everything your book needs, under one roof — editing, design, ISBN, printing and distribution.",
    url: "/services",
  },
};

/* --------------------------------------------------------------------- */
/*  Icon primitive + per-service line icons                              */
/* --------------------------------------------------------------------- */
function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const icons = {
  book: (
    <Svg>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
    </Svg>
  ),
  cap: (
    <Svg>
      <path d="m12 4 10 4.5-10 4.5-10-4.5L12 4Z" />
      <path d="M6 11v4.5c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V11" />
      <path d="M21 8.5v6" />
    </Svg>
  ),
  pencil: (
    <Svg>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </Svg>
  ),
  cover: (
    <Svg>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 3v18" />
      <circle cx="14.5" cy="9" r="1.6" />
      <path d="m12 16 2.5-2.5L18 17" />
    </Svg>
  ),
  barcode: (
    <Svg>
      <path d="M4 6v12M7 6v12M10 6v9M13 6v12M16 6v9M20 6v12" />
    </Svg>
  ),
  layout: (
    <Svg>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </Svg>
  ),
  ebook: (
    <Svg>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <path d="M9 6.5h6M9 10h6M9 13.5h4" />
    </Svg>
  ),
  cloud: (
    <Svg>
      <path d="M7 18a4 4 0 0 1-.5-7.97 5 5 0 0 1 9.6-1.3A3.5 3.5 0 0 1 18 18H7Z" />
      <path d="M12 21v-7m0 0-2.2 2.2M12 14l2.2 2.2" />
    </Svg>
  ),
  printer: (
    <Svg>
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="7" rx="1" />
    </Svg>
  ),
  truck: (
    <Svg>
      <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </Svg>
  ),
  building: (
    <Svg>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M9 7h1M14 7h1M9 11h1M14 11h1M9 15h1M14 15h1M10 21v-3h4v3" />
    </Svg>
  ),
  mic: (
    <Svg>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
    </Svg>
  ),
  content: (
    <Svg>
      <path d="M4 4h16v14H8l-4 3V4Z" />
      <path d="M8 9h8M8 13h5" />
    </Svg>
  ),
  spark: (
    <Svg>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </Svg>
  ),
};

const services: { title: string; desc: string; icon: React.ReactNode }[] = [
  {
    title: "Book Publishing",
    desc: "End-to-end publishing of your manuscript into a professionally printed title — from first draft to finished book.",
    icon: icons.book,
  },
  {
    title: "University Textbook Publishing",
    desc: "Syllabus-aligned textbooks produced with faculty authors for University of Madras and affiliated programmes.",
    icon: icons.cap,
  },
  {
    title: "Manuscript Editing & Proofreading",
    desc: "Structural, line and copy editing plus a final proofread so your text reads clean, accurate and consistent.",
    icon: icons.pencil,
  },
  {
    title: "Book Cover Design",
    desc: "Original, market-ready cover design that reflects your subject and stands out on the shelf.",
    icon: icons.cover,
  },
  {
    title: "ISBN Registration",
    desc: "Registration and assignment of a unique ISBN so your book is catalogued and retail-ready.",
    icon: icons.barcode,
  },
  {
    title: "Book Formatting & Typesetting",
    desc: "Print-perfect interior layout and typesetting for readable, professional pages in any trim size.",
    icon: icons.layout,
  },
  {
    title: "eBook Publishing",
    desc: "Conversion and publishing of your title as a reflowable eBook for phones, tablets and e-readers.",
    icon: icons.ebook,
  },
  {
    title: "Amazon KDP Publishing",
    desc: "Setup and publishing of your book on Amazon Kindle Direct Publishing for worldwide distribution.",
    icon: icons.cloud,
  },
  {
    title: "Printing & Print-on-Demand",
    desc: "Quality offset and print-on-demand production — print a full run or exactly what you need, when you need it.",
    icon: icons.printer,
  },
  {
    title: "Distribution Support",
    desc: "Getting your book to students, colleges and stores across India through our distribution network.",
    icon: icons.truck,
  },
  {
    title: "Institutional Publishing",
    desc: "Publishing services for colleges, departments and institutions producing their own academic titles.",
    icon: icons.building,
  },
  {
    title: "Conference Proceedings Publishing",
    desc: "Compilation, editing and publishing of academic conference proceedings, complete with ISBN.",
    icon: icons.mic,
  },
  {
    title: "Educational Content Development",
    desc: "Development of study material, workbooks and course content aligned to your syllabus and outcomes.",
    icon: icons.content,
  },
  {
    title: "Branding & Promotional Design",
    desc: "Posters, mockups and promotional assets to launch and market your published book with confidence.",
    icon: icons.spark,
  },
];

const process = [
  { n: "01", title: "Manuscript", desc: "You share your manuscript and requirements with our team." },
  { n: "02", title: "Editing", desc: "We edit and proofread for clarity, accuracy and consistency." },
  { n: "03", title: "Design", desc: "Cover design and print-ready interior typesetting." },
  { n: "04", title: "ISBN & proof", desc: "ISBN registration and a final proof for your approval." },
  { n: "05", title: "Printing", desc: "Offset or print-on-demand production at quality standards." },
  { n: "06", title: "Distribution", desc: "Delivery, listing and launch support across India." },
];

const reasons = [
  {
    title: "Academic focus",
    desc: "Built specifically for University of Madras syllabus titles and the faculty who author them.",
  },
  {
    title: "Everything under one roof",
    desc: "Editing, design, ISBN, printing and distribution handled together — one team, one point of contact.",
  },
  {
    title: "Fair & transparent",
    desc: "Clear scope and honest, affordable pricing — no hidden costs, no surprises.",
  },
  {
    title: "Delivered across India",
    desc: "Reliable printing and shipping to students, colleges and institutions nationwide.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />

      <main className="pb-24 md:pb-0">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="relative h-[62vh] min-h-[420px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=2000&q=80"
              alt="Editing and preparing academic manuscripts for print"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a140a]/85 via-[#1a140a]/45 to-[#1a140a]/25" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas to-transparent" />
            <div className="absolute inset-0 flex items-end pb-14 sm:items-center sm:pb-0">
              <Container>
                <div className="max-w-2xl">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#e9dcc2]">
                    Publishing services
                  </span>
                  <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.05] text-[#fbf6ec] sm:text-5xl lg:text-6xl">
                    Everything your book needs, under one roof.
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-[#efe6d6]/90 sm:text-lg">
                    From manuscript to finished book — editing, design, ISBN,
                    printing and distribution, handled by a team that publishes
                    academic titles every day.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href={whatsappLink(
                        "Hi Publish With Vaishu, I'd like to know more about your publishing services.",
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center rounded-full bg-[#fbf6ec] px-6 text-sm font-semibold text-[#1a140a] transition-transform duration-200 hover:scale-[1.02]"
                    >
                      Start your book
                    </a>
                    <Link
                      href="/books"
                      className="glass-dark inline-flex h-12 items-center rounded-xl px-6 text-sm font-semibold text-ink transition-colors hover:border-[#e8b647]/40"
                    >
                      Browse our titles
                    </Link>
                  </div>
                </div>
              </Container>
            </div>
          </div>
        </section>

        {/* Our Services */}
        <section className="py-16 sm:py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">Our services</span>
              <span className="rule-hair mx-auto mt-3 block w-10" />
              <h2 className="mt-5 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                A complete publishing house
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                Pick a single service or the full journey — every part of
                bringing a book to print, done with academic care.
              </p>
            </div>

            <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <li
                  key={s.title}
                  className="card-dark group rounded-2xl p-6"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-gold transition-colors duration-300 group-hover:bg-[#e8b647] group-hover:text-[#1a1405]">
                    {s.icon}
                  </span>
                  <h3 className="mt-5 font-serif text-lg font-medium text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {s.desc}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Publishing Process timeline */}
        <section className="border-y border-white/[0.06] bg-white/[0.02] py-16 sm:py-24">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <span className="eyebrow">How it works</span>
              <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                The publishing process
              </h2>
              <p className="mt-4 leading-relaxed text-muted">
                A clear, guided path from your manuscript to a book in students&rsquo;
                hands.
              </p>
            </div>

            <ol className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {process.map((step) => (
                <li key={step.n} className="relative pl-14">
                  <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-[#e8b647]/40 bg-[#e8b647]/10 font-serif text-sm font-semibold text-gold">
                    {step.n}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {step.desc}
                  </p>
                </li>
              ))}
            </ol>
          </Container>
        </section>

        {/* Why choose */}
        <section className="py-16 sm:py-24">
          <Container>
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div>
                <span className="eyebrow">Why us</span>
                <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                  Why choose Publish With Vaishu
                </h2>
                <p className="mt-4 max-w-md leading-relaxed text-muted">
                  We are a publishing house, not a marketplace — every book gets
                  the same academic attention, from a team you can reach
                  directly.
                </p>
                <dl className="mt-8 space-y-6">
                  {reasons.map((r) => (
                    <div key={r.title} className="border-l-2 border-[#e8b647]/40 pl-4">
                      <dt className="font-serif text-lg font-medium text-ink">
                        {r.title}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-muted">
                        {r.desc}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="relative order-first overflow-hidden rounded-2xl lg:order-last">
                <Image
                  src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80"
                  alt="Printed academic books stacked in a publishing house"
                  width={1200}
                  height={1400}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-full w-full object-cover [filter:grayscale(0.35)_brightness(0.85)]"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <Container>
            <div className="card-dark relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e8b647]/12 to-transparent px-6 py-16 text-center sm:px-12">
              <h2 className="mx-auto max-w-2xl font-serif text-3xl font-medium tracking-tight text-ink sm:text-4xl">
                Ready to publish your book?
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
                Tell us about your manuscript and what you need. We&rsquo;ll guide
                you through the rest.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <a
                  href={whatsappLink(
                    "Hi Publish With Vaishu, I'd like to publish my book. Please share the details.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center rounded-full bg-[#fbf6ec] px-7 text-sm font-semibold text-[#1a140a] transition-transform duration-200 hover:scale-[1.02]"
                >
                  Chat on WhatsApp
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="glass-dark inline-flex h-12 items-center rounded-xl px-7 text-sm font-semibold text-ink transition-colors hover:border-[#e8b647]/40"
                >
                  Email us
                </a>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </>
  );
}
