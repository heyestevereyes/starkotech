import Image from "next/image";
import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Eyebrow, RichTitle } from "@/components/ui/rich-title";

export function Benefits() {
  const { benefits } = site;
  return (
    <section id={benefits.id} aria-labelledby="beneficios-title" className="section-y on-light bg-mist pt-0 md:pt-0">
      <div className="container-site">
        <div className="border-t border-ink/10 pt-[clamp(4.5rem,3rem+6vw,9rem)]">
          <AnimatedSection className="max-w-[46rem]">
            <Eyebrow tone="light">{benefits.eyebrow}</Eyebrow>
            <RichTitle
              id="beneficios-title"
              text={benefits.title}
              className="mt-5 text-[length:var(--text-h2)] font-semibold leading-[1.02] tracking-[var(--tracking-tight)] text-ink"
              accentClassName="text-cobalt"
            />
          </AnimatedSection>

          <ul className="mt-14 grid gap-6 md:mt-16 lg:grid-cols-3 lg:gap-7">
            {benefits.items.map((b, i) => (
              <AnimatedSection as="li" key={b.title} delay={i * 0.1} className="h-full">
                <article className="group grid h-full overflow-hidden rounded-[var(--radius-card-lg)] border border-ink/[0.07] bg-paper shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-cobalt/40 hover:shadow-[var(--shadow-lift)] md:grid-cols-[0.9fr_1.1fr] lg:grid-cols-1 lg:grid-rows-[auto_1fr]">
                  <div className="relative aspect-[4/3] overflow-hidden bg-navy md:aspect-auto md:min-h-[17rem] lg:aspect-[4/3] lg:min-h-0">
                    <Image
                      src={b.image}
                      alt={b.alt}
                      fill
                      sizes="(min-width: 1024px) 28vw, (min-width: 768px) 42vw, 92vw"
                      quality={75}
                      className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-ink/85 px-3 py-1.5 font-mono text-[0.75rem] font-medium tracking-[0.1em] text-signal backdrop-blur">
                      {b.tag}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center p-6 md:p-8 lg:justify-start lg:p-8">
                    <h3 className="text-[1.375rem] font-semibold leading-tight tracking-[-0.02em] text-ink">{b.title}</h3>
                    <p className="mt-3 text-[1rem] leading-relaxed text-graphite">{b.text}</p>
                  </div>
                </article>
              </AnimatedSection>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
