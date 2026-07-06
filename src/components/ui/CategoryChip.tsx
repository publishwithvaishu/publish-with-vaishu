import Link from "next/link";
import type { Accent } from "@/lib/accents";

/**
 * Pill chip for course categories. Default: outline pill (unchanged). With an
 * `accent`, the chip rests on a light pastel tint (decorative only — indigo
 * remains the action color elsewhere).
 */
export function CategoryChip({
  label,
  href,
  accent,
}: {
  label: string;
  href: string;
  accent?: Accent;
}) {
  const className = accent
    ? `inline-flex items-center rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:brightness-[0.98] ${accent.bg} ${accent.border} ${accent.text} tap-target`
    : "inline-flex items-center rounded-full border border-hairline bg-bg px-5 py-2.5 text-sm font-medium tracking-wide text-ink transition-all duration-200 hover:border-ink hover:bg-ink hover:text-white tap-target";

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}
