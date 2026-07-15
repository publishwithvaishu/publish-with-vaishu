"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { CartCountBadge } from "@/components/cart/CartCountBadge";
import { HeaderNav } from "@/components/home/HeaderNav";
import { cn } from "@/lib/cn";

/**
 * Homepage-only header: transparent over the full-bleed hero photo (so the
 * image reads edge-to-edge with no white bar above it), then fades to the
 * normal solid header once the user scrolls past the hero. Every other
 * route keeps using the plain <Header /> untouched.
 */
export function HomeHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300",
        scrolled
          ? "border-hairline bg-bg/90 shadow-[0_1px_2px_rgba(15,23,42,0.04)] backdrop-blur-sm supports-[backdrop-filter]:bg-bg/80"
          : "border-transparent bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo-emblem.png"
              alt="Publish With Vaishu"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              priority
            />
            <span
              className={cn(
                "font-serif text-lg font-semibold tracking-tight transition-colors duration-300",
                scrolled ? "text-ink" : "text-[#fbf6ec]",
              )}
            >
              Publish With Vaishu
            </span>
          </Link>

          <HeaderNav light={!scrolled} />

          <div className="flex items-center gap-1">
            <Link
              href="/cart"
              aria-label="Your cart"
              className={cn(
                "relative flex items-center justify-center rounded-full tap-target transition-colors duration-300 md:hidden",
                scrolled
                  ? "text-muted hover:bg-bg-secondary hover:text-ink"
                  : "text-[#fbf6ec] hover:bg-white/10",
              )}
            >
              <CartIcon />
              <CartCountBadge />
            </Link>
            <Link
              href="/account"
              aria-label="Your account"
              className={cn(
                "flex items-center justify-center rounded-full tap-target transition-colors duration-300",
                scrolled
                  ? "text-muted hover:bg-bg-secondary hover:text-ink"
                  : "text-[#fbf6ec] hover:bg-white/10",
              )}
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
