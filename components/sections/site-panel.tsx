"use client";

import { m, useReducedMotion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { trackCta } from "@/lib/analytics";

const w = site.plans.panel;

/** Panel de sitio completo (vive en la sección de pólizas): los estados se marcan en secuencia y el punto "en línea" pulsa. */
export function SitePanel() {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const total = w.checks.length;

  useEffect(() => {
    if (reduce) return;
    const timers = Array.from({ length: total }, (_, i) => window.setTimeout(() => setProgress(i + 1), 900 + i * 600));
    return () => timers.forEach(clearTimeout);
  }, [reduce, total]);

  const shown = reduce ? total : progress;

  return (
    <div className="relative w-full max-w-[22rem]">
      <div className="relative z-10 rounded-[24px] border border-cobalt/50 bg-navy/70 p-2 shadow-[var(--shadow-deep)]">
        <div className="on-light rounded-[18px] bg-paper p-4 text-ink">
          <div className="flex items-center justify-between gap-3">
            <p className="min-w-0">
              <span className="block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-graphite">{w.label}</span>
              <span className="mt-0.5 block text-[0.875rem] font-semibold leading-tight tracking-[-0.01em]">
                <span className="font-mono tracking-[0.02em]">{w.id}</span>
                <span className="font-medium text-graphite"> · {w.place}</span>
              </span>
            </p>
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 font-mono text-[0.625rem] font-medium uppercase tracking-[0.08em] text-online">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-online" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-online" />
              </span>
              {w.status}
            </span>
          </div>

          <dl className="mt-3 grid gap-1 text-[0.8125rem]">
            {w.rows.map((r) => (
              <div key={r.k} className="grid grid-cols-[3.75rem_1fr] gap-2">
                <dt className="font-mono text-[0.6875rem] uppercase leading-5 tracking-[0.08em] text-graphite">{r.k}</dt>
                <dd className="font-medium leading-5">{r.v}</dd>
              </div>
            ))}
          </dl>

          <div className="my-3 h-px bg-ink/10" />

          <ol className="grid gap-0.5" aria-label={w.listLabel}>
            {w.checks.map((c, i) => {
              const done = shown > i;
              const next = c.state === "next";
              return (
                <li
                  key={c.code}
                  className={`grid grid-cols-[2.25rem_1fr_auto] items-center gap-x-2.5 rounded-lg px-2 py-1.5 transition-colors duration-500 ease-out-expo ${
                    done ? "bg-mist" : "bg-transparent"
                  }`}
                >
                  <span className="font-mono text-[0.6875rem] font-medium tracking-[0.06em] text-cobalt">{c.code}</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[0.8125rem] font-medium leading-tight">{c.label}</span>
                    <span
                      className={`block font-mono text-[0.625rem] leading-tight text-graphite transition-opacity duration-500 ${
                        done ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      {c.note}
                    </span>
                  </span>
                  <span
                    className={`relative flex h-[1.125rem] w-[1.125rem] shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,transform] duration-500 ease-out-expo ${
                      done
                        ? next
                          ? "border-cobalt bg-signal-soft"
                          : "border-ink bg-ink text-signal"
                        : "border-ink/20 bg-paper"
                    } ${done ? "scale-100" : "scale-90"}`}
                  >
                    {done && !next ? <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden /> : null}
                    {done && next ? (
                      <>
                        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-signal" />
                        <span className="relative h-1.5 w-1.5 rounded-full bg-cobalt" />
                      </>
                    ) : null}
                  </span>
                  <span className="sr-only">{done ? (next ? ", programada" : ", correcto") : ", pendiente"}</span>
                </li>
              );
            })}
          </ol>

          <m.a
            href={w.ctaHref}
            onClick={() => trackCta("plans_panel", w.cta)}
            whileTap={reduce ? undefined : { scale: 0.98 }}
            className="group mt-3.5 flex h-11 items-center justify-center gap-2 rounded-full bg-ink text-[0.875rem] font-medium text-mist transition-colors duration-300 ease-out-expo hover:bg-navy"
          >
            {w.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" aria-hidden />
          </m.a>
        </div>
      </div>
    </div>
  );
}
