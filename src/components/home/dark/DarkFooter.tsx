import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { EMAIL, PHONE, LINKEDIN_URL, whatsappLink } from "@/lib/site-config";

/**
 * Premium dark footer (homepage only) — same link groups and contact
 * details as the shared Footer, restyled for the dark theme. Other routes
 * keep using the existing Footer component untouched.
 */
const groups = [
  {
    heading: "Browse",
    links: [
      { label: "All books", href: "/books" },
      { label: "B.Com", href: "/books?category=b-com" },
      { label: "BBA", href: "/books?category=bba" },
      { label: "BCA", href: "/books?category=bca" },
    ],
  },
  {
    heading: "Shop",
    links: [
      { label: "All books", href: "/books" },
      { label: "Cart", href: "/cart" },
      { label: "Your orders", href: "/orders" },
    ],
  },
  {
    heading: "Publisher",
    links: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function DarkFooter() {
  return (
    <footer className="mt-16 border-t border-white/[0.06] bg-[#080b11]">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 sm:py-16 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo-emblem.png"
                alt=""
                width={64}
                height={36}
                className="h-9 w-auto object-contain"
              />
              <p className="font-serif text-xl font-medium tracking-tight text-ink">
                Publish With Vaishu
              </p>
            </div>
            <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
              Empowering Authors. Enriching Minds.
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              An academic publishing house for University of Madras syllabus
              titles and research publications.
            </p>
          </div>

          {groups.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gold">
                {group.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav aria-label="Contact">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-gold">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={`tel:${PHONE.replace(/\s/g, "")}`}
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  {PHONE}
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={LINKEDIN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="break-all text-sm text-muted transition-colors hover:text-ink"
                >
                  {EMAIL}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.06] py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Publish With Vaishu. All rights reserved.</p>
          <p>Chennai, India</p>
        </div>
      </Container>
    </footer>
  );
}
