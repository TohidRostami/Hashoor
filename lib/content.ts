import siteConfigJson from "@/content/site-config.json";
export type NavLink = { label: string; href: string };
export type FooterColumn = { title: string; links: NavLink[] };
export type Category = { slug: string; title: string; description: string };

export type SiteConfig = {
  site: {
    name: string;
    nameLatin: string;
    tagline: string;
    shortDescription: string;
    description: string;
    url: string;
    locale: string;
    keywords: string[];
  };
  theme: {
    colors: Record<string, string>;
    radius: string;
  };
  contact: {
    phone: string;
    mobile: string;
    email: string;
    address: string;
    workingHours: string;
  };
  social: Record<string, string>;
  nav: {
    main: NavLink[];
    footerColumns: FooterColumn[];
  };
  home: {
    hero: {
      eyebrow: string;
      headline: string;
      subheadline: string;
      ctaPrimary: NavLink;
      ctaSecondary: NavLink;
    };
    valueProps: { title: string; description: string }[];
    categoriesTitle: string;
    featuredTitle: string;
    featuredSubtitle: string;
    philosophy: { eyebrow: string; title: string; body: string };
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      cta: string;
    };
  };
  categories: Category[];
  ui: Record<string, string>;
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
  };
};

export const siteConfig = siteConfigJson as SiteConfig;
