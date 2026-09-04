import { Reveal } from "@/components/shared/reveal";
import { CategoriesCarousel } from "@/components/home/categories-slider";
import { getCategories } from "@/lib/queries/products";
import { siteConfig } from "@/lib/content";

export async function CategoriesSection() {
  const categories = await getCategories();
  return (
    <section className="mx-auto max-w-7xl px-4 py-15 sm:px-6 lg:px-8">
      <Reveal>
        <CategoriesCarousel categories={categories} title={siteConfig.home.categoriesTitle} />
      </Reveal>
    </section>
  );
}
