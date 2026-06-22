// Indian Rupee currency formatting (spec: University of Madras, Razorpay → INR).
const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  return inr.format(value);
}

// Compact display of large counts, e.g. 12000 → "12,000".
const compact = new Intl.NumberFormat("en-IN");

export function formatCount(value: number): string {
  return compact.format(value);
}
