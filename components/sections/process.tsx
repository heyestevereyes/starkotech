"use client";

import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Eyebrow, RichTitle } from "@/components/ui/rich-title";
import { PillButton } from "@/components/ui/pill-button";

/**
 * Línea de red: un trazo signal que se dibuja con el scroll (GSAP + ScrollTrigger) y conecta los 7 pasos como nodos.
 * Móvil y tablet: línea vertical a la izquierda. Escritorio: eje central con tarjetas en zigzag.
 */
export function Process() {
  const { process } = site;
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const drawRef = useRef<SVGPathElement>(null);
  const packetRef = useRef<SVGGElement>(null);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    // GSAP se carga bajo demanda para no inflar el JS inicial
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const wrap = wrapRef.current;
      const svg = svgRef.current;
      const base = baseRef.current;
      const draw = drawRef.current;
      const packet = packetRef.current;
      if (!wrap || !svg || !base || !draw || !packet) return;

      const nodes = Array.from(wrap.querySelectorAll<HTMLElement>("[data-node]"));
      const cards = Array.from(wrap.querySelectorAll<HTMLElement>("[data-step]"));
      let fractions: number[] = [];
      let total = 0;

      const layout = () => {
        const box = wrap.getBoundingClientRect();
        svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
        const pts = nodes.map((n) => {
          const r = n.getBoundingClientRect();
          return { x: r.left - box.left + r.width / 2, y: r.top - box.top + r.height / 2 };
        });
        const d = `M ${pts[0].x} ${pts[0].y} ${pts
          .slice(1)
          .map((p) => `L ${p.x} ${p.y}`)
          .join(" ")}`;
        base.setAttribute("d", d);
        draw.setAttribute("d", d);
        total = draw.getTotalLength();
        const span = pts[pts.length - 1].y - pts[0].y || 1;
        fractions = pts.map((p) => (p.y - pts[0].y) / span);
        draw.style.strokeDasharray = `${total}`;
      };

      const render = (p: number) => {
        draw.style.strokeDashoffset = `${total * (1 - p)}`;
        const pt = draw.getPointAtLength(total * p);
        packet.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
        packet.style.opacity = p > 0 && p < 1 ? "1" : "0";
        fractions.forEach((f, i) => {
          const on = p >= f - 0.004;
          nodes[i].dataset.active = on ? "true" : "false";
          cards[i].dataset.active = on ? "true" : "false";
        });
      };

      layout();
      const mm = gsap.matchMedia();
      const state = { p: 0 };

      mm.add({ reduce: "(prefers-reduced-motion: reduce)", motion: "(prefers-reduced-motion: no-preference)" }, (ctx) => {
        if (ctx.conditions?.reduce) {
          state.p = 1;
          render(1);
          return;
        }
        render(0);
        gsap.to(state, {
          p: 1,
          ease: "none",
          onUpdate: () => render(state.p),
          scrollTrigger: {
            trigger: wrap,
            start: "top 65%",
            end: "bottom 60%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });

      const ro = new ResizeObserver(() => {
        layout();
        render(state.p);
        ScrollTrigger.refresh();
      });
      ro.observe(wrap);

      cleanup = () => {
        ro.disconnect();
        mm.revert();
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section
      id={process.id}
      aria-labelledby="proceso-title"
      className="grain section-y relative overflow-hidden bg-[radial-gradient(90%_60%_at_50%_0%,var(--color-navy)_0%,var(--color-ink)_70%)] text-mist"
    >
      <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 -z-0 opacity-60" />
      <div className="container-site relative z-10">
        <AnimatedSection className="max-w-[44rem]">
          <Eyebrow>{process.eyebrow}</Eyebrow>
          <RichTitle
            id="proceso-title"
            text={process.title}
            className="mt-5 text-[length:var(--text-h2)] font-semibold leading-[1.02] tracking-[var(--tracking-tight)]"
            accentClassName="text-signal"
          />
        </AnimatedSection>

        <div ref={wrapRef} className="relative mt-16 md:mt-20">
          <svg ref={svgRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
            <path ref={baseRef} fill="none" stroke="var(--color-cobalt)" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" />
            <path ref={drawRef} fill="none" stroke="var(--color-signal)" strokeWidth="2.5" strokeLinecap="round" />
            <g ref={packetRef} style={{ opacity: 0 }}>
              <circle r="14" fill="var(--color-signal)" opacity="0.18" />
              <circle r="5" fill="var(--color-signal)" />
            </g>
          </svg>

          <ol className="relative grid gap-6 pl-12 md:pl-16 lg:gap-10 lg:pl-0">
            {process.steps.map((s, i) => {
              const right = i % 2 === 1;
              return (
                <li key={s.n} data-step data-active="false" className="group relative lg:grid lg:grid-cols-2">
                  {/* nodo en la línea de red */}
                  <span
                    data-node
                    data-active="false"
                    aria-hidden
                    className="absolute -left-[2.1rem] top-8 h-4 w-4 rounded-full border-2 border-cobalt bg-ink transition-[background-color,border-color,box-shadow] duration-500 ease-out-expo data-[active=true]:border-signal data-[active=true]:bg-signal data-[active=true]:shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-signal)_18%,transparent)] md:-left-[2.6rem] lg:left-1/2 lg:-translate-x-1/2"
                  />
                  {/* ramal del nodo a su tarjeta (escritorio) */}
                  <span
                    aria-hidden
                    className={`absolute top-[2.45rem] hidden h-px w-[calc(3rem-0.5rem)] bg-cobalt transition-colors duration-500 group-data-[active=true]:bg-signal lg:block ${
                      right ? "left-[calc(50%+0.5rem)]" : "right-[calc(50%+0.5rem)]"
                    }`}
                  />
                  <div className={`${right ? "lg:col-start-2 lg:pl-12" : "lg:col-start-1 lg:pr-12"}`}>
                    <div className="rounded-[var(--radius-card)] border border-cobalt/50 bg-navy/50 p-6 backdrop-blur-sm transition-[border-color,background-color,transform] duration-500 ease-out-expo group-data-[active=true]:border-signal/40 group-data-[active=true]:bg-navy/80 hover:-translate-y-0.5 md:p-7">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-[2rem] font-medium leading-none tracking-[-0.04em] text-mist/30 transition-colors duration-500 group-data-[active=true]:text-signal">
                          {s.n}
                        </span>
                        <span className="rounded-full border border-cobalt px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-mist/70">
                          {s.tag}
                        </span>
                      </div>
                      <h3 className="mt-6 text-[1.25rem] font-semibold leading-tight tracking-[-0.02em]">{s.title}</h3>
                      <p className="mt-2.5 text-[0.9688rem] leading-relaxed text-mist/70">{s.text}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <AnimatedSection className="mt-16 flex flex-col items-center gap-6 text-center md:mt-20">
          <p className="max-w-[32rem] text-[length:var(--text-lead)] text-mist/80">{process.note}</p>
          <PillButton href={process.cta.href} size="lg" location="proceso">
            {process.cta.label}
          </PillButton>
        </AnimatedSection>
      </div>
    </section>
  );
}
