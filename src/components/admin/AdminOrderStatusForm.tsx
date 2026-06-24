"use client";

import { useActionState, useState } from "react";
import { updateOrderStatusAction } from "@/lib/actions/admin-order-actions";
import { initialActionState } from "@/lib/forms/types";
import { FormField } from "@/components/forms/FormField";
import { FormAlert } from "@/components/forms/FormAlert";
import { SubmitButton } from "@/components/forms/SubmitButton";
import type { Order } from "@/lib/orders/types";
import type { OrderStatus } from "@/lib/types";

const STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export function AdminOrderStatusForm({ order }: { order: Order }) {
  const [state, action] = useActionState(
    updateOrderStatusAction,
    initialActionState,
  );
  const [status, setStatus] = useState<OrderStatus>(order.status);

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormAlert error={state.error} success={state.success} />
      <input type="hidden" name="id" value={order.id} />

      <div>
        <label
          htmlFor="field-status"
          className="block text-sm font-medium text-ink"
        >
          Order status
        </label>
        <select
          id="field-status"
          name="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="mt-1.5 h-12 w-full rounded-xl border border-hairline bg-bg px-4 text-sm text-ink focus:border-ink focus:outline-none"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {status === "shipped" && (
        <div className="space-y-3 rounded-xl border border-hairline bg-bg-secondary p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Shipment details
          </p>
          <FormField
            label="Courier name"
            name="courier_name"
            defaultValue={order.courier_name ?? ""}
          />
          <FormField
            label="Tracking number"
            name="tracking_number"
            defaultValue={order.tracking_number ?? ""}
          />
          <FormField
            label="Tracking URL"
            name="tracking_url"
            type="url"
            placeholder="https://…"
            defaultValue={order.tracking_url ?? ""}
          />
        </div>
      )}

      <FormField label="Note (optional)" name="note" />

      <SubmitButton pendingText="Updating…">Update status</SubmitButton>
    </form>
  );
}
