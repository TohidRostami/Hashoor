import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategoryBySlug } from "@/lib/queries/products";
import { ProductsListing, type ProductsListingSearchParams } from "@/components/shop/products-listing";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ProductsListingSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  return {
    title: category.title,
    description: category.description ?? `مجموعه‌ی ${category.title} در فروشگاه هاشور.`,
    alternates: { canonical: `/products/category/${category.slug}` },
  };
}

export default async function ProductCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const sp = await searchParams;
  return (
    <ProductsListing categorySlug={category.slug} pageTitleOverride={category.title} searchParams={sp} />
  );
}
