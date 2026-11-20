"use client";

import Image from "next/image";
import { Check, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Service } from "@/content/services";
import { site } from "@/content/site";
import { Icon } from "@/components/ui/icons";
import { trackCta } from "@/lib/analytics";

const CLOSE_MS = 200;

/**
 * Drawer del servicio sobre <dialog> nativo: foco atrapado, Esc y fondo inerte sin código extra.
 * En móvil es una hoja inferior; desde tablet, un panel lateral.
 */
export function ServiceDrawer({ service, onClose }: { service: Service; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<number>(0);
  const skipRestore = useRef(false);
  const [closing, setClosing] = useState(false);
  const d = site.services.drawer;

  useEffect(() => {
    const el = dialog.current;
    // El drawer se desmonta al cerrar, así que el foco se devuelve a mano a la card que lo abrió.
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (el && !el.open) el.showModal();
    return () => {
      window.clearTimeout(timer.current);
      if (el?.open) el.close();
      if (!skipRestore.current) opener?.focus({ preventScroll: true });
    };
  }, []);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    timer.current = window.setTimeout(onClose, CLOSE_MS);
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby="servicio-titulo"
      data-closing={closing}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      className="drawer on-light fixed inset-0 m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-ink backdrop:bg-ink/75 backdrop:backdrop-blur-sm"
    >
      <div
        className="flex h-full items-end justify-center md:items-stretch md:justify-end"
        onClick={(e) => {
          if (e.target === e.currentTarget) requestClose();
        }}
      >
        <div className="drawer-panel relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[var(--radius-card-lg)] bg-paper shadow-[var(--shadow-deep)] md:max-h-none md:h-full md:max-w-[34rem] md:rounded-none md:rounded-l-[var(--radius-card-lg)]">
          <button
            type="button"
            onClick={requestClose}
            aria-label={d.close}
            className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-ink text-mist transition-[transform,background-color] duration-300 ease-out-expo hover:scale-105 hover:bg-navy active:scale-95"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>

          <div className="flex-1 overflow-y-auto overscroll-contain p-6 pb-4 pt-8 sm:p-8 sm:pb-4">
            {service.image ? (
              <div className="relative -mx-6 -mt-8 mb-8 aspect-[16/8] overflow-hidden bg-navy sm:-mx-8 sm:-mt-8">
                <Image src={service.image} alt={service.imageAlt ?? ""} fill sizes="(min-width: 768px) 34rem, 100vw" quality={70} className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,var(--color-paper)_100%)]" />
              </div>
            ) : null}
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-signal">
              <Icon name={service.icon} className="h-7 w-7" />
            </span>
            <h2
              id="servicio-titulo"
              className="mt-6 text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] font-semibold leading-[1.05] tracking-[var(--tracking-tight)]"
            >
              {service.name}
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-graphite">{service.intro}</p>

            <p className="eyebrow mt-9 text-cobalt">{d.groupsLabel}</p>
            <div className="mt-4 grid gap-7">
              {service.groups.map((g, gi) => (
                <section key={gi} aria-label={g.title}>
                  {g.title ? <h3 className="text-[1.0625rem] font-semibold tracking-[-0.01em]">{g.title}</h3> : null}
                  <ul className="mt-3 grid gap-2.5">
                    {g.items.map((it) => (
                      <li key={it} className="flex items-start gap-3 text-[0.9688rem] leading-snug text-ink">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ink text-signal">
                          <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>

            {service.note ? (
              <p className="mt-8 rounded-2xl border border-cobalt/20 bg-signal-soft px-5 py-4 text-[0.9688rem] leading-relaxed text-ink">
                {service.note}
              </p>
            ) : null}
          </div>

          <div className="border-t border-ink/10 bg-paper p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
            <a
              href={`#cotizar?servicio=${service.slug}`}
              onClick={() => {
                trackCta("drawer_servicio", `${d.cta}: ${service.slug}`);
                // cierra sin animación para que el scroll al cotizador no encuentre el fondo inerte;
                // el foco lo toma el cotizador, no la card
                skipRestore.current = true;
                dialog.current?.close();
                onClose();
              }}
              className="group inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-signal font-medium text-ink transition-colors duration-300 ease-out-expo hover:bg-signal-soft active:bg-signal"
            >
              {d.cta}
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
}
