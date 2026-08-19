"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Category = {
  id: string;
  title: string;
  slug: string;
};

type ProductsFiltersProps = {
  categories: Category[];
};

export function ProductsFilters({ categories }: ProductsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = React.useState(
    searchParams.get("search") ?? ""
  );

  React.useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // Any filter change narrows/changes the result set, so whatever page
    // you were on may no longer exist (or may now show different
    // products) — always land back on page 1.
    params.delete("page");

    router.push(`/admin/products?${params.toString()}`);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateFilter("search", search);
  }

  function clearFilters() {
    setSearch("");
    router.push("/admin/products");
  }

  // "page" alone (no real filter) shouldn't count as an active filter.
  const hasFilters = Array.from(searchParams.keys()).some((key) => key !== "page");

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col gap-3 md:flex-row"
      >
        <div className="relative flex-1">
          <Search className="absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجو در نام محصولات..."
            className="pe-10"
          />
        </div>

        <Button variant="accent" type="submit">
          جستجو
        </Button>
      </form>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {/* Category */}
        <select
          value={searchParams.get("category") ?? "all"}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">همه دسته‌بندی‌ها</option>

          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.title}
            </option>
          ))}
        </select>

        {/* Status */}
        <select
          value={searchParams.get("status") ?? "all"}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="published">منتشرشده</option>
          <option value="draft">پیش‌نویس</option>
        </select>

        {/* Featured */}
        <select
          value={searchParams.get("featured") ?? "all"}
          onChange={(e) => updateFilter("featured", e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">همه محصولات</option>
          <option value="true">فقط محصولات ویژه</option>
          <option value="false">غیر ویژه</option>
        </select>

        {/* Sort */}
        <select
          value={searchParams.get("sort") ?? "newest"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="newest">جدیدترین</option>
          <option value="oldest">قدیمی‌ترین</option>
          <option value="name-asc">نام: الف تا ی</option>
          <option value="name-desc">نام: ی تا الف</option>
          <option value="price-asc">قیمت: کم به زیاد</option>
          <option value="price-desc">قیمت: زیاد به کم</option>
        </select>

        {hasFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            size="sm"
          >
            <X className="size-4" />
            پاک کردن فیلترها
          </Button>
        )}
      </div>
    </div>
  );
}
