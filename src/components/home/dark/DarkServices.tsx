import Link from "next/link";
import { Container } from "@/components/ui/Container";

/**
 * Services teaser — highlight tiles mirroring the existing /services page,
 * each linking straight to it. Pure navigation, no new logic.
 */
const SERVICES = [
  { label: "Book Publishing", icon: <BookIcon /> },
  { label: "Manuscript Editing", icon: <PencilIcon /> },
  { label: "Cover Design", icon: <CoverIcon /> },
  { label: "ISBN Registration", icon: <BarcodeIcon /> },
  { label: "Printing & POD", icon: <PrinterIcon /> },
  { label: "Amazon KDP", icon: <CloudIcon /> },
];

export function DarkServices() {
  return (
    <section className="pt-14">
      <Container>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-ink sm:text-xl">
              Publishing Services
            </h2>
            <p className="mt-1 text-sm text-muted">
              Everything your book needs, under one roof.
            </p>
          </div>
          <Link
            href="/services"
            className="shrink-0 text-sm font-medium text-gold hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SERVICES.map((s) => (
            <Link
              key={s.label}
              href="/services"
              className="card-dark flex flex-col items-center gap-3 rounded-2xl px-3 py-6 text-center"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-gold">
                {s.icon}
              </span>
              <span className="text-xs font-medium leading-snug text-ink">
                {s.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="card-dark mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#e8b647]/10 to-transparent px-6 py-6 sm:flex-row">
          <p className="text-center font-serif text-lg text-ink sm:text-left">
            Ready to publish your book?
          </p>
          <Link
            href="/services"
            className="btn-gold flex h-11 items-center rounded-xl px-6 text-sm font-semibold tap-target"
          >
            Start Your Book
          </Link>
        </div>
      </Container>
    </section>
  );
}

function svgProps(size = 22) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
}

function BookIcon() {
  return (
    <svg {...svgProps()}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
    </svg>
  );
}
function PencilIcon() {
  return (
    <svg {...svgProps()}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
    </svg>
  );
}
function CoverIcon() {
  return (
    <svg {...svgProps()}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M9 3v18" />
      <circle cx="14.5" cy="9" r="1.6" />
    </svg>
  );
}
function BarcodeIcon() {
  return (
    <svg {...svgProps()}>
      <path d="M4 6v12M7 6v12M10 6v9M13 6v12M16 6v9M20 6v12" />
    </svg>
  );
}
function PrinterIcon() {
  return (
    <svg {...svgProps()}>
      <path d="M6 9V3h12v6" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="7" rx="1" />
    </svg>
  );
}
function CloudIcon() {
  return (
    <svg {...svgProps()}>
      <path d="M7 18a4 4 0 0 1-.5-7.97 5 5 0 0 1 9.6-1.3A3.5 3.5 0 0 1 18 18H7Z" />
      <path d="M12 21v-7m0 0-2.2 2.2M12 14l2.2 2.2" />
    </svg>
  );
}
