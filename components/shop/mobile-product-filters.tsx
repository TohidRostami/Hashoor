"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildProductsHref } from "@/lib/product-filters";
import type { CategoryDTO } from "@/lib/types";
import type { SortOption } from "@/lib/product-constants";

const ALL_CATEGORIES_VALUE = "__all__";

export function MobileProductFilters({
  categories,
  sorts,
  activeCategorySlug,
  activeSort,
}: {
  categories: CategoryDTO[];
  sorts: { value: SortOption; label: string }[];
  activeCategorySlug?: string;
  activeSort: SortOption;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function go(overrides: Record<string, string | undefined>) {
    const href = buildProductsHref(
      new URLSearchParams(searchParams.toString()),
      {
        ...overrides,
        page: undefined,
      },
    );
    router.push(href);
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:hidden">
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          دسته بندی‌ها:
        </h2>
        <Select
          value={activeCategorySlug ?? ALL_CATEGORIES_VALUE}
          onValueChange={(v) =>
            go({ category: v === ALL_CATEGORIES_VALUE ? undefined : v })
          }
        >
          <SelectTrigger
            aria-label="دسته‌بندی"
            className="w-full text-right text-xs"
            dir="rtl"
          >
            <SelectValue placeholder="دسته‌بندی" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES_VALUE}>
              همه دسته‌بندی‌ها
            </SelectItem>
            {categories.map((c) => (
              <SelectItem
                key={c.slug}
                value={c.slug}
                className="justify-end text-right text-xs"
              >
                {c.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">
          مرتب‌سازی:
        </h2>
        <Select
          value={activeSort}
          onValueChange={(v) => go({ sort: v === "newest" ? undefined : v })}
        >
          <SelectTrigger
            aria-label="مرتب‌سازی"
            className="w-full text-right text-xs"
            dir="rtl"
          >
            <SelectValue placeholder="مرتب‌سازی" />
          </SelectTrigger>
          <SelectContent>
            {sorts.map((s) => (
              <SelectItem
                key={s.value}
                value={s.value}
                className="justify-end text-right text-xs"
              >
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
