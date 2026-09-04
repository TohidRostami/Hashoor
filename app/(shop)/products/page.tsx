import Link from "next/link";
import type { Metadata } from "next";

import { ProductCard } from "@/components/shared/product-card";
import { ProductSearchInput } from "@/components/shop/product-search-input";
import { MobileProductFilters } from "@/components/shop/mobile-product-filters";
import { PerPageSelect } from "@/components/shop/per-page-select";
import { ProductsPagination } from "@/components/shop/products-pagination";
import {
  getCategories,
  getProducts,
  DEFAULT_PER_PAGE,
  type SortOption,
} from "@/lib/queries/products";
import { buildProductsHref } from "@/lib/product-filters";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/format";

export const metadata: Metadata = { title: "محصولات" };

const SORTS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "bestseller", label: "پرفروش‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

type ProductsSearchParams = {
  category?: string;
  sort?: string;
  q?: string;
  page?: string;
  perPage?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductsSearchParams>;
}) {
  const params = await searchParams;
  const categorySlug = params.category;
  const sort = (params.sort as SortOption) ?? "newest";
  const query = params.q ?? "";
  const page = params.page ? Number(params.page) || 1 : 1;
  const perPage = params.perPage
    ? Number(params.perPage) || DEFAULT_PER_PAGE
    : DEFAULT_PER_PAGE;

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug, sort, query, page, perPage }),
  ]);
  const { products, totalCount, totalPages, page: currentPage } = result;
  console.log(products);
  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const currentParams = new URLSearchParams(
    Object.entries(params).filter(
      (entry): entry is [string, string] => entry[1] !== undefined,
    ),
  );

  const pageTitle = query
    ? `نتایج جستجو برای «${query}»`
    : activeCategory
      ? activeCategory.title
      : "همه محصولات";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{pageTitle}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          <span>{toPersianDigits(totalCount)}</span> محصول
        </p>
      </header>

      <div className="mb-4 flex flex-col gap-4">
        <MobileProductFilters
          categories={categories}
          sorts={SORTS}
          activeCategorySlug={categorySlug}
          activeSort={sort}
        />
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <aside className="hidden shrink-0 lg:block lg:w-52">
          <h2 className="mb-3 text-sm font-medium text-muted-foreground">
            دسته‌بندی
          </h2>
          <nav className="flex flex-col items-start gap-0.5">
            <Link
              href={buildProductsHref(currentParams, {
                category: undefined,
                page: undefined,
              })}
              className={cn(
                "w-full rounded-md px-3 py-2 text-sm transition-colors",
                !categorySlug
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              همه محصولات
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={buildProductsHref(currentParams, {
                  category: c.slug,
                  page: undefined,
                })}
                className={cn(
                  "w-full rounded-md px-3 py-2 text-sm transition-colors",
                  c.slug === categorySlug
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {c.title}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <ProductSearchInput defaultValue={query} />
          <div className="mb-7 hidden flex-wrap items-center justify-between pt-4 gap-3 border-b border-border pb-5 lg:flex">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">مرتب‌سازی:</span>
              {SORTS.map((s) => (
                <Link
                  key={s.value}
                  href={buildProductsHref(currentParams, {
                    sort: s.value === "newest" ? undefined : s.value,
                    page: undefined,
                  })}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs transition-colors",
                    sort === s.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                  )}
                >
                  {s.label}
                </Link>
              ))}
            </div>
            <PerPageSelect value={perPage} />
          </div>

          <div className="my-6 flex justify-start lg:hidden">
            <PerPageSelect value={perPage} />
          </div>

          {products.length === 0 ? (
            <p className="py-24 text-center text-sm text-muted-foreground">
              {query
                ? `نتیجه‌ای برای «${query}» پیدا نشد.`
                : "محصولی در این دسته پیدا نشد."}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <ProductsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                currentParams={currentParams}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
