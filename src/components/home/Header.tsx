import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CartCountBadge } from "@/components/cart/CartCountBadge";

/** Section 1 — Header: logo wordmark + cart + account icon, hairline bottom border. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-bg/70 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-xl supports-[backdrop-filter]:bg-bg/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">
              V
            </span>
            <span className="font-serif text-lg font-semibold tracking-tight text-ink">
              Publish With Vaishu
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/cart"
              aria-label="Your cart"
              className="relative flex items-center justify-center rounded-full text-muted tap-target hover:bg-indigo-50 hover:text-indigo-600"
            >
              <CartIcon />
              <CartCountBadge />
            </Link>
            <Link
              href="/account"
              aria-label="Your account"
              className="flex items-center justify-center rounded-full text-muted tap-target hover:bg-indigo-50 hover:text-indigo-600"
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
