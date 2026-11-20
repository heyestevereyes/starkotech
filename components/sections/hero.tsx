import Image from "next/image";
import { UserRound } from "lucide-react";
import { site } from "@/content/site";
import { PillButton } from "@/components/ui/pill-button";
import { Counter } from "@/components/ui/counter";
import { FloatChip } from "./float-chip";
import { HeroTitle } from "./hero-title";
import { HeroStatus } from "./hero-status";

const avatarTones = ["bg-cobalt text-mist", "bg-signal text-ink", "bg-signal-soft text-ink", "bg-navy text-mist"];

export function Hero() {
  const { hero, metrics } = site;
  return (
    <section id={hero.id} aria-labelledby="hero-title" className="grain bg-hero relative overflow-hidden text-mist">
      <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 -z-0" />

      <div className="container-site relative z-10 pb-10 pt-32 md:pt-36 lg:pb-16 lg:pt-40">
        <div className="grid items-center gap-14 md:gap-16 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_32rem] xl:gap-16">
          {/* Texto */}
          <div className="max-w-[40rem] lg:max-w-none">
            <div className="rise">
              <p className="inline-flex items-center gap-2.5 rounded-full border border-mist/15 bg-mist/[0.06] py-2 pl-3 pr-4 text-[0.8125rem] text-mist/85 backdrop-blur">
                <span className="relative flex h-2 w-2" aria-hidden>
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-online" />
                  <span className="relative h-2 w-2 rounded-full bg-online" />
                </span>
                {hero.chip}
              </p>
            </div>

            <div className="rise-soft" style={{ animationDelay: "0.13s" }}>
              <HeroTitle />
            </div>

            <div className="rise-soft" style={{ animationDelay: "0.21s" }}>
              <p className="mt-7 max-w-[34rem] text-[length:var(--text-lead)] leading-relaxed text-mist/75">{hero.subtitle}</p>
            </div>

            <div className="rise" style={{ animationDelay: "0.29s" }}>
              <div className="mt-9 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:flex-wrap">
                <PillButton href={hero.primary.href} size="lg" location="hero">
                  {hero.primary.label}
                </PillButton>
                <PillButton href={hero.secondary.href} size="lg" variant="outline-dark" location="hero" arrow={false}>
                  {hero.secondary.label}
                </PillButton>
              </div>
            </div>

            <div className="rise" style={{ animationDelay: "0.37s" }}>
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-2.5" aria-hidden="true">
                  {avatarTones.map((tone, i) => (
                    <span key={i} className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink ${tone}`}>
                      <UserRound className="h-[1.1rem] w-[1.1rem]" />
                    </span>
                  ))}
                </div>
                <p className="max-w-[18rem] text-[0.875rem] leading-snug text-mist/75">{hero.social}</p>
              </div>
            </div>
          </div>

          {/* Foto real con el panel de sitio encima */}
          <div className="rise relative w-full" style={{ animationDelay: "0.25s" }}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-card-lg)] border border-cobalt/40 bg-navy shadow-[var(--shadow-deep)] md:aspect-[16/10] lg:aspect-[3/4.5] xl:aspect-[3/4]">
              <Image
                src={hero.image.src}
                alt={hero.image.alt}
                fill
                preload
                sizes="(min-width: 1280px) 32rem, (min-width: 1024px) 26rem, 100vw"
                quality={75}
                className="object-cover object-[50%_22%]"
              />
              <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,color-mix(in_srgb,var(--color-ink)_75%,transparent)_0%,color-mix(in_srgb,var(--color-ink)_25%,transparent)_40%,transparent_70%)]" />

              <FloatChip className="right-3 top-3 sm:right-4 sm:top-4 lg:right-4 lg:top-5">
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inset-0 animate-pulse-ring rounded-full bg-online" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-online" />
                </span>
                <span className="text-signal">{hero.floatChips.top.code}</span>
                <span aria-hidden>·</span>
                {hero.floatChips.top.text}
              </FloatChip>

              <HeroStatus />
            </div>

            {/* Línea de red: entra por el hueco entre columnas a la altura de la barra de estado y termina en un nodo sobre el borde izquierdo de la foto (solo lg+) */}
            <svg
              viewBox="0 0 56 170"
              aria-hidden="true"
              fill="none"
              className="pointer-events-none absolute bottom-0 right-full z-0 hidden h-[170px] w-14 overflow-visible lg:block"
            >
              <path
                className="widget-route"
                d="M 0 30 H 14 Q 26 30 26 42 V 78 Q 26 90 38 90 H 56"
                stroke="var(--color-signal)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-[80px] left-0 z-30 hidden h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 lg:block"
            >
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-signal/60" />
              <span className="absolute inset-0 rounded-full border-2 border-signal bg-ink" />
            </span>
          </div>
        </div>

        {/* Franja de métricas */}
        <dl className="relative mt-20 grid grid-cols-2 gap-px overflow-hidden rounded-[24px] border border-cobalt/50 bg-cobalt/40 md:mt-24 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="flex flex-col bg-ink/70 px-5 py-6 backdrop-blur-sm sm:px-7 sm:py-8">
              <dt className="order-2 mt-3 text-[0.875rem] leading-snug text-mist/70">{m.label}</dt>
              <dd className="order-1 whitespace-nowrap font-mono text-[clamp(1.625rem,1rem+2.4vw,3rem)] font-medium leading-none tracking-[-0.04em] text-signal">
                <Counter value={m.value} display={m.display} suffix={m.suffix} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
