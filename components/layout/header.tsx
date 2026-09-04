import { SiteHeaderClient } from "@/components/shop/site-header-client";
import { getCategories } from "@/lib/queries/products";

export async function SiteHeader() {
  const categories = await getCategories();
  return <SiteHeaderClient categories={categories} />;
}
