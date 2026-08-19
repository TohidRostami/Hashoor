import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/account", "/checkout", "/api/", "/cart"],
      },
    ],
    sitemap: `${siteConfig.site.url}/sitemap.xml`,
  };
}
