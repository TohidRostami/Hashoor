import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { buildProductsHref } from "@/lib/product-filters";
import { cn } from "@/lib/utils";
import { toPersianDigits } from "@/lib/format";

/** Builds a compact page list with ellipses, e.g. 1 … 4 5 [6] 7 8 … 20 */
function getPageList(current: number, total: number): (number | "gap")[] {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: (number | "gap")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push("gap");
    result.push(sorted[i]);
  }
  return result;
}

export function ProductsPagination({
  currentPage,
  totalPages,
  currentParams,
}: {
  currentPage: number;
  totalPages: number;
  currentParams: URLSearchParams;
}) {
  if (totalPages <= 1) return null;

  const pages = getPageList(currentPage, totalPages);
  const hrefFor = (page: number) =>
    buildProductsHref(currentParams, {
      page: page === 1 ? undefined : String(page),
    });

  return (
    <nav
      aria-label="صفحه‌بندی محصولات"
      className="mt-12 flex items-center justify-center gap-1.5"
    >
      <PageLink
        href={hrefFor(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="صفحه قبل"
      >
        <ChevronRight className="size-4" />
      </PageLink>

      {pages.map((p, i) =>
        p === "gap" ? (
          <span
            key={`gap-${i}`}
            className="px-1.5 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <PageLink key={p} href={hrefFor(p)} active={p === currentPage}>
            <span className="">{toPersianDigits(p)}</span>
          </PageLink>
        ),
      )}

      <PageLink
        href={hrefFor(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="صفحه بعد"
      >
        <ChevronLeft className="size-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...props
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
} & React.ComponentProps<"a">) {
  if (disabled) {
    return (
      <span className="flex size-9 items-center justify-center rounded-md text-muted-foreground/40">
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      className={cn(
        "flex size-9 items-center justify-center rounded-md text-sm transition-colors",
        active
          ? "bg-foreground text-background"
          : "text-foreground/80 hover:bg-secondary hover:text-foreground",
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
