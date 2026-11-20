import Image from "next/image";
import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Diagonals } from "@/components/ui/diagonals";
import { WhatsAppIcon } from "@/components/ui/icons";
import { PillButton } from "@/components/ui/pill-button";
import { RichTitle } from "@/components/ui/rich-title";
import { whatsappUrl } from "@/lib/contact";

const c = site.finalCta;

/** CTA final sobre foto panorámica: el espacio libre de la imagen queda a la izquierda, donde va el texto. */
export function FinalCta() {
  return (
    <section
      id={c.id}
      aria-labelledby="cta-title"
      className="grain relative overflow-hidden bg-ink py-[clamp(5rem,3.5rem+7vw,10rem)] text-mist"
    >
      <Image
        src={c.image.src}
        alt={c.image.alt}
        fill
        sizes="100vw"
        quality={75}
        className="object-cover object-[72%_50%] md:object-center"
      />
      {/* overlay ink: más cerrado a la izquierda (texto) y abierto a la derecha (foto) */}
      <div aria-hidden className="absolute inset-0 bg-ink/65 md:bg-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-[linear-gradient(90deg,var(--color-ink)_0%,color-mix(in_srgb,var(--color-ink)_88%,transparent)_34%,color-mix(in_srgb,var(--color-ink)_35%,transparent)_70%,color-mix(in_srgb,var(--color-ink)_10%,transparent)_100%)] md:block"
      />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,color-mix(in_srgb,var(--color-ink)_55%,transparent)_0%,transparent_40%)]" />
      <Diagonals variant="cta" />

      <div className="container-site relative z-10">
        <AnimatedSection className="max-w-[40rem]">
          <RichTitle
            id="cta-title"
            text={c.title}
            className="text-[length:var(--text-h2)] font-semibold leading-[1.02] tracking-[var(--tracking-tight)]"
            accentClassName="text-signal"
          />
          <p className="mt-6 max-w-[34rem] text-[length:var(--text-lead)] leading-relaxed text-mist/85">{c.subtitle}</p>
          <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <PillButton href={c.primary.href} size="lg" location="cta_final">
              {c.primary.label}
            </PillButton>
            <PillButton
              href={whatsappUrl(c.secondary.message)}
              external
              arrow={false}
              variant="outline-dark"
              size="lg"
              icon={<WhatsAppIcon className="h-full w-full" />}
              location="cta_final_whatsapp"
            >
              {c.secondary.label}
            </PillButton>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
