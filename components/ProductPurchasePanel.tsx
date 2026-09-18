"use client";

import { useMemo, useState } from "react";
import type { WCProduct, WCVariation } from "@/lib/woocommerce";
import { formatPrice } from "@/lib/woocommerce";
import AddToCartButton from "./AddToCartButton";

// Handles variable products: lets the shopper pick one option per attribute
// (Color, Size, ...), resolves the matching variation, and only enables
// Add to Cart once a valid, in-stock variation is selected. For simple
// products this isn't used — the product page renders AddToCartButton
// directly.
export default function ProductPurchasePanel({
  product,
  variations
}: {
  product: WCProduct;
  variations: WCVariation[];
}) {
  type SelectableOption = { label: string; value: string };

  const normalizeAttributeValue = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");

  const getAttributeOptions = (attribute: WCProduct["attributes"][number]): SelectableOption[] => {
    const rawOptions = Array.isArray(attribute.options) && attribute.options.length > 0
      ? attribute.options
      : Array.isArray(attribute.terms)
        ? attribute.terms
        : [];

    return rawOptions.map((item) => {
      if (typeof item === "string") {
        const label = item.trim();
        return { label, value: normalizeAttributeValue(label) };
      }

      const label = item.name.trim();
      const rawValue = item.slug && item.slug.trim() ? item.slug : label;

      return {
        label,
        value: normalizeAttributeValue(rawValue)
      };
    });
  };

  const selectableAttrs = (product.attributes ?? [])
    .map((attribute) => ({
      ...attribute,
      options: getAttributeOptions(attribute)
    }))
    .filter((attribute) => attribute.options.length > 0);

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};

    for (const attribute of selectableAttrs) {
      if (attribute.options.length === 1) {
        initial[attribute.name] = attribute.options[0].label;
      }
    }

    return initial;
  });

  const matchedVariation = useMemo(() => {
    const attrNames = selectableAttrs.map((attribute) => attribute.name);
    if (attrNames.length === 0 && variations.length > 0) return variations[0];
    if (attrNames.some((name) => !selected[name])) return null;

    const directMatch = variations.find((variation) => {
      if (variation.attributes.length === 0) {
        return true;
      }

      return selectableAttrs.every((attribute) => {
        const chosenLabel = selected[attribute.name];
        if (!chosenLabel) return false;

        const chosenValue = attribute.options.find((option) => option.label === chosenLabel)?.value ?? normalizeAttributeValue(chosenLabel);
        const matchingAttributes = variation.attributes.filter((variationAttribute) => {
          const currentName = variationAttribute.name.toLowerCase();
          const taxonomyName = attribute.taxonomy ? `attribute_${attribute.taxonomy}`.toLowerCase() : "";
          return currentName === attribute.name.toLowerCase() || currentName === taxonomyName;
        });

        if (matchingAttributes.length === 0) return true;

        return matchingAttributes.some((variationAttribute) => {
          const variationValue = (variationAttribute.option ?? variationAttribute.value ?? "").trim();
          if (!variationValue) return true;

          const normalizedVariationValue = normalizeAttributeValue(variationValue);
          return normalizedVariationValue === chosenValue || normalizedVariationValue === normalizeAttributeValue(chosenLabel);
        });
      });
    });

    return directMatch ?? variations[0] ?? null;
  }, [selected, selectableAttrs, variations]);

  const allSelected = selectableAttrs.every((attribute) => selected[attribute.name]);

  const selectedVariation = selectableAttrs.reduce<{ attribute: string; value: string }[]>((acc, attribute) => {
    const chosenLabel = selected[attribute.name];
    if (chosenLabel) {
      const chosenOption = attribute.options.find((option) => option.label === chosenLabel);
      acc.push({
        attribute: attribute.taxonomy ?? normalizeAttributeValue(attribute.name),
        value: chosenOption?.value ?? normalizeAttributeValue(chosenLabel)
      });
    }

    return acc;
  }, []);

  return (
    <div>
      {selectableAttrs.map((attr) => (
        <div key={attr.id} className="mb-5">
          <p className="text-sm font-medium text-ink mb-2">{attr.name}</p>
          <div className="flex flex-wrap gap-2">
            {attr.options.map((option) => {
              const isActive = selected[attr.name] === option.label;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setSelected((prev) => ({ ...prev, [attr.name]: option.label }))
                  }
                  className={`px-4 py-2 rounded-full border text-sm transition-colors ${
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-line text-ink hover:border-primary"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {allSelected && matchedVariation ? (
        <>
          <p className="text-xl font-semibold mb-4">
            {formatPrice(matchedVariation.prices.price, matchedVariation.prices)}
          </p>
          <AddToCartButton
            productId={product.id}
            variationId={matchedVariation.id}
            variation={selectedVariation}
            disabled={!matchedVariation.is_in_stock}
          />
          {!matchedVariation.is_in_stock && (
            <p className="text-red-500 text-sm mt-3">This option is out of stock.</p>
          )}
        </>
      ) : (
        <button
          type="button"
          disabled
          className="w-full rounded-full bg-line text-muted py-3.5 font-medium cursor-not-allowed"
        >
          {allSelected ? "Option unavailable" : "Select options"}
        </button>
      )}
    </div>
  );
}