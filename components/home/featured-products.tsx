import Link from "next/link";
import { ProductCard } from "@/components/shared/product-card";
import { Reveal } from "@/components/shared/reveal";
import { getFeaturedProducts } from "@/lib/queries/products";
import { siteConfig } from "@/lib/content";
import { ArrowLeft } from "lucide-react";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(4);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-15 sm:px-6 lg:px-8">
      <Reveal className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold sm:text-3xl">
            {siteConfig.home.featuredTitle}
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {siteConfig.home.featuredSubtitle}
          </p>
        </div>
        <Link
          href="/products"
          className="hidden lg:flex lg:gap-1 lg:items-center lg:border lg:rounded-2xl lg:p-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
        >
          مشاهده همه
          <ArrowLeft size={20} />
        </Link>
      </Reveal>

      <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={Math.min(i * 0.08, 0.3)}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
