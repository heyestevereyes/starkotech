import { leadRequestSchema, productLeadRequestSchema, qualify } from "@/lib/lead-schema";
import { resolveLines, totalsOf } from "@/lib/quote-math";

/** Envía el payload al webhook configurado (o lo deja en consola si no hay webhook). */
async function deliver(payload: Record<string, unknown>) {
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (!webhook) {
    console.warn("[lead] LEAD_WEBHOOK_URL no está configurada. Lead recibido:", payload);
    return { ok: true as const, delivered: false };
  }
  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook respondió ${res.status}`);
  } catch (err) {
    console.error("[lead] Error enviando al webhook", err);
    return { ok: false as const };
  }
  return { ok: true as const, delivered: true };
}

/** Cotizador de productos: source "productos" con el detalle de la lista. */
async function handleProductos(body: unknown, request: Request) {
  const parsed = productLeadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })) },
      { status: 422 },
    );
  }
  const { lead, items, meta, website } = parsed.data;
  if (website) return Response.json({ ok: true });

  // Nombres, SKU y precios salen del catálogo del servidor
  const lines = resolveLines(items);
  if (!lines.length) return Response.json({ ok: false, error: "empty_list" }, { status: 422 });
  const totals = totalsOf(lines);

  const result = await deliver({
    source: "productos",
    ...lead,
    whatsapp: `+52${lead.whatsapp}`,
    items: lines.map((l) => ({
      slug: l.product.slug,
      sku: l.product.sku,
      name: l.product.name,
      category: l.product.category,
      qty: l.qty,
      unit_price: l.product.price,
      install: l.install,
      install_from: l.install ? (l.product.installFrom ?? null) : null,
      install_note: l.install && l.installTbd ? (l.product.installNote ?? null) : null,
      equipment_subtotal: l.equipment,
      install_estimate: l.installEstimate,
    })),
    totals: { currency: "MXN", equipment: totals.equipment, install_estimate: totals.install, install_pending: totals.installTbd, units: totals.units },
    meta: { ...meta, user_agent: request.headers.get("user-agent") ?? undefined },
    submitted_at: new Date().toISOString(),
  });
  if (!result.ok) return Response.json({ ok: false, error: "webhook" }, { status: 502 });
  return Response.json({ ok: true, delivered: result.delivered });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (body && typeof body === "object" && (body as { source?: unknown }).source === "productos") {
    return handleProductos(body, request);
  }

  const parsed = leadRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "validation", issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })) },
      { status: 422 },
    );
  }

  const { lead, meta, website } = parsed.data;
  const qualification = qualify(lead);

  // Honeypot: respondemos OK sin reenviar para no dar pistas al bot.
  if (website) {
    return Response.json({ ok: true, qualification });
  }

  const result = await deliver({
    ...lead,
    whatsapp: `+52${lead.whatsapp}`,
    qualification,
    meta: {
      ...meta,
      user_agent: request.headers.get("user-agent") ?? undefined,
    },
    submitted_at: new Date().toISOString(),
    source: "sitio-seguridad",
  });
  if (!result.ok) return Response.json({ ok: false, error: "webhook" }, { status: 502 });
  return Response.json({ ok: true, qualification, delivered: result.delivered });
}
