# WP2Next AI Builder — Phase 1 Starter

A working Next.js 14 (App Router) storefront that renders your WordPress
content and WooCommerce catalog through the official REST / Store APIs.
WordPress + WooCommerce stay the backend of record — this app never stores
products, carts, or orders of its own.

## What's in this scaffold

- `lib/wordpress.ts` — typed WordPress REST client (pages, posts, categories, media)
- `lib/woocommerce.ts` — WooCommerce Store API (public) + REST API (server-only, admin) client
- `lib/cart.ts` — client helpers that call our own `/api/cart` route (never WooCommerce directly)
- `app/api/cart/route.ts` — server proxy that owns the WooCommerce cart-token cookie (httpOnly)
- Pages: `/`, `/about`, `/shop`, `/category/[slug]`, `/product/[slug]`, `/blog`, `/blog/[slug]`, `/contact`, `/cart`, `/checkout`
- Components: `Header`, `Footer`, `ProductCard`, `ProductGrid`, `BlogCard`, `AddToCartButton`

## Setup

```bash
npm install
cp .env.example .env
# edit .env with your WordPress URL and WooCommerce REST keys
npm run dev
```

Requirements on the WordPress side:
- WordPress REST API enabled (default on any modern WP install)
- WooCommerce with the **Store API** active (built into WooCommerce 8+)
- A WooCommerce REST API key pair (WooCommerce → Settings → Advanced → REST API) if you want admin-only stats (e.g. order counts)

## Architecture

```
WordPress REST API  ─┐
                      ├──► Next.js (this app) ──► Vercel ──► Browser
WooCommerce Store API─┘
```

- Product/cart/checkout data is fetched live — no product or order database
  exists in this app.
- `WOOCOMMERCE_CONSUMER_SECRET` and payment secrets are read only in
  server-side code (`lib/woocommerce.ts`, API routes) and are never sent to
  the browser.
- The cart uses an httpOnly cookie holding the Store API cart-token, set by
  `/api/cart`, so client JS never touches the raw token.

## What's NOT included yet (roadmap)

This scaffold covers the *generated frontend* (spec sections 5–16, 21–23,
28). The parts of the original spec that are a separate product on top of
this — and a real multi-week build in their own right — are:

- **Builder dashboard & wizard UI** (spec §1–3): the SaaS screens for
  connecting a site, picking pages/content, and configuring design visually
- **AI codegen / AI chat design editor** (spec §4, §17): natural-language →
  project-mutation pipeline
- **Visual drag-drop section builder** (spec §18)
- **One-click Vercel deploy + GitHub flow** (spec §26)
- **Variation selector UI** for variable products, coupon UI polish, full
  checkout → payment gateway wiring (Razorpay/Stripe/WooCommerce Payments —
  this depends on which gateway plugin is active on your site)

Recommended next step: get this connected to a real WP/WooCommerce site and
confirm the data flow end-to-end, then layer the dashboard/wizard as a
separate admin app that edits this project's config rather than trying to
build the whole platform at once.

## Payment note

WooCommerce's Store API `/checkout` endpoint together with your active
payment gateway plugin (Razorpay, Stripe, WooCommerce Payments, etc.) is
what should ultimately create the order — the checkout form in this
scaffold is a shell that needs to be wired to that endpoint /
gateway-specific redirect flow, since the exact request shape depends on
the gateway installed on your site.
