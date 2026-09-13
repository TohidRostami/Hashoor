import { permanentRedirect } from "next/navigation";
import type { Metadata } from "next";
import {
  ProductsListing,
  type ProductsListingSearchParams,
} from "@/components/shop/products-listing";

export const metadata: Metadata = {
  title: "محصولات",
  description:
    "همه‌ی محصولات فروشگاه هاشور — پوشاک مردانه با طراحی مینیمال و پارچه‌ی باکیفیت.",
  alternates: { canonical: "/products" },
};

type ProductsPageSearchParams = ProductsListingSearchParams & {
  /** Legacy only — old links/bookmarks used ?category=slug. Redirected
   * below (permanently, so any accumulated search-engine value
   * consolidates onto the new URL) rather than still being handled
   * here, so there's a single canonical URL per category going forward. */
  category?: string;
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ProductsPageSearchParams>;
}) {
  const params = await searchParams;

  if (params.category) {
    const rest = new URLSearchParams(
      Object.entries(params).filter(
        (entry): entry is [string, string] =>
          entry[0] !== "category" && entry[1] !== undefined,
      ),
    );
    const qs = rest.toString();
    permanentRedirect(
      `/products/category/${params.category}${qs ? `?${qs}` : ""}`,
    );
  }

  return <ProductsListing searchParams={params} />;
}
