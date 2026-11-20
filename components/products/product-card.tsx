import Image from "next/image";
import Link from "next/link";
import { categoryBySlug, type Product } from "@/content/products";
import { site } from "@/content/site";
import { AddToQuoteButton } from "./add-button";
import { installText, Price } from "./price";

/**
 * Card de producto reutilizable (home y catálogo). Toda la card enlaza al detalle con un enlace
 * extendido sobre el nombre; el botón + queda por encima y no navega.
 * `sizes` lo define quien la usa según su grid.
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 80vw",
}: {
  product: Product;
  sizes?: string;
}) {
  const category = categoryBySlug(product.category);
  const install = installText(product);
  return (
    <article className="on-light group relative flex h-full flex-col rounded-[24px] border border-ink/[0.08] bg-paper p-2 text-ink shadow-[var(--shadow-soft)] transition-[transform,box-shadow,border-color] duration-500 ease-out-expo hover:-translate-y-1 hover:border-cobalt/40 hover:shadow-[var(--shadow-lift)] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-cobalt motion-reduce:hover:translate-y-0">
      <div className="relative aspect-square overflow-hidden rounded-[18px] bg-mist">
        <Image
          src={product.image}
          alt={product.imageAlt}
          fill
          sizes={sizes}
          quality={75}
          className="object-contain p-5 transition-transform duration-700 ease-out-expo group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1.5 font-mono text-[0.6875rem] font-medium uppercase leading-none tracking-[0.08em] text-signal">
            {product.badge}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <p className="font-mono text-[0.6875rem] uppercase leading-tight tracking-[0.1em] text-cobalt">{category?.name}</p>
        <h3 className="mt-2 line-clamp-2 min-h-[2.6em] text-[1.0625rem] font-semibold leading-[1.3] tracking-[-0.015em]">
          <Link
            href={`/productos/${product.slug}`}
            className="outline-none after:absolute after:inset-0 after:z-0 after:rounded-[24px] after:content-['']"
          >
            {product.name}
          </Link>
        </h3>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={site.shop.card.chipsLabel}>
          {product.chips.map((chip) => (
            <li key={chip} className="rounded-full bg-signal-soft px-2.5 py-1 font-mono text-[0.6875rem] leading-none tracking-[0.02em] text-cobalt">
              {chip}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div className="min-w-0">
            <Price product={product} />
            {install ? <p className="mt-1 text-[0.8125rem] leading-snug text-graphite">{install}</p> : null}
          </div>
          <AddToQuoteButton product={product} />
        </div>
      </div>
    </article>
  );
}
