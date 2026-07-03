/**
 * Decorative pastel accents — presentational only. Very light Tailwind tints
 * (-50 backgrounds, -100 borders, -700 text) used to warm up cards and chips
 * across the customer site. Indigo remains the ONLY action color (buttons,
 * links, active states); these are never used for interactive affordances.
 *
 * Class strings are literal so Tailwind's scanner generates them.
 * Deterministic hashing mirrors pickTint() in src/components/ui/BookCover.tsx
 * so a given seed (e.g. "B.Com") gets the same accent everywhere.
 */

export interface Accent {
  bg: string;
  bgSoft: string; // translucent bg for larger surfaces
  border: string;
  text: string;
  chipBg: string; // slightly deeper bg for small chips/icons
}

export const ACCENTS: Accent[] = [
  {
    bg: "bg-indigo-50",
    bgSoft: "bg-indigo-50/60",
    border: "border-indigo-100",
    text: "text-indigo-700",
    chipBg: "bg-indigo-100",
  },
  {
    bg: "bg-emerald-50",
    bgSoft: "bg-emerald-50/60",
    border: "border-emerald-100",
    text: "text-emerald-700",
    chipBg: "bg-emerald-100",
  },
  {
    bg: "bg-sky-50",
    bgSoft: "bg-sky-50/60",
    border: "border-sky-100",
    text: "text-sky-700",
    chipBg: "bg-sky-100",
  },
  {
    bg: "bg-amber-50",
    bgSoft: "bg-amber-50/60",
    border: "border-amber-100",
    text: "text-amber-700",
    chipBg: "bg-amber-100",
  },
  {
    bg: "bg-violet-50",
    bgSoft: "bg-violet-50/60",
    border: "border-violet-100",
    text: "text-violet-700",
    chipBg: "bg-violet-100",
  },
  {
    bg: "bg-rose-50",
    bgSoft: "bg-rose-50/60",
    border: "border-rose-100",
    text: "text-rose-700",
    chipBg: "bg-rose-100",
  },
];

/** Index-based accent for fixed lists (e.g. the three WhyUs points). */
export function accentAt(i: number): Accent {
  return ACCENTS[((i % ACCENTS.length) + ACCENTS.length) % ACCENTS.length];
}

/** Deterministic accent for a seed string — same seed, same pastel, sitewide. */
export function pickAccent(seed: string): Accent {
  let sum = 0;
  for (let i = 0; i < seed.length; i++) sum = (sum + seed.charCodeAt(i)) % 997;
  return ACCENTS[sum % ACCENTS.length];
}
