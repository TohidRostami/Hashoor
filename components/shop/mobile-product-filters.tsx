"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    const href = buildProductsHref(new URLSearchParams(searchParams.toString()), {
      ...overrides,
      page: undefined,
    });
    router.push(href);
  }

  return (
    <div className="grid grid-cols-2 gap-3 lg:hidden">
      <Select
        value={activeCategorySlug ?? ALL_CATEGORIES_VALUE}
        onValueChange={(v) => go({ category: v === ALL_CATEGORIES_VALUE ? undefined : v })}
      >
        <SelectTrigger aria-label="دسته‌بندی">
          <SelectValue placeholder="دسته‌بندی" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_CATEGORIES_VALUE}>همه دسته‌بندی‌ها</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.slug} value={c.slug}>
              {c.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={activeSort} onValueChange={(v) => go({ sort: v === "newest" ? undefined : v })}>
        <SelectTrigger aria-label="مرتب‌سازی">
          <SelectValue placeholder="مرتب‌سازی" />
        </SelectTrigger>
        <SelectContent>
          {sorts.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
