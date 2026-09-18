"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

export default function AddToCartButton({
  productId,
  variationId,
  disabled,
  variation
}: {
  productId: number;
  variationId?: number;
  disabled?: boolean;
  variation?: { attribute: string; value: string }[];
}) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  async function handleClick() {
    setLoading(true);
    try {
      await addToCart(productId, quantity, variationId, variation);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (err) {
      console.error(err);
      alert("Could not add to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between rounded-full border border-line bg-white px-3 py-2">
        <span className="text-sm font-medium text-ink">Quantity</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            disabled={disabled || loading}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-lg text-ink disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-8 text-center text-sm font-medium text-ink">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((prev) => prev + 1)}
            disabled={disabled || loading}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-lg text-ink disabled:opacity-40"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleClick}
        disabled={disabled || loading}
        className="btn-primary w-full rounded-full py-3.5 font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? "Adding..." : added ? "Added ✓" : "Add To Cart"}
      </button>
    </div>
  );
}
