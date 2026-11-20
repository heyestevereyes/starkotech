import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Icon } from "@/components/ui/icons";
import { Eyebrow, RichTitle } from "@/components/ui/rich-title";

const d = site.differentiators;
const half = Math.ceil(d.items.length / 2);
const rows = [d.items.slice(0, half), d.items.slice(half)];

function Pill({ icon, label }: { icon: string; label: string }) {
  return (
    <li className="inline-flex shrink-0 items-center gap-3 rounded-full border border-cobalt/50 bg-navy/60 py-2.5 pl-3 pr-5 text-[0.9688rem] text-mist transition-colors duration-300 ease-out-expo hover:border-signal/60 hover:bg-navy">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-signal text-ink">
        <Icon name={icon} className="h-4 w-4" />
      </span>
      {label}
    </li>
  );
}

/** Una fila del marquee: la lista se repite dos veces para el bucle (la copia va oculta a lectores de pantalla). */
function Row({ items, reverse, duration }: { items: (typeof d.items)[number][]; reverse?: boolean; duration: string }) {
  return (
    <div className="marquee-pause overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div
        className={`marquee-track flex w-max gap-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ ["--marquee-duration" as string]: duration }}
      >
        <ul className="flex shrink-0 gap-3 pr-3">
          {items.map((it) => (
            <Pill key={it.label} {...it} />
          ))}
        </ul>
        <ul aria-hidden="true" className="marquee-dup flex shrink-0 gap-3 pr-3">
          {items.map((it) => (
            <Pill key={it.label} {...it} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Differentiators() {
  return (
    <section
      id={d.id}
      aria-labelledby="dif-title"
      className="grain relative overflow-hidden bg-ink py-[clamp(4rem,3rem+4vw,7rem)] text-mist"
    >
      <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 -z-0 opacity-50" />
      <div className="relative z-10">
        <AnimatedSection className="container-site">
          <Eyebrow>{d.eyebrow}</Eyebrow>
          <RichTitle
            id="dif-title"
            text={d.title}
            className="mt-5 max-w-[40rem] text-[length:var(--text-h3)] font-semibold leading-[1.05] tracking-[var(--tracking-tight)]"
            accentClassName="text-signal"
          />
        </AnimatedSection>

        <div className="mt-10 grid gap-3 md:mt-12">
          <Row items={rows[0]} duration="70s" />
          <Row items={rows[1]} reverse duration="60s" />
        </div>

        <AnimatedSection className="container-site mt-12 md:mt-14">
          <div className="flex flex-col items-start gap-5 border-t border-cobalt/40 pt-8 md:flex-row md:items-center md:gap-10">
            <p className="eyebrow text-mist/60">{d.brandsLabel}</p>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {d.brands.map((b, i) => (
                <li key={`${b}-${i}`} className="font-mono text-[0.9375rem] font-medium tracking-[0.08em] text-mist/60 transition-colors duration-300 hover:text-mist">
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
