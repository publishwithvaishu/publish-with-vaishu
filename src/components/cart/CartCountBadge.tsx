"use client";

import { useCart } from "@/lib/cart/CartContext";

/** Small live count badge for cart icons. Renders nothing when empty. */
export function CartCountBadge() {
  const { count, isHydrated } = useCart();
  if (!isHydrated || count === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#e8b647] px-1 text-[10px] font-semibold leading-none text-[#1a1405]">
      {count > 99 ? "99+" : count}
    </span>
  );
}
