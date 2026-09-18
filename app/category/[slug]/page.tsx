import { notFound } from "next/navigation";
import { getCategory, getProducts } from "@/lib/woocommerce";
import ProductGrid from "@/components/ProductGrid";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug).catch(() => null);
  if (!category) notFound();

  const products = await getProducts({ category: String(category.id), per_page: "24" }).catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="font-display text-4xl text-ink mb-2">{category.name}</h1>
      {category.description && (
        <p className="text-gray-600 mb-8" dangerouslySetInnerHTML={{ __html: category.description }} />
      )}
      <ProductGrid products={products} columns={4} />
    </div>
  );
}
