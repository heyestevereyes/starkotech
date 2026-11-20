import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { PillButton } from "@/components/ui/pill-button";

const H = site.shop.catalog.help;

/** Cierre del catálogo: invita a una visita técnica cuando el cliente no sabe qué equipo necesita. */
export function HelpBlock() {
  return (
    <AnimatedSection>
      <div className="grain relative overflow-hidden rounded-[var(--radius-card-lg)] border border-cobalt/50 bg-[radial-gradient(90%_120%_at_85%_0%,var(--color-cobalt)_0%,var(--color-navy)_55%,var(--color-ink)_100%)] p-7 text-mist shadow-[var(--shadow-deep)] sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:p-14">
        <div className="relative z-10 max-w-[38rem]">
          <h2 className="text-[length:var(--text-h3)] font-semibold leading-[1.08] tracking-[var(--tracking-tight)]">{H.title}</h2>
          <p className="mt-4 text-[length:var(--text-lead)] leading-relaxed text-mist/80">{H.text}</p>
        </div>
        <div className="relative z-10 mt-8 lg:mt-0 lg:shrink-0">
          <PillButton href={H.href} size="lg" location="catalogo_ayuda">
            {H.cta}
          </PillButton>
        </div>
      </div>
    </AnimatedSection>
  );
}
