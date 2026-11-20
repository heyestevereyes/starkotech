"use client";

import { ChevronDown, Search, SearchX, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { productCategories, products, type Product } from "@/content/products";
import { site } from "@/content/site";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Icon } from "@/components/ui/icons";
import { trackCta } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/contact";
import { ProductCard } from "./product-card";

const C = site.shop.catalog;

type Sort = (typeof C.sort)[number]["value"];
const sortValues = C.sort.map((s) => s.value) as Sort[];
const ALL = "todos";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function applyFilters(category: string, sort: Sort, q: string): Product[] {
  const needle = norm(q.trim());
  const list = products.filter(
    (p) => (category === ALL || p.category === category) && (!needle || norm(`${p.name} ${p.short}`).includes(needle)),
  );
  if (sort === "precio-asc") return [...list].sort((a, b) => a.price - b.price);
  if (sort === "precio-desc") return [...list].sort((a, b) => b.price - a.price);
  // Destacados: primero los marcados como featured, el resto en el orden del catálogo
  return [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
}

type ViewProps = {
  category: string;
  sort: Sort;
  q: string;
  onCategory: (c: string) => void;
  onSort: (s: Sort) => void;
  onQuery: (q: string) => void;
  onReset: () => void;
};

function CatalogView({ category, sort, q, onCategory, onSort, onQuery, onReset }: ViewProps) {
  const list = useMemo(() => applyFilters(category, sort, q), [category, sort, q]);
  const countText = list.length === 1 ? C.countOne : C.count.replace("{n}", String(list.length));
  const chip =
    "inline-flex h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-[0.9375rem] font-medium transition-[background-color,border-color,color,transform] duration-300 ease-out-expo active:scale-[0.97]";

  return (
    <div>
      {/* Barra de filtros: queda fija bajo el navbar */}
      <div className="on-light sticky top-[4.5rem] z-30 border-b border-ink/10 bg-mist/90 backdrop-blur-xl">
        <div className="container-site flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div
            role="group"
            aria-label={C.categoriesLabel}
            className="no-scrollbar -mx-[clamp(1.25rem,0.6rem+3vw,3rem)] flex gap-2 overflow-x-auto px-[clamp(1.25rem,0.6rem+3vw,3rem)] py-0.5 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 lg:flex-1"
          >
            {[{ slug: ALL, name: C.all, icon: "" }, ...productCategories].map((c) => {
              const active = category === c.slug;
              return (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onCategory(c.slug)}
                  className={`${chip} ${
                    active ? "border-ink bg-ink text-mist" : "border-ink/20 bg-paper text-ink hover:border-ink/55 active:bg-ink/5"
                  }`}
                >
                  {c.icon ? <Icon name={c.icon} className={`h-4 w-4 lg:hidden ${active ? "text-signal" : "text-cobalt"}`} /> : null}
                  {c.name}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 lg:shrink-0">
            <div className="relative min-w-0 flex-1 lg:w-64 lg:flex-none">
              <label htmlFor="catalogo-buscar" className="sr-only">
                {C.searchLabel}
              </label>
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite" strokeWidth={1.75} aria-hidden />
              <input
                id="catalogo-buscar"
                type="search"
                value={q}
                onChange={(e) => onQuery(e.target.value)}
                placeholder={C.searchPlaceholder}
                autoComplete="off"
                className="h-11 w-full rounded-full border border-ink/20 bg-paper pl-10 pr-10 text-[0.9375rem] text-ink transition-[border-color,box-shadow] duration-200 ease-out-expo placeholder:text-graphite/80 hover:border-ink/45 focus:border-cobalt focus:outline-none focus:ring-4 focus:ring-cobalt/25 [&::-webkit-search-cancel-button]:hidden"
              />
              {q ? (
                <button
                  type="button"
                  onClick={() => onQuery("")}
                  aria-label={C.clearSearch}
                  className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-graphite transition-colors duration-200 hover:bg-ink/5 hover:text-ink"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                </button>
              ) : null}
            </div>

            <div className="relative shrink-0">
              <label htmlFor="catalogo-orden" className="sr-only">
                {C.sortLabel}
              </label>
              <select
                id="catalogo-orden"
                value={sort}
                onChange={(e) => onSort(e.target.value as Sort)}
                className="h-11 w-[9.25rem] appearance-none rounded-full border border-ink/20 bg-paper pl-4 pr-9 text-[0.9375rem] text-ink transition-[border-color,box-shadow] duration-200 ease-out-expo hover:border-ink/45 focus:border-cobalt focus:outline-none focus:ring-4 focus:ring-cobalt/25"
              >
                {C.sort.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite" strokeWidth={1.75} aria-hidden />
            </div>
          </div>
        </div>
      </div>

      <div className="container-site on-light pb-6 pt-8 md:pt-10">
        <p role="status" aria-live="polite" className="font-mono text-[0.8125rem] uppercase tracking-[0.1em] text-graphite">
          <span className="sr-only">{C.results}: </span>
          {countText}
        </p>

        {list.length ? (
          <ul className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {list.map((p, i) => (
              <AnimatedSection as="li" key={p.slug} y={18} delay={(i % 4) * 0.05}>
                <ProductCard product={p} sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw" />
              </AnimatedSection>
            ))}
          </ul>
        ) : (
          <div className="mt-6 flex flex-col items-center rounded-[var(--radius-card-lg)] border border-ink/10 bg-paper px-6 py-14 text-center shadow-[var(--shadow-soft)]">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-signal">
              <SearchX className="h-7 w-7" strokeWidth={1.5} aria-hidden />
            </span>
            <p className="mt-5 max-w-[26rem] text-[1.25rem] font-semibold leading-snug tracking-[-0.02em]">{C.empty.title}</p>
            <p className="mt-2 max-w-[28rem] text-[1rem] leading-relaxed text-graphite">{C.empty.text}</p>
            <div className="mt-7 flex flex-col gap-3 min-[480px]:flex-row">
              <a
                href={whatsappUrl(C.empty.message)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCta("catalogo_vacio", C.empty.cta)}
                className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 font-medium text-mist transition-colors duration-300 hover:bg-navy active:bg-ink"
              >
                {C.empty.cta}
              </a>
              <button
                type="button"
                onClick={onReset}
                className="inline-flex h-12 items-center justify-center rounded-full border border-ink/30 px-6 font-medium text-ink transition-colors duration-300 hover:border-ink hover:bg-ink/[0.05] active:bg-ink/10"
              >
                {C.empty.reset}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** Filtros sincronizados con la URL: ?categoria=chapas&orden=precio-asc&q=camara */
function CatalogLive() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawCategory = params.get("categoria");
  const category = rawCategory && productCategories.some((c) => c.slug === rawCategory) ? rawCategory : ALL;
  const rawSort = params.get("orden") as Sort | null;
  const sort: Sort = rawSort && sortValues.includes(rawSort) ? rawSort : "destacados";
  const qUrl = params.get("q") ?? "";

  const [q, setQ] = useState(qUrl);
  const pushed = useRef(qUrl);
  // Última URL pedida: router.replace tarda en reflejarse, y un cambio rápido (categoría y enseguida búsqueda)
  // no debe partir de parámetros viejos.
  const intent = useRef(new URLSearchParams(params.toString()));
  const paramsKey = params.toString();
  useEffect(() => {
    intent.current = new URLSearchParams(paramsKey);
  }, [paramsKey]);

  const push = (changes: Record<string, string | null>) => {
    const sp = new URLSearchParams(intent.current.toString());
    for (const [k, v] of Object.entries(changes)) {
      if (v) sp.set(k, v);
      else sp.delete(k);
    }
    intent.current = sp;
    const qs = sp.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Atrás y adelante del navegador: la URL manda sobre lo escrito
  useEffect(() => {
    if (qUrl !== pushed.current) {
      pushed.current = qUrl;
      setQ(qUrl);
    }
  }, [qUrl]);

  // Búsqueda: el filtrado es inmediato y la URL se actualiza al dejar de escribir
  useEffect(() => {
    if (q === pushed.current) return;
    const t = window.setTimeout(() => {
      pushed.current = q;
      push({ q: q.trim() || null });
    }, 350);
    return () => window.clearTimeout(t);
    // push depende de params, que cambia al actualizar la URL: solo reaccionamos a lo escrito
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <CatalogView
      category={category}
      sort={sort}
      q={q}
      onCategory={(c) => push({ categoria: c === ALL ? null : c })}
      onSort={(s) => push({ orden: s === "destacados" ? null : s })}
      onQuery={setQ}
      onReset={() => {
        setQ("");
        pushed.current = "";
        intent.current = new URLSearchParams();
        router.replace(pathname, { scroll: false });
      }}
    />
  );
}

const noop = () => {};

/** Catálogo con filtros. Mientras carga la URL muestra todos los productos, así el HTML inicial ya trae el grid completo. */
export function Catalog() {
  return (
    <Suspense
      fallback={<CatalogView category={ALL} sort="destacados" q="" onCategory={noop} onSort={noop} onQuery={noop} onReset={noop} />}
    >
      <CatalogLive />
    </Suspense>
  );
}
