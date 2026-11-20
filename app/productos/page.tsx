import type { Metadata } from "next";
import { products } from "@/content/products";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/contact";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Floating } from "@/components/sections/floating";
import { Breadcrumb } from "@/components/products/breadcrumb";
import { Catalog } from "@/components/products/catalog";
import { HelpBlock } from "@/components/products/help-block";

const C = site.shop.catalog;

export const metadata: Metadata = {
  title: C.seoTitle,
  description: C.seoDescription,
  alternates: { canonical: C.path },
  openGraph: { type: "website", locale: "es_MX", url: C.path, siteName: site.brand.name, title: C.seoTitle, description: C.seoDescription },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: C.title,
  url: `${siteUrl}${C.path}`,
  numberOfItems: products.length,
  itemListElement: products.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${siteUrl}${C.path}/${p.slug}`,
    name: p.name,
    image: `${siteUrl}${p.image}`,
  })),
};

export default function ProductosPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Navbar homePrefix="/" />
      <main id="contenido">
        <section aria-labelledby="productos-h1" className="grain bg-hero relative overflow-hidden text-mist">
          <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 -z-0" />
          <div className="container-site relative z-10 pb-12 pt-32 md:pb-16 md:pt-36">
            <Breadcrumb crumbs={[{ label: C.breadcrumbHome, href: "/" }, { label: C.title }]} />
            <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
              <div className="max-w-[44rem]">
                <p className="eyebrow text-signal">{C.eyebrow}</p>
                <h1 id="productos-h1" className="mt-4 text-[length:var(--text-display)] font-semibold leading-[0.98] tracking-[var(--tracking-tightest)]">
                  {C.title}
                </h1>
                <p className="mt-5 max-w-[36rem] text-[length:var(--text-lead)] leading-relaxed text-mist/75">{C.subtitle}</p>
              </div>
              <p className="inline-flex w-fit shrink-0 items-center gap-2.5 rounded-full border border-mist/15 bg-mist/[0.06] py-2 pl-3 pr-4 font-mono text-[0.8125rem] text-mist/85 backdrop-blur">
                <span aria-hidden className="h-2 w-2 rounded-full bg-signal" />
                {C.count.replace("{n}", String(products.length))}
              </p>
            </div>
          </div>
        </section>

        <div className="on-light bg-mist">
          <Catalog />
          <div className="container-site pb-[clamp(4rem,2.5rem+5vw,7rem)] pt-10 md:pt-14">
            <HelpBlock />
          </div>
        </div>
      </main>
      <Footer homePrefix="/" />
      <Floating homePrefix="/" />
    </>
  );
}
