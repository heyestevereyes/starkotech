"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowRight, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { WhatsAppIcon } from "@/components/ui/icons";
import { trackCta } from "@/lib/analytics";
import { whatsappUrl } from "@/lib/contact";
import { useQuoteList } from "@/lib/quote-list";

const L = site.shop.list;

/** Contador de la lista de cotización: rebota cada vez que se agrega algo. */
function Count({ n, bump, className = "" }: { n: number; bump: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <m.span
      key={bump}
      initial={reduce || bump === 0 ? false : { scale: 1.5 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 14 }}
      className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 font-mono text-[0.75rem] font-semibold tabular-nums ${className}`}
    >
      {n}
    </m.span>
  );
}

/**
 * Barra fija inferior con "Cotizar" y WhatsApp en móvil (después del hero) + botones flotantes en tablet y escritorio.
 * Con productos en la lista de cotización suma "Mi cotización" a la barra móvil (sin encimarse con WhatsApp)
 * y, desde md, un botón sobre el de WhatsApp.
 * homePrefix: "/" cuando vive fuera del home (los anclas apuntan a la página principal).
 */
export function Floating({ homePrefix = "" }: { homePrefix?: string }) {
  const [pastHero, setPastHero] = useState(false);
  const [atQuote, setAtQuote] = useState(false);
  const reduce = useReducedMotion();
  const { count, bump, openList } = useQuoteList();

  useEffect(() => {
    const hero = document.getElementById(site.hero.id);
    const quote = document.getElementById(site.quote.id);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.target === hero) setPastHero(!e.isIntersecting);
          if (e.target === quote) setAtQuote(e.isIntersecting);
        });
      },
      { threshold: 0 },
    );
    if (hero) io.observe(hero);
    if (quote) io.observe(quote);
    return () => io.disconnect();
  }, []);

  const hasList = count > 0;
  // La barra móvil aparece pasado el hero; con productos en la lista también en páginas sin hero (catálogo y detalle)
  const showBar = (pastHero && !atQuote) || hasList;

  return (
    <div data-floating>
      <AnimatePresence>
        {showBar ? (
          <m.div
            key="bar"
            initial={reduce ? { opacity: 0 } : { y: "110%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "110%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-cobalt/50 bg-ink/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl md:hidden"
          >
            <div className="flex items-center gap-3">
              {hasList ? (
                <>
                  <button
                    type="button"
                    onClick={openList}
                    aria-label={L.openAria.replace("{n}", String(count))}
                    className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2.5 rounded-full bg-signal px-4 font-medium text-ink transition-colors duration-300 hover:bg-signal-soft active:bg-signal"
                  >
                    <ClipboardList className="h-[1.125rem] w-[1.125rem] shrink-0" strokeWidth={1.75} aria-hidden />
                    <span className="truncate">{L.open}</span>
                    <Count n={count} bump={bump} className="bg-ink text-signal" />
                  </button>
                  <a
                    href={`${homePrefix}#cotizar`}
                    onClick={() => trackCta("barra_movil", site.nav.mobileCta)}
                    className="inline-flex h-12 items-center justify-center rounded-full border border-mist/25 px-5 font-medium text-mist transition-colors duration-300 hover:border-signal hover:text-signal active:bg-mist/10"
                  >
                    {site.nav.mobileCta}
                  </a>
                </>
              ) : (
                <a
                  href={`${homePrefix}#cotizar`}
                  onClick={() => trackCta("barra_movil", site.nav.mobileCta)}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-signal font-medium text-ink transition-colors duration-300 hover:bg-signal-soft active:bg-signal"
                >
                  {site.nav.mobileCta}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              )}
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={site.whatsappFab}
                onClick={() => trackCta("barra_movil_whatsapp", "WhatsApp")}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-mist/25 text-mist transition-colors duration-300 hover:border-signal hover:text-signal active:bg-mist/10"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>

      {/* Tablet y escritorio: "Mi cotización" sobre el botón de WhatsApp, solo con productos en la lista */}
      <AnimatePresence>
        {hasList ? (
          <m.button
            key="list-fab"
            type="button"
            onClick={openList}
            aria-label={L.openAria.replace("{n}", String(count))}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[5.75rem] right-6 z-40 hidden h-14 items-center gap-3 rounded-full bg-signal pl-5 pr-3 font-medium text-ink shadow-[0_14px_30px_-8px_rgb(0_0_0/0.45)] transition-colors duration-300 hover:bg-signal-soft active:bg-signal md:inline-flex"
          >
            <ClipboardList className="h-5 w-5" strokeWidth={1.75} aria-hidden />
            {L.open}
            <Count n={count} bump={bump} className="h-8 min-w-8 bg-ink text-signal" />
          </m.button>
        ) : null}
      </AnimatePresence>

      {/* Botón flotante de WhatsApp (tablet y escritorio; en móvil vive en la barra inferior) */}
      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={site.whatsappFab}
        onClick={() => trackCta("whatsapp_flotante", "WhatsApp")}
        className="group fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-paper shadow-[0_14px_30px_-8px_rgb(0_0_0/0.45)] transition-transform duration-300 ease-out-expo hover:scale-105 active:scale-95 md:flex"
      >
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-whatsapp/40 [animation-duration:2.6s]" aria-hidden />
        <WhatsAppIcon className="relative h-7 w-7" />
        <span className="pointer-events-none absolute right-[calc(100%+0.75rem)] whitespace-nowrap rounded-full bg-ink px-3.5 py-2 text-[0.8125rem] font-medium text-mist opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          {site.whatsappFab}
        </span>
      </a>
    </div>
  );
}
