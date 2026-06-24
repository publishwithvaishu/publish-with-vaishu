import { cn } from "@/lib/cn";
import { LOW_STOCK_THRESHOLD } from "@/lib/admin/inventory";

export function StockLevelBadge({ stock }: { stock: number }) {
  const level =
    stock <= 0 ? "out" : stock <= LOW_STOCK_THRESHOLD ? "low" : "in";
  const styles = {
    out: "bg-red-50 text-red-700",
    low: "bg-amber-50 text-amber-800",
    in: "bg-green-50 text-green-700",
  }[level];
  const label = { out: "Out of stock", low: "Low", in: "In stock" }[level];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        styles,
      )}
    >
      {label}
    </span>
  );
}
