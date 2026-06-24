import { cn } from "@/lib/cn";

export function PaymentBadge({
  status,
  method,
}: {
  status: string;
  method: string | null;
}) {
  const paid = status === "paid";
  const methodLabel =
    method === "razorpay" ? "Online" : method === "cod" ? "Pay on delivery" : method;

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
          paid ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-800",
        )}
      >
        {paid ? "Paid" : "Payment pending"}
      </span>
      {methodLabel && (
        <span className="text-xs text-muted">· {methodLabel}</span>
      )}
    </span>
  );
}
