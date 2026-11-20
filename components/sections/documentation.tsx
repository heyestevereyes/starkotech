"use client";

import { m, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Eyebrow, RichTitle } from "@/components/ui/rich-title";

const d = site.documentation;

/** Mini diagrama de nodos conectado por la línea de red: se dibuja al entrar en pantalla. */
function Topology() {
  const reduce = useReducedMotion();
  const line = {
    initial: reduce ? { pathLength: 1 } : { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true, amount: 0.6 },
    transition: { duration: 1.4, ease: [0.65, 0, 0.35, 1] as [number, number, number, number], delay: 0.3 },
  };
  const nodes = [
    { x: 28, y: 75, label: "NVR-01", pos: "below" },
    { x: 112, y: 30, label: "SW-02", pos: "above" },
    { x: 112, y: 120, label: "ANT-03", pos: "below" },
    { x: 210, y: 30, label: "CAM-07", pos: "above" },
    { x: 210, y: 120, label: "PLM-01", pos: "below" },
    { x: 290, y: 75, label: "CAM-12", pos: "right" },
  ];
  const paths = [
    "M28 75 H78 Q90 75 90 63 V42 Q90 30 102 30 H112",
    "M28 75 H78 Q90 75 90 87 V108 Q90 120 102 120 H112",
    "M112 30 H210",
    "M112 120 H210",
    "M210 30 H262 Q274 30 274 42 V63 Q274 75 286 75 H290",
    "M210 120 H262 Q274 120 274 108 V87 Q274 75 286 75 H290",
  ];
  return (
    <figure className="mt-6 rounded-2xl bg-ink p-4 sm:p-5">
      <figcaption className="eyebrow mb-3 text-signal">{d.sheet.diagramLabel}</figcaption>
      <svg viewBox="0 0 370 150" role="img" aria-label="Diagrama de topología de ejemplo: grabador, switch, antena y dispositivos" className="h-auto w-full" fill="none">
        {paths.map((p) => (
          <m.path key={p} d={p} stroke="var(--color-signal)" strokeWidth="1.5" {...line} />
        ))}
        {nodes.map((n) => (
          <g key={n.label}>
            <circle cx={n.x} cy={n.y} r="6" fill="var(--color-ink)" stroke="var(--color-signal)" strokeWidth="1.5" />
            <circle cx={n.x} cy={n.y} r="2.2" fill="var(--color-signal)" />
            <text
              x={n.pos === "right" ? n.x + 13 : n.x}
              y={n.pos === "above" ? n.y - 12 : n.pos === "below" ? n.y + 21 : n.y + 4}
              textAnchor={n.pos === "right" ? "start" : "middle"}
              fontSize="11"
              fill="var(--color-mist)"
              fontFamily="var(--font-mono)"
              letterSpacing="0.04em"
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}

export function Documentation() {
  return (
    <section id={d.id} aria-labelledby="memoria-title" className="section-y on-light bg-mist">
      <div className="container-site grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 xl:gap-24">
        <AnimatedSection>
          <Eyebrow tone="light">{d.eyebrow}</Eyebrow>
          <RichTitle
            id="memoria-title"
            text={d.title}
            className="mt-5 text-[length:var(--text-h2)] font-semibold leading-[1.02] tracking-[var(--tracking-tight)] text-ink"
            accentClassName="text-cobalt"
          />
          <p className="mt-6 max-w-[36rem] text-[length:var(--text-lead)] leading-relaxed text-graphite">{d.text}</p>
          <ul className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {d.checks.map((c) => (
              <li key={c} className="flex items-start gap-3 text-[1rem] leading-snug text-ink">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-signal">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden />
                </span>
                {c}
              </li>
            ))}
          </ul>

          <figure className="group relative mt-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-navy shadow-[var(--shadow-soft)]">
            <Image
              src={d.photo.src}
              alt={d.photo.alt}
              fill
              sizes="(min-width: 1280px) 32rem, (min-width: 1024px) 42vw, (min-width: 768px) 90vw, 92vw"
              quality={75}
              className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]"
            />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(0deg,color-mix(in_srgb,var(--color-ink)_80%,transparent)_0%,transparent_55%)]" />
            <figcaption className="absolute bottom-4 left-4 rounded-full bg-ink/80 px-3 py-1.5 font-mono text-[0.6875rem] tracking-[0.06em] text-signal backdrop-blur">
              {d.photo.caption}
            </figcaption>
          </figure>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          {/* Hoja de memoria técnica estilizada (UI, no imagen) */}
          <div className="rounded-[var(--radius-card-lg)] border border-ink/[0.08] bg-paper p-4 shadow-[var(--shadow-lift)] sm:p-6">
            <div className="flex items-start justify-between gap-4 border-b border-ink/10 pb-4">
              <div>
                <p className="eyebrow text-cobalt">{d.sheet.title}</p>
                <p className="mt-2 font-mono text-[0.8125rem] text-graphite">{d.sheet.subtitle}</p>
              </div>
              <span className="flex gap-1" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 rounded-full bg-ink/15" />
                ))}
              </span>
            </div>

            <div role="table" aria-label={d.sheet.title} className="mt-2 font-mono text-[0.75rem] sm:text-[0.8125rem]">
              <div role="row" className="hidden grid-cols-[6.5rem_1.2fr_1fr_1.1fr_1.5rem] gap-3 px-2 py-2.5 uppercase tracking-[0.1em] text-graphite sm:grid">
                {d.sheet.columns.map((c, i) => (
                  <span role="columnheader" key={c} className={i === d.sheet.columns.length - 1 ? "sr-only" : undefined}>
                    {c}
                  </span>
                ))}
              </div>
              {d.sheet.rows.map((r) => (
                <div
                  role="row"
                  key={r.id}
                  className="grid grid-cols-[5.75rem_1fr_1.5rem] items-center gap-x-3 gap-y-0.5 border-t border-ink/[0.07] px-2 py-3 transition-colors duration-300 hover:bg-mist sm:grid-cols-[6.5rem_1.2fr_1fr_1.1fr_1.5rem]"
                >
                  <span role="cell" className="font-medium text-cobalt">
                    {r.id}
                  </span>
                  <span role="cell" className="text-ink">
                    {r.device}
                  </span>
                  <span role="cell" className="order-last col-start-2 text-graphite sm:order-none sm:col-start-auto">
                    {r.ip}
                  </span>
                  <span role="cell" className="order-last col-start-2 text-graphite sm:order-none sm:col-start-auto">
                    {r.place}
                  </span>
                  <span
                    role="cell"
                    aria-label={r.state === "ok" ? d.sheet.legend.ok : d.sheet.legend.mnt}
                    className="row-start-1 col-start-3 flex justify-end sm:row-start-auto sm:col-start-auto"
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${r.state === "ok" ? "bg-online" : "border-2 border-cobalt bg-signal-soft"}`} />
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 px-2 font-mono text-[0.6875rem] text-graphite">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-online" aria-hidden />
                {d.sheet.legend.ok}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full border-2 border-cobalt bg-signal-soft" aria-hidden />
                {d.sheet.legend.mnt}
              </span>
            </div>

            <Topology />
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
