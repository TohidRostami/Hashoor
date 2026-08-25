import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";

import { ProductPlaceholder } from "@/components/shared/product-placeholder";
import type { GarmentVariant } from "@/components/shared/garment-glyph";
import { ProductCard } from "@/components/shared/product-card";
import { AddToCartForm } from "@/components/shop/add-to-cart-form";
import { Reveal } from "@/components/shared/reveal";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/content";
import { ProductGallery } from "@/components/shop/product-gallery";

const KNOWN_VARIANTS: GarmentVariant[] = [
  "shirts",
  "tshirts",
  "pants",
  "outerwear",
  "shoes",
  "accessories",
];

function toGarmentVariant(slug: string): GarmentVariant {
  return (KNOWN_VARIANTS as string[]).includes(slug)
    ? (slug as GarmentVariant)
    : "shirts";
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  console.log(product);
  return {
    title: product.metaTitle ?? product.name,
    description: product.metaDescription ?? product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [{ url: product.images[0].url }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.category.id, 4);
  const image = product.images[0];
  const inStock =
    product.variants.length === 0 || product.variants.some((v) => v.stock > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    category: product.category.title,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "IRR",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteConfig.site.url}/products/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          خانه
        </Link>
        <ChevronLeft className="size-3.5 rotate-180" />
        <Link
          href={`/products?category=${product.category.slug}`}
          className="transition-colors hover:text-foreground"
        >
          {product.category.title}
        </Link>
        <ChevronLeft className="size-3.5 rotate-180" />
        <span className="text-foreground/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden">
          {image ? (
            <ProductGallery
              images={product.images}
              productName={product.name}
              categorySlug={product.category.slug}
            />
          ) : (
            <ProductPlaceholder
              variant={toGarmentVariant(product.category.slug)}
            />
          )}
        </div>

        <div className="flex flex-col lg:py-4">
          <p className="text-sm text-muted-foreground">
            {product.category.title}
          </p>
          <h1 className="mt-1.5 text-2xl font-bold sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-2.5">
            {product.compareAtPrice && (
              <span className="text-base text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
            <span className="text-xl font-medium text-foreground">
              {formatPrice(product.price)}
            </span>
            <span className="text-sm text-muted-foreground">تومان</span>
          </div>

          <p className="mt-6 max-w-lg text-pretty text-sm leading-8 text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-8 border-t border-border pt-8">
            <AddToCartForm product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <Reveal>
            <h2 className="text-xl font-bold sm:text-2xl">محصولات مرتبط</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={Math.min(i * 0.08, 0.3)}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
