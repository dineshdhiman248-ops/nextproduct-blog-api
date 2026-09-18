import type { WCProduct } from "@/lib/woocommerce";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products,
  columns = 4
}: {
  products: WCProduct[];
  columns?: 2 | 3 | 4;
}) {
  const colClass = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" }[columns];

  if (!products.length) {
    return (
      <p className="text-muted text-sm py-24 text-center border border-dashed border-line rounded-lg">
        No products found.
      </p>
    );
  }

  return (
    <div className={`grid grid-cols-2 ${colClass} gap-x-6 gap-y-10`}>
      {products.map((p, i) => (
        <div key={p.id} className="animate-rise-in" style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
