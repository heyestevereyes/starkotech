"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article";
  amount?: number;
};

/** Fade in + translateY al entrar en viewport. Respeta prefers-reduced-motion. Toda entrada del sitio pasa por aquí. */
export function AnimatedSection({ children, className, delay = 0, y = 28, as = "div", amount = 0.2 }: Props) {
  const reduce = useReducedMotion();
  const Comp = as === "li" ? m.li : as === "article" ? m.article : m.div;
  return (
    <Comp
      className={className}
      initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
