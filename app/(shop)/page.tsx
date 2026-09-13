import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { PhilosophySection } from "@/components/home/philosophy-section";
import { NewsletterSection } from "@/components/home/newsletter-section";
import { siteConfig } from "@/lib/content";

// Previously absent entirely, so the homepage — the single most
// important page on the site — fell back to the root layout's generic
// site-wide default instead of having its own tailored title/description.
export const metadata: Metadata = {
  title: siteConfig.seo.defaultTitle,
  description: siteConfig.seo.defaultDescription,
  alternates: { canonical: "/" },
};

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
      // Was hardcoded to "Tehran" regardless of the store's actual
      // location — now reflects whatever's actually configured.
      // ⚠️ content/site-config.json's contact.address is still a
      // placeholder ("تهران، خیابان نمونه، پلاک ۰") — replace it with
      // the real address for this to be accurate.
      streetAddress: siteConfig.contact.address,
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
