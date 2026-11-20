"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { PRESET_EVENT, QUOTE_ID } from "@/lib/quote-preset";

/** Esqueleto con la misma silueta que el formulario (evita saltos de layout). */
function FormSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={site.quote.loading}
      className="rounded-[var(--radius-card-lg)] bg-paper p-5 shadow-[var(--shadow-deep)] sm:p-8 lg:p-10"
    >
      <div className="h-3 w-24 rounded-full bg-ink/10" />
      <div className="mt-4 h-1.5 rounded-full bg-ink/10" />
      <div className="mt-10 h-7 w-2/3 rounded-full bg-ink/10" />
      <div className="mt-8 h-24 rounded-2xl bg-ink/[0.06]" />
      <div className="mt-4 h-24 rounded-2xl bg-ink/[0.06]" />
      <div className="mt-10 flex justify-end">
        <div className="h-14 w-40 rounded-full bg-ink/15" />
      </div>
    </div>
  );
}

const QuoteForm = dynamic(() => import("./quote-form").then((m) => m.QuoteForm), {
  ssr: false,
  loading: FormSkeleton,
});

/**
 * Carga el formulario (react-hook-form + zod) solo cuando el usuario se acerca
 * a la sección, llega por #cotizar o pulsa un CTA con preselección. Mantiene ligero el JS inicial.
 */
export function QuoteFormLazy() {
  const ref = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onHash = () => {
      if (window.location.hash.startsWith(`#${QUOTE_ID}`)) setLoad(true);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    window.addEventListener(PRESET_EVENT, () => setLoad(true));
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "1200px 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return <div ref={ref}>{load ? <QuoteForm /> : <FormSkeleton />}</div>;
}
