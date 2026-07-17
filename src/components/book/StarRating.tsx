import { cn } from "@/lib/cn";

/** Read-only star display for an average/given rating (supports half-stars visually via fill %). */
export function StarRating({
  value,
  size = 16,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) => {
        const fill = Math.max(0, Math.min(1, value - (n - 1)));
        return <Star key={n} fillPercent={fill} size={size} />;
      })}
    </span>
  );
}

function Star({ fillPercent, size }: { fillPercent: number; size: number }) {
  const id = `star-clip-${Math.round(fillPercent * 100)}-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={24 * fillPercent} height="24" />
        </clipPath>
      </defs>
      <path
        d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-white/20"
      />
      <path
        d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z"
        fill="currentColor"
        className="text-gold"
        clipPath={`url(#${id})`}
      />
    </svg>
  );
}
