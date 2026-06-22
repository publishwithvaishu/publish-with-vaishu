"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart, type CartItem } from "@/lib/cart/CartContext";

type Props = {
  book: Omit<CartItem, "quantity">;
};

export function AddToCartButtons({ book }: Props) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  const outOfStock = book.stock <= 0;

  if (outOfStock) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          disabled
          className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-bg-secondary px-6 text-sm font-medium text-muted"
        >
          Out of stock
        </button>
      </div>
    );
  }

  function handleAdd() {
    addItem(book, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  function handleBuyNow() {
    addItem(book, 1);
    router.push("/cart");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={handleAdd}
        className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-ink px-6 text-sm font-medium text-ink transition-colors hover:bg-bg-secondary tap-target"
      >
        {added ? "Added to cart ✓" : "Add to Cart"}
      </button>
      <button
        type="button"
        onClick={handleBuyNow}
        className="inline-flex h-12 flex-1 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-white transition-colors hover:bg-ink/90 tap-target"
      >
        Buy Now
      </button>
    </div>
  );
}
