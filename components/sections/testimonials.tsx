import { Quote, Star } from "lucide-react";
import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Eyebrow, RichTitle } from "@/components/ui/rich-title";

const t = site.testimonials;

export function Testimonials() {
  return (
    <section id={t.id} aria-labelledby="clientes-title" className="on-light bg-mist px-[clamp(0.75rem,0.2rem+2vw,2rem)] pb-[clamp(2rem,1rem+3vw,4rem)] pt-0">
      <div className="grain relative mx-auto max-w-[88rem] overflow-hidden rounded-[clamp(1.75rem,1rem+3vw,3rem)] bg-navy py-[clamp(4rem,3rem+5vw,7.5rem)] text-mist">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-signal/20 blur-[100px]" />
        <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 opacity-40" />
        <div className="container-site relative z-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <AnimatedSection className="max-w-[46rem]">
              <Eyebrow>{t.eyebrow}</Eyebrow>
              <RichTitle
                id="clientes-title"
                text={t.title}
                className="mt-5 text-[length:var(--text-h2)] font-semibold leading-[1.02] tracking-[var(--tracking-tight)]"
                accentClassName="text-signal"
              />
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="flex items-center gap-4 rounded-[var(--radius-card)] border border-cobalt/60 bg-ink/40 px-5 py-4 backdrop-blur">
                <p className="font-mono text-[2.25rem] font-medium leading-none tracking-[-0.04em] text-signal">
                  {t.rating.score}
                  <span className="text-[1.125rem] text-mist/60">{t.rating.outOf}</span>
                </p>
                <div>
                  <div className="flex gap-0.5 text-signal" aria-hidden>
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-1.5 text-[0.875rem] text-mist/75">{t.rating.label}</p>
                </div>
              </div>
            </AnimatedSection>
          </div>

          <ul className="mt-12 grid gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {t.items.map((it, i) => (
              <AnimatedSection as="li" key={i} delay={i * 0.1} className={`${i === 0 ? "md:col-span-2 lg:col-span-1" : ""}`}>
                <figure className="flex h-full flex-col rounded-[var(--radius-card)] border border-cobalt/50 bg-ink/50 p-6 backdrop-blur-sm transition-[border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-signal/50 md:p-8">
                  <div className="flex items-center justify-between">
                    <Quote className="h-8 w-8 text-signal" aria-hidden />
                  </div>
                  <blockquote className="mt-6 text-[1.125rem] leading-relaxed text-mist">{it.quote}</blockquote>
                  <figcaption className="mt-8 pt-6">
                    <p className="font-semibold">{it.author}</p>
                    <p className="mt-1 text-[0.875rem] leading-snug text-mist/70">{it.role}</p>
                    <p className="mt-5 inline-block rounded-full bg-signal px-3.5 py-1.5 font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink">
                      {it.chip}
                    </p>
                  </figcaption>
                </figure>
              </AnimatedSection>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
