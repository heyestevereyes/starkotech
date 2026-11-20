import { z } from "zod";
import { site } from "@/content/site";
import { services } from "@/content/services";

const e = site.quote.errors;
const f = site.quote.fields;

const values = <T extends readonly { value: string }[]>(opts: T) =>
  opts.map((o) => o.value) as [T[number]["value"], ...T[number]["value"][]];

/** Valores del paso 2: los 11 servicios y "No estoy seguro". */
export const areaValues = [...services.map((s) => s.slug), f.areas.unsure.value] as unknown as [string, ...string[]];

export const stepSchemas = [
  z.object({
    tipo: z.enum(values(f.tipo.options), { error: e.tipo }),
  }),
  z.object({
    areas: z.array(z.enum(areaValues)).min(1, e.areas).max(12),
    description: z.string().trim().max(1000, e.description).optional(),
  }),
  z.object({
    inmueble: z.enum(values(f.inmueble.options), { error: e.inmueble }),
    urgencia: z.enum(values(f.urgencia.options), { error: e.urgencia }),
  }),
  z.object({
    name: z.string({ error: e.name }).trim().min(2, e.name).max(80),
    company: z.string().trim().max(120).optional(),
    whatsapp: z
      .string({ error: e.whatsapp })
      .transform((v) => v.replace(/\D/g, ""))
      .pipe(z.string().length(10, e.whatsapp)),
    email: z.email(e.email),
    colonia: z.string({ error: e.colonia }).trim().min(2, e.colonia).max(80),
    municipio: z.string({ error: e.municipio }).trim().min(2, e.municipio).max(80),
    privacy: z.literal(true, { error: e.privacy }),
  }),
] as const;

export const leadSchema = stepSchemas[0]
  .extend(stepSchemas[1].shape)
  .extend(stepSchemas[2].shape)
  .extend(stepSchemas[3].shape);

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

/** Metadatos de atribución que acompañan al lead. */
export const leadMetaSchema = z.object({
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  referrer: z.string().max(500).optional(),
  page: z.string().max(500).optional(),
  submitted_at_client: z.string().max(40).optional(),
});

export const leadRequestSchema = z.object({
  lead: leadSchema,
  meta: leadMetaSchema.default({}),
  /** honeypot: debe llegar vacío */
  website: z.string().max(500).optional(),
});

export type Qualification = "urgent" | "booking" | "standard";

const bookingInmuebles = ["fraccionamiento", "edificio", "empresa", "industria"];
const bookingTipos = ["mantenimiento", "visita", "modernizacion"];

/**
 * Calificación del lead:
 * - urgent: urgencia "Urgente" o tipo "Falla o reparación" (continúa por WhatsApp).
 * - booking: inmueble grande y tipo de proyecto o póliza (agenda de visita).
 * - standard: el resto.
 */
export function qualify(lead: Pick<Lead, "tipo" | "urgencia" | "inmueble">): Qualification {
  if (lead.urgencia === "urgente" || lead.tipo === "falla") return "urgent";
  if (bookingInmuebles.includes(lead.inmueble) && bookingTipos.includes(lead.tipo)) return "booking";
  return "standard";
}

/* ---------- Solicitud de cotización de productos (lista de cotización) ---------- */

const pe = site.shop.list.errors;

export const productLeadSchema = z.object({
  name: z.string({ error: pe.name }).trim().min(2, pe.name).max(80),
  whatsapp: z
    .string({ error: pe.whatsapp })
    .transform((v) => v.replace(/\D/g, ""))
    .pipe(z.string().length(10, pe.whatsapp)),
  colonia: z.string({ error: pe.colonia }).trim().min(2, pe.colonia).max(80),
  municipio: z.string({ error: pe.municipio }).trim().min(2, pe.municipio).max(80),
  privacy: z.literal(true, { error: pe.privacy }),
});

export type ProductLeadInput = z.input<typeof productLeadSchema>;
export type ProductLead = z.output<typeof productLeadSchema>;

/** Renglón de la lista: el servidor vuelve a resolver nombre y precio contra el catálogo, no confía en el cliente. */
export const productItemSchema = z.object({
  slug: z.string().max(80),
  qty: z.number().int().min(1).max(99),
  install: z.boolean(),
});

export const productLeadRequestSchema = z.object({
  source: z.literal("productos"),
  lead: productLeadSchema,
  items: z.array(productItemSchema).min(1).max(40),
  meta: leadMetaSchema.default({}),
  /** honeypot: debe llegar vacío */
  website: z.string().max(500).optional(),
});
