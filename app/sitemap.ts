import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { siteUrl } from "@/lib/contact";

// Fase 2: aquí se sumarán /servicios/[slug] a partir de content/services.ts.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/productos`, changeFrequency: "weekly", priority: 0.8 },
    ...products.map((p) => ({ url: `${siteUrl}/productos/${p.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    { url: `${siteUrl}/aviso-de-privacidad`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
