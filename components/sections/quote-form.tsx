"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState, type BaseSyntheticEvent, type ReactNode } from "react";
import { useForm, useWatch, type FieldPath, type UseFormRegisterReturn } from "react-hook-form";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { areaValues, leadSchema, qualify, type Lead, type LeadInput, type Qualification } from "@/lib/lead-schema";
import { track } from "@/lib/analytics";
import { readAttribution } from "@/lib/attribution";
import { bookingUrl, whatsappUrl } from "@/lib/contact";
import { PRESET_EVENT, type QuotePreset } from "@/lib/quote-preset";
import { WhatsAppIcon } from "@/components/ui/icons";

const q = site.quote;
const f = q.fields;
const UNSURE = f.areas.unsure.value;

const stepFields: FieldPath<LeadInput>[][] = [
  ["tipo"],
  ["areas", "description"],
  ["inmueble", "urgencia"],
  ["name", "company", "whatsapp", "email", "colonia", "municipio", "privacy"],
];

const inputBase =
  "on-light w-full rounded-2xl border border-ink/20 bg-mist px-4 text-[1rem] text-ink placeholder:text-graphite/80 transition-[border-color,box-shadow,background-color] duration-200 ease-out-expo hover:border-ink/40 focus:border-cobalt focus:bg-paper focus:outline-none focus:ring-4 focus:ring-cobalt/25 aria-[invalid=true]:border-alert";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-[0.8125rem] font-medium text-alert">
      {message}
    </p>
  );
}

function Legend({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <legend className="mb-3 text-[0.9375rem] font-semibold text-ink">
      {children}
      {hint ? <span className="ml-2 font-normal text-graphite">{hint}</span> : null}
    </legend>
  );
}

/** Resumen del lead para continuar por WhatsApp con el mensaje prellenado. */
function summary(lead: Lead, intro: string) {
  const tipo = f.tipo.options.find((o) => o.value === lead.tipo)?.label ?? lead.tipo;
  const areas = lead.areas.map((a) => (a === UNSURE ? f.areas.unsure.label : (services.find((s) => s.slug === a)?.name ?? a))).join(", ");
  const inmueble = f.inmueble.options.find((o) => o.value === lead.inmueble)?.label ?? lead.inmueble;
  const urgencia = f.urgencia.options.find((o) => o.value === lead.urgencia)?.label ?? lead.urgencia;
  return [
    intro,
    `Servicio: ${tipo}`,
    `Área: ${areas}`,
    lead.description ? `Detalle: ${lead.description}` : "",
    `Inmueble: ${inmueble}`,
    `Urgencia: ${urgencia}`,
    `Ubicación: ${lead.colonia}, ${lead.municipio}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function QuoteForm() {
  const reduce = useReducedMotion();
  const uid = useId();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [done, setDone] = useState<{ lead: Lead; qualification: Qualification } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = useForm<LeadInput, unknown, Lead>({
    resolver: zodResolver(leadSchema),
    mode: "onTouched",
    defaultValues: { areas: [], description: "", company: "", privacy: false as unknown as true },
  });

  const areas = useWatch({ control, name: "areas" }) ?? [];

  useEffect(() => {
    readAttribution();
  }, []);

  // Preselección desde cualquier CTA: #cotizar?tipo=visita&servicio=acceso-vehicular
  useEffect(() => {
    const apply = (p?: QuotePreset) => {
      if (!p || (!p.tipo && !p.servicio)) return;
      if (p.tipo && f.tipo.options.some((o) => o.value === p.tipo)) {
        setValue("tipo", p.tipo as LeadInput["tipo"], { shouldValidate: false });
        clearErrors("tipo");
      }
      if (p.servicio && areaValues.includes(p.servicio)) {
        setValue("areas", [p.servicio], { shouldValidate: false });
        clearErrors("areas");
      }
      // con tipo y servicio ya elegidos se salta al paso 2 para confirmar el área; si no, se muestra el paso 1
      setDir(1);
      setStep(p.tipo && p.servicio ? 1 : 0);
    };
    apply(window.__quotePreset);
    const onPreset = (e: Event) => apply((e as CustomEvent<QuotePreset>).detail);
    window.addEventListener(PRESET_EVENT, onPreset);
    return () => window.removeEventListener(PRESET_EVENT, onPreset);
  }, [setValue, clearErrors]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    track("form_step", { step: step + 1, step_name: q.steps[step].title });
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const next = async () => {
    const ok = await trigger(stepFields[step], { shouldFocus: true });
    if (!ok) return;
    if (step === 0) track("form_start", {});
    setDir(1);
    setStep((s) => Math.min(s + 1, 3));
  };
  const back = () => {
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const toggleArea = (value: string) => {
    let nextAreas: string[];
    if (value === UNSURE) nextAreas = areas.includes(UNSURE) ? [] : [UNSURE];
    else {
      const without = areas.filter((a) => a !== UNSURE);
      nextAreas = without.includes(value) ? without.filter((a) => a !== value) : [...without, value];
    }
    setValue("areas", nextAreas, { shouldDirty: true });
    if (nextAreas.length) clearErrors("areas");
  };

  const onSubmit = async (lead: Lead, e?: BaseSyntheticEvent) => {
    const form = e?.target instanceof HTMLFormElement ? e.target : null;
    const website = form ? String(new FormData(form).get("website") ?? "") : "";
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lead, meta: { ...readAttribution(), submitted_at_client: new Date().toISOString() }, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; qualification?: Qualification };
      if (!res.ok || !data.ok) throw new Error("lead");
      const qualification = data.qualification ?? qualify(lead);
      track("generate_lead", {
        tipo: lead.tipo,
        servicios: lead.areas.join(","),
        inmueble: lead.inmueble,
        urgencia: lead.urgencia,
        qualification,
      });
      setDone({ lead, qualification });
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  /** Selección (radio, checkbox): limpia el error al elegir, sin esperar al blur. */
  const choice = <K extends "tipo" | "inmueble" | "urgencia" | "privacy">(k: K) =>
    register(k, { onChange: () => clearErrors(k) });

  const err = (k: keyof LeadInput) => errors[k]?.message as string | undefined;
  const aria = (k: keyof LeadInput) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${uid}-${k}-err` : undefined,
  });

  const variants = {
    enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * 32 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, x: d * -32 }),
  };

  if (done) {
    return (
      <Success
        lead={done.lead}
        qualification={done.qualification}
        onAgain={() => {
          reset();
          setDone(null);
          setStep(0);
        }}
      />
    );
  }

  const progress = ((step + 1) / 4) * 100;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="on-light relative rounded-[var(--radius-card-lg)] bg-paper p-5 text-ink shadow-[var(--shadow-deep)] sm:p-8 lg:p-10"
      aria-labelledby={`${uid}-title`}
    >
      {/* Honeypot anti spam */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Sitio web
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Progreso */}
      <div className="flex items-center justify-between font-mono text-[0.75rem] uppercase tracking-[0.12em] text-graphite">
        <span>
          {q.stepLabel} {step + 1} {q.of} 4
        </span>
        <span aria-hidden>{Math.round(progress)}%</span>
      </div>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10"
        role="progressbar"
        aria-label="Progreso del formulario"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={4}
      >
        <m.div
          className="h-full rounded-full bg-cobalt"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <ol className="mt-4 hidden grid-cols-4 gap-2 sm:grid" aria-hidden>
        {q.steps.map((s, i) => (
          <li key={s.title} className={`truncate font-mono text-[0.6875rem] uppercase tracking-[0.1em] ${i <= step ? "text-ink" : "text-graphite"}`}>
            {s.short}
          </li>
        ))}
      </ol>

      <div className="relative mt-8 min-h-[22rem]">
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <m.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: reduce ? 0.01 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3
              id={`${uid}-title`}
              ref={headingRef}
              tabIndex={-1}
              className="text-[clamp(1.375rem,1.15rem+0.8vw,1.75rem)] font-semibold tracking-[-0.03em] focus:outline-none"
            >
              {q.steps[step].title}
            </h3>

            {/* Paso 1: tipo de servicio */}
            {step === 0 ? (
              <fieldset className="mt-6" {...aria("tipo")}>
                <legend className="sr-only">{f.tipo.label}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {f.tipo.options.map((o, i) => (
                    <label key={o.value} className={`group relative cursor-pointer ${i === f.tipo.options.length - 1 ? "sm:col-span-2" : ""}`}>
                      <input type="radio" value={o.value} className="peer sr-only" {...choice("tipo")} />
                      <ChoiceCard hint={o.hint} label={o.label} />
                    </label>
                  ))}
                </div>
                <FieldError id={`${uid}-tipo-err`} message={err("tipo")} />
              </fieldset>
            ) : null}

            {/* Paso 2: área */}
            {step === 1 ? (
              <div className="mt-6 grid gap-6">
                <fieldset {...aria("areas")}>
                  <Legend hint={f.areas.hint}>{f.areas.label}</Legend>
                  <div className="flex flex-wrap gap-2.5">
                    {[...services.map((s) => ({ value: s.slug, label: s.name })), f.areas.unsure].map((o) => {
                      const on = areas.includes(o.value);
                      return (
                        <button
                          key={o.value}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggleArea(o.value)}
                          className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-[0.9375rem] font-medium transition-[border-color,background-color,transform] duration-200 ease-out-expo active:scale-[0.97] ${
                            on ? "border-cobalt bg-signal-soft text-ink" : "border-ink/20 bg-mist text-ink hover:border-ink/45"
                          }`}
                        >
                          <span
                            className={`flex h-4 w-4 items-center justify-center rounded-full border ${on ? "border-cobalt bg-cobalt text-paper" : "border-ink/30 bg-paper text-transparent"}`}
                          >
                            <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden />
                          </span>
                          {o.label}
                        </button>
                      );
                    })}
                  </div>
                  <FieldError id={`${uid}-areas-err`} message={err("areas")} />
                </fieldset>
                <div>
                  <label htmlFor={`${uid}-description`} className="mb-2 block text-[0.9375rem] font-semibold">
                    {f.description.label}
                  </label>
                  <textarea
                    id={`${uid}-description`}
                    rows={4}
                    placeholder={f.description.placeholder}
                    className={`${inputBase} resize-none py-3.5 leading-relaxed`}
                    {...register("description")}
                    {...aria("description")}
                  />
                  <FieldError id={`${uid}-description-err`} message={err("description")} />
                </div>
              </div>
            ) : null}

            {/* Paso 3: instalación */}
            {step === 2 ? (
              <div className="mt-6 grid gap-7">
                <fieldset {...aria("inmueble")}>
                  <Legend>{f.inmueble.label}</Legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {f.inmueble.options.map((o) => (
                      <label key={o.value} className="group relative cursor-pointer">
                        <input type="radio" value={o.value} className="peer sr-only" {...choice("inmueble")} />
                        <ChoiceCard label={o.label} compact />
                      </label>
                    ))}
                  </div>
                  <FieldError id={`${uid}-inmueble-err`} message={err("inmueble")} />
                </fieldset>
                <fieldset {...aria("urgencia")}>
                  <Legend>{f.urgencia.label}</Legend>
                  <PillRadios options={f.urgencia.options} field={choice("urgencia")} />
                  <FieldError id={`${uid}-urgencia-err`} message={err("urgencia")} />
                </fieldset>
              </div>
            ) : null}

            {/* Paso 4: datos */}
            {step === 3 ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {(["name", "company"] as const).map((k) => (
                  <div key={k}>
                    <label htmlFor={`${uid}-${k}`} className="mb-2 block text-[0.9375rem] font-semibold">
                      {f[k].label}
                    </label>
                    <input
                      id={`${uid}-${k}`}
                      type="text"
                      autoComplete={k === "name" ? "name" : "organization"}
                      placeholder={f[k].placeholder}
                      className={`${inputBase} h-14`}
                      {...register(k)}
                      {...aria(k)}
                    />
                    <FieldError id={`${uid}-${k}-err`} message={err(k)} />
                  </div>
                ))}
                <div>
                  <label htmlFor={`${uid}-whatsapp`} className="mb-2 block text-[0.9375rem] font-semibold">
                    {f.whatsapp.label}
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-[0.9375rem] text-graphite">{f.whatsapp.prefix}</span>
                    <input
                      id={`${uid}-whatsapp`}
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel-national"
                      placeholder={f.whatsapp.placeholder}
                      className={`${inputBase} h-14 pl-14`}
                      {...register("whatsapp")}
                      {...aria("whatsapp")}
                    />
                  </div>
                  <FieldError id={`${uid}-whatsapp-err`} message={err("whatsapp")} />
                </div>
                <div>
                  <label htmlFor={`${uid}-email`} className="mb-2 block text-[0.9375rem] font-semibold">
                    {f.email.label}
                  </label>
                  <input
                    id={`${uid}-email`}
                    type="email"
                    autoComplete="email"
                    placeholder={f.email.placeholder}
                    className={`${inputBase} h-14`}
                    {...register("email")}
                    {...aria("email")}
                  />
                  <FieldError id={`${uid}-email-err`} message={err("email")} />
                </div>
                {(["colonia", "municipio"] as const).map((k) => (
                  <div key={k}>
                    <label htmlFor={`${uid}-${k}`} className="mb-2 block text-[0.9375rem] font-semibold">
                      {f[k].label}
                    </label>
                    <input
                      id={`${uid}-${k}`}
                      type="text"
                      autoComplete={k === "colonia" ? "address-level3" : "address-level2"}
                      placeholder={f[k].placeholder}
                      className={`${inputBase} h-14`}
                      {...register(k)}
                      {...aria(k)}
                    />
                    <FieldError id={`${uid}-${k}-err`} message={err(k)} />
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem] leading-relaxed text-graphite">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded accent-cobalt"
                      {...choice("privacy")}
                      {...aria("privacy")}
                    />
                    <span>
                      {f.privacy.before}
                      <a href="/aviso-de-privacidad" target="_blank" className="font-medium text-ink underline underline-offset-4 hover:text-cobalt">
                        {f.privacy.link}
                      </a>
                      {f.privacy.after}
                    </span>
                  </label>
                  <FieldError id={`${uid}-privacy-err`} message={err("privacy")} />
                </div>
              </div>
            ) : null}
          </m.div>
        </AnimatePresence>
      </div>

      {status === "error" ? (
        <p role="alert" className="mt-6 rounded-2xl bg-alert-soft px-4 py-3 text-[0.9375rem] text-alert">
          {q.error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 font-medium text-ink transition-colors duration-200 hover:bg-ink/5 active:bg-ink/10"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {q.back}
          </button>
        ) : (
          <span className="hidden sm:block" />
        )}
        {step < 3 ? (
          <button
            type="button"
            onClick={next}
            className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ink px-8 font-medium text-mist transition-[background-color,transform] duration-200 ease-out-expo hover:bg-navy active:scale-[0.98]"
          >
            {q.next}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" aria-hidden />
          </button>
        ) : (
          <button
            type="submit"
            disabled={status === "sending"}
            className="group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-ink px-8 font-medium text-mist transition-[background-color,transform] duration-200 ease-out-expo hover:bg-navy active:scale-[0.98] disabled:opacity-70"
          >
            {status === "sending" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {q.sending}
              </>
            ) : (
              <>
                {q.submit}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-1" aria-hidden />
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}

/** Tarjeta de opción: el input radio (peer) va justo antes. */
function ChoiceCard({ label, hint, compact }: { label: string; hint?: string; compact?: boolean }) {
  return (
    <span
      className={`flex h-full flex-col justify-between gap-3 rounded-2xl border border-ink/20 bg-mist p-4 transition-[border-color,background-color,box-shadow] duration-200 ease-out-expo group-hover:border-ink/45 peer-checked:border-cobalt peer-checked:bg-signal-soft peer-checked:shadow-[0_0_0_1px_var(--color-cobalt)] peer-focus-visible:ring-4 peer-focus-visible:ring-cobalt/30 ${
        compact ? "min-h-[3.75rem] justify-center" : "min-h-[5.25rem]"
      }`}
    >
      <span className="flex items-center justify-between gap-3">
        {hint ? <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-graphite">{hint}</span> : <span />}
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-ink/30 bg-paper text-transparent transition-colors group-has-[:checked]:border-cobalt group-has-[:checked]:bg-cobalt group-has-[:checked]:text-paper">
          <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
        </span>
      </span>
      <span className="text-[1rem] font-semibold leading-snug">{label}</span>
    </span>
  );
}

function PillRadios({ options, field }: { options: readonly { value: string; label: string }[]; field: UseFormRegisterReturn }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((o) => (
        <label key={o.value} className="group relative cursor-pointer">
          <input type="radio" value={o.value} className="peer sr-only" {...field} />
          <span className="inline-flex h-12 items-center gap-2 rounded-full border border-ink/20 bg-mist px-5 text-[0.9375rem] font-medium transition-[border-color,background-color] duration-200 ease-out-expo group-hover:border-ink/45 peer-checked:border-cobalt peer-checked:bg-signal-soft peer-focus-visible:ring-4 peer-focus-visible:ring-cobalt/30">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-ink/30 bg-paper group-has-[:checked]:border-cobalt group-has-[:checked]:bg-cobalt">
              <span className="h-1.5 w-1.5 rounded-full bg-paper opacity-0 group-has-[:checked]:opacity-100" />
            </span>
            {o.label}
          </span>
        </label>
      ))}
    </div>
  );
}

function Success({ lead, qualification, onAgain }: { lead: Lead; qualification: Qualification; onAgain: () => void }) {
  const reduce = useReducedMotion();
  const s = q.success;
  const name = lead.name.split(" ")[0];
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  const waLink = (intro: string) => whatsappUrl(summary(lead, intro.replace("{name}", name)));

  return (
    <m.div
      ref={ref}
      tabIndex={-1}
      role="status"
      initial={reduce ? false : { opacity: 0, scale: 0.97, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="on-light rounded-[var(--radius-card-lg)] bg-paper p-6 text-ink shadow-[var(--shadow-deep)] focus:outline-none sm:p-10"
    >
      <m.span
        className="flex h-16 w-16 items-center justify-center rounded-full bg-signal"
        initial={reduce ? false : { scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden="true">
          <m.path
            d="M5 12.5l4.5 4.5L19 7.5"
            stroke="var(--color-ink)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
        </svg>
      </m.span>
      <h3 className="mt-7 text-[clamp(1.5rem,1.2rem+1.1vw,2.125rem)] font-semibold leading-tight tracking-[-0.03em]">
        {s.title.replace("{name}", name)}
      </h3>

      {qualification === "urgent" ? (
        <div className="mt-6">
          <p className="max-w-[34rem] text-[1.0625rem] leading-relaxed text-graphite">{s.urgent}</p>
          <a
            href={waLink(s.urgentMessage)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("cta_click", { cta_location: "success_urgent", cta_label: s.urgentCta })}
            className="mt-5 inline-flex h-14 items-center gap-2.5 rounded-full bg-whatsapp px-7 font-medium text-paper transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98]"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {s.urgentCta}
          </a>
        </div>
      ) : null}

      {qualification === "booking" ? (
        <div className="mt-6">
          <p className="max-w-[34rem] text-[1.0625rem] leading-relaxed text-graphite">{s.booking}</p>
          {bookingUrl ? (
            <iframe src={bookingUrl} title={s.bookingTitle} loading="lazy" className="mt-4 h-[640px] w-full rounded-2xl border border-ink/10 bg-paper" />
          ) : (
            // Sin NEXT_PUBLIC_BOOKING_URL: respaldo directo a WhatsApp
            <a
              href={waLink(s.bookingMessage)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("cta_click", { cta_location: "success_booking", cta_label: s.bookingFallback })}
              className="mt-4 inline-flex h-14 items-center gap-2.5 rounded-full bg-signal px-7 font-medium text-ink transition-[background-color,transform] duration-200 hover:bg-signal-soft active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {s.bookingFallback}
            </a>
          )}
        </div>
      ) : null}

      {qualification === "standard" ? <p className="mt-4 max-w-[34rem] text-[1.0625rem] leading-relaxed text-graphite">{s.standard}</p> : null}

      <button
        type="button"
        onClick={onAgain}
        className="mt-8 text-[0.9375rem] font-medium text-graphite underline underline-offset-4 transition-colors hover:text-ink"
      >
        {s.again}
      </button>
    </m.div>
  );
}
