import { cn } from "@/lib/cn";

/**
 * Centered content column with mobile-first horizontal padding.
 *
 * Desktop (lg: 1024px+) is true edge-to-edge by default: no max-width cap
 * and no side padding, so content touches the browser window's left/right
 * edges exactly. Mobile/tablet keep their original padding (20px → 32px),
 * unconstrained by any max-width, unchanged from before.
 *
 * `maxWidth` and `desktopPadding` let a caller opt out — used by AdminShell
 * to keep the admin dashboard's original (narrower, padded) desktop layout
 * completely unchanged.
 */
export function Container({
  children,
  className,
  maxWidth = "",
  desktopPadding = "lg:px-0",
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  desktopPadding?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        desktopPadding,
        maxWidth,
        className,
      )}
    >
      {children}
    </div>
  );
}
