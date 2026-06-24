"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

// Sections are added as their modules are built (users, categories, etc.).
const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/books", label: "Books" },
  { href: "/admin/orders", label: "Orders" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="-mb-px flex items-center gap-1 overflow-x-auto">
      {links.map((link) => {
        const active =
          link.href === "/admin"
            ? pathname === "/admin"
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
    </nav>
  );
}
