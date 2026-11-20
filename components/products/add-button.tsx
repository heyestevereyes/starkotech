"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/content/products";
import { site } from "@/content/site";
import { useQuoteList } from "@/lib/quote-list";

const c = site.shop.card;
const fill = (t: string, name: string) => t.replace("{name}", name);

/**
 * Botón "Agregar a cotización". Al agregar, el + se vuelve check con un pequeño resorte y
 * vuelve a su estado a los 1.8 s. variant "circle" (cards) o "pill" (banner y detalle).
 */
export function AddToQuoteButton({
  product,
  variant = "circle",
  qty = 1,
  install,
  label = c.add,
  doneLabel = c.added,
  tone = "light",
  className = "",
  onAdded,
}: {
  product: Product;
  variant?: "circle" | "pill";
  qty?: number;
  install?: boolean;
  label?: string;
  doneLabel?: string;
  /** Sobre qué fondo está el botón (afecta el estilo del círculo) */
  tone?: "light" | "dark";
  className?: string;
  onAdded?: () => void;
}) {
  const { add } = useQuoteList();
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const timer = useRef<number>(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = () => {
    add(product.slug, { qty, install });
    setDone(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setDone(false), 1800);
    onAdded?.();
  };

  const icon = (
    <AnimatePresence mode="wait" initial={false}>
      <m.span
        key={done ? "check" : "plus"}
        initial={reduce ? false : { scale: 0.4, rotate: done ? -60 : 60, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        exit={reduce ? undefined : { scale: 0.4, opacity: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 20, mass: 0.6 }}
        className="flex"
      >
        {done ? <Check className="h-5 w-5" strokeWidth={2.25} aria-hidden /> : <Plus className="h-5 w-5" strokeWidth={1.75} aria-hidden />}
      </m.span>
    </AnimatePresence>
  );

  const status = (
    <span role="status" className="sr-only">
      {done ? fill(c.addedAria, product.name) : ""}
    </span>
  );

  if (variant === "pill") {
    return (
      <>
        <button
          type="button"
          onClick={onClick}
          className={`group inline-flex h-14 items-center justify-center gap-2.5 rounded-full px-7 text-[1.0625rem] font-medium tracking-[-0.01em] transition-[background-color,transform] duration-300 ease-out-expo active:scale-[0.98] ${
            done ? "bg-signal-soft text-ink" : "bg-signal text-ink hover:bg-signal-soft active:bg-signal"
          } ${className}`}
        >
          {icon}
          <span>{done ? doneLabel : label}</span>
        </button>
        {status}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={fill(c.addAria, product.name)}
        title={label}
        className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,transform] duration-300 ease-out-expo active:scale-90 ${
          done
            ? "border-cobalt bg-cobalt text-paper"
            : tone === "dark"
              ? "border-mist/30 bg-transparent text-mist hover:border-signal hover:text-signal"
              : "border-ink/25 bg-transparent text-ink hover:border-ink hover:bg-ink hover:text-signal"
        } ${className}`}
      >
        {icon}
      </button>
      {status}
    </>
  );
}
