import { cn } from "@/lib/cn";
import type { OrderStatus } from "@/lib/types";

const LABELS: Record<OrderStatus, string> = {
  confirmed: "Confirmed",
  processing: "Processing",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STYLES: Record<OrderStatus, string> = {
  confirmed: "bg-bg-secondary text-ink",
  processing: "bg-bg-secondary text-ink",
  packed: "bg-bg-secondary text-ink",
  shipped: "bg-blue-50 text-blue-700",
  delivered: "border border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  cancelled: "border border-red-400/30 bg-red-500/10 text-red-300",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        STYLES[status],
      )}
    >
      {LABELS[status]}
    </span>
  );
}
