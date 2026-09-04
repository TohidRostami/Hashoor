"use client";

import { useState } from "react";
import { ProductPlaceholder } from "@/components/shared/product-placeholder";
import type { GarmentVariant } from "@/components/shared/garment-glyph";
import { ProductGallery } from "@/components/shop/product-gallery";
import { AddToCartForm } from "@/components/shop/add-to-cart-form";
import { formatPrice } from "@/lib/format";
import type { ProductDetailDTO } from "@/lib/types";

const KNOWN_VARIANTS: GarmentVariant[] = ["shirts", "tshirts", "pants", "outerwear", "shoes", "accessories"];
function toGarmentVariant(slug: string): GarmentVariant {
  return (KNOWN_VARIANTS as string[]).includes(slug) ? (slug as GarmentVariant) : "shirts";
}

export function ProductPurchaseSection({ product }: { product: ProductDetailDTO }) {
  const hasColors = product.colors.length > 0;
  const [selectedColorId, setSelectedColorId] = useState<string | null>(product.colors[0]?.id ?? null);

  // Images for the selected color. If that color has none of its own
  // (e.g. admin forgot to upload any), fall back to whatever images the
  // product does have rather than leaving the gallery empty.
  const colorImages = hasColors ? product.images.filter((img) => img.colorId === selectedColorId) : product.images;
  const galleryImages = colorImages.length > 0 ? colorImages : product.images;

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
      <div className="overflow-hidden">
        {galleryImages.length > 0 ? (
          <ProductGallery images={galleryImages} productName={product.name} categorySlug={product.category.slug} />
        ) : (
          <ProductPlaceholder variant={toGarmentVariant(product.category.slug)} />
        )}
      </div>

      <div className="flex flex-col lg:py-4">
        <p className="text-sm text-muted-foreground">{product.category.title}</p>
        <h1 className="mt-1.5 text-2xl font-bold sm:text-3xl">{product.name}</h1>

        <div className="mt-4 flex items-baseline gap-2.5">
          {product.compareAtPrice && (
            <span className="text-base text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
          <span className="text-xl font-medium text-foreground">{formatPrice(product.price)}</span>
          <span className="text-sm text-muted-foreground">تومان</span>
        </div>

        <div className="mt-8 border-y border-border py-8">
          <AddToCartForm product={product} selectedColorId={selectedColorId} onColorChange={setSelectedColorId} />
        </div>

        <p className="mt-6 max-w-lg text-pretty text-sm leading-8 text-muted-foreground">{product.description}</p>
      </div>
    </div>
  );
}
