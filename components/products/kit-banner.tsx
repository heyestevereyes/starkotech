import Image from "next/image";
import { Check } from "lucide-react";
import { formatMXN, productBySlug, kitBannerSlug } from "@/content/products";
import { site } from "@/content/site";
import { PillButton } from "@/components/ui/pill-button";
import { AddToQuoteButton } from "./add-button";
import { Price } from "./price";

const k = site.shop.section.kit;

/** Banner ancho del kit destacado: foto sobre mist a la izquierda y datos de compra a la derecha. */
export function KitBanner() {
  const kit = productBySlug(kitBannerSlug);
  if (!kit) return null;
  return (
    <article className="grid overflow-hidden rounded-[var(--radius-card-lg)] border border-cobalt/50 bg-ink shadow-[var(--shadow-deep)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="on-light relative aspect-[4/3] bg-mist md:aspect-auto md:min-h-[22rem]">
        <Image
          src={kit.image}
          alt={kit.imageAlt}
          fill
          sizes="(min-width: 1024px) 40vw, (min-width: 768px) 45vw, 100vw"
          quality={75}
          className="object-contain p-6 md:p-8"
        />
      </div>

      <div className="flex flex-col justify-center p-6 text-mist sm:p-8 lg:p-12">
        <span className="inline-flex w-fit rounded-full bg-signal px-3.5 py-1.5 font-mono text-[0.6875rem] font-semibold uppercase leading-none tracking-[0.1em] text-ink">
          {k.badge}
        </span>
        <h3 className="mt-5 text-[clamp(1.5rem,1.15rem+1.3vw,2.25rem)] font-semibold leading-[1.1] tracking-[var(--tracking-tight)]">{kit.name}</h3>

        <p className="eyebrow mt-6 text-mist/60">{k.includesLabel}</p>
        <ul className="mt-3 grid gap-2.5">
          {k.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3 text-[0.9688rem] leading-snug text-mist/90">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal text-ink">
                <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
              </span>
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-7 border-t border-cobalt/40 pt-6">
          <Price product={kit} tone="dark" valueClassName="text-[clamp(2.25rem,1.6rem+2.4vw,3.25rem)] leading-none" />
          {typeof kit.installFrom === "number" ? (
            <p className="mt-2 text-[0.9375rem] text-mist/75">{k.installFrom.replace("{price}", formatMXN(kit.installFrom))}</p>
          ) : null}
        </div>

        <div className="mt-7 flex flex-col gap-3 min-[480px]:flex-row min-[480px]:flex-wrap">
          <AddToQuoteButton product={kit} variant="pill" label={k.add} />
          <PillButton href={`/productos/${kit.slug}`} variant="outline-dark" size="lg" location="kit_banner" arrow={false}>
            {k.view}
          </PillButton>
        </div>
      </div>
    </article>
  );
}
