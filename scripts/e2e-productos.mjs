// Prueba de punta a punta de la fase de productos: catálogo, filtros con URL, detalle, lista de cotización
// (cantidades, instalación, persistencia al recargar), salidas por WhatsApp y formulario (payload), teclado y analítica.
// Uso: node scripts/e2e-productos.mjs [baseUrl]
import { chromium } from "@playwright/test";
import { products } from "../content/products.ts";

const base = process.argv[2] || "http://localhost:3000";
let failures = 0;
const ok = (c, m) => {
  console.log(`${c ? "✓" : "✗"} ${m}`);
  if (!c) failures++;
};
const by = (slug) => products.find((p) => p.slug === slug);
const norm = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const matches = (q) => products.filter((p) => norm(`${p.name} ${p.short}`).includes(norm(q))).length;
const digits = (s) => Number(String(s).replace(/[^\d]/g, ""));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

const fab = () => page.locator("button[aria-label^='Abrir mi cotización']:visible").first();
const countFromFab = async () => {
  const el = page.locator("button[aria-label^='Abrir mi cotización']:visible").first();
  if (!(await el.count())) return 0;
  const label = (await el.getAttribute("aria-label")) ?? "";
  return Number(label.match(/(\d+) productos/)?.[1] ?? 0);
};
const events = () => page.evaluate(() => (window.dataLayer || []).map((e) => e));

// ---------- Home: sección Productos ----------
await page.goto(base, { waitUntil: "networkidle" });
ok((await page.locator("#productos article").count()) === 8, "home: banner del kit + 7 destacados (8 cards)");
ok((await page.locator("#productos a[href^='/productos?categoria=']").count()) === 7, "home: 7 chips de categoría enlazan al catálogo");
ok((await page.locator("#productos a[href='/productos']").count()) === 1, "home: card final 'Ver los 16 productos'");
const navLinks = await page.locator("header nav a").allTextContents();
ok(navLinks.indexOf("Productos") === navLinks.indexOf("Servicios") + 1, "navbar: 'Productos' va entre Servicios y Para quién");
ok((await page.locator("header nav ul li").first().evaluate((li) => li.getBoundingClientRect().height)) < 60, "navbar: los enlaces no se parten en dos líneas");

// ---------- Catálogo ----------
await page.goto(`${base}/productos`, { waitUntil: "networkidle" });
ok((await page.locator("main ul > li article").count()) === 16, "catálogo: 16 productos");
ok(/16 productos/i.test(await page.locator("[role=status]").first().innerText()), "catálogo: contador de resultados");

// Filtros con teclado: enfoca "Todos", Tab al siguiente chip, Enter
await page.getByRole("button", { name: "Todos", exact: true }).focus();
await page.keyboard.press("Tab");
await page.keyboard.press("Enter");
await page.waitForTimeout(500);
ok(page.url().includes("categoria=videovigilancia"), `filtros por teclado: URL ${new URL(page.url()).search}`);
ok((await page.locator("main ul > li article").count()) === 3, "filtro videovigilancia: 3 cámaras");

await page.getByRole("button", { name: "Chapas y cerraduras" }).click();
await page.waitForTimeout(400);
ok(page.url().includes("categoria=chapas"), "chip de categoría sincroniza la URL");
ok((await page.locator("main ul > li article").count()) === 4, "filtro chapas: 4 productos");
await page.getByLabel("Ordenar por").selectOption("precio-asc");
await page.waitForTimeout(400);
ok(page.url().includes("orden=precio-asc"), "orden sincroniza la URL");
const firstName = await page.locator("main ul > li article h3").first().innerText();
ok(/Cerrojo de alta seguridad/.test(firstName), `menor precio primero: ${firstName.replace(/\n/g, " ")}`);
await page.getByLabel("Ordenar por").selectOption("precio-desc");
await page.waitForTimeout(300);
ok(/Chapa inteligente/.test(await page.locator("main ul > li article h3").first().innerText()), "mayor precio primero");

await page.goto(`${base}/productos?categoria=chapas&orden=precio-asc`, { waitUntil: "networkidle" });
ok((await page.getByRole("button", { name: "Chapas y cerraduras" }).getAttribute("aria-pressed")) === "true", "carga con filtros desde la URL");
ok((await page.locator("main ul > li article").count()) === 4, "URL con filtros: 4 productos");

await page.getByRole("button", { name: "Todos", exact: true }).click();
await page.getByLabel("Buscar producto").fill("zzzz");
await page.waitForTimeout(500);
ok(await page.getByText("No encontramos productos con esos filtros.").isVisible(), "estado vacío visible");
ok((await page.getByRole("link", { name: "Cuéntanos qué buscas" }).getAttribute("href"))?.startsWith("https://wa.me/"), "estado vacío: CTA a WhatsApp");
await page.getByLabel("Buscar producto").fill("cámara");
await page.waitForTimeout(500);
{ const n = await page.locator("main ul > li article").count(); ok(n === matches("cámara"), `búsqueda 'cámara' (con acento): ${n} de ${matches("cámara")} esperados`); }
await page.getByLabel("Buscar producto").fill("camara");
await page.waitForTimeout(500);
{ const n = await page.locator("main ul > li article").count(); ok(n === matches("camara"), `búsqueda 'camara' (sin acento): ${n} de ${matches("camara")} esperados`); }
await page.getByLabel("Buscar producto").fill("");
await page.waitForTimeout(500);

// ---------- Agregar 3 desde las cards ----------
await page.goto(`${base}/productos`, { waitUntil: "networkidle" });
const adds = page.locator("button[aria-label^='Agregar ']");
await adds.nth(0).click();
await adds.nth(1).click();
await adds.nth(2).click();
await page.waitForTimeout(400);
ok((await countFromFab()) === 3, `3 productos agregados desde las cards (botón: ${await countFromFab()})`);
ok(await page.locator("button[aria-label^='Agregar '] >> nth=0").evaluate((b) => b.className.includes("bg-cobalt")), "el + se vuelve check al agregar");

// ---------- Detalle: cantidad e instalación ----------
await page.locator("main ul > li article h3 a").first().click();
await page.waitForURL(/\/productos\//);
await page.goto(`${base}/productos/chapa-inteligente-huella`, { waitUntil: "networkidle" });
ok((await page.title()).includes("Chapa inteligente con huella y teclado"), `detalle: title "${await page.title()}"`);
ok((await page.locator("link[rel=canonical]").getAttribute("href"))?.endsWith("/productos/chapa-inteligente-huella"), "detalle: canonical");
const ld = JSON.parse(await page.locator("script[type='application/ld+json']").first().textContent());
ok(ld["@type"] === "Product" && ld.offers.priceCurrency === "MXN" && ld.offers.availability.endsWith("InStock") && ld.offers.price === 4290, "detalle: JSON-LD Product con oferta MXN e InStock");
await page.getByRole("button", { name: "Aumentar cantidad", exact: true }).click();
await page.getByRole("button", { name: "Aumentar cantidad", exact: true }).click();
ok((await page.locator("output").first().innerText()) === "3", "stepper: cantidad 3");
const sw = page.getByRole("switch", { name: /Incluir instalación/ });
ok((await sw.getAttribute("aria-checked")) === "false", "instalación apagada por defecto");
await sw.click();
ok((await sw.getAttribute("aria-checked")) === "true", "toggle de instalación");
await page.getByRole("button", { name: "Agregar a cotización" }).click();
await page.waitForTimeout(400);
ok((await countFromFab()) === 6, `3 + 3 piezas en la lista (botón: ${await countFromFab()})`);

const seenEvents = await events();

// ---------- Persistencia al recargar ----------
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(400);
ok((await countFromFab()) === 6, `la lista persiste al recargar (botón: ${await countFromFab()})`);

// ---------- Drawer: cantidades, instalación, totales ----------
await fab().click();
await page.waitForSelector("dialog[open]");
const dialog = page.locator("dialog[open]");
ok((await dialog.locator("ul > li").count()) === 4, "drawer: 4 renglones");
await dialog.getByRole("button", { name: "Aumentar cantidad de Cámara domo IP 4MP" }).click();
await dialog.getByRole("switch").nth(0).click(); // domo: con instalación
await page.waitForTimeout(300);
// Orden de la lista: domo, bala, videoportero, chapa inteligente
const rowsText = await dialog.locator("ul > li").allInnerTexts();
ok(rowsText[0].includes("Cámara domo IP 4MP") && rowsText[3].includes("Chapa inteligente"), "drawer: orden de la lista");
const expEquip = by("camara-domo-ip-4mp").price * 2 + by("camara-bala-ip-4mp-color").price + by("videoportero-ip-7").price + by("chapa-inteligente-huella").price * 3;
const expInst = by("camara-domo-ip-4mp").installFrom * 2 + by("chapa-inteligente-huella").installFrom * 3;
const dl = await dialog.locator("dl").innerText();
const nums = [...dl.matchAll(/\$([\d,]+)/g)].map((m) => digits(m[1]));
ok(nums[0] === expEquip, `subtotal de equipo $${expEquip.toLocaleString("en-US")} (leído $${nums[0]?.toLocaleString("en-US")})`);
ok(nums[1] === expInst, `instalación estimada desde $${expInst.toLocaleString("en-US")} (leído $${nums[1]?.toLocaleString("en-US")})`);
ok(await dialog.getByText("Precio final sujeto a visita técnica y disponibilidad.").isVisible(), "drawer: nota de precio final");

const waHref = decodeURIComponent((await dialog.getByRole("link", { name: "Enviar por WhatsApp" }).getAttribute("href")) ?? "");
ok(waHref.startsWith("https://wa.me/") && waHref.includes("Hola, quiero cotizar estos productos:"), "WhatsApp: mensaje prellenado con encabezado");
ok(waHref.includes("Cámara domo IP 4MP × 2 (con instalación)") && waHref.includes("Cámara bala IP 4MP con visión nocturna a color × 1"), "WhatsApp: cantidades e instalación por producto");
ok(waHref.includes(`Total de equipo: $${expEquip.toLocaleString("en-US")} MXN`) && waHref.includes(`Instalación estimada desde: $${expInst.toLocaleString("en-US")} MXN`), "WhatsApp: totales");

// ---------- Formulario: validación y payload ----------
await dialog.getByRole("button", { name: "Enviar solicitud" }).click();
await page.waitForTimeout(500);
await dialog.getByRole("button", { name: "Enviar solicitud" }).click(); // envío vacío
await page.waitForTimeout(500);
ok((await dialog.locator("[role=alert]").count()) >= 5, `validación: ${await dialog.locator("[role=alert]").count()} errores con el formulario vacío`);
await dialog.getByLabel("Nombre").fill("Laura Méndez");
await dialog.getByLabel("WhatsApp").fill("442 123 4567");
await dialog.getByLabel("Colonia").fill("Centro");
await dialog.getByLabel("Municipio").fill("Querétaro");
await dialog.getByRole("checkbox").check({ force: true });
const reqPromise = page.waitForRequest((r) => r.url().endsWith("/api/lead") && r.method() === "POST");
const resPromise = page.waitForResponse((r) => r.url().endsWith("/api/lead"));
await dialog.getByRole("button", { name: "Enviar solicitud" }).last().click();
const payload = (await reqPromise).postDataJSON();
const res = await resPromise;
const resJson = await res.json();
console.log("   payload:", JSON.stringify({ source: payload.source, lead: payload.lead, items: payload.items }));
ok(res.status() === 200 && resJson.ok === true, `API acepta la solicitud (${res.status()} ${JSON.stringify(resJson)})`);
ok(payload.source === "productos", 'payload: source "productos"');
ok(payload.lead.name === "Laura Méndez" && payload.lead.whatsapp === "4421234567" && payload.lead.municipio === "Querétaro", "payload: datos de contacto");
ok(payload.items.length === 4, "payload: 4 renglones");
const dom = payload.items.find((i) => i.slug === "camara-domo-ip-4mp");
const chapa = payload.items.find((i) => i.slug === "chapa-inteligente-huella");
ok(dom?.qty === 2 && dom?.install === true && chapa?.qty === 3 && chapa?.install === true, "payload: cantidades e instalación");
await page.waitForSelector("text=Recibimos tu lista", { timeout: 5000 }).then(
  () => ok(true, "confirmación en pantalla"),
  () => ok(false, "confirmación en pantalla"),
);
const ev = await events();
const names = [...seenEvents, ...ev].map((e) => e.event);
ok(["add_to_quote", "begin_quote", "generate_lead"].every((n) => names.includes(n)), `analítica: ${[...new Set(names)].filter((n) => /quote|lead|item/.test(n)).join(", ")}`);
ok(ev.some((e) => e.event === "generate_lead" && e.source === "productos"), 'analítica: generate_lead con source "productos"');

// Servidor: no confía en el cliente
const bad = await page.evaluate(async () => {
  const r = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source: "productos", lead: { name: "Ana", whatsapp: "4421234567", colonia: "Centro", municipio: "Qro", privacy: true }, items: [{ slug: "no-existe", qty: 1, install: false }] }),
  });
  return r.status;
});
ok(bad === 422, `API rechaza una lista con productos inexistentes (${bad})`);
const old = await page.evaluate(async () => (await fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lead: {} }) })).status);
ok(old === 422, `el cotizador de servicios sigue validando (${old})`);

// ---------- Vaciar lista ----------
await dialog.getByRole("button", { name: "Vaciar lista" }).click();
await page.waitForTimeout(400);
ok(/Tu lista está vacía/.test(await dialog.innerText()), "vaciar lista: estado vacío");
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
ok((await page.locator("dialog[open]").count()) === 0, "Esc cierra el drawer");
ok((await page.locator("button[aria-label^='Abrir mi cotización']").count()) === 0, "sin productos, el botón flotante desaparece");

// ---------- Teclado en el drawer: foco atrapado, Esc y foco de regreso ----------
await page.goto(`${base}/productos`, { waitUntil: "networkidle" });
await page.locator("button[aria-label^='Agregar ']").first().focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(400);
await fab().focus();
await page.keyboard.press("Enter");
await page.waitForSelector("dialog[open]");
let trapped = true;
for (let i = 0; i < 24; i++) {
  await page.keyboard.press("Tab");
  if (!(await page.evaluate(() => { const a = document.activeElement; return !a || a === document.body || !!a.closest("dialog"); }))) trapped = false;
}
ok(trapped, "el foco nunca sale del drawer a la página (24 Tab)");
await page.keyboard.press("Escape");
await page.waitForTimeout(500);
ok((await page.locator("dialog[open]").count()) === 0, "Esc cierra el drawer (teclado)");
ok(await page.evaluate(() => document.activeElement?.getAttribute("aria-label")?.startsWith("Abrir mi cotización") ?? false), "el foco vuelve al botón que abrió el drawer");
// stepper con teclado dentro del drawer
await fab().focus();
await page.keyboard.press("Enter");
await page.waitForSelector("dialog[open]");
await page.locator("dialog[open]").getByRole("button", { name: /Aumentar cantidad de/ }).focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(200);
ok((await page.locator("dialog[open] output").first().innerText()) === "2", "stepper operable con teclado");
await page.keyboard.press("Escape");
await page.waitForTimeout(400);

// ---------- Móvil: la barra inferior no encima WhatsApp ----------
const m = await browser.newContext({ viewport: { width: 375, height: 812 } });
await m.addInitScript(() => {
  try {
    localStorage.setItem("starko_quote_list_v1", JSON.stringify([{ slug: "camara-domo-ip-4mp", qty: 3, install: false }]));
  } catch {}
});
const mp = await m.newPage();
await mp.goto(`${base}/productos`, { waitUntil: "networkidle" });
await mp.waitForTimeout(700);
const rects = await mp.evaluate(() => {
  const bar = document.querySelector("[data-floating] > div");
  return [...bar.querySelectorAll("button, a")].map((e) => {
    const r = e.getBoundingClientRect();
    return { t: (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 24), x: Math.round(r.x), r: Math.round(r.right), w: Math.round(r.width) };
  });
});
console.log("   barra móvil:", JSON.stringify(rects));
const sorted = [...rects].sort((a, b) => a.x - b.x);
let overlap = false;
for (let i = 1; i < sorted.length; i++) if (sorted[i].x < sorted[i - 1].r) overlap = true;
ok(rects.length === 3 && !overlap && sorted.at(-1).r <= 375, "375px: 'Mi cotización', 'Cotizar' y WhatsApp conviven sin encimarse");
await m.close();

const real = errors.filter((e) => !e.includes("422")); // los 422 los provoca la propia prueba
ok(real.length === 0, real.length ? `errores de consola: ${real.slice(0, 3).join(" | ")}` : "sin errores de consola (salvo los 422 provocados)");

await browser.close();
console.log(failures ? `\n${failures} fallas` : "\nTodo OK");
process.exit(failures ? 1 : 0);
