import { formatMXN, type Product } from "@/content/products";
import { site } from "@/content/site";

/** Precio en mono: "$1,290 MXN" (con "Desde" cuando aplica). */
export function Price({
  product,
  className = "",
  valueClassName = "text-[1.375rem]",
  tone = "light",
}: {
  product: Pick<Product, "price" | "priceLabel">;
  className?: string;
  valueClassName?: string;
  /** light: sobre paper o mist. dark: sobre ink o navy (el valor va en signal). */
  tone?: "light" | "dark";
}) {
  return (
    <p className={`flex flex-wrap items-baseline gap-x-1.5 ${className}`}>
      {product.priceLabel ? (
        <span className={`text-[0.8125rem] ${tone === "dark" ? "text-mist/70" : "text-graphite"}`}>{product.priceLabel}</span>
      ) : null}
      <span className={`font-mono font-medium tracking-[-0.03em] ${valueClassName} ${tone === "dark" ? "text-signal" : "text-ink"}`}>
        {formatMXN(product.price)}
      </span>
      <span className={`font-mono text-[0.75rem] ${tone === "dark" ? "text-mist/70" : "text-graphite"}`}>{site.shop.card.currency}</span>
    </p>
  );
}

/** "Instalación desde $650" o la nota cuando se cotiza en sitio. */
export function installText(product: Pick<Product, "installFrom" | "installNote">): string | null {
  if (typeof product.installFrom === "number") return site.shop.card.installFrom.replace("{price}", formatMXN(product.installFrom));
  return product.installNote ?? null;
}
