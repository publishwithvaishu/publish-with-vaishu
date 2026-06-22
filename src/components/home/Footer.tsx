import Link from "next/link";
import { Container } from "@/components/ui/Container";

/** Section 10 — Footer: minimal links + brand line. */
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
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-bg-secondary">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-[1.4fr_repeat(3,1fr)] sm:py-16">
          <div>
            <span className="font-serif text-lg font-semibold tracking-tight text-ink">
              Publish With Vaishu
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              An academic publishing house for University of Madras syllabus
              titles and research publications.
            </p>
          </div>

          {groups.map((group) => (
            <nav key={group.heading} aria-label={group.heading}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
                {group.heading}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink hover:text-muted"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-2 border-t border-hairline py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Publish With Vaishu. All rights reserved.</p>
          <p>Chennai, India</p>
        </div>
      </Container>
    </footer>
  );
}
