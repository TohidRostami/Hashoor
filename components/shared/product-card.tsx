import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ProductPlaceholder } from "@/components/shared/product-placeholder";
import type { GarmentVariant } from "@/components/shared/garment-glyph";
import type { ProductDTO } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const KNOWN_VARIANTS: GarmentVariant[] = [
  "shirts",
  "tshirts",
  "pants",
  "outerwear",
  "shoes",
  "accessories",
];

const MAX_VISIBLE_SWATCHES = 5;

function toGarmentVariant(slug: string): GarmentVariant {
  return (KNOWN_VARIANTS as string[]).includes(slug)
    ? (slug as GarmentVariant)
    : "shirts";
}

export function ProductCard({ product }: { product: ProductDTO }) {
  const image = product.images[0];
  const visibleColors = product.colors
    ? product.colors.slice(0, MAX_VISIBLE_SWATCHES)
    : [];
  const hiddenColorCount = product.colors
    ? product.colors.length - visibleColors.length
    : 0;

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg">
        {image ? (
          <div
            className={cn(
              "relative aspect-4/5 w-full",
              !product.inStock && "opacity-60",
            )}
          >
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <ProductPlaceholder
            variant={toGarmentVariant(product.category.slug)}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {!product.inStock ? (
          <Badge
            variant="outline"
            className="absolute end-3 top-3 bg-background"
          >
            ناموجود
          </Badge>
        ) : (
          product.isNew && <Badge className="absolute end-3 top-3">جدید</Badge>
        )}

        {product.inStock && (
          <button
            type="button"
            aria-label="افزودن سریع به سبد خرید"
            className="absolute bottom-3 start-3 inline-flex h-9 translate-y-2 items-center justify-center gap-2 rounded-md bg-background px-3 text-sm text-foreground opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
          >
            <span>افزودن به سبد خرید</span>
            <Plus className="size-4 shrink-0" />
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-col items-start justify-between">
        <div className="min-h-[3.5rem]">
          <p className="text-xs text-muted-foreground">
            {product.category.title}
          </p>
          <h3 className="mt-0.5 text-sm font-medium">{product.name}</h3>
        </div>

        {product.colors && (
          <div className="mt-1.5 flex items-center gap-1.5">
            {visibleColors?.map((c) => (
              <span
                key={c.id}
                title={c.name}
                className="size-3.5 shrink-0 rounded-full border border-border/60"
                style={{ backgroundColor: c.hexValue ?? "#d4d4d4" }}
              />
            ))}
            {hiddenColorCount > 0 && (
              <span className="text-[10px] text-muted-foreground">
                +{hiddenColorCount}
              </span>
            )}
          </div>
        )}

        <div className="min-h-[2.5rem] shrink-0 text-start text-sm sm:flex sm:min-h-0 sm:items-center">
          {product.compareAtPrice && (
            <>
              <span className="block text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
              <span className="px-1 hidden sm:flex">-</span>
            </>
          )}
          <span className="text-foreground">{formatPrice(product.price)}</span>
          <span className="text-muted-foreground pr-1"> تومان</span>
        </div>
        <button
          type="button"
          aria-label="افزودن سریع به سبد خرید"
          className="flex sm:hidden h-9 w-full items-center justify-center gap rounded-md bg-dark-blue px-1 text-xs text-white shadow-sm cursor-pointer"
        >
          <span className="text-nowrap">افزودن به سبد خرید</span>
          <Plus className="size-3 shrink-0" />
        </button>
      </div>
    </Link>
  );
}
