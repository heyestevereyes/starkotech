"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { site } from "@/content/site";

const t = site.hero.title;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * H1 con la palabra resaltada rotando entre los servicios.
 * - La primera palabra viene en el HTML del servidor (LCP sin esperar hidratación).
 * - El h1 lleva el texto completo para lectores de pantalla; la parte animada va con aria-hidden.
 * - La palabra sale hacia arriba y entra desde abajo; el bloque signal ajusta su ancho con Framer Motion.
 *   Siempre ocupa una sola línea, así que el alto del H1 no cambia entre palabras.
 * - Con prefers-reduced-motion se queda fija en la primera.
 */
export function HeroTitle() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [widths, setWidths] = useState<number[] | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  // Rotación
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % t.words.length), t.intervalMs);
    return () => window.clearInterval(id);
  }, [reduce]);

  // Mide el ancho de cada palabra (con su padding) para animar el bloque entre ellas
  const measure = useCallback(() => {
    const el = measureRef.current;
    if (!el) return;
    setWidths(Array.from(el.children).map((c) => (c as HTMLElement).getBoundingClientRect().width));
  }, []);

  useLayoutEffect(() => {
    measure();
    const el = measureRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // las fuentes web cambian los anchos al cargar
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const word = t.words[index];

  return (
    <h1
      id="hero-title"
      className="mt-7 text-[length:var(--text-hero)] font-semibold leading-[1.06] tracking-[var(--tracking-tightest)]"
    >
      <span className="sr-only">{t.srOnly}</span>
      <span aria-hidden="true" className="block">
        <span className="block">{t.lead}</span>
        <span className="mt-[0.08em] block whitespace-nowrap">
          <m.span
            className="relative inline-block max-w-full align-bottom"
            initial={false}
            animate={widths && !reduce ? { width: widths[index] } : undefined}
            transition={{ duration: 0.55, ease: EASE }}
          >
            {/* Medidor invisible: todas las palabras, para conocer su ancho exacto */}
            <span ref={measureRef} className="pointer-events-none invisible absolute left-0 top-0 flex flex-col items-start" aria-hidden="true">
              {t.words.map((w) => (
                <em
                  key={w}
                  className="inline-block whitespace-nowrap px-[0.14em] font-serif font-normal italic"
                  style={{ fontSize: "1.1em", letterSpacing: "-0.01em", lineHeight: 1.12 }}
                >
                  {w}
                </em>
              ))}
            </span>

            {/* Bloque signal: el fondo ocupa todo el ancho animado */}
            <span className="highlight block overflow-hidden py-[0.02em]" style={{ width: "100%" }}>
              <span className="relative block">
                <AnimatePresence initial={false} mode="popLayout">
                  <m.em
                    key={word}
                    className="block whitespace-nowrap px-[0.14em] font-serif font-normal italic"
                    style={{ fontSize: "1.1em", letterSpacing: "-0.01em", lineHeight: 1.12 }}
                    initial={{ y: "105%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-105%" }}
                    transition={{ duration: 0.55, ease: EASE }}
                  >
                    {word}
                  </m.em>
                </AnimatePresence>
              </span>
            </span>
          </m.span>
        </span>
      </span>
    </h1>
  );
}
