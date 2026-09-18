import Link from "next/link";
import { getProducts } from "@/lib/woocommerce";
import ProductGrid from "@/components/ProductGrid";

export default async function HomePage() {
  const products = await getProducts({ per_page: "8" }).catch(() => []);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-28 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-rise-in">
            <h1 className="font-display text-5xl md:text-6xl leading-[1.05] text-ink">
              {process.env.NEXT_PUBLIC_SITE_NAME || "Your Store"}
            </h1>
            <p className="mt-6 text-muted max-w-md leading-relaxed">
              Powered by WordPress &amp; WooCommerce, delivered as a fast Next.js storefront —
              every piece styled the way it deserves to be shown.
            </p>
            <Link
              href="/shop"
              className="btn-primary inline-block mt-8 rounded-full px-8 py-3.5 font-medium"
            >
              Shop the collection
            </Link>
          </div>
          <div className="relative aspect-[4/5] rounded-lg bg-line/50 animate-rise-in" style={{ animationDelay: "120ms" }}>
            {products[0]?.images?.[0]?.src && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={products[0].images[0].src}
                alt=""
                className="absolute inset-0 w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="font-display text-3xl text-ink">Featured</h2>
          <Link href="/shop" className="nav-link text-sm text-muted hover:text-primary">
            View all
          </Link>
        </div>
        <ProductGrid products={products} columns={4} />
      </section>
    </div>
  );
}
