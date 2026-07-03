// Order pricing rules (single source of truth — mirrored in the place_order RPC).

/** Flat delivery charge for orders below the free-shipping threshold. */
export const SHIPPING_FEE = 49;

/** Orders at or above this subtotal ship free. */
export const FREE_SHIPPING_THRESHOLD = 500;

/**
 * Tax rate applied to the subtotal. Printed academic books are GST-exempt in
 * India (HSN 4901 → 0%), so this is 0 by default. The calculation is wired
 * end-to-end; change this constant to apply a rate.
 */
export const TAX_RATE = 0;

export interface PriceBreakdown {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  freeShipping: boolean;
  /** True when the shipping fee came from a book's manual delivery_charge
   *  override rather than the default flat-fee/free-threshold rule. */
  usesManualDelivery: boolean;
}

export function computeTotals(subtotal: number): PriceBreakdown {
  const shipping =
    subtotal <= 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  return {
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    freeShipping: subtotal > 0 && shipping === 0,
    usesManualDelivery: false,
  };
}

/**
 * Item-aware totals: mirrors the place_order RPC's shipping rule (see
 * supabase/migrations/0007_book_delivery_charge.sql). If any item carries an
 * explicit delivery_charge (admin-set on that book — 0 means free, a positive
 * number is a fixed fee), the order's shipping is the HIGHEST such charge
 * among the cart's items, bypassing the default free-shipping threshold.
 * Carts with no per-item overrides get the unchanged default behaviour.
 */
export function computeTotalsForItems(
  items: { price: number; quantity: number; delivery_charge?: number | null }[],
): PriceBreakdown {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const overrides = items
    .map((i) => i.delivery_charge)
    .filter((v): v is number => v !== null && v !== undefined);

  if (subtotal <= 0) {
    return { subtotal, shipping: 0, tax: 0, total: 0, freeShipping: false, usesManualDelivery: false };
  }

  if (overrides.length > 0) {
    const shipping = Math.max(...overrides);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    return {
      subtotal,
      shipping,
      tax,
      total: subtotal + shipping + tax,
      freeShipping: shipping === 0,
      usesManualDelivery: true,
    };
  }

  return computeTotals(subtotal);
}

/**
 * Amount still needed to qualify for free shipping (0 if already free or not
 * applicable — e.g. a manual delivery override is in effect).
 */
export function amountToFreeShipping(subtotal: number): number {
  if (subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return FREE_SHIPPING_THRESHOLD - subtotal;
}
