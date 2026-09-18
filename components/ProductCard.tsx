import Image from "next/image";
import Link from "next/link";
import type { WCProduct } from "@/lib/woocommerce";
import { formatPrice } from "@/lib/woocommerce";

export default function ProductCard({ product }: { product: WCProduct }) {
  const image = product.images?.[0]?.src;
  const secondImage = product.images?.[1]?.src;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] bg-line/40 rounded-lg overflow-hidden">
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ease-out group-hover:scale-[1.04] ${
              secondImage ? "group-hover:opacity-0" : ""
            }`}
          />
        )}
        {secondImage && (
          <Image
            src={secondImage}
            alt={product.name}
            fill
            className="object-cover absolute inset-0 opacity-0 scale-[1.04] transition-all duration-700 ease-out group-hover:opacity-100"
          />
        )}

        {product.on_sale && (
          <span className="absolute top-3 left-3 bg-gold text-white text-[11px] tracking-wide px-2.5 py-1 rounded-full">
            Sale
          </span>
        )}
        {!product.is_in_stock && (
          <span className="absolute top-3 right-3 bg-ink/80 text-white text-[11px] px-2.5 py-1 rounded-full">
            Out of stock
          </span>
        )}

        {/* Quick add — slides up on hover, disabled for out-of-stock/variable */}
        {product.is_in_stock && product.type === "simple" && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <span className="block w-full bg-ink/90 text-white text-center text-sm py-2.5 backdrop-blur-sm">
              Quick view
            </span>
          </div>
        )}
      </div>

      <div className="pt-3">
        <h3 className="text-[15px] text-ink truncate">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          {product.on_sale ? (
            <>
              <span className="text-sm font-medium text-primary">
                {formatPrice(product.prices.sale_price, product.prices)}
              </span>
              <span className="text-xs text-muted line-through">
                {formatPrice(product.prices.regular_price, product.prices)}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-ink">
              {formatPrice(product.prices.price, product.prices)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
