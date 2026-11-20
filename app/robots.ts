import type { MetadataRoute } from "next";
import { allowIndexing, siteUrl } from "@/lib/contact";

export default function robots(): MetadataRoute.Robots {
  // Versión de revisión: nada se indexa hasta definir NEXT_PUBLIC_ALLOW_INDEXING=true
  if (!allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
