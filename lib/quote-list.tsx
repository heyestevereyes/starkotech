"use client";

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { productBySlug } from "@/content/products";
import { track } from "@/lib/analytics";
import { clampQty, resolveLines, sanitizeItems, totalsOf, type QuoteItem, type QuoteLine, type QuoteTotals } from "@/lib/quote-math";

const STORE = "starko_quote_list_v1";
const EMPTY = "[]";

/* ---------- Almacén externo: localStorage con respaldo en memoria ---------- */
let memory = EMPTY;
const listeners = new Set<() => void>();

function readRaw(): string {
  try {
    return window.localStorage.getItem(STORE) ?? EMPTY;
  } catch {
    return memory; // sin almacenamiento: la lista sigue viva en memoria
  }
}

function writeRaw(value: string) {
  memory = value;
  try {
    window.localStorage.setItem(STORE, value);
  } catch {
    /* sin almacenamiento: queda en memoria */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORE) cb(); // cambios desde otra pestaña
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

const parse = (raw: string): QuoteItem[] => {
  try {
    return sanitizeItems(JSON.parse(raw));
  } catch {
    return [];
  }
};

const subscribeNever = () => () => {};

type QuoteListContext = {
  items: QuoteItem[];
  lines: QuoteLine[];
  totals: QuoteTotals;
  /** Piezas en total (suma de cantidades) */
  count: number;
  /** false durante la hidratación: evita diferencias entre servidor y cliente */
  ready: boolean;
  /** Se incrementa en cada alta: los botones lo usan para animar el contador */
  bump: number;
  isOpen: boolean;
  openList: () => void;
  closeList: () => void;
  has: (slug: string) => boolean;
  add: (slug: string, opts?: { qty?: number; install?: boolean }) => void;
  setQty: (slug: string, qty: number) => void;
  setInstall: (slug: string, install: boolean) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const Ctx = createContext<QuoteListContext | null>(null);

/** Aplica un cambio a la lista guardada leyendo siempre el valor más reciente (sin cierres obsoletos). */
const update = (fn: (prev: QuoteItem[]) => QuoteItem[]) => writeRaw(JSON.stringify(fn(parse(readRaw()))));

/**
 * Lista de cotización: estado cliente persistido en localStorage (con try/catch: si falla, sigue en memoria).
 * Solo guarda slug, cantidad e instalación; precios y nombres se resuelven siempre contra content/products.ts,
 * así que cambiar el catálogo (o conectarlo a Shopify) no deja datos viejos en el navegador.
 */
export function QuoteListProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, readRaw, () => EMPTY);
  const ready = useSyncExternalStore(subscribeNever, () => true, () => false);
  const [bump, setBump] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const items = useMemo(() => parse(raw), [raw]);
  const lines = useMemo(() => resolveLines(items), [items]);
  const totals = useMemo(() => totalsOf(lines), [lines]);

  const add = useCallback<QuoteListContext["add"]>((slug, opts = {}) => {
    const product = productBySlug(slug);
    if (!product) return;
    const qty = clampQty(opts.qty ?? 1);
    update((prev) => {
      const found = prev.find((i) => i.slug === slug);
      if (found) {
        return prev.map((i) => (i.slug === slug ? { ...i, qty: clampQty(i.qty + qty), install: opts.install ?? i.install } : i));
      }
      return [...prev, { slug, qty, install: opts.install ?? false }];
    });
    setBump((b) => b + 1);
    track("add_to_quote", {
      currency: "MXN",
      value: product.price * qty,
      items: [{ item_id: product.sku ?? product.slug, item_name: product.name, item_category: product.category, price: product.price, quantity: qty }],
      install: opts.install ?? false,
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => update((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty: clampQty(qty) } : i))), []);
  const setInstall = useCallback((slug: string, install: boolean) => update((prev) => prev.map((i) => (i.slug === slug ? { ...i, install } : i))), []);
  const remove = useCallback((slug: string) => update((prev) => prev.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => writeRaw(EMPTY), []);

  const openList = useCallback(() => {
    setIsOpen(true);
    track("begin_quote", { source: "productos" });
  }, []);
  const closeList = useCallback(() => setIsOpen(false), []);
  const has = useCallback((slug: string) => items.some((i) => i.slug === slug), [items]);

  const value = useMemo<QuoteListContext>(
    () => ({ items, lines, totals, count: totals.units, ready, bump, isOpen, openList, closeList, has, add, setQty, setInstall, remove, clear }),
    [items, lines, totals, ready, bump, isOpen, openList, closeList, has, add, setQty, setInstall, remove, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useQuoteList(): QuoteListContext {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useQuoteList debe usarse dentro de QuoteListProvider");
  return ctx;
}
