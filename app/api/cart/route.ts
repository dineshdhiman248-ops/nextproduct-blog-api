// app/api/cart/route.ts
// Server-side proxy between the browser and WooCommerce Store API.
// Purpose: keep the Store API's cart-token in an httpOnly cookie instead of
// exposing it to page JavaScript, and give us one place to extend with
// custom logic (rate limiting, logging, validation) later.

import { NextRequest, NextResponse } from "next/server";
import { storeApiRequest } from "@/lib/woocommerce";

const CART_TOKEN_COOKIE = "wc_cart_token";
const NONCE_COOKIE = "wc_store_api_nonce";

export async function POST(req: NextRequest) {
  const { action, ...payload } = await req.json();
  let existingToken = req.cookies.get(CART_TOKEN_COOKIE)?.value;
  let existingNonce = req.cookies.get(NONCE_COOKIE)?.value;

  const isWrite = action !== "get";

  // A write action (add/update/remove/coupon) needs a valid Nonce, which is
  // only ever handed out by a prior request. If this is the very first
  // request of the session — e.g. someone clicks "Add to Cart" on a product
  // page without ever loading /cart first — silently prime the session with
  // a GET before performing the real write, so it never fails on first use.
  if (isWrite && !existingNonce) {
    const primed = await storeApiRequest("cart", {
      headers: existingToken ? { "Cart-Token": existingToken } : {}
    });
    if (primed.cartToken) existingToken = primed.cartToken;
    if (primed.nonce) existingNonce = primed.nonce;
  }

  const headers: Record<string, string> = {};
  if (existingToken) headers["Cart-Token"] = existingToken;
  // WooCommerce Store API rejects write requests (add/update/remove/coupon)
  // without a valid Nonce header — it's returned on every response and must
  // be forwarded on the next request, same as the cart token.
  if (existingNonce) headers["Nonce"] = existingNonce;

  let result;
  switch (action) {
    case "get":
      result = await storeApiRequest("cart", { headers });
      break;
    case "add":
      result = await storeApiRequest("cart/add-item", {
        method: "POST",
        headers,
        body: JSON.stringify({
          id: payload.id,
          quantity: payload.quantity,
          variation_id: payload.variation_id,
          ...(Array.isArray(payload.variation) && payload.variation.length > 0
            ? { variation: payload.variation }
            : {})
        })
      });
      break;
    case "update":
      result = await storeApiRequest("cart/update-item", {
        method: "POST",
        headers,
        body: JSON.stringify({ key: payload.key, quantity: payload.quantity })
      });
      break;
    case "remove":
      result = await storeApiRequest("cart/remove-item", {
        method: "POST",
        headers,
        body: JSON.stringify({ key: payload.key })
      });
      break;
    case "coupon":
      result = await storeApiRequest("cart/apply-coupon", {
        method: "POST",
        headers,
        body: JSON.stringify({ code: payload.code })
      });
      break;
    default:
      return NextResponse.json({ error: "Unknown cart action" }, { status: 400 });
  }

  const response = NextResponse.json(result.body, { status: result.status });
  const cookieOpts = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/"
  };
  if (result.cartToken) {
    response.cookies.set(CART_TOKEN_COOKIE, result.cartToken, cookieOpts);
  }
  if (result.nonce) {
    response.cookies.set(NONCE_COOKIE, result.nonce, cookieOpts);
  }
  return response;
}
