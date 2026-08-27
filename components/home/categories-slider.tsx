"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";

import { ProductPlaceholder } from "@/components/shared/product-placeholder";
import type { GarmentVariant } from "@/components/shared/garment-glyph";
import type { CategoryDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoriesCarousel({
  categories,
  title,
}: {
  categories: CategoryDTO[];
  title: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: "rtl",
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
  },
    [
      Autoplay({
        delay: 3000,
      }),
    ]);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>

        <div className="flex items-center gap-2.5">
          {/* <div className="flex gap-1.5">
            <ArrowButton direction="prev" onClick={() => emblaApi?.scrollPrev()} disabled={!canScrollPrev} />
            <ArrowButton direction="next" onClick={() => emblaApi?.scrollNext()} disabled={!canScrollNext} />
          </div> */}
          <Link
            href="/products"
            className="hidden items-center gap-1 rounded-2xl border p-2 text-sm text-muted-foreground transition-colors hover:text-foreground lg:flex"
          >
            مشاهده همه
            <ArrowLeft size={20} />
          </Link>
        </div>
      </div>

      <div ref={emblaRef} className="mt-9 overflow-hidden">
        <div className="flex gap-4">
          {categories.map((cat) => (
            <div key={cat.slug} className="min-w-0 flex-[0_0_44%] sm:flex-[0_0_30%] lg:flex-[0_0_17%]">
              <Link href={`/products?category=${cat.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-[50%] rounded-b-lg border border-border transition-colors group-hover:border-foreground/40">
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.title}
                      fill
                      sizes="(min-width: 1024px) 16vw, 44vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <ProductPlaceholder
                      variant={cat.slug as GarmentVariant}
                      className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <h3 className="mt-3 text-sm font-medium">{cat.title}</h3>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === "prev" ? ChevronRight : ChevronLeft;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "دسته‌بندی قبلی" : "دسته‌بندی بعدی"}
      className={cn(
        "flex size-9 items-center justify-center rounded-full border border-border text-foreground transition-colors",
        disabled ? "cursor-not-allowed opacity-30" : "hover:border-foreground/40 hover:bg-secondary"
      )}
    >
      <Icon className="size-4" />
    </button>
  );
}
