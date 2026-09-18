import { getProducts } from "@/lib/woocommerce";
import ProductGrid from "@/components/ProductGrid";

export default async function ShopPage() {
  const products = await getProducts({ per_page: "100" }).catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-4xl text-ink mb-10">Shop</h1>
      <ProductGrid products={products} columns={4} />
    </div>
  );
}
