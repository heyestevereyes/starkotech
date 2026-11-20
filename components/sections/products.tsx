import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { featuredProducts, productCategories, products } from "@/content/products";
import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Icon } from "@/components/ui/icons";
import { Eyebrow, RichTitle } from "@/components/ui/rich-title";
import { KitBanner } from "@/components/products/kit-banner";
import { ProductCard } from "@/components/products/product-card";

const s = site.shop.section;
/** Mismo gutter que container-site, para que el carrusel móvil llegue al borde de la pantalla. */
const gutter = "clamp(1.25rem,0.6rem+3vw,3rem)";

/** Sección Productos del home (fondo navy): categorías, banner del kit y destacados. */
export function Products() {
  return (
    <section
      id={s.id}
      aria-labelledby="productos-title"
      className="grain section-y relative overflow-hidden border-t border-cobalt/30 bg-navy text-mist"
    >
      <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 -z-0 opacity-50" />
      <div className="container-site relative z-10">
        <AnimatedSection className="max-w-[48rem]">
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <RichTitle
            id="productos-title"
            text={s.title}
            className="mt-5 text-[length:var(--text-h2)] font-semibold leading-[1.02] tracking-[var(--tracking-tight)]"
            accentClassName="text-signal"
          />
          <p className="mt-6 max-w-[42rem] text-[length:var(--text-lead)] leading-relaxed text-mist/75">{s.subtitle}</p>
        </AnimatedSection>

        <AnimatedSection delay={0.08} className="mt-10">
          <ul aria-label={s.categoriesLabel} className="flex flex-wrap gap-2.5">
            {productCategories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/productos?categoria=${c.slug}`}
                  className="group inline-flex h-11 items-center gap-2.5 rounded-full border border-mist/25 px-4 text-[0.9375rem] text-mist/90 transition-[border-color,color,background-color] duration-300 ease-out-expo hover:border-signal hover:text-signal active:bg-mist/5"
                >
                  <Icon name={c.icon} className="h-[1.125rem] w-[1.125rem] text-signal" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="mt-12 md:mt-14">
          <KitBanner />
        </AnimatedSection>

        {/* Móvil: carrusel con scroll snap y peek de la siguiente card. Desde md: grid. */}
        <ul
          aria-label={s.eyebrow}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:mt-12 md:grid md:snap-none md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-4 lg:gap-6"
          style={{ marginInline: `calc(${gutter} * -1)`, paddingInline: gutter, scrollPaddingInline: gutter }}
        >
          {featuredProducts.map((p, i) => (
            <AnimatedSection
              as="li"
              key={p.slug}
              delay={Math.min(i, 3) * 0.06}
              className="w-[78%] shrink-0 snap-start min-[480px]:w-[52%] md:w-auto"
            >
              <ProductCard product={p} sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 78vw" />
            </AnimatedSection>
          ))}
          <AnimatedSection as="li" delay={0.2} className="w-[78%] shrink-0 snap-start min-[480px]:w-[52%] md:col-span-2 md:w-auto lg:col-span-1">
            <Link
              href={s.allCard.href}
              className="group flex h-full min-h-[18rem] flex-col justify-between rounded-[24px] border border-cobalt/60 bg-ink p-6 transition-[border-color,transform,background-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-signal active:bg-ink/90 motion-reduce:hover:translate-y-0 md:p-8"
            >
              <span className="eyebrow text-signal">{s.eyebrow}</span>
              <span>
                <span className="block text-[clamp(1.5rem,1.2rem+1.1vw,2rem)] font-semibold leading-[1.1] tracking-[var(--tracking-tight)]">
                  {s.allCard.title.replace("{n}", String(products.length))}
                </span>
                <span className="mt-3 block text-[0.9688rem] leading-relaxed text-mist/70">{s.allCard.text}</span>
              </span>
              <span className="mt-8 flex h-12 w-12 items-center justify-center rounded-full bg-signal text-ink transition-transform duration-300 ease-out-expo group-hover:translate-x-1.5">
                <ArrowRight className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
            </Link>
          </AnimatedSection>
        </ul>

        <AnimatedSection className="mt-10">
          <p className="max-w-[40rem] text-[0.875rem] leading-relaxed text-mist/65">{s.note}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
