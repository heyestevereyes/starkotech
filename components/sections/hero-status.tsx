"use client";

import { useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

const s = site.hero.status;

/** Barra de estado de vidrio oscuro anclada abajo dentro de la foto del hero. Los estados se marcan en secuencia (600 ms entre cada uno). */
export function HeroStatus() {
  const reduce = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const total = s.items.length;

  useEffect(() => {
    if (reduce) return;
    const timers = Array.from({ length: total }, (_, i) => window.setTimeout(() => setProgress(i + 1), 900 + i * 600));
    return () => timers.forEach(clearTimeout);
  }, [reduce, total]);

  const shown = reduce ? total : progress;

  return (
    <div className="absolute inset-x-3 bottom-3 z-20 rounded-[20px] border border-mist/10 bg-ink/60 px-3.5 py-3 text-mist backdrop-blur-md sm:inset-x-4 sm:bottom-4 sm:px-4">
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate font-mono text-[0.625rem] tracking-[0.02em] text-mist/85 min-[400px]:text-[0.6875rem] min-[400px]:tracking-[0.04em]">
          {s.id} <span aria-hidden>·</span> {s.place}
        </p>
        <span className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[0.625rem] font-medium uppercase tracking-[0.06em] text-signal min-[400px]:text-[0.6875rem] min-[400px]:tracking-[0.08em]">
          <span className="relative flex h-1.5 w-1.5" aria-hidden>
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-online" />
            <span className="relative h-1.5 w-1.5 rounded-full bg-online" />
          </span>
          {s.state}
        </span>
      </div>

      <ul aria-label={s.listLabel} className="mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-mist/10 pt-2.5 md:grid-cols-4 lg:grid-cols-2">
        {s.items.map((it, i) => {
          const done = shown > i;
          return (
            <li key={it.code} className="flex items-center justify-between gap-2">
              <span className="min-w-0">
                <span className="block font-mono text-[0.625rem] font-medium leading-none tracking-[0.1em] text-signal">{it.code}</span>
                <span className="mt-1 block truncate text-[0.875rem] leading-tight text-mist">{it.value}</span>
              </span>
              <span
                aria-hidden
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-signal text-ink transition-[opacity,transform] duration-500 ease-out-expo ${
                  done ? "scale-100 opacity-100" : "scale-75 opacity-0"
                }`}
              >
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
              </span>
              <span className="sr-only">{done ? ", correcto" : ", pendiente"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
