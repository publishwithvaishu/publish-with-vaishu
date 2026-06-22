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
  };
}

/** Amount still needed to qualify for free shipping (0 if already free). */
export function amountToFreeShipping(subtotal: number): number {
  if (subtotal <= 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return FREE_SHIPPING_THRESHOLD - subtotal;
}
