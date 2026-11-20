// Capturas de la fase de productos a 375, 768, 1024, 1366 y 1920px:
// sección Productos del home, /productos, /productos/chapa-inteligente-huella y el drawer de cotización abierto.
// Uso: node scripts/productos-shots.mjs [baseUrl] [--only=375,1366]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const base = args.find((a) => a.startsWith("http")) || "http://localhost:3000";
const only = args.find((a) => a.startsWith("--only="))?.split("=")[1]?.split(",").map(Number);
const widths = only ?? [375, 768, 1024, 1366, 1920];
const out = path.join(process.cwd(), "screenshots", "prod");
mkdirSync(out, { recursive: true });

const seed = JSON.stringify([
  { slug: "chapa-inteligente-huella", qty: 2, install: true },
  { slug: "camara-domo-ip-4mp", qty: 1, install: false },
  { slug: "electrificador-cerca", qty: 1, install: true },
]);

async function sweep(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 350) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 110));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 900));
  });
}

const browser = await chromium.launch();
for (const width of widths) {
  const height = width < 768 ? 812 : 900;
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  // Home: sección Productos
  await page.goto(base, { waitUntil: "networkidle" });
  await sweep(page);
  await page.addStyleTag({ content: "header, [data-floating]{visibility:hidden!important}" });
  const sec = page.locator("#productos");
  await sec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await sec.screenshot({ path: path.join(out, `home-${width}.png`) });
  const ov1 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

  // Catálogo
  await page.goto(`${base}/productos`, { waitUntil: "networkidle" });
  await sweep(page);
  await page.screenshot({ path: path.join(out, `catalogo-${width}.png`), fullPage: true });
  const ov2 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

  // Detalle
  await page.goto(`${base}/productos/chapa-inteligente-huella`, { waitUntil: "networkidle" });
  await sweep(page);
  await page.screenshot({ path: path.join(out, `detalle-${width}.png`), fullPage: true });
  const ov3 = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await page.close();

  // Drawer abierto con una lista de ejemplo
  const ctx = await browser.newContext({ viewport: { width, height } });
  await ctx.addInitScript((s) => {
    try {
      localStorage.setItem("starko_quote_list_v1", s);
    } catch {}
  }, seed);
  const p2 = await ctx.newPage();
  await p2.goto(`${base}/productos`, { waitUntil: "networkidle" });
  await p2.waitForTimeout(600);
  await p2.locator("button[aria-label^='Abrir mi cotización']:visible").first().click();
  await p2.waitForSelector("dialog[open]");
  await p2.waitForTimeout(900);
  await p2.screenshot({ path: path.join(out, `drawer-${width}.png`) });
  await p2.getByRole("button", { name: "Enviar solicitud" }).first().click();
  await p2.waitForTimeout(700);
  await p2.screenshot({ path: path.join(out, `drawer-form-${width}.png`) });
  await ctx.close();

  console.log(width, "overflow home/catálogo/detalle:", ov1, ov2, ov3, errors.length ? `ERRORES: ${errors.join(" | ")}` : "sin errores de consola");
}
await browser.close();
