"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { ProductPlaceholder } from "@/components/shared/product-placeholder";
import type { GarmentVariant } from "@/components/shared/garment-glyph";
import { cn } from "@/lib/utils";

const KNOWN_VARIANTS: GarmentVariant[] = [
  "shirts", "tshirts", "pants", "outerwear", "shoes", "accessories",
];
function toGarmentVariant(slug: string): GarmentVariant {
  return (KNOWN_VARIANTS as string[]).includes(slug) ? (slug as GarmentVariant) : "shirts";
}

type GalleryImage = { url: string; alt: string | null };

export function ProductGallery({
  images,
  productName,
  categorySlug,
}: {
  images: GalleryImage[];
  productName: string;
  categorySlug: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainRef, mainApi] = useEmblaCarousel({ loop: false, direction: "rtl" });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    direction: "rtl",
  });

  const onSelect = useCallback(() => {
    if (!mainApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi?.scrollTo(index);
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect).on("reInit", onSelect);
  }, [mainApi, onSelect]);

  function handleThumbClick(index: number) {
    mainApi?.scrollTo(index);
  }

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg border border-border">
        <ProductPlaceholder variant={toGarmentVariant(categorySlug)} />
      </div>
    );
  }

  const hasMultiple = images.length > 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative overflow-hidden rounded-lg border border-border">
        <div ref={mainRef} className="overflow-hidden">
          <div className="flex">
            {images.map((image, i) => (
              <div key={i} className="relative aspect-4/5 w-full shrink-0 grow-0 basis-full">
                <Image
                  src={image.url}
                  alt={image.alt ?? productName}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => mainApi?.scrollPrev()}
              aria-label="عکس قبلی"
              className="absolute start-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => mainApi?.scrollNext()}
              aria-label="عکس بعدی"
              className="absolute end-3 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 shadow-sm backdrop-blur transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="absolute bottom-3 end-3 rounded-full bg-background/80 px-2.5 py-1 text-xs text-foreground backdrop-blur">
              <span className="font-nums">
                {selectedIndex + 1} / {images.length}
              </span>
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div ref={thumbRef} className="overflow-hidden">
          <div className="flex gap-2.5">
            {images.map((image, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleThumbClick(i)}
                aria-label={`نمایش عکس ${i + 1}`}
                className={cn(
                  "relative aspect-square w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors sm:w-20",
                  i === selectedIndex
                    ? "border-foreground"
                    : "border-transparent opacity-70 hover:border-border hover:opacity-100"
                )}
              >
                <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
