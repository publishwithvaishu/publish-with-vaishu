import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { CartCountBadge } from "@/components/cart/CartCountBadge";

/**
 * Premium dark header (homepage only) — gold-framed logo mark, brand
 * wordmark with tagline, desktop nav, cart + account icons. Sticky and
 * glassy over the dark canvas. Every link reuses existing routes.
 */
export function DarkHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0b0f16]/85 backdrop-blur-md">
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e8b647]/60 bg-[#11151d] shadow-[0_0_18px_-6px_rgba(232,182,71,0.5)]">
              <Image
                src="/logo-emblem.png"
                alt="Publish With Vaishu"
                width={60}
                height={34}
                className="h-[30px] w-auto object-contain"
                priority
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-serif text-lg font-semibold uppercase tracking-wide text-ink sm:text-xl">
                Publish With Vaishu
              </span>
              <span className="block truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                Empowering Authors. Enriching Minds.
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {[
              { label: "Home", href: "/" },
              { label: "Books", href: "/books" },
              { label: "Services", href: "/services" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/5 hover:text-ink"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1">
            <Link
              href="/cart"
              aria-label="Your cart"
              className="relative flex items-center justify-center rounded-full text-muted transition-colors tap-target hover:bg-white/5 hover:text-[#e8b647]"
            >
              <CartIcon />
              <CartCountBadge />
            </Link>
            <Link
              href="/account"
              aria-label="Your account"
              className="flex items-center justify-center rounded-full text-muted transition-colors tap-target hover:bg-white/5 hover:text-[#e8b647]"
            >
              <AccountIcon />
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}

function CartIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" />
    </svg>
  );
}
