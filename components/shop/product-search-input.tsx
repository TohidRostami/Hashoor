"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { buildProductsHref } from "@/lib/product-filters";

export function ProductSearchInput({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (value === defaultValue) return;
    const timer = setTimeout(() => {
      const href = buildProductsHref(new URLSearchParams(searchParams.toString()), {
        q: value.trim() || undefined,
        page: undefined,
      });
      startTransition(() => router.push(href));
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function handleClear() {
    setValue("");
    const href = buildProductsHref(new URLSearchParams(searchParams.toString()), {
      q: undefined,
      page: undefined,
    });
    startTransition(() => router.push(href));
  }

  return (
    <div className="relative max-w-md lg:max-w-full">
      <Search className="absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="جستجو در محصولات..."
        className="ps-10 pe-9"
        aria-label="جستجوی محصولات"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="پاک‌کردن جستجو"
          className="absolute end-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
        </button>
      )}
    </div>
  );
}
