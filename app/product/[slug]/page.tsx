import Image from "next/image";
import { notFound } from "next/navigation";
import { getProduct, getProductVariations, formatPrice } from "@/lib/woocommerce";
import AddToCartButton from "@/components/AddToCartButton";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug).catch(() => null);
  if (!product) notFound();

  const variations =
    product.type === "variable"
      ? await getProductVariations(product.id).catch(() => [])
      : [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 grid md:grid-cols-2 gap-12">
      <div className="relative aspect-square bg-line/40 rounded-lg overflow-hidden">
        {product.images?.[0]?.src && (
          <Image src={product.images[0].src} alt={product.name} fill className="object-cover" />
        )}
      </div>

      <div>
        <h1 className="font-display text-3xl text-ink mb-2">{product.name}</h1>

        {product.type !== "variable" && (
          <div className="flex items-center gap-2 mb-4">
            {product.on_sale ? (
              <>
                <span className="text-xl font-semibold text-primary">
                  {formatPrice(product.prices.sale_price, product.prices)}
                </span>
                <span className="text-muted line-through">
                  {formatPrice(product.prices.regular_price, product.prices)}
                </span>
              </>
            ) : (
              <span className="text-xl font-semibold">
                {formatPrice(product.prices.price, product.prices)}
              </span>
            )}
          </div>
        )}

        <div
          className="text-muted text-sm mb-6 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: product.short_description ?? "" }}
        />

        {product.type === "variable" ? (
          <ProductPurchasePanel product={product} variations={variations} />
        ) : (
          <>
            <AddToCartButton productId={product.id} disabled={!product.is_in_stock} />
            {!product.is_in_stock && (
              <p className="text-red-500 text-sm mt-3">Currently out of stock.</p>
            )}
          </>
        )}

        {product.description && (
          <div className="mt-10 pt-10 border-t border-line">
            <h2 className="font-medium mb-3 text-ink">Description</h2>
            <div
              className="text-sm text-muted prose leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description ?? "" }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
