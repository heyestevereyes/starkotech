"use client";

import { useEffect } from "react";
import { announcePreset, parseQuoteHash, QUOTE_ID } from "@/lib/quote-preset";

/**
 * Maneja los anclas del sitio, incluidos los que llevan preselección del cotizador
 * (`#cotizar?tipo=visita&servicio=acceso-vehicular`):
 * - Al entrar con ancla en la URL, asegura que la vista llegue a la sección una vez hidratada.
 * - Al hacer clic en un enlace `#cotizar?...`, anuncia la preselección y se desplaza aunque el hash no cambie.
 */
export function HashScroll() {
  useEffect(() => {
    const goTo = (id: string, behavior: ScrollBehavior) =>
      document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });

    const applyHash = (behavior: ScrollBehavior) => {
      if (!window.location.hash) return;
      const { id, preset } = parseQuoteHash(window.location.hash);
      if (id === QUOTE_ID) announcePreset(preset);
      goTo(id, behavior);
    };

    const raf = requestAnimationFrame(() => applyHash("instant"));
    // segundo intento por si cargó contenido diferido (fuentes, formulario)
    const t = window.setTimeout(() => applyHash("instant"), 400);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      const href = a?.getAttribute("href");
      if (!a || !href || href === "#") return;
      const { id, preset } = parseQuoteHash(href);
      if (!document.getElementById(id)) return;
      e.preventDefault();
      if (id === QUOTE_ID) announcePreset(preset);
      history.pushState(null, "", href);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      goTo(id, reduce ? "instant" : "smooth");
      // mover el foco a la sección para teclado y lectores de pantalla
      const target = document.getElementById(id);
      if (target) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    };

    const onPop = () => applyHash("smooth");
    document.addEventListener("click", onClick);
    window.addEventListener("popstate", onPop);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
    };
  }, []);
  return null;
}
