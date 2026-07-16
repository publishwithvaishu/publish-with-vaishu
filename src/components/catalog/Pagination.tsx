import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Link-based pagination (works without JS). `baseQuery` holds the current
 * filters (without `page`); each link sets its own page.
 */
export function Pagination({
  page,
  totalPages,
  baseQuery,
  basePath = "/books",
}: {
  page: number;
  totalPages: number;
  baseQuery: Record<string, string>;
  basePath?: string;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams(baseQuery);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-12 flex items-center justify-center gap-2"
    >
      <PageLink
        href={hrefFor(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        ←
      </PageLink>

      {pages.map((p) => (
        <PageLink key={p} href={hrefFor(p)} active={p === page}>
          {p}
        </PageLink>
      ))}

      <PageLink
        href={hrefFor(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        →
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...rest
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  const className = cn(
    "inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm font-semibold transition-all duration-200",
    active
      ? "btn-gold border-transparent"
      : "glass-dark text-muted hover:border-[#e8b647]/40 hover:text-ink",
    disabled && "pointer-events-none opacity-40",
  );

  if (disabled) {
    return (
      <span className={className} aria-disabled="true" {...rest}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
