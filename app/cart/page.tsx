"use client";

import { useEffect, useState } from "react";
import { getCart, updateCartItem, removeCartItem, formatCartAmount, type Cart } from "@/lib/cart";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCart().then(setCart).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mx-auto max-w-4xl px-4 py-16">Loading cart...</div>;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="mb-6 text-gray-600">Your cart is empty.</p>
        <Link href="/shop" className="btn-primary rounded-full px-8 py-3 font-medium">
          Continue Shopping
        </Link>
      </div>
    );
  }

  async function handleQuantity(key: string, quantity: number) {
    const updated = await updateCartItem(key, quantity);
    setCart(updated);
  }

  async function handleRemove(key: string) {
    const updated = await removeCartItem(key);
    setCart(updated);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="font-display text-4xl text-ink mb-10">Your Cart</h1>
      <div className="space-y-6">
        {cart.items.map((item) => (
          <div key={item.key} className="flex items-center gap-4 border-b pb-4">
            {item.images?.[0]?.src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.images[0].src} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
            )}
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{formatCartAmount(item.prices.price, item.prices)}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) => handleQuantity(item.key, parseInt(e.target.value, 10))}
              className="w-16 border rounded-lg px-2 py-1"
            />
            <p className="w-24 text-right">{formatCartAmount(item.totals.line_total, item.totals)}</p>
            <button onClick={() => handleRemove(item.key)} className="text-sm text-red-500">
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Shipping and tax calculated at checkout.
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold mb-4">
            Total: {formatCartAmount(cart.totals.total_price, cart.totals)}
          </p>
          <Link href="/checkout" className="btn-primary rounded-full px-8 py-3 font-medium">
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
