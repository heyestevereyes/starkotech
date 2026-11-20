import { Check, Minus } from "lucide-react";
import Image from "next/image";
import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Diagonals } from "@/components/ui/diagonals";
import { PillButton } from "@/components/ui/pill-button";
import { Eyebrow, RichTitle } from "@/components/ui/rich-title";
import { SitePanel } from "./site-panel";

const p = site.plans;

export function Plans() {
  return (
    <section id={p.id} aria-labelledby="polizas-title" className="section-y on-light relative overflow-hidden bg-mist">
      <Diagonals variant="plans" className="opacity-90" />
      <div className="container-site relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16 xl:gap-24">
          <AnimatedSection className="max-w-[46rem]">
            <Eyebrow tone="light">{p.eyebrow}</Eyebrow>
            <RichTitle
              id="polizas-title"
              text={p.title}
              className="mt-5 text-[length:var(--text-h2)] font-semibold leading-[1.02] tracking-[var(--tracking-tight)] text-ink"
              accentClassName="text-cobalt"
            />
            <p className="mt-6 max-w-[34rem] text-[length:var(--text-lead)] leading-relaxed text-graphite">{p.lead}</p>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="mx-auto w-full max-w-[22rem] lg:mx-0 lg:justify-self-end">
            <p className="eyebrow mb-4 text-graphite">{p.panelLabel}</p>
            <div className="-rotate-2 transition-transform duration-500 ease-out-expo hover:rotate-0 motion-reduce:transition-none">
              <SitePanel />
            </div>
          </AnimatedSection>
        </div>

        <ul className="mt-14 grid items-stretch gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {p.items.map((plan, i) => {
            const featured = plan.id === "poliza";
            return (
              <AnimatedSection
                as="li"
                key={plan.id}
                delay={i * 0.1}
                className={`${featured ? "order-first md:col-span-2 lg:order-none lg:col-span-1" : ""} ${featured ? "lg:-my-5" : ""}`}
              >
                <article
                  className={`group relative flex h-full flex-col rounded-[var(--radius-card-lg)] border p-6 transition-[transform,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-1 md:p-8 ${
                    featured
                      ? "grain border-cobalt/60 bg-ink text-mist shadow-[var(--shadow-deep)] hover:border-signal/60 lg:py-12"
                      : "border-ink/[0.08] bg-paper text-ink shadow-[var(--shadow-soft)] hover:border-cobalt/40 hover:shadow-[var(--shadow-lift)]"
                  }`}
                >
                  {featured && "badge" in plan ? (
                    <span className="absolute -top-3.5 left-6 z-10 rounded-full bg-signal px-4 py-1.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-ink md:left-8">
                      {plan.badge}
                    </span>
                  ) : null}

                  {"photo" in plan ? (
                    <div className="relative z-0 -mx-6 -mt-6 mb-6 aspect-[16/8] overflow-hidden rounded-t-[var(--radius-card-lg)] bg-navy md:-mx-8 md:-mt-8 lg:aspect-[16/9]">
                      <Image
                        src={plan.photo.src}
                        alt={plan.photo.alt}
                        fill
                        sizes="(min-width: 1024px) 28vw, (min-width: 768px) 90vw, 92vw"
                        quality={75}
                        className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                      />
                      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,var(--color-ink)_0%,color-mix(in_srgb,var(--color-ink)_45%,transparent)_45%,color-mix(in_srgb,var(--color-ink)_10%,transparent)_100%)]" />
                    </div>
                  ) : null}

                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[0.75rem] font-medium tracking-[0.14em] ${
                        featured ? "border border-cobalt/70 text-signal" : "bg-signal-soft text-cobalt"
                      }`}
                    >
                      {plan.tag}
                    </span>
                  </div>

                  <h3 className="relative z-10 mt-6 text-[1.625rem] font-semibold leading-tight tracking-[-0.025em]">{plan.name}</h3>
                  <p className={`relative z-10 mt-3 text-[1rem] leading-relaxed ${featured ? "text-mist/75" : "text-graphite"}`}>{plan.text}</p>

                  <p className={`relative z-10 mt-6 border-y py-4 font-mono text-[0.9375rem] ${featured ? "border-cobalt/40 text-signal" : "border-ink/10 text-cobalt"}`}>
                    {plan.price}
                  </p>

                  <p className={`eyebrow relative z-10 mt-6 ${featured ? "text-mist/60" : "text-graphite"}`}>{p.includedLabel}</p>
                  <ul className="relative z-10 mt-4 grid gap-3">
                    {plan.included.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-[0.9688rem] leading-snug">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                            featured ? "bg-signal text-ink" : "bg-ink text-signal"
                          }`}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>

                  {plan.notIncluded.length ? (
                    <>
                      <p className="eyebrow relative z-10 mt-6 text-graphite">{p.notIncludedLabel}</p>
                      <ul className="relative z-10 mt-4 grid gap-3">
                        {plan.notIncluded.map((it) => (
                          <li key={it} className="flex items-start gap-3 text-[0.9688rem] leading-snug text-graphite">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink/25">
                              <Minus className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                            </span>
                            {it}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}

                  <div className="relative z-10 mt-auto pt-8">
                    <PillButton
                      href={plan.cta.href}
                      location={`poliza_${plan.id}`}
                      variant={featured ? "signal" : "outline-light"}
                      className="w-full"
                    >
                      {plan.cta.label}
                    </PillButton>
                  </div>
                </article>
              </AnimatedSection>
            );
          })}
        </ul>

        <AnimatedSection className="mt-12 md:mt-16">
          <p className="max-w-[40rem] text-[0.9688rem] leading-relaxed text-graphite">{p.note}</p>
        </AnimatedSection>
      </div>
    </section>
  );
}
