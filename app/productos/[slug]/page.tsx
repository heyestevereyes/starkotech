import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { categoryBySlug, productBySlug, products, relatedProducts } from "@/content/products";
import { serviceBySlug } from "@/content/services";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/contact";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { Floating } from "@/components/sections/floating";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Icon } from "@/components/ui/icons";
import { Breadcrumb } from "@/components/products/breadcrumb";
import { ProductGallery } from "@/components/products/gallery";
import { installText, Price } from "@/components/products/price";
import { ProductCard } from "@/components/products/product-card";
import { PurchasePanel } from "@/components/products/purchase-panel";
import { TrackView } from "@/components/products/track-view";

const D = site.shop.detail;
const C = site.shop.catalog;

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/productos/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const product = productBySlug(slug);
  if (!product) return {};
  const path = `${C.path}/${product.slug}`;
  const description = `${product.short} ${product.description}`.slice(0, 200);
  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: path,
      siteName: site.brand.name,
      title: product.name,
      description,
      images: [{ url: product.image, alt: product.imageAlt }],
    },
  };
}

export default async function ProductPage(props: PageProps<"/productos/[slug]">) {
  const { slug } = await props.params;
  const product = productBySlug(slug);
  if (!product) notFound();

  const category = categoryBySlug(product.category);
  const service = product.relatedService ? serviceBySlug(product.relatedService) : undefined;
  const related = relatedProducts(product, 4);
  const install = installText(product);
  const url = `${siteUrl}${C.path}/${product.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [`${siteUrl}${product.image}`, ...(product.gallery ?? []).map((g) => `${siteUrl}${g}`)],
    sku: product.sku ?? product.slug,
    category: category?.name,
    brand: { "@type": "Brand", name: site.brand.name },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "MXN",
      price: product.price,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@type": "Organization", name: site.brand.legalName },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <TrackView product={product} />
      <Navbar homePrefix="/" />
      <main id="contenido">
        <div className="grain bg-hero relative overflow-hidden text-mist">
          <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 -z-0" />
          <div className="container-site relative z-10 pb-8 pt-28 md:pb-10 md:pt-32">
            <Breadcrumb
              crumbs={[
                { label: C.breadcrumbHome, href: "/" },
                { label: C.title, href: C.path },
                ...(category ? [{ label: category.name, href: `${C.path}?categoria=${category.slug}` }] : []),
                { label: product.name },
              ]}
            />
          </div>
        </div>

        <div className="on-light bg-mist">
          <section aria-labelledby="producto-title" className="container-site py-10 md:py-14 lg:py-16">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14 xl:gap-20">
              <div className="lg:sticky lg:top-28">
                <ProductGallery images={[{ src: product.image, alt: product.imageAlt }, ...(product.gallery ?? []).map((src) => ({ src, alt: product.imageAlt }))]} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-cobalt">{category?.name}</p>
                  {product.badge ? (
                    <span className="rounded-full bg-ink px-3 py-1.5 font-mono text-[0.6875rem] font-medium uppercase leading-none tracking-[0.08em] text-signal">
                      {product.badge}
                    </span>
                  ) : null}
                </div>
                <h1 id="producto-title" className="mt-4 text-[clamp(1.875rem,1.3rem+2vw,3rem)] font-semibold leading-[1.05] tracking-[var(--tracking-tight)] text-ink">
                  {product.name}
                </h1>
                <p className="mt-5 text-[1.0625rem] leading-relaxed text-graphite">{product.description}</p>

                <div className="mt-7 border-y border-ink/10 py-5">
                  <Price product={product} valueClassName="text-[clamp(2rem,1.6rem+1.4vw,2.75rem)] leading-none" />
                  {install ? <p className="mt-2 text-[0.9688rem] text-graphite">{install}</p> : null}
                  <p className="mt-1 text-[0.8125rem] text-graphite">{D.priceNote}</p>
                </div>

                <PurchasePanel product={product} />

                {product.sku ? (
                  <p className="mt-6 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-graphite">
                    {D.skuLabel} {product.sku}
                  </p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="container-site pb-4 md:pb-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8">
              <AnimatedSection>
                <div className="rounded-[var(--radius-card-lg)] border border-ink/[0.08] bg-paper p-6 shadow-[var(--shadow-soft)] md:p-8">
                  <h2 className="text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">{D.specs}</h2>
                  <table className="mt-5 w-full border-collapse text-left">
                    <caption className="sr-only">
                      {D.specs}: {product.name}
                    </caption>
                    <tbody>
                      {product.specs.map((s) => (
                        <tr key={s.label} className="border-t border-ink/10 first:border-t-0">
                          <th scope="row" className="w-[42%] py-3.5 pr-4 align-top font-mono text-[0.75rem] font-medium uppercase tracking-[0.08em] text-graphite">
                            {s.label}
                          </th>
                          <td className="py-3.5 text-[0.9688rem] font-medium leading-snug text-ink">{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.08} className="grid content-start gap-6">
                {product.includes?.length ? (
                  <div className="rounded-[var(--radius-card-lg)] border border-ink/[0.08] bg-paper p-6 shadow-[var(--shadow-soft)] md:p-8">
                    <h2 className="text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">{D.includes}</h2>
                    <ul className="mt-5 grid gap-3">
                      {product.includes.map((it) => (
                        <li key={it} className="flex items-start gap-3 text-[0.9688rem] leading-snug text-ink">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-signal">
                            <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                          </span>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <div className="rounded-[var(--radius-card-lg)] border border-ink/[0.08] bg-paper p-6 shadow-[var(--shadow-soft)] md:p-8">
                  <h2 className="text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">{D.idealFor}</h2>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {product.idealFor.map((x) => (
                      <li key={x} className="rounded-full bg-signal-soft px-3.5 py-2 text-[0.875rem] font-medium text-cobalt">
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            </div>
          </section>

          {service ? (
            <section className="container-site py-6 md:py-8">
              <AnimatedSection>
                <Link
                  href={D.service.href}
                  className="group flex flex-col gap-5 rounded-[var(--radius-card-lg)] border border-cobalt/50 bg-ink p-6 text-mist shadow-[var(--shadow-deep)] transition-[border-color,transform] duration-500 ease-out-expo hover:border-signal active:bg-ink/95 sm:flex-row sm:items-center sm:justify-between sm:p-8"
                >
                  <span className="flex items-center gap-5">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy text-signal">
                      <Icon name={service.icon} className="h-7 w-7" />
                    </span>
                    <span>
                      <span className="eyebrow block text-signal">{D.service.eyebrow}</span>
                      <span className="mt-2 block text-[clamp(1.25rem,1.05rem+0.8vw,1.625rem)] font-semibold leading-tight tracking-[-0.02em]">
                        {D.service.title.replace("{service}", service.name.toLowerCase())}
                      </span>
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-2 font-medium text-signal">
                    {D.service.cta}
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 ease-out-expo group-hover:translate-x-1.5" strokeWidth={1.75} aria-hidden />
                  </span>
                </Link>
              </AnimatedSection>
            </section>
          ) : null}

          <section aria-labelledby="relacionados-title" className="container-site pb-[clamp(4rem,2.5rem+5vw,7rem)] pt-10 md:pt-14">
            <AnimatedSection>
              <h2 id="relacionados-title" className="text-[length:var(--text-h3)] font-semibold leading-[1.08] tracking-[var(--tracking-tight)] text-ink">
                {D.related}
              </h2>
            </AnimatedSection>
            <ul className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {related.map((p, i) => (
                <AnimatedSection as="li" key={p.slug} y={18} delay={i * 0.05}>
                  <ProductCard product={p} sizes="(min-width: 1024px) 23vw, (min-width: 768px) 46vw, 92vw" />
                </AnimatedSection>
              ))}
            </ul>
            <p className="mt-8 text-[0.8125rem] text-graphite">
              {site.shop.section.note}
            </p>
          </section>
        </div>
      </main>
      <Footer homePrefix="/" />
      <Floating homePrefix="/" />
    </>
  );
}
