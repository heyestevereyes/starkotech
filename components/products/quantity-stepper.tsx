"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_QTY } from "@/lib/quote-math";

const btn =
  "flex h-11 w-11 items-center justify-center text-ink transition-[background-color,transform] duration-200 ease-out-expo hover:bg-ink/[0.06] active:scale-90 active:bg-ink/10 disabled:opacity-35 disabled:hover:bg-transparent";

/** Selector de cantidad con botones de 44px y valor anunciado a lectores de pantalla. */
export function QuantityStepper({
  value,
  onChange,
  label,
  decreaseLabel,
  increaseLabel,
  className = "",
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  decreaseLabel: string;
  increaseLabel: string;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={`on-light inline-flex items-center rounded-full border border-ink/20 bg-paper ${className}`}>
      <button type="button" className={`${btn} rounded-l-full`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label={decreaseLabel}>
        <Minus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </button>
      <output aria-live="polite" className="min-w-9 select-none text-center font-mono text-[0.9375rem] font-medium tabular-nums">
        {value}
      </output>
      <button type="button" className={`${btn} rounded-r-full`} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label={increaseLabel}>
        <Plus className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </button>
    </div>
  );
}

/** Interruptor accesible (role="switch") para "Incluir instalación". */
export function InstallSwitch({
  checked,
  onChange,
  label,
  hint,
  className = "",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`on-light group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-[border-color,background-color] duration-200 ease-out-expo ${
        checked ? "border-cobalt bg-signal-soft" : "border-ink/15 bg-paper hover:border-ink/35"
      } ${className}`}
    >
      <span
        aria-hidden
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-300 ease-out-expo ${checked ? "bg-cobalt" : "bg-ink/25"}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-paper shadow transition-transform duration-300 ease-out-expo ${checked ? "translate-x-4" : ""}`}
        />
      </span>
      <span className="min-w-0">
        <span className="block text-[0.9375rem] font-semibold leading-tight text-ink">{label}</span>
        {hint ? <span className="mt-0.5 block text-[0.8125rem] leading-snug text-graphite">{hint}</span> : null}
      </span>
    </button>
  );
}
