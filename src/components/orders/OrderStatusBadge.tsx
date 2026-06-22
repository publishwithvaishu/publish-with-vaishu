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
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
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
