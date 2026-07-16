/**
 * Decorative accents — presentational only. Translucent tints tuned for the
 * dark luxury theme (soft /10 backgrounds, /30 borders, -300 text) used on
 * category chips and cards across the customer site. Gold remains the ONLY
 * action colour (buttons, active states); these are never used for
 * interactive affordances.
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
    bg: "bg-indigo-500/10",
    bgSoft: "bg-indigo-500/[0.07]",
    border: "border-indigo-400/30",
    text: "text-indigo-300",
    chipBg: "bg-indigo-500/20",
  },
  {
    bg: "bg-emerald-500/10",
    bgSoft: "bg-emerald-500/[0.07]",
    border: "border-emerald-400/30",
    text: "text-emerald-300",
    chipBg: "bg-emerald-500/20",
  },
  {
    bg: "bg-sky-500/10",
    bgSoft: "bg-sky-500/[0.07]",
    border: "border-sky-400/30",
    text: "text-sky-300",
    chipBg: "bg-sky-500/20",
  },
  {
    bg: "bg-amber-500/10",
    bgSoft: "bg-amber-500/[0.07]",
    border: "border-amber-400/30",
    text: "text-amber-300",
    chipBg: "bg-amber-500/20",
  },
  {
    bg: "bg-violet-500/10",
    bgSoft: "bg-violet-500/[0.07]",
    border: "border-violet-400/30",
    text: "text-violet-300",
    chipBg: "bg-violet-500/20",
  },
  {
    bg: "bg-rose-500/10",
    bgSoft: "bg-rose-500/[0.07]",
    border: "border-rose-400/30",
    text: "text-rose-300",
    chipBg: "bg-rose-500/20",
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
