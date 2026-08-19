import Link from "next/link";
import { ProductPlaceholder } from "@/components/shared/product-placeholder";
import type { GarmentVariant } from "@/components/shared/garment-glyph";
import { Reveal } from "@/components/shared/reveal";
import { getCategories } from "@/lib/queries/products";
import { siteConfig } from "@/lib/content";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export async function CategoriesSection() {
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-7xl px-4 py-15 sm:px-6 lg:px-8">
      <Reveal className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-bold sm:text-3xl">
          {siteConfig.home.categoriesTitle}
        </h2>
        <Link
          href="/products"
          className="hidden lg:flex lg:gap-1 lg:items-center lg:border lg:rounded-2xl lg:p-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-block"
        >
          مشاهده همه
          <ArrowLeft size={20} />
        </Link>
      </Reveal>

      <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((cat, i) => (
          <Reveal key={cat.slug} delay={Math.min(i * 0.06, 0.3)} className="">
            <Link
              href={`/products?category=${cat.slug}`}
              className="group block"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-[50%] rounded-b-lg border border-border transition-colors group-hover:border-foreground/40">
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.title}
                    fill
                    sizes="(min-width: 1024px) 16vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <ProductPlaceholder
                    variant={cat.slug as GarmentVariant}
                    className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <h3 className="mt-3 text-sm font-medium">{cat.title}</h3>
              <p className="text-xs text-muted-foreground">{cat.description}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
