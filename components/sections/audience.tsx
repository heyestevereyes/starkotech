import Image from "next/image";
import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Eyebrow, RichTitle } from "@/components/ui/rich-title";

export function Audience() {
  const { audience } = site;
  return (
    <section
      id={audience.id}
      aria-labelledby="para-quien-title"
      className="grain section-y relative overflow-hidden bg-[radial-gradient(90%_60%_at_50%_0%,var(--color-navy)_0%,var(--color-ink)_70%)] text-mist"
    >
      <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 -z-0 opacity-60" />
      <div className="container-site relative z-10">
        <AnimatedSection className="max-w-[46rem]">
          <Eyebrow>{audience.eyebrow}</Eyebrow>
          <RichTitle
            id="para-quien-title"
            text={audience.title}
            className="mt-5 text-[length:var(--text-h2)] font-semibold leading-[1.02] tracking-[var(--tracking-tight)]"
            accentClassName="text-signal"
          />
        </AnimatedSection>

        <ul className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {audience.items.map((a, i) => (
            <AnimatedSection
              as="li"
              key={a.title}
              delay={i * 0.1}
              className={`h-full ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}
            >
              <article
                className={`group flex h-full flex-col overflow-hidden rounded-[var(--radius-card-lg)] border border-cobalt/40 bg-navy/60 transition-[transform,border-color,background-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-signal/50 hover:bg-navy/90 ${
                  i === 2 ? "md:flex-row lg:flex-col" : ""
                }`}
              >
                <div
                  className={`relative aspect-[16/11] overflow-hidden bg-navy ${
                    i === 2 ? "md:aspect-auto md:w-[46%] md:min-h-[18rem] lg:aspect-[16/11] lg:w-auto lg:min-h-0" : ""
                  }`}
                >
                  <Image
                    src={a.image}
                    alt={a.alt}
                    fill
                    sizes="(min-width: 1024px) 28vw, (min-width: 768px) 46vw, 92vw"
                    quality={75}
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,color-mix(in_srgb,var(--color-ink)_55%,transparent)_100%)]" />
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h3 className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em]">{a.title}</h3>
                  <p className="mt-3 text-[1rem] leading-relaxed text-mist/75">{a.text}</p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label="Incluye">
                    {a.tags.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-cobalt/60 px-3 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-mist/80"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </AnimatedSection>
          ))}
        </ul>

        <AnimatedSection className="mt-12 md:mt-14">
          <p className="flex items-center gap-3 text-[length:var(--text-lead)] text-mist/85">
            <span aria-hidden className="h-px w-10 bg-signal" />
            {audience.closing}
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
