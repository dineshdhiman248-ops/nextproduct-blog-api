// lib/woocommerce.ts
// WooCommerce access is split in two:
//  - Store API (public, customer-facing: products/categories/cart) — safe for
//    server components to call directly, no secrets required.
//  - REST API (authenticated, admin/server-only) — uses Consumer Key/Secret,
//    NEVER call this from client components.

const WORDPRESS_URL = process.env.WORDPRESS_URL as string;
const STORE_API = `${WORDPRESS_URL}/wp-json/wc/store/v1`;
const REST_API = `${WORDPRESS_URL}/wp-json/wc/v3`;

const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

export interface WCPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  price_range: { min_amount: string; max_amount: string } | null;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface WCProductAttributeTerm {
  id?: number;
  name: string;
  slug?: string;
}

export interface WCProductAttribute {
  id: number;
  name: string;
  taxonomy?: string;
  options?: string[];
  terms?: WCProductAttributeTerm[];
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: "simple" | "variable" | "grouped" | "external";
  prices: WCPrices;
  on_sale: boolean;
  short_description: string;
  description: string;
  sku: string;
  is_in_stock: boolean;
  average_rating: string;
  review_count: number;
  images: { id: number; src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  attributes: WCProductAttribute[];
  variations: number[];
}

// Store API returns price amounts as integers scaled by currency_minor_unit
// (e.g. "4200" with minor_unit 2 means 42.00) — this converts + formats them.
export function formatPrice(amount?: string | null, prices?: Partial<WCPrices> | null): string {
  const safeAmount = amount ?? "0";
  const safePrices = prices ?? {
    currency_minor_unit: 2,
    currency_prefix: "₹",
    currency_suffix: ""
  };

  const value = parseInt(safeAmount, 10) / Math.pow(10, safePrices.currency_minor_unit ?? 2);
  return `${safePrices.currency_prefix ?? "₹"}${value.toFixed(safePrices.currency_minor_unit ?? 2)}${safePrices.currency_suffix ?? ""}`;
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: { src: string } | null;
  count: number;
}

// ---------- Store API (public, no secrets) ----------

async function storeFetch<T>(path: string, init?: RequestInit, revalidate = 60): Promise<T> {
  const res = await fetch(`${STORE_API}/${path}`, {
    ...init,
    next: init?.method ? undefined : { revalidate }
  });
  if (!res.ok) {
    throw new Error(`WooCommerce Store API error (${res.status}) on ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function getProducts(params: Record<string, string> = {}) {
  const qs = new URLSearchParams(params).toString();
  return storeFetch<WCProduct[]>(`products${qs ? `?${qs}` : ""}`);
}

export async function getProduct(slug: string) {
  const products = await storeFetch<WCProduct[]>(`products?slug=${slug}`);
  return products[0] ?? null;
}

export async function getProductCategories() {
  return storeFetch<WCCategory[]>("products/categories?per_page=50");
}

export interface WCVariationAttribute {
  name: string;
  value?: string;
  option?: string;
}

export interface WCVariation {
  id: number;
  attributes: WCVariationAttribute[];
  prices: WCPrices;
  is_in_stock: boolean;
  images?: { id: number; src: string; alt: string }[];
}

export async function getProductVariations(productId: number) {
  // The Store API has no dedicated /products/{id}/variations route (that's
  // only in the authenticated wc/v3 REST API). Variations are fetched from
  // the same /products list endpoint using type=variation + parent.
  return storeFetch<WCVariation[]>(
    `products?type=variation&parent=${productId}&per_page=100`
  );
}

export async function getCategory(slug: string) {
  const cats = await storeFetch<WCCategory[]>(`products/categories?slug=${slug}`);
  return cats[0] ?? null;
}

// Cart calls need the cart token / nonce forwarded from the browser cookie —
// these are called from the server route in app/api/cart/route.ts, which
// owns cookie handling. Kept here as thin wrappers for that route to use.

export async function storeApiRequest(
  path: string,
  init: RequestInit & { headers?: Record<string, string> } = {}
) {
  const res = await fetch(`${STORE_API}/${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {})
    },
    cache: "no-store"
  });
  const cartToken = res.headers.get("cart-token");
  const nonce = res.headers.get("nonce");
  const body = await res.json();
  return { body, status: res.status, cartToken, nonce };
}

// ---------- Authenticated REST API (server/admin only) ----------

function restAuthQuery() {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    throw new Error("WooCommerce REST credentials are not configured on the server.");
  }
  return `consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
}

// Example admin-only call — e.g. for the builder dashboard's product counts.
// Never import this file's REST helpers into a "use client" component.
export async function adminGetOrderCount() {
  const res = await fetch(`${REST_API}/orders?per_page=1&${restAuthQuery()}`, {
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`WooCommerce REST API error (${res.status})`);
  const total = res.headers.get("X-WP-Total");
  return total ? parseInt(total, 10) : 0;
}