import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Icon, WhatsAppIcon } from "@/components/ui/icons";
import { PillButton } from "@/components/ui/pill-button";
import { Eyebrow, RichTitle } from "@/components/ui/rich-title";
import { whatsappUrl } from "@/lib/contact";
import { QuoteFormLazy } from "./quote-form-lazy";

const q = site.quote;

export function Quote() {
  return (
    <section
      id={q.id}
      aria-labelledby="cotizar-title"
      className="grain section-y relative overflow-hidden bg-[radial-gradient(80%_60%_at_20%_0%,var(--color-navy)_0%,var(--color-ink)_70%)] text-mist"
    >
      <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 -z-0 opacity-60" />
      <div className="container-site relative z-10 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14 xl:gap-20">
        <AnimatedSection className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow>{q.eyebrow}</Eyebrow>
          <RichTitle
            id="cotizar-title"
            text={q.title}
            className="mt-5 text-[length:var(--text-h2)] font-semibold leading-[1.02] tracking-[var(--tracking-tight)]"
            accentClassName="text-signal"
          />
          <p className="mt-6 max-w-[34rem] text-[length:var(--text-lead)] leading-relaxed text-mist/75">{q.subtitle}</p>

          <ul className="mt-8 grid gap-4">
            {q.bullets.map((b) => (
              <li key={b.text} className="flex items-center gap-3.5 text-[1rem] text-mist">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cobalt/60 bg-navy/60 text-signal">
                  <Icon name={b.icon} className="h-5 w-5" />
                </span>
                {b.text}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-[var(--radius-card)] border border-cobalt/50 bg-navy/50 p-6 backdrop-blur-sm">
            <p className="text-[1.25rem] font-semibold tracking-[-0.02em]">{q.urgent.title}</p>
            <p className="mt-2 text-[0.9688rem] leading-relaxed text-mist/75">{q.urgent.text}</p>
            <PillButton
              href={whatsappUrl(q.urgent.message)}
              external
              arrow={false}
              size="lg"
              icon={<WhatsAppIcon className="h-full w-full" />}
              location="cotizador_urgente"
              className="mt-5 w-full sm:w-auto"
            >
              {q.urgent.cta}
            </PillButton>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <QuoteFormLazy />
        </AnimatedSection>
      </div>
    </section>
  );
}
