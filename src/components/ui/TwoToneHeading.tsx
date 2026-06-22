import { cn } from "@/lib/cn";

/**
 * Two-tone headline (spec §4): first line near-black ink,
 * second line muted gray. Renders as a single heading element.
 */
export function TwoToneHeading({
  lead,
  trail,
  as: As = "h2",
  className,
}: {
  lead: string;
  trail: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <As
      className={cn(
        "text-balance font-semibold tracking-tight",
        className,
      )}
    >
      <span className="block text-ink">{lead}</span>
      <span className="block text-muted">{trail}</span>
    </As>
  );
}
