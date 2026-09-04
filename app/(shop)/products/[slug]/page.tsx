import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";

import { ProductCard } from "@/components/shared/product-card";
import { ProductPurchaseSection } from "@/components/shop/product-purchase-section";
import { Reveal } from "@/components/shared/reveal";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/products";
import { siteConfig } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

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
  const inStock = product.variants.length === 0 || product.variants.some((v) => v.stock > 0);

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
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${siteConfig.site.url}/products/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-foreground">
          خانه
        </Link>
        <ChevronLeft className="size-3.5 rotate-180" />
        <Link href={`/products?category=${product.category.slug}`} className="transition-colors hover:text-foreground">
          {product.category.title}
        </Link>
        <ChevronLeft className="size-3.5 rotate-180" />
        <span className="text-foreground/70">{product.name}</span>
      </nav>

      <ProductPurchaseSection product={product} />

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
