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
import { TransitionLink } from "@/components/shared/transition-link";
import { TransitionRegion } from "@/components/shared/transition-region";

const SORTS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "bestseller", label: "پرفروش‌ترین" },
  { value: "price-asc", label: "ارزان‌ترین" },
  { value: "price-desc", label: "گران‌ترین" },
];

export type ProductsListingSearchParams = {
  sort?: string;
  q?: string;
  page?: string;
  perPage?: string;
};

/**
 * Shared body for both the "all products" page and each category page
 * — identical filtering/pagination UI either way, just with
 * `categorySlug` set or left undefined. Every internal link/filter
 * threads `categorySlug` through explicitly rather than reading it
 * back out of the query string, since it now lives in the URL path.
 */
export async function ProductsListing({
  categorySlug,
  searchParams,
  pageTitleOverride,
}: {
  categorySlug?: string;
  searchParams: ProductsListingSearchParams;
  /** Category pages pass the category's own title instead of
   * re-deriving it, since they already looked the category up (for
   * generateMetadata/notFound) before rendering this. */
  pageTitleOverride?: string;
}) {
  const sort = (searchParams.sort as SortOption) ?? "newest";
  const query = searchParams.q ?? "";
  const page = searchParams.page ? Number(searchParams.page) || 1 : 1;
  const perPage = searchParams.perPage
    ? Number(searchParams.perPage) || DEFAULT_PER_PAGE
    : DEFAULT_PER_PAGE;

  const [categories, result] = await Promise.all([
    getCategories(),
    getProducts({ categorySlug, sort, query, page, perPage }),
  ]);
  const { products, totalCount, totalPages, page: currentPage } = result;

  // Only the filters that are still query params — category is
  // handled via the path/categorySlug prop instead.
  const currentParams = new URLSearchParams(
    Object.entries(searchParams).filter(
      (entry): entry is [string, string] => entry[1] !== undefined
    )
  );

  const pageTitle = query
    ? `نتایج جستجو برای «${query}»`
    : (pageTitleOverride ?? "همه محصولات");

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
            <TransitionLink
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
            </TransitionLink>
            {categories.map((c) => (
              <TransitionLink
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
              </TransitionLink>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <ProductSearchInput defaultValue={query} categorySlug={categorySlug} />
          <div className="mb-7 hidden flex-wrap items-center justify-between pt-4 gap-3 border-b border-border pb-5 lg:flex">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">مرتب‌سازی:</span>
              {SORTS.map((s) => (
                <TransitionLink
                  key={s.value}
                  href={buildProductsHref(currentParams, {
                    category: categorySlug,
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
                </TransitionLink>
              ))}
            </div>
            <PerPageSelect value={perPage} categorySlug={categorySlug} />
          </div>

          <div className="my-6 flex justify-start lg:hidden">
            <PerPageSelect value={perPage} categorySlug={categorySlug} />
          </div>

          {products.length === 0 ? (
            <p className="py-24 text-center text-sm text-muted-foreground">
              {query
                ? `نتیجه‌ای برای «${query}» پیدا نشد.`
                : "محصولی در این دسته پیدا نشد."}
            </p>
          ) : (
            <>
              <TransitionRegion className="rounded-2xl">
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </TransitionRegion>
              <ProductsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                currentParams={currentParams}
                categorySlug={categorySlug}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
