"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartCountBadge } from "@/components/cart/CartCountBadge";
import { cn } from "@/lib/cn";

/**
 * Desktop top nav — Home / Books / Cart as raised "3D" pills (see .nav-3d
 * in globals.css). Client component only because it needs the current
 * pathname for the active state; mobile keeps using MobileNav's bottom bar.
 */
const links = [
  { label: "Home", href: "/" },
  { label: "Books", href: "/books" },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="hidden items-center gap-2 md:flex">
      {links.map(({ label, href }) => {
        const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium tap-target",
              active
                ? "border-primary bg-primary text-white"
                : "nav-3d border-hairline bg-bg text-ink hover:text-ink/60",
            )}
          >
            {label}
          </Link>
        );
      })}
      <Link
        href="/cart"
        className={cn(
          "relative flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium tap-target",
          pathname?.startsWith("/cart")
            ? "border-primary bg-primary text-white"
            : "nav-3d border-hairline bg-bg text-ink hover:text-ink/60",
        )}
      >
        <CartIcon />
        Cart
        <CartCountBadge />
      </Link>
    </nav>
  );
}

function CartIcon() {
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
    >
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
    </svg>
  );
}
