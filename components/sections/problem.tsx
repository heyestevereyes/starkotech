import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Eyebrow, RichTitle } from "@/components/ui/rich-title";
import { Icon } from "@/components/ui/icons";

export function Problem() {
  const { problem } = site;
  return (
    <section id={problem.id} aria-labelledby="problema-title" className="section-y on-light bg-mist">
      <div className="container-site grid gap-12 lg:grid-cols-[0.85fr_1.3fr] lg:gap-16 xl:gap-24">
        <AnimatedSection className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow tone="light">{problem.eyebrow}</Eyebrow>
          <RichTitle
            id="problema-title"
            text={problem.title}
            className="mt-5 max-w-[34rem] text-[length:var(--text-h2)] font-semibold leading-[1.02] tracking-[var(--tracking-tight)] text-ink"
            accentClassName="text-cobalt"
          />
        </AnimatedSection>

        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {problem.items.map((item, i) => (
            <AnimatedSection as="li" key={item.title} delay={i * 0.08} className="h-full">
              <article className="group flex h-full flex-col rounded-[var(--radius-card)] border border-ink/[0.07] bg-paper p-6 shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-cobalt/40 hover:shadow-[var(--shadow-lift)] md:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-signal transition-transform duration-500 ease-out-expo group-hover:scale-105">
                    <Icon name={item.icon} className="h-6 w-6" />
                  </span>
                  <span className="font-mono text-[0.75rem] tracking-[0.12em] text-graphite">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-7 text-[1.25rem] font-semibold leading-tight tracking-[-0.02em] text-ink">{item.title}</h3>
                <p className="mt-3 text-[0.9688rem] leading-relaxed text-graphite">{item.text}</p>
              </article>
            </AnimatedSection>
          ))}
        </ul>
      </div>
    </section>
  );
}
