import { formatPrice } from "@/lib/format";

/** Subtotal / delivery / tax / total breakdown — used on checkout + orders. */
export function OrderTotals({
  subtotal,
  shipping,
  tax,
  total,
}: {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}) {
  return (
    <dl className="space-y-3 text-sm">
      <Row label="Subtotal" value={formatPrice(subtotal)} />
      <Row
        label="Delivery"
        value={shipping === 0 ? "Free" : formatPrice(shipping)}
        muted={shipping === 0}
      />
      <Row label="Tax (GST)" value={formatPrice(tax)} />
      <div className="flex items-center justify-between border-t border-hairline pt-3">
        <dt className="text-base font-medium text-ink">Total</dt>
        <dd className="text-base font-semibold text-ink">
          {formatPrice(total)}
        </dd>
      </div>
    </dl>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className={muted ? "text-muted" : "font-medium text-ink"}>{value}</dd>
    </div>
  );
}
