import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/lib/types";
import type { OrderStatusHistoryEntry } from "@/lib/orders/types";

const STEPS: { key: OrderStatus; label: string }[] = [
  { key: "confirmed", label: "Order confirmed" },
  { key: "processing", label: "Processing" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function OrderStatusStepper({
  status,
  history,
}: {
  status: OrderStatus;
  history: OrderStatusHistoryEntry[];
}) {
  // First timestamp recorded for each status.
  const dates = new Map<string, string>();
  for (const h of history) if (!dates.has(h.status)) dates.set(h.status, h.created_at);

  if (status === "cancelled") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        This order was cancelled.
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <ol className="relative">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const active = i === currentIndex;
        const date = dates.get(step.key);
        const isLast = i === STEPS.length - 1;

        return (
          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Connector line */}
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[11px] top-6 h-[calc(100%-12px)] w-px",
                  i < currentIndex ? "bg-ink" : "bg-hairline",
                )}
                aria-hidden
              />
            )}
            {/* Dot */}
            <span
              className={cn(
                "relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                done ? "border-ink bg-ink text-white" : "border-hairline bg-bg",
              )}
              aria-hidden
            >
              {done && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12.5l4 4 10-10"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <div className="pt-0.5">
              <p
                className={cn(
                  "text-sm font-medium",
                  active ? "text-ink" : done ? "text-ink" : "text-muted",
                )}
              >
                {step.label}
              </p>
              {date && (
                <p className="mt-0.5 text-xs text-muted">{formatDate(date)}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
