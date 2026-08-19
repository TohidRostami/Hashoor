import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { PhilosophySection } from "@/components/home/philosophy-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { siteConfig } from "@/lib/content";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: siteConfig.site.name,
    alternateName: siteConfig.site.nameLatin,
    description: siteConfig.site.description,
    url: siteConfig.site.url,
    telephone: siteConfig.contact.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tehran",
      addressCountry: "IR",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ValueProps />
      <CategoriesSection />
      <FeaturedProducts />
      <PhilosophySection />
      <NewsletterSection />
    </>
  );
}
