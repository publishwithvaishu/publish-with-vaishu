"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartCountBadge } from "@/components/cart/CartCountBadge";
import { cn } from "@/lib/cn";

/**
 * Desktop top nav — Home / Books / Cart as raised "3D" pills (see .nav-3d
 * in globals.css), each with a small icon that animates on hover. Client
 * component only because it needs the current pathname for the active
 * state; mobile keeps using MobileNav's bottom bar.
 */
const links = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Books", href: "/books", icon: BookIcon },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
      {links.map(({ label, href, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "group flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium tap-target",
              active
                ? "border-primary bg-primary text-white"
                : "nav-3d border-hairline bg-bg text-ink hover:text-ink/60",
            )}
          >
            <Icon className="nav-icon" />
            {label}
          </Link>
        );
      })}
      <Link
        href="/cart"
        className={cn(
          "group relative flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium tap-target",
          pathname?.startsWith("/cart")
            ? "border-primary bg-primary text-white"
            : "nav-3d border-hairline bg-bg text-ink hover:text-ink/60",
        )}
      >
        <CartIcon className="nav-icon" />
        Cart
        <CartCountBadge />
      </Link>
    </nav>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
    </svg>
  );
}
