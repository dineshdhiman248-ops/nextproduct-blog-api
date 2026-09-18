// lib/cart.ts
// Client-side helpers that talk to OUR Next.js server route (/api/cart),
// never directly to WooCommerce. This keeps the cart token in an
// httpOnly cookie instead of exposing it to page JS.

// Store API returns money amounts as scaled integers (see lib/woocommerce.ts
// formatPrice) — currency_minor_unit tells you how many places to shift.
export interface CartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  prices: { price: string; currency_minor_unit: number; currency_prefix: string; currency_suffix: string };
  totals: { line_total: string; currency_minor_unit: number; currency_prefix: string; currency_suffix: string };
  images: { src: string }[];
}

export interface Cart {
  items: CartItem[];
  items_count: number;
  totals: {
    total_price: string;
    total_shipping: string;
    total_tax: string;
    currency_minor_unit: number;
    currency_prefix: string;
    currency_suffix: string;
  };
}

export function formatCartAmount(
  amount: string,
  ctx: { currency_minor_unit: number; currency_prefix: string; currency_suffix: string }
): string {
  const value = parseInt(amount, 10) / Math.pow(10, ctx.currency_minor_unit);
  return `${ctx.currency_prefix}${value.toFixed(ctx.currency_minor_unit)}${ctx.currency_suffix}`;
}

async function cartRequest(action: string, payload?: Record<string, unknown>) {
  const res = await fetch("/api/cart", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...payload })
  });
  if (!res.ok) throw new Error(`Cart request failed: ${action}`);
  return res.json();
}

export async function getCart(): Promise<Cart> {
  return cartRequest("get");
}

export async function addToCart(
  productId: number,
  quantity = 1,
  variationId?: number,
  variation?: { attribute: string; value: string }[]
) {
  return cartRequest("add", {
    id: productId,
    quantity,
    variation_id: variationId,
    variation
  });
}

export async function updateCartItem(key: string, quantity: number) {
  return cartRequest("update", { key, quantity });
}

export async function removeCartItem(key: string) {
  return cartRequest("remove", { key });
}

export async function applyCoupon(code: string) {
  return cartRequest("coupon", { code });
}
