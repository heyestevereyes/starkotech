import { productBySlug, formatMXN, type Product } from "@/content/products";
import { site } from "@/content/site";

/** Lo único que se guarda de cada renglón: el resto se resuelve contra el catálogo. */
export type QuoteItem = { slug: string; qty: number; install: boolean };

export type QuoteLine = {
  product: Product;
  qty: number;
  install: boolean;
  /** price × qty */
  equipment: number;
  /** installFrom × qty si lleva instalación y tiene monto; 0 en otro caso */
  installEstimate: number;
  /** Lleva instalación pero el monto se define en sitio (por ejemplo, según metros) */
  installTbd: boolean;
};

export type QuoteTotals = { equipment: number; install: number; units: number; installTbd: boolean };

export const MAX_QTY = 99;
export const clampQty = (n: number) => Math.min(MAX_QTY, Math.max(1, Math.round(Number.isFinite(n) ? n : 1)));

/** Resuelve la lista contra el catálogo (descarta slugs que ya no existen). */
export function resolveLines(items: QuoteItem[]): QuoteLine[] {
  const lines: QuoteLine[] = [];
  for (const it of items) {
    const product = productBySlug(it.slug);
    if (!product) continue;
    const qty = clampQty(it.qty);
    const hasAmount = typeof product.installFrom === "number";
    lines.push({
      product,
      qty,
      install: it.install,
      equipment: product.price * qty,
      installEstimate: it.install && hasAmount ? (product.installFrom as number) * qty : 0,
      installTbd: it.install && !hasAmount,
    });
  }
  return lines;
}

export function totalsOf(lines: QuoteLine[]): QuoteTotals {
  return lines.reduce<QuoteTotals>(
    (t, l) => ({
      equipment: t.equipment + l.equipment,
      install: t.install + l.installEstimate,
      units: t.units + l.qty,
      installTbd: t.installTbd || l.installTbd,
    }),
    { equipment: 0, install: 0, units: 0, installTbd: false },
  );
}

/** Limpia lo que venga de localStorage u otra fuente no confiable. */
export function sanitizeItems(raw: unknown): QuoteItem[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: QuoteItem[] = [];
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const { slug, qty, install } = r as Record<string, unknown>;
    if (typeof slug !== "string" || seen.has(slug) || !productBySlug(slug)) continue;
    seen.add(slug);
    out.push({ slug, qty: clampQty(Number(qty)), install: install === true });
  }
  return out;
}

const L = site.shop.list;

/** Mensaje de WhatsApp con la lista, cantidades, instalación y totales. */
export function buildWhatsAppText(lines: QuoteLine[]): string {
  const t = totalsOf(lines);
  const rows = lines.map((l, i) => {
    const inst = l.install ? ` (${L.whatsappInstall})` : "";
    return `${i + 1}. ${l.product.name} × ${l.qty}${inst}\n   ${formatMXN(l.product.price)} ${site.shop.card.currency} ${L.each}`;
  });
  const parts = [
    L.whatsappIntro,
    "",
    ...rows,
    "",
    `${L.whatsappEquipment}: ${formatMXN(t.equipment)} ${site.shop.card.currency}`,
  ];
  if (t.install > 0 || t.installTbd) {
    parts.push(
      `${L.whatsappInstallTotal}: ${t.install > 0 ? `${formatMXN(t.install)} ${site.shop.card.currency}` : L.installTbd}${
        t.install > 0 && t.installTbd ? ` + ${L.installTbd.toLowerCase()}` : ""
      }`,
    );
  }
  parts.push("", L.whatsappNote);
  return parts.join("\n");
}
