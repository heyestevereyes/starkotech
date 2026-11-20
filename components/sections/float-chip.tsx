import type { ReactNode } from "react";

/** Chip flotante sobre la foto del hero: flota lento (CSS, solo transform) y se desfasa con `delay`. */
export function FloatChip({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <div className={`absolute z-20 ${className}`}>
      <div
        className="float-slow flex items-center gap-2 whitespace-nowrap rounded-full border border-mist/20 bg-ink/75 px-3 py-2 font-mono text-[0.6875rem] tracking-[0.04em] text-mist shadow-[var(--shadow-soft)] backdrop-blur-md sm:text-[0.75rem]"
        style={{ animationDelay: `${delay}s` }}
      >
        {children}
      </div>
    </div>
  );
}
