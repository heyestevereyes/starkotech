// Prueba E2E del cotizador: validación por paso, regreso, preselección por hash, calificación, envío y dataLayer.
// Uso: node scripts/e2e-form.mjs [baseUrl]
import { chromium } from "@playwright/test";

const base = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch();
let failures = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "✓" : "✗"} ${msg}`);
  if (!cond) failures++;
};

async function run({ tipo, area, inmueble, urgencia, expect }) {
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${base}/?utm_source=test&utm_campaign=e2e#cotizar`, { waitUntil: "networkidle" });
  const form = page.locator("#cotizar form");

  // Paso 1: validación vacía
  await form.getByRole("button", { name: "Continuar" }).click();
  ok((await form.getByRole("alert").count()) >= 1, `[${expect}] paso 1 muestra error si está vacío`);
  await form.locator(`input[name=tipo][value="${tipo}"]`).check({ force: true });
  await form.getByRole("button", { name: "Continuar" }).click();

  // Paso 2: validación de área
  await form.getByRole("heading", { name: "¿En qué área?", exact: true }).waitFor();
  await form.getByRole("button", { name: "Continuar" }).click();
  ok((await form.getByRole("alert").count()) >= 1, `[${expect}] paso 2 exige al menos un área`);
  await form.getByRole("button", { name: area, exact: true }).click();
  ok((await form.getByRole("button", { name: area, exact: true }).getAttribute("aria-pressed")) === "true", `[${expect}] chip de área marcado`);
  await form.getByLabel("Cuéntanos brevemente").fill("La pluma de la entrada no baja y 3 cámaras no graban");
  // regresar y volver: los valores se conservan
  await form.getByRole("button", { name: "Atrás" }).click();
  await form.getByRole("heading", { name: "¿Qué tipo de servicio buscas?", exact: true }).waitFor();
  ok(await form.locator(`input[name=tipo][value="${tipo}"]`).isChecked(), `[${expect}] al regresar se conserva el tipo`);
  await form.getByRole("button", { name: "Continuar" }).click();
  await form.getByRole("button", { name: "Continuar" }).click();

  // Paso 3
  await form.getByRole("heading", { name: "Tu instalación.", exact: true }).waitFor();
  await form.getByRole("button", { name: "Continuar" }).click();
  ok((await form.getByRole("alert").count()) >= 2, `[${expect}] paso 3 valida inmueble y urgencia`);
  await form.locator(`input[name=inmueble][value="${inmueble}"]`).check({ force: true });
  // teclado en radios
  await form.locator('input[name=urgencia]').first().focus();
  await form.locator(`input[name=urgencia][value="${urgencia}"]`).check({ force: true });
  await form.getByRole("button", { name: "Continuar" }).click();

  // Paso 4
  await form.getByRole("heading", { name: "Tus datos.", exact: true }).waitFor();
  await form.getByLabel("Nombre", { exact: true }).fill("Laura Méndez");
  await form.getByLabel("WhatsApp").fill("55 1234 567"); // 9 dígitos: inválido
  await form.getByLabel("Correo").fill("laura@prueba.mx");
  await form.getByLabel("Colonia").fill("Del Valle");
  await form.getByLabel("Municipio").fill("Benito Juárez");
  await form.getByRole("button", { name: "Enviar solicitud" }).click();
  ok((await form.getByRole("alert").count()) >= 2, `[${expect}] valida WhatsApp y aviso de privacidad`);
  await form.getByLabel("WhatsApp").fill("55 1234 5678");
  await form.getByRole("checkbox").check();
  const [resp] = await Promise.all([
    page.waitForResponse((r) => r.url().endsWith("/api/lead")),
    form.getByRole("button", { name: "Enviar solicitud" }).click(),
  ]);
  const body = await resp.json();
  ok(resp.status() === 200 && body.ok, `[${expect}] /api/lead respondió ok`);
  ok(body.qualification === expect, `[${expect}] calificación = ${body.qualification}`);

  await page.getByText("Listo, Laura.").waitFor();
  ok(true, `[${expect}] mensaje de éxito visible`);
  if (expect === "urgent") ok(await page.getByRole("link", { name: "Continuar por WhatsApp" }).isVisible(), "[urgent] botón de WhatsApp con resumen");
  if (expect === "urgent") {
    const href = await page.getByRole("link", { name: "Continuar por WhatsApp" }).getAttribute("href");
    ok(decodeURIComponent(href).includes("Colonia") || decodeURIComponent(href).includes("Del Valle"), "[urgent] el resumen de WhatsApp incluye los datos");
  }
  if (expect === "booking") ok(await page.getByText("agenda ahora tu visita técnica").isVisible(), "[booking] muestra bloque de agenda");
  if (expect === "standard") ok(await page.getByText("Recibimos tu solicitud").isVisible(), "[standard] mensaje estándar");

  const events = await page.evaluate(() => (window.dataLayer || []).map((e) => e.event));
  ok(events.includes("form_step") && events.includes("generate_lead"), `[${expect}] dataLayer: ${[...new Set(events)].join(", ")}`);
  const lead = await page.evaluate(() => (window.dataLayer || []).find((e) => e.event === "generate_lead"));
  ok(lead && lead.tipo === tipo && lead.inmueble === inmueble && lead.urgencia === urgencia && lead.servicios, `[${expect}] generate_lead con tipo, servicios, inmueble y urgencia`);
  ok(errors.length === 0, `[${expect}] sin errores de JS ${errors.join(" | ")}`);
  await page.close();
}

await run({ tipo: "falla", area: "Acceso vehicular", inmueble: "fraccionamiento", urgencia: "semana", expect: "urgent" });
await run({ tipo: "mantenimiento", area: "Mantenimiento", inmueble: "fraccionamiento", urgencia: "semana", expect: "booking" });
await run({ tipo: "instalacion", area: "Videovigilancia", inmueble: "casa", urgencia: "planeando", expect: "standard" });
// Urgencia "Urgente" gana aunque el tipo no sea falla
await run({ tipo: "visita", area: "Redes", inmueble: "empresa", urgencia: "urgente", expect: "urgent" });

// Preselección por hash desde un CTA: tipo + servicio
{
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto(`${base}/#cotizar?tipo=visita&servicio=acceso-vehicular`, { waitUntil: "networkidle" });
  await page.locator("#cotizar form").getByRole("heading", { name: "¿En qué área?", exact: true }).waitFor({ timeout: 8000 });
  ok((await page.locator("#cotizar form").getByRole("button", { name: "Acceso vehicular", exact: true }).getAttribute("aria-pressed")) === "true", "hash: servicio preseleccionado en el paso 2");
  await page.locator("#cotizar form").getByRole("button", { name: "Atrás" }).click();
  ok(await page.locator('input[name=tipo][value="visita"]').isChecked(), "hash: tipo preseleccionado en el paso 1");
  await page.close();
}

// Preselección con clic en un CTA ya dentro de la página (hero: Agendar visita técnica)
{
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Agendar visita técnica" }).first().click();
  await page.waitForTimeout(1200);
  ok(await page.locator('input[name=tipo][value="visita"]').isChecked(), "clic en CTA: tipo = visita técnica preseleccionado");
  await page.close();
}

// Honeypot y validación del API
const bad = await fetch(`${base}/api/lead`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
ok(bad.status === 422, "API rechaza payload inválido (422)");
const valid = {
  lead: { tipo: "visita", areas: ["redes"], inmueble: "casa", urgencia: "semana", name: "Bot", whatsapp: "5512345678", email: "bot@x.mx", colonia: "Centro", municipio: "CDMX", privacy: true },
  meta: {},
  website: "spam",
};
const hp = await (await fetch(`${base}/api/lead`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(valid) })).json();
ok(hp.ok === true && hp.delivered === undefined, "honeypot: responde ok sin entregar");

await browser.close();
console.log(failures ? `\n${failures} fallas` : "\nTodo OK");
process.exit(failures ? 1 : 0);
