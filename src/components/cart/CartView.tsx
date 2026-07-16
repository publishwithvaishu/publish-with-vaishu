"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/CartContext";
import { BookCover } from "@/components/ui/BookCover";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { items, subtotal, count, isHydrated, updateQuantity, removeItem } =
    useCart();

  // Avoid a hydration flash — the cart is restored from localStorage on mount.
  if (!isHydrated) {
    return <p className="py-16 text-center text-muted">Loading your cart…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-hairline px-6 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-gold">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="20" r="1.4" />
            <circle cx="18" cy="20" r="1.4" />
            <path d="M2.5 3h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.4a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
          </svg>
        </div>
        <h2 className="mt-6 font-serif text-2xl text-ink">
          Your cart is empty
        </h2>
        <p className="mt-2 max-w-sm text-muted">
          Looks like you haven’t added any books yet. Browse our catalogue and
          find your next title.
        </p>
        <Link
          href="/books"
          className="mt-7 inline-flex h-12 items-center justify-center btn-gold rounded-full px-7 text-sm font-semibold tap-target"
        >
          Explore books
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      {/* Items */}
      <ul className="divide-y divide-hairline border-y border-hairline">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4 py-5">
            <Link
              href={`/books/${item.id}`}
              className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-hairline bg-bg-secondary"
            >
              <BookCover
                title={item.title}
                coverImage={item.cover_image}
                variant="mini"
                sizes="80px"
              />
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/books/${item.id}`}
                    className="font-serif text-base leading-snug text-ink hover:underline"
                  >
                    {item.title}
                  </Link>
                  {item.author_name && (
                    <p className="mt-0.5 text-sm text-muted">
                      {item.author_name}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.title}`}
                  className="shrink-0 rounded-full px-2 py-1 text-sm text-muted hover:text-ink"
                >
                  Remove
                </button>
              </div>

              <div className="mt-auto flex items-center justify-between pt-3">
                <QuantityStepper
                  quantity={item.quantity}
                  max={item.stock}
                  onChange={(q) => updateQuantity(item.id, q)}
                />
                <span className="text-sm font-medium text-ink">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Summary */}
      <aside className="h-fit rounded-2xl border border-hairline p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold text-ink">Order summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">
              Subtotal ({count} {count === 1 ? "item" : "items"})
            </dt>
            <dd className="font-medium text-ink">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="text-muted">Calculated at checkout</dd>
          </div>
        </dl>

        <div className="mt-5 flex justify-between border-t border-hairline pt-5">
          <span className="text-base font-medium text-ink">Total</span>
          <span className="text-base font-semibold text-ink">
            {formatPrice(subtotal)}
          </span>
        </div>

        <Link
          href="/checkout"
          className="mt-6 inline-flex h-12 w-full items-center justify-center btn-gold rounded-full px-6 text-sm font-semibold tap-target"
        >
          Proceed to checkout
        </Link>
        <p className="mt-3 text-center text-xs text-muted">
          Pay on delivery. Secure online payment (Razorpay) arrives soon.
        </p>

        <Link
          href="/books"
          className="mt-4 block text-center text-sm text-ink hover:text-muted"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}

function QuantityStepper({
  quantity,
  max,
  onChange,
}: {
  quantity: number;
  max: number;
  onChange: (q: number) => void;
}) {
  const atMax = max > 0 && quantity >= max;
  return (
    <div className="inline-flex items-center rounded-full border border-hairline">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center rounded-l-full text-ink hover:bg-bg-secondary"
      >
        −
      </button>
      <span className="w-8 text-center text-sm tabular-nums text-ink">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={atMax}
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center rounded-r-full text-ink hover:bg-bg-secondary disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
