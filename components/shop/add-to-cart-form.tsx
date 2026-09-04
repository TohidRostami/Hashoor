"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { SizeGuideSheet } from "@/components/shop/size-guide-sheet";
import { useCartStore } from "@/lib/store/cart";
import type { ProductDetailDTO } from "@/lib/types";
import { siteConfig } from "@/lib/content";
import { cn } from "@/lib/utils";

export function AddToCartForm({
  product,
  selectedColorId,
  onColorChange,
}: {
  product: ProductDetailDTO;
  selectedColorId: string | null;
  onColorChange: (colorId: string) => void;
}) {
  const hasColors = product.colors.length > 0;

  // Only this color's variants are selectable — sizes for other colors
  // shouldn't appear (and may not even exist, since stock is tracked
  // per color+size combination).
  const variantsForColor = hasColors
    ? product.variants.filter((v) => v.colorId === selectedColorId)
    : product.variants;
  const hasVariants = variantsForColor.length > 0;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variantsForColor.find((v) => v.stock > 0)?.id ??
      variantsForColor[0]?.id ??
      null,
  );
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const selectedVariant = product.variants.find(
    (v) => v.id === selectedVariantId,
  );
  const inStock = hasVariants ? (selectedVariant?.stock ?? 0) > 0 : true;

  function handleSelectColor(colorId: string) {
    onColorChange(colorId);
    const nextVariants = product.variants.filter((v) => v.colorId === colorId);
    setSelectedVariantId(
      nextVariants.find((v) => v.stock > 0)?.id ?? nextVariants[0]?.id ?? null,
    );
  }

  const sizeGuideRows = useMemo(() => {
    const seen = new Set<string>();
    const rows: { name: string; description: string | null }[] = [];
    for (const v of variantsForColor) {
      if (!v.size || seen.has(v.size.name)) continue;
      seen.add(v.size.name);
      rows.push({ name: v.size.name, description: v.size.description });
    }
    return rows;
  }, [variantsForColor]);

  function handleAdd() {
    if (hasVariants && !selectedVariant) return;
    const colorImage = product.images.find(
      (img) => img.colorId === selectedVariant?.colorId,
    );
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: selectedVariant?.size?.name ?? null,
      color: selectedVariant?.color?.name ?? null,
      categorySlug: product.category.slug,
      image: colorImage?.url ?? product.images[0]?.url ?? null,
    });
    toast.success("به سبد خرید اضافه شد", { description: product.name });
  }

  return (
    <div className="flex flex-col gap-6">
      {hasColors && (
        <div>
          <p className="mb-2.5 text-sm font-medium">
            رنگ
            {selectedColorId && (
              <span className="text-muted-foreground">
                {" "}
                — {product.colors.find((c) => c.id === selectedColorId)?.name}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectColor(c.id)}
                title={c.name}
                aria-label={c.name}
                className={cn(
                  "flex size-9 items-center justify-center rounded-full border-2 transition-colors",
                  c.id === selectedColorId
                    ? "border-foreground"
                    : "border-transparent hover:border-border",
                )}
              >
                <span
                  className="size-6 rounded-full border border-border/50"
                  style={{ backgroundColor: c.hexValue ?? "#d4d4d4" }}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {hasVariants && (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-sm font-medium">سایز</p>
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="text-xs text-accent-2 transition-colors hover:underline"
            >
              راهنمای سایز
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {variantsForColor.map((v) => {
              const isSelected = v.id === selectedVariantId;
              const isOut = v.stock === 0;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={isOut}
                  title={v.size?.description ?? undefined}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={cn(
                    "font-nums flex h-11 min-w-11 items-center justify-center rounded-md border px-3 text-sm transition-colors",
                    isOut &&
                      "cursor-not-allowed border-border text-muted-foreground/40 line-through",
                    !isOut &&
                      isSelected &&
                      "border-foreground bg-foreground text-background",
                    !isOut &&
                      !isSelected &&
                      "border-border hover:border-foreground/40",
                  )}
                >
                  {v.size?.name ?? "—"}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Button
        size="lg"
        onClick={handleAdd}
        disabled={!inStock}
        className="w-full sm:w-auto"
      >
        {inStock ? siteConfig.ui.addToCart : siteConfig.ui.outOfStock}
      </Button>

      <SizeGuideSheet
        open={sizeGuideOpen}
        onOpenChange={setSizeGuideOpen}
        sizes={sizeGuideRows}
      />
    </div>
  );
}
