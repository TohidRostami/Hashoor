"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ProductPlaceholder } from "@/components/shared/product-placeholder";
import type { GarmentVariant } from "@/components/shared/garment-glyph";
import type { ProductDTO } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { searchProductsAction } from "@/app/(shop)/actions";

const KNOWN_VARIANTS: GarmentVariant[] = [
  "shirts",
  "tshirts",
  "pants",
  "outerwear",
  "shoes",
  "accessories",
];
function toGarmentVariant(slug: string): GarmentVariant {
  return (KNOWN_VARIANTS as string[]).includes(slug)
    ? (slug as GarmentVariant)
    : "shirts";
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      const data = await searchProductsAction(query);
      setResults(data);
      setLoading(false);
      setSearched(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="جستجو">
          <Search />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="border-x-0 border-t-0">
        <SheetHeader className="sr-only">
          <SheetTitle>جستجوی محصولات</SheetTitle>
        </SheetHeader>

        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-5 py-10">
          <div className="relative">
            <Search className="absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی محصولات..."
              className="h-12 w-full rounded-md border border-input bg-background ps-11 pe-4 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            />
            {loading && (
              <Loader2 className="absolute end-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          {searched && !loading && results.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">
              نتیجه‌ای برای «{query}» پیدا نشد.
            </p>
          )}

          {results.length > 0 && (
            <ul className="flex max-h-[55vh] flex-col divide-y divide-border overflow-y-auto">
              {results.map((product) => {
                const image = product.images[0];
                return (
                  <li key={product.id}>
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={() => handleOpenChange(false)}
                      className="flex items-center gap-4 py-3 transition-colors hover:bg-secondary/40"
                    >
                      <div className="size-16 shrink-0 overflow-hidden rounded-md border border-border">
                        {image ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={image.url}
                              alt={image.alt ?? product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <ProductPlaceholder
                            variant={toGarmentVariant(product.category.slug)}
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">
                          {product.category.title}
                        </p>
                        <p className="truncate text-sm font-medium">
                          {product.name}
                        </p>
                      </div>
                      <span className="shrink-0 text-sm">
                        <span className="font-nums">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-muted-foreground"> تومان</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
