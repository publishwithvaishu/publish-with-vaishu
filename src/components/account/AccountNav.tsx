"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { logoutAction } from "@/lib/actions/auth-actions";

const links = [
  { href: "/account", label: "Profile" },
  { href: "/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/password", label: "Password" },
];

export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-8 flex items-center gap-2 overflow-x-auto border-b border-hairline pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {links.map((link) => {
        const active =
          link.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "shrink-0 border-b-2 px-3 py-3 text-sm font-medium transition-colors",
              active
                ? "border-ink text-ink"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {link.label}
          </Link>
        );
      })}

      <form action={logoutAction} className="ml-auto shrink-0">
        <button
          type="submit"
          className="px-3 py-3 text-sm font-medium text-muted hover:text-ink"
        >
          Sign out
        </button>
      </form>
    </nav>
  );
}
