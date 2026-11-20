"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Props = {
  /** Valor real; si es 0 se muestra `display` (placeholder por confirmar) */
  value: number;
  display: string;
  suffix?: string;
  className?: string;
};

const fmt = new Intl.NumberFormat("es-MX");

/** Contador animado al entrar en viewport. Con prefers-reduced-motion muestra el valor final. */
export function Counter({ value, display, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(0);
  const animating = Boolean(value) && !reduce;
  const revealed = inView || Boolean(reduce);

  useEffect(() => {
    if (!inView || !animating) return;
    const c = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => c.stop();
  }, [inView, value, animating]);

  const text = value ? fmt.format(animating ? n : value) : display;

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">
        {value ? fmt.format(value) : display}
        {suffix}
      </span>
      <span
        aria-hidden="true"
        className={`inline-block tabular-nums transition-[opacity,transform] duration-700 ease-out-expo ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        {text}
        {suffix}
      </span>
    </span>
  );
}
