import { getProducts } from "@/lib/woocommerce";
import ProductGrid from "@/components/ProductGrid";

export default async function SearchPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim() || "";
  const products = query
    ? await getProducts({ search: query, per_page: "48" }).catch(() => [])
    : [];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <form action="/search" className="mb-10">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search products..."
          className="w-full max-w-xl border border-line rounded-full px-5 py-3 outline-none focus:border-primary transition-colors"
        />
      </form>

      {query ? (
        <>
          <h1 className="font-display text-3xl text-ink mb-8">
            Results for &ldquo;{query}&rdquo;
          </h1>
          <ProductGrid products={products} columns={4} />
        </>
      ) : (
        <p className="text-muted text-sm">Type something above to search products.</p>
      )}
    </div>
  );
}
