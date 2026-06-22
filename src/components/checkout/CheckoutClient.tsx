"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart/CartContext";
import { computeTotals, amountToFreeShipping } from "@/lib/orders/pricing";
import { createOrderAction } from "@/lib/actions/order-actions";
import { OrderTotals } from "@/components/orders/OrderTotals";
import { RazorpayButton } from "@/components/checkout/RazorpayButton";
import { BookCover } from "@/components/ui/BookCover";
import { FormAlert } from "@/components/forms/FormAlert";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Address } from "@/lib/auth/addresses";

export function CheckoutClient({
  addresses,
  razorpayEnabled = false,
  prefill,
}: {
  addresses: Address[];
  razorpayEnabled?: boolean;
  prefill?: { name?: string; email?: string };
}) {
  const { items, subtotal, count, isHydrated, clear } = useCart();
  const router = useRouter();

  const defaultId =
    addresses.find((a) => a.is_default)?.id ?? addresses[0]?.id ?? "";
  const [selected, setSelected] = useState(defaultId);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isHydrated) {
    return <p className="py-16 text-center text-muted">Loading checkout…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-hairline px-6 py-16 text-center">
        <p className="font-serif text-lg text-ink">Your cart is empty</p>
        <p className="mt-2 text-sm text-muted">
          Add a book before checking out.
        </p>
        <Link
          href="/books"
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-sm font-medium text-white tap-target"
        >
          Browse books
        </Link>
      </div>
    );
  }

  const totals = computeTotals(subtotal);
  const toFree = amountToFreeShipping(subtotal);

  async function placeOrder() {
    setError(null);
    if (!selected) {
      setError("Please select a shipping address.");
      return;
    }
    setPending(true);
    const res = await createOrderAction({
      addressId: selected,
      items: items.map((i) => ({ bookId: i.id, quantity: i.quantity })),
    });
    if (res.ok && res.orderId) {
      clear();
      router.push(`/orders/${res.orderId}?placed=1`);
    } else {
      setError(res.error ?? "Could not place your order.");
      setPending(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div className="space-y-10">
        {/* Shipping address */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            Shipping address
          </h2>

          {addresses.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-hairline p-6 text-center">
              <p className="text-sm text-muted">
                You don’t have a saved address yet.
              </p>
              <Link
                href="/account/addresses/new"
                className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white"
              >
                Add an address
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-2xl border p-4 transition-colors",
                    selected === a.id
                      ? "border-ink bg-bg-secondary"
                      : "border-hairline hover:border-ink/30",
                  )}
                >
                  <input
                    type="radio"
                    name="address"
                    value={a.id}
                    checked={selected === a.id}
                    onChange={() => setSelected(a.id)}
                    className="mt-1 h-4 w-4"
                  />
                  <span className="text-sm">
                    <span className="flex items-center gap-2 font-medium text-ink">
                      {a.full_name}
                      {a.is_default && (
                        <span className="rounded-full bg-ink px-2 py-0.5 text-[10px] font-medium text-white">
                          Default
                        </span>
                      )}
                    </span>
                    <span className="mt-1 block text-muted">
                      {a.address}, {a.city}, {a.state} — {a.pincode}
                    </span>
                    {a.mobile && (
                      <span className="mt-0.5 block text-muted">{a.mobile}</span>
                    )}
                  </span>
                </label>
              ))}
              <Link
                href="/account/addresses/new"
                className="inline-block text-sm font-medium text-ink underline"
              >
                Add a new address
              </Link>
            </div>
          )}
        </section>

        {/* Items review */}
        <section>
          <h2 className="text-xl font-semibold tracking-tight text-ink">
            Items ({count})
          </h2>
          <ul className="mt-4 divide-y divide-hairline border-y border-hairline">
            {items.map((item) => (
              <li key={item.id} className="flex gap-4 py-4">
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-md border border-hairline bg-bg-secondary">
                  <BookCover
                    title={item.title}
                    coverImage={item.cover_image}
                    variant="mini"
                    sizes="56px"
                  />
                </div>
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-serif text-sm text-ink">{item.title}</p>
                    <p className="mt-0.5 text-sm text-muted">
                      Qty {item.quantity} × {formatPrice(item.price)}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-ink">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Summary / place order */}
      <aside className="h-fit space-y-5 rounded-2xl border border-hairline p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold text-ink">Order summary</h2>
        {toFree > 0 && (
          <p className="rounded-lg bg-bg-secondary px-3 py-2 text-xs text-muted">
            Add {formatPrice(toFree)} more for free delivery.
          </p>
        )}
        <OrderTotals {...totals} />

        {error && <FormAlert error={error} />}

        {/* Online payment (Razorpay) — primary when configured. */}
        {razorpayEnabled && (
          <RazorpayButton
            addressId={selected}
            items={items.map((i) => ({ bookId: i.id, quantity: i.quantity }))}
            prefill={prefill}
            disabled={!selected}
            onPaid={clear}
          />
        )}

        {/* Pay on delivery (unchanged 3B flow). */}
        <button
          type="button"
          onClick={placeOrder}
          disabled={pending || !selected}
          className={cn(
            "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-colors disabled:opacity-60",
            razorpayEnabled
              ? "border border-hairline text-ink hover:bg-bg-secondary"
              : "bg-primary text-white hover:bg-ink/90",
          )}
        >
          {pending && (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
              <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          )}
          {pending
            ? "Placing order…"
            : razorpayEnabled
              ? "Pay on delivery"
              : "Place order"}
        </button>

        <p className="text-center text-xs text-muted">
          {razorpayEnabled
            ? "Pay securely online via Razorpay, or pay on delivery."
            : "Pay on delivery. Secure online payment (Razorpay) arrives soon."}
        </p>
        <Link
          href="/cart"
          className="block text-center text-sm text-ink hover:text-muted"
        >
          Back to cart
        </Link>
      </aside>
    </div>
  );
}
