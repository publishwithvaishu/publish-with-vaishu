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
      className="inline-flex items-center rounded-full border border-hairline bg-bg px-4 py-2.5 text-sm font-medium text-ink transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 tap-target"
    >
      {label}
    </Link>
  );
}
