"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Eyebrow, RichTitle } from "@/components/ui/rich-title";

export function Faq() {
  const { faq } = site;
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const uid = useId();

  return (
    <section id={faq.id} aria-labelledby="faq-title" className="section-y on-light bg-mist">
      <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <AnimatedSection className="lg:sticky lg:top-28 lg:self-start">
          <Eyebrow tone="light">{faq.eyebrow}</Eyebrow>
          <RichTitle
            id="faq-title"
            text={faq.title}
            className="mt-5 max-w-[30rem] text-[length:var(--text-h2)] font-semibold leading-[1.02] tracking-[var(--tracking-tight)] text-ink"
            accentClassName="text-cobalt"
          />
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              const btnId = `${uid}-q-${i}`;
              const panelId = `${uid}-a-${i}`;
              return (
                <li key={item.q}>
                  <h3>
                    <button
                      id={btnId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)] font-semibold tracking-[-0.02em] text-ink transition-colors duration-300 hover:text-cobalt"
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-xs font-normal text-graphite">{String(i + 1).padStart(2, "0")}</span>
                        {item.q}
                      </span>
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-300 ease-out-expo ${
                          isOpen ? "rotate-45 border-ink bg-ink text-signal" : "border-ink/25 text-ink group-hover:border-ink"
                        }`}
                      >
                        <Plus className="h-4 w-4" aria-hidden />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <m.div
                        id={panelId}
                        role="region"
                        aria-labelledby={btnId}
                        key="panel"
                        initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                        exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[40rem] pb-7 pl-8 pr-4 text-[1rem] leading-relaxed text-graphite md:pr-14">{item.a}</p>
                      </m.div>
                    ) : null}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </AnimatedSection>
      </div>
    </section>
  );
}
