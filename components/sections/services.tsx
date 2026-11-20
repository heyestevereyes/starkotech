"use client";

import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { services, type Service } from "@/content/services";
import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Icon } from "@/components/ui/icons";
import { Eyebrow, RichTitle } from "@/components/ui/rich-title";
import { trackCta } from "@/lib/analytics";
import { CameraGrid } from "./camera-grid";
import { ServiceDrawer } from "./service-drawer";

const s = site.services;

/**
 * Bento: móvil 1 columna, tablet 2, lg 3 y xl 4.
 * El DOM sigue este orden (móvil y tablet): Videovigilancia, Acceso vehicular, el resto.
 * Con las utilidades order se reacomoda en lg para no dejar huecos.
 */
const featured: Record<string, string> = {
  videovigilancia: "md:col-span-2 lg:row-span-2",
  "acceso-vehicular": "md:col-span-2 lg:order-1 lg:col-span-3 xl:order-none xl:col-span-2",
  "control-de-acceso": "",
  "seguridad-perimetral": "",
};
/** Servicios que muestran su foto en la tarjeta del bento (la de Mantenimiento va en Pólizas y en el drawer). */
const bentoPhotos = ["acceso-vehicular", "redes", "automatizacion"];
const restClass = "lg:order-2 xl:order-none";
const ctaClass = "lg:order-3 lg:col-span-2 xl:order-none xl:col-span-1";
const bentoOrder = ["videovigilancia", "acceso-vehicular", "control-de-acceso", "seguridad-perimetral"];
/** Las 4 piezas del bloque superior primero; el resto conserva el orden del catálogo. */
const ordered = [
  ...bentoOrder.map((slug) => services.find((x) => x.slug === slug)!),
  ...services.filter((x) => !bentoOrder.includes(x.slug)),
];

const arrowClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,transform] duration-300 ease-out-expo";

function Chips({ items, tone }: { items: string[]; tone: "light" | "dark" }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Incluye">
      {items.map((h) => (
        <li
          key={h}
          className={`rounded-full px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.06em] ${
            tone === "dark" ? "border border-cobalt/60 text-mist/85" : "bg-signal-soft text-cobalt"
          }`}
        >
          {h}
        </li>
      ))}
    </ul>
  );
}

export function Services() {
  const [open, setOpen] = useState<Service | null>(null);

  const trigger = (svc: Service) => () => {
    trackCta("servicios_card", svc.slug);
    setOpen(svc);
  };

  return (
    <section id={s.id} aria-labelledby="servicios-title" className="section-y on-light bg-mist">
      <div className="container-site">
        <AnimatedSection className="max-w-[46rem]">
          <Eyebrow tone="light">{s.eyebrow}</Eyebrow>
          <RichTitle
            id="servicios-title"
            text={s.title}
            className="mt-5 text-[length:var(--text-h2)] font-semibold leading-[1.02] tracking-[var(--tracking-tight)] text-ink"
            accentClassName="text-cobalt"
          />
        </AnimatedSection>

        <ul className="mt-14 grid gap-4 md:mt-16 md:grid-cols-2 md:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {ordered.map((svc, i) => {
            const pos = featured[svc.slug] ?? restClass;
            const isVideo = svc.slug === "videovigilancia";
            const isVehicular = svc.slug === "acceso-vehicular";
            /** Tarjeta con foto real (vehicular, redes, automatización): texto claro sobre overlay ink */
            const hasImage = Boolean(svc.image) && bentoPhotos.includes(svc.slug);
            const dark = isVideo || hasImage;

            return (
              <AnimatedSection as="li" key={svc.slug} delay={Math.min(i, 5) * 0.05} className={`${pos}`} amount={0.1}>
                <button
                  type="button"
                  onClick={trigger(svc)}
                  aria-haspopup="dialog"
                  aria-label={`${s.openDetail} ${svc.name}`}
                  className={`group relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-card-lg)] border text-left transition-[transform,box-shadow,border-color,background-color] duration-500 ease-out-expo hover:-translate-y-1 active:translate-y-0 ${
                    isVideo
                      ? "grain border-cobalt/50 bg-[radial-gradient(100%_80%_at_80%_0%,var(--color-cobalt)_0%,var(--color-navy)_55%,var(--color-ink)_100%)] p-6 text-mist hover:border-signal/60 md:p-8"
                      : hasImage
                        ? "min-h-[22rem] border-cobalt/40 bg-ink p-6 text-mist hover:border-signal/60 md:p-8"
                        : "border-ink/[0.07] bg-paper p-6 shadow-[var(--shadow-soft)] hover:border-cobalt/40 hover:shadow-[var(--shadow-lift)]"
                  }`}
                >
                  {hasImage && svc.image ? (
                    <>
                      <Image
                        src={svc.image}
                        alt={svc.imageAlt ?? ""}
                        fill
                        sizes="(min-width: 1280px) 50vw, (min-width: 1024px) 66vw, (min-width: 768px) 50vw, 100vw"
                        quality={75}
                        className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-ink)_0%,color-mix(in_srgb,var(--color-ink)_92%,transparent)_42%,color-mix(in_srgb,var(--color-ink)_55%,transparent)_68%,color-mix(in_srgb,var(--color-ink)_12%,transparent)_100%)]"
                      />
                    </>
                  ) : null}

                  <span className="relative z-10 flex items-start justify-between gap-4">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                        dark ? "bg-signal text-ink" : "bg-ink text-signal"
                      }`}
                    >
                      <Icon name={svc.icon} className="h-6 w-6" />
                    </span>
                    <span
                      aria-hidden
                      className={`${arrowClass} ${
                        dark
                          ? "border-mist/30 text-mist group-hover:border-signal group-hover:bg-signal group-hover:text-ink"
                          : "border-ink/20 text-ink group-hover:border-ink group-hover:bg-ink group-hover:text-signal"
                      }`}
                    >
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </span>

                  <span className={`relative z-10 block ${hasImage ? "mt-auto pt-24" : "mt-6"}`}>
                    <span
                      className={`block font-semibold leading-tight tracking-[-0.025em] ${
                        isVideo ? "text-[clamp(1.75rem,1.4rem+1.2vw,2.5rem)]" : "text-[1.375rem]"
                      }`}
                    >
                      {svc.name}
                    </span>
                    <span
                      className={`mt-2.5 block text-[0.9688rem] leading-relaxed ${
                        dark ? "max-w-[28rem] text-mist/80" : "text-graphite"
                      }`}
                    >
                      {svc.short}
                    </span>
                    {isVehicular ? (
                      <span className="mt-3 block max-w-[28rem] text-[0.9688rem] leading-relaxed text-mist">{s.vehicularNote}</span>
                    ) : null}
                  </span>

                  {isVideo ? (
                    <span className="relative z-10 mt-8 block lg:flex-1">
                      <CameraGrid />
                    </span>
                  ) : null}

                  <span className={`relative z-10 block ${hasImage ? "pt-5" : "mt-auto pt-6"}`}>
                    <Chips items={svc.highlights} tone={dark ? "dark" : "light"} />
                  </span>
                </button>
              </AnimatedSection>
            );
          })}

          {/* Card 12: CTA */}
          <AnimatedSection as="li" delay={0.2} amount={0.1} className={ctaClass}>
            <a
              href={s.cta.href}
              onClick={() => trackCta("servicios_cta", s.cta.label)}
              className="group grain relative flex h-full min-h-[16rem] flex-col justify-between overflow-hidden rounded-[var(--radius-card-lg)] border border-cobalt/50 bg-ink p-6 text-mist transition-[transform,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-signal/60 active:translate-y-0"
            >
              <span aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 opacity-60" />
              <span className="relative z-10 block">
                <span className="block text-[1.5rem] font-semibold leading-tight tracking-[-0.025em]">{s.cta.title}</span>
                <span className="mt-3 block text-[0.9688rem] leading-relaxed text-mist/75">{s.cta.text}</span>
              </span>
              <span className="relative z-10 mt-8 inline-flex h-12 w-full max-w-[22rem] items-center justify-between gap-3 rounded-full bg-signal pl-5 pr-2 font-medium text-ink transition-colors duration-300 group-hover:bg-signal-soft">
                {s.cta.label}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-signal">
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" aria-hidden />
                </span>
              </span>
            </a>
          </AnimatedSection>
        </ul>
      </div>

      {open ? <ServiceDrawer key={open.slug} service={open} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}
