import { cn } from "@/lib/cn";

/**
 * Centered content column with mobile-first horizontal padding.
 *
 * Default max width is wide (min(1800px, 96vw)) on desktop (lg: 1024px+) so
 * the site uses available screen space on large monitors instead of leaving
 * big empty side margins — matching modern e-commerce layouts (Amazon/
 * Flipkart/Apple). The `96vw` half keeps a comfortable minimum side margin
 * between breakpoints, without ever going full edge-to-edge. The cap only
 * applies from `lg:` up — below that (mobile/tablet) the container stays
 * unconstrained (just the padding below), exactly as before, since 92vw
 * would otherwise shrink a phone-width layout below the viewport itself.
 * Padding scales from 20px on mobile up to 40px on large desktop, staying
 * within a comfortable 24–40px range throughout.
 *
 * `maxWidth` lets a caller opt into a different cap — used by AdminShell
 * to keep the admin dashboard's original (narrower) width unchanged.
 */
export function Container({
  children,
  className,
  maxWidth = "lg:max-w-[min(1800px,96vw)]",
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-10",
        maxWidth,
        className,
      )}
    >
      {children}
    </div>
  );
}
