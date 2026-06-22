import Link from "next/link";

/** Outline pill chip for course categories (spec §4 — not a colored box). */
export function CategoryChip({
  label,
  href,
}: {
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-full border border-hairline px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-bg-secondary tap-target"
    >
      {label}
    </Link>
  );
}
