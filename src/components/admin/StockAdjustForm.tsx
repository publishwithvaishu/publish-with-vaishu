import {
  addStockAction,
  removeStockAction,
} from "@/lib/actions/admin-inventory-actions";

/**
 * Inline stock adjustment: quantity + optional reason. The Add and Remove
 * buttons use per-button `formAction` (two distinct server actions), so the
 * operation never depends on a submitter's name/value being forwarded.
 */
export function StockAdjustForm({ bookId }: { bookId: string }) {
  return (
    <form action={addStockAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={bookId} />
      <label className="sr-only" htmlFor={`qty-${bookId}`}>
        Quantity
      </label>
      <input
        id={`qty-${bookId}`}
        name="qty"
        type="number"
        min={1}
        defaultValue={1}
        className="h-9 w-16 rounded-lg border border-hairline bg-bg px-2 text-sm text-ink focus:border-ink focus:outline-none"
      />
      <input
        name="reason"
        placeholder="Reason (optional)"
        className="h-9 w-36 rounded-lg border border-hairline bg-bg px-3 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none sm:w-44"
      />
      <button
        type="submit"
        formAction={addStockAction}
        className="h-9 rounded-full border border-green-200 bg-green-50 px-3 text-xs font-medium text-green-700 hover:bg-green-100"
      >
        + Add
      </button>
      <button
        type="submit"
        formAction={removeStockAction}
        className="h-9 rounded-full border border-hairline px-3 text-xs font-medium text-ink hover:bg-bg-secondary"
      >
        − Remove
      </button>
    </form>
  );
}
