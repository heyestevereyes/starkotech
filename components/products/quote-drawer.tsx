"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Check, ClipboardList, Loader2, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { formatMXN } from "@/content/products";
import { site } from "@/content/site";
import { WhatsAppIcon } from "@/components/ui/icons";
import { track } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import { whatsappUrl } from "@/lib/contact";
import { productLeadSchema, type ProductLead, type ProductLeadInput } from "@/lib/lead-schema";
import { useQuoteList } from "@/lib/quote-list";
import { buildWhatsAppText } from "@/lib/quote-math";
import { InstallSwitch, QuantityStepper } from "./quantity-stepper";
import { installText } from "./price";

const L = site.shop.list;
const F = L.fields;
const CLOSE_MS = 200;
const fill = (t: string, name: string) => t.replace("{name}", name);

const inputBase =
  "on-light w-full rounded-2xl border border-ink/20 bg-mist px-4 text-[1rem] text-ink placeholder:text-graphite/80 transition-[border-color,box-shadow,background-color] duration-200 ease-out-expo hover:border-ink/40 focus:border-cobalt focus:bg-paper focus:outline-none focus:ring-4 focus:ring-cobalt/25 aria-[invalid=true]:border-alert";

type View = "list" | "form" | "done";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-[0.8125rem] font-medium text-alert">
      {message}
    </p>
  );
}

const money = (n: number) => `${formatMXN(n)} ${site.shop.card.currency}`;

/**
 * Drawer de "Mi cotización" sobre <dialog> nativo (mismo patrón que el drawer de servicios):
 * foco atrapado, Esc, fondo inerte. Tres vistas: lista, formulario de solicitud y confirmación.
 */
export default function QuoteDrawer() {
  const { lines, items, totals, count, setQty, setInstall, remove, clear, closeList } = useQuoteList();
  const uid = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const timer = useRef<number>(0);
  const skipRestore = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [closing, setClosing] = useState(false);
  const [view, setView] = useState<View>("list");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [doneName, setDoneName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm<ProductLeadInput, unknown, ProductLead>({
    resolver: zodResolver(productLeadSchema),
    mode: "onTouched",
    defaultValues: { name: "", whatsapp: "", colonia: "", municipio: "", privacy: false as unknown as true },
  });

  useEffect(() => {
    const el = dialog.current;
    // El drawer se desmonta al cerrar: el foco vuelve a mano al botón que lo abrió.
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (el && !el.open) el.showModal();
    return () => {
      window.clearTimeout(timer.current);
      if (el?.open) el.close();
      if (!skipRestore.current) opener?.focus({ preventScroll: true });
    };
  }, []);

  // Al cambiar de vista el foco pasa al encabezado, para teclado y lectores de pantalla
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [view]);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    timer.current = window.setTimeout(closeList, CLOSE_MS);
  };

  /** Navegación a otra página: cierra sin animación y sin devolver el foco al botón. */
  const leave = () => {
    skipRestore.current = true;
    dialog.current?.close();
    closeList();
  };

  const err = (k: keyof ProductLeadInput) => errors[k]?.message as string | undefined;
  const aria = (k: keyof ProductLeadInput) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
  });

  const onSubmit = async (lead: ProductLead, e?: BaseSyntheticEvent) => {
    const form = e?.target instanceof HTMLFormElement ? e.target : null;
    const website = form ? String(new FormData(form).get("website") ?? "") : "";
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "productos",
          lead,
          items: items.map((i) => ({ slug: i.slug, qty: i.qty, install: i.install })),
          meta: { ...readAttribution(), submitted_at_client: new Date().toISOString() },
          website,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !data.ok) throw new Error("lead");
      track("generate_lead", { source: "productos", channel: "formulario", currency: "MXN", value: totals.equipment, units: totals.units, lines: lines.length });
      setDoneName(lead.name.split(" ")[0]);
      setStatus("idle");
      setView("done");
    } catch {
      setStatus("error");
    }
  };

  const waHref = whatsappUrl(buildWhatsAppText(lines));
  const countText = count === 1 ? L.countOne : L.count.replace("{n}", String(count));
  const title = view === "form" ? L.formTitle : L.title;

  return (
    <dialog
      ref={dialog}
      aria-labelledby={`${uid}-title`}
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
        <div className="drawer-panel relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[var(--radius-card-lg)] bg-paper shadow-[var(--shadow-deep)] md:h-full md:max-h-none md:max-w-[34rem] md:rounded-none md:rounded-l-[var(--radius-card-lg)]">
          <div className="flex items-start justify-between gap-4 border-b border-ink/10 px-5 pb-4 pt-5 sm:px-8 sm:pt-7">
            <div className="min-w-0">
              <p className="eyebrow inline-flex items-center gap-2 text-cobalt">
                <ClipboardList className="h-4 w-4" strokeWidth={1.75} aria-hidden />
                {view === "list" && count > 0 ? countText : L.open}
              </p>
              <h2
                id={`${uid}-title`}
                ref={headingRef}
                tabIndex={-1}
                className="mt-2 text-[clamp(1.5rem,1.25rem+1vw,1.875rem)] font-semibold leading-tight tracking-[var(--tracking-tight)] outline-none"
              >
                {view === "done" ? fill(L.success.title, doneName) : title}
              </h2>
            </div>
            <button
              type="button"
              onClick={requestClose}
              aria-label={L.close}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-mist transition-[transform,background-color] duration-300 ease-out-expo hover:scale-105 hover:bg-navy active:scale-95"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>

          {/* ---------- Lista ---------- */}
          {view === "list" ? (
            <>
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-8">
                {lines.length === 0 ? (
                  <div className="py-14 text-center">
                    <p className="mx-auto max-w-[20rem] text-[1rem] leading-relaxed text-graphite">{L.empty}</p>
                    <Link
                      href="/productos"
                      onClick={leave}
                      className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-6 font-medium text-mist transition-colors duration-300 hover:bg-navy active:bg-ink"
                    >
                      {L.emptyCta}
                    </Link>
                  </div>
                ) : (
                  <ul>
                    {lines.map((l) => {
                      const p = l.product;
                      return (
                        <li key={p.slug} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-4 gap-y-3 border-b border-ink/10 py-5 last:border-b-0">
                          <Link
                            href={`/productos/${p.slug}`}
                            onClick={leave}
                            tabIndex={-1}
                            aria-hidden
                            className="relative aspect-square overflow-hidden rounded-xl bg-mist"
                          >
                            <Image src={p.image} alt="" fill sizes="72px" quality={70} className="object-contain p-1.5" />
                          </Link>
                          <div className="min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/productos/${p.slug}`}
                                onClick={leave}
                                className="line-clamp-2 text-[0.9688rem] font-semibold leading-snug tracking-[-0.01em] hover:text-cobalt"
                              >
                                {p.name}
                              </Link>
                              <button
                                type="button"
                                onClick={() => remove(p.slug)}
                                aria-label={fill(L.remove, p.name)}
                                className="-mr-2 -mt-2 grid h-11 w-11 shrink-0 place-items-center rounded-full text-graphite transition-[background-color,color] duration-200 hover:bg-alert-soft hover:text-alert active:bg-alert-soft"
                              >
                                <Trash2 className="h-[1.125rem] w-[1.125rem]" strokeWidth={1.5} aria-hidden />
                              </button>
                            </div>
                            <p className="mt-0.5 font-mono text-[0.8125rem] text-graphite">
                              {money(p.price)} {L.each}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                              <QuantityStepper
                                value={l.qty}
                                onChange={(n) => setQty(p.slug, n)}
                                label={fill(L.quantity, p.name)}
                                decreaseLabel={fill(L.decrease, p.name)}
                                increaseLabel={fill(L.increase, p.name)}
                              />
                              <p className="font-mono text-[1rem] font-medium tracking-[-0.02em]">{money(l.equipment)}</p>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <InstallSwitch
                              checked={l.install}
                              onChange={(v) => setInstall(p.slug, v)}
                              label={L.install}
                              hint={installText(p) ?? L.installTbd}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {lines.length > 0 ? (
                <div className="border-t border-ink/10 bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-8">
                  <dl className="grid gap-1.5 text-[0.9688rem]">
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-graphite">{L.subtotalEquipment}</dt>
                      <dd className="font-mono font-medium">{money(totals.equipment)}</dd>
                    </div>
                    {totals.install > 0 || totals.installTbd ? (
                      <div className="flex items-baseline justify-between gap-4">
                        <dt className="text-graphite">{L.subtotalInstall}</dt>
                        <dd className="text-right font-mono font-medium">
                          {totals.install > 0 ? money(totals.install) : L.installTbd}
                          {totals.install > 0 && totals.installTbd ? <span className="block text-[0.75rem] font-normal text-graphite">+ {L.installTbd.toLowerCase()}</span> : null}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                  <div className="mt-3 flex items-start justify-between gap-4">
                    <p className="text-[0.8125rem] leading-snug text-graphite">{L.note}</p>
                    <button
                      type="button"
                      onClick={clear}
                      className="-mt-2 h-10 shrink-0 rounded-full px-2 text-[0.8125rem] font-medium text-graphite underline underline-offset-4 transition-colors duration-200 hover:text-alert"
                    >
                      {L.clear}
                    </button>
                  </div>

                  <div className="mt-2 grid gap-2.5 min-[480px]:grid-cols-2">
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() =>
                        track("generate_lead", { source: "productos", channel: "whatsapp", currency: "MXN", value: totals.equipment, units: totals.units, lines: lines.length })
                      }
                      className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-whatsapp px-5 sm:h-14 font-medium text-paper transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98]"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      {L.whatsapp}
                    </a>
                    <button
                      type="button"
                      onClick={() => setView("form")}
                      className="inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-ink px-5 font-medium text-mist transition-[background-color,transform] duration-200 ease-out-expo hover:bg-navy active:scale-[0.98] sm:h-14"
                    >
                      {L.request}
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          ) : null}

          {/* ---------- Formulario ---------- */}
          {view === "form" ? (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8">
                <p className="text-[1rem] leading-relaxed text-graphite">{L.formText}</p>
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Sitio web
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <div className="mt-6 grid gap-5">
                  <div>
                    <label htmlFor={`${uid}-name`} className="mb-2 block text-[0.9375rem] font-semibold">
                      {F.name.label}
                    </label>
                    <input id={`${uid}-name`} type="text" autoComplete="name" placeholder={F.name.placeholder} className={`${inputBase} h-14`} {...register("name")} {...aria("name")} />
                    <FieldError id={`${uid}-name-err`} message={err("name")} />
                  </div>
                  <div>
                    <label htmlFor={`${uid}-whatsapp`} className="mb-2 block text-[0.9375rem] font-semibold">
                      {F.whatsapp.label}
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[0.9375rem] text-graphite">{F.whatsapp.prefix}</span>
                      <input
                        id={`${uid}-whatsapp`}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder={F.whatsapp.placeholder}
                        className={`${inputBase} h-14 pl-14`}
                        {...register("whatsapp")}
                        {...aria("whatsapp")}
                      />
                    </div>
                    <FieldError id={`${uid}-whatsapp-err`} message={err("whatsapp")} />
                  </div>
                  <div className="grid gap-5 min-[480px]:grid-cols-2">
                    {(["colonia", "municipio"] as const).map((k) => (
                      <div key={k}>
                        <label htmlFor={`${uid}-${k}`} className="mb-2 block text-[0.9375rem] font-semibold">
                          {F[k].label}
                        </label>
                        <input
                          id={`${uid}-${k}`}
                          type="text"
                          autoComplete={k === "colonia" ? "address-level3" : "address-level2"}
                          placeholder={F[k].placeholder}
                          className={`${inputBase} h-14`}
                          {...register(k)}
                          {...aria(k)}
                        />
                        <FieldError id={`${uid}-${k}-err`} message={err(k)} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="group flex cursor-pointer items-start gap-3.5">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        {...register("privacy", { onChange: () => clearErrors("privacy") })}
                        {...aria("privacy")}
                      />
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-ink/30 bg-mist text-transparent transition-colors duration-200 group-hover:border-ink/55 peer-checked:border-cobalt peer-checked:bg-cobalt peer-checked:text-paper peer-focus-visible:ring-4 peer-focus-visible:ring-cobalt/30 peer-aria-[invalid=true]:border-alert">
                        <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                      </span>
                      <span className="text-[0.9375rem] leading-snug">
                        {F.privacy.before}
                        <a href="/aviso-de-privacidad" target="_blank" rel="noopener noreferrer" className="font-medium text-cobalt underline underline-offset-4">
                          {F.privacy.link}
                        </a>
                        {F.privacy.after}
                      </span>
                    </label>
                    <FieldError id={`${uid}-privacy-err`} message={err("privacy")} />
                  </div>
                </div>
                {status === "error" ? (
                  <p role="alert" className="mt-5 rounded-2xl bg-alert-soft px-4 py-3 text-[0.9375rem] font-medium text-alert">
                    {L.error}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2.5 border-t border-ink/10 bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-8 min-[480px]:grid-cols-[auto_1fr]">
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full px-5 font-medium text-ink transition-colors duration-200 hover:bg-ink/5 active:bg-ink/10"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                  {L.back}
                </button>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ink px-6 font-medium text-mist transition-[background-color,transform] duration-200 ease-out-expo hover:bg-navy active:scale-[0.98] disabled:opacity-70"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
                      {L.sending}
                    </>
                  ) : (
                    L.submit
                  )}
                </button>
              </div>
            </form>
          ) : null}

          {/* ---------- Confirmación ---------- */}
          {view === "done" ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="flex-1 overflow-y-auto px-5 py-8 sm:px-8" role="status">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-signal text-ink">
                  <Check className="h-8 w-8" strokeWidth={2.5} aria-hidden />
                </span>
                <p className="mt-6 text-[1.0625rem] leading-relaxed text-graphite">{L.success.text}</p>
              </div>
              <div className="grid gap-2.5 border-t border-ink/10 bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4 sm:px-8 min-[480px]:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    clear();
                    setView("list");
                  }}
                  className="inline-flex h-14 items-center justify-center rounded-full border border-ink/30 px-5 font-medium text-ink transition-colors duration-200 hover:border-ink hover:bg-ink/[0.05] active:bg-ink/10"
                >
                  {L.success.clear}
                </button>
                <button
                  type="button"
                  onClick={requestClose}
                  className="inline-flex h-14 items-center justify-center rounded-full bg-ink px-5 font-medium text-mist transition-[background-color,transform] duration-200 ease-out-expo hover:bg-navy active:scale-[0.98]"
                >
                  {L.success.close}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
