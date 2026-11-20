// Verifica el H1 rotativo: texto accesible completo, rotación por las 6 palabras, SIN saltos de layout
// (alto del H1 y del hero constantes, la palabra cabe en su columna) a 375, 768, 1024, 1366 y 1920px,
// y que con prefers-reduced-motion se queda fija en la primera palabra.
// Uso: node scripts/e2e-hero.mjs [baseUrl]
import { chromium } from "@playwright/test";

const base = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch();
let failures = 0;
const ok = (c, m) => {
  console.log(`${c ? "✓" : "✗"} ${m}`);
  if (!c) failures++;
};

const EXPECTED = ["videovigilancia.", "control de acceso.", "barreras vehiculares.", "redes.", "cercas eléctricas.", "automatización."];
const SR = "Instalamos y mantenemos videovigilancia, control de acceso, barreras vehiculares, redes, cercas eléctricas y automatización";

for (const width of [375, 768, 1024, 1366, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: width < 768 ? 812 : 900 } });
  await page.goto(base, { waitUntil: "networkidle" });

  if (width === 375) {
    const sr = (await page.locator("#hero-title .sr-only").textContent())?.trim();
    ok(sr === SR, "h1 con texto completo para lectores de pantalla");
    ok((await page.locator("#hero-title [aria-hidden=true]").count()) > 0, "la parte animada va con aria-hidden");
  }

  const seen = new Set();
  const h1Heights = new Set();
  const heroHeights = new Set();
  let overflow = false;
  let tooWide = false;
  const samples = 14; // ~ 2 vueltas completas a 2.4 s
  for (let i = 0; i < samples; i++) {
    const m = await page.evaluate(() => {
      const h1 = document.getElementById("hero-title");
      const em = [...h1.querySelectorAll("em")].find((e) => e.closest(".highlight") && getComputedStyle(e).position !== "absolute");
      const block = h1.querySelector(".highlight");
      const col = h1.parentElement.getBoundingClientRect();
      return {
        word: em?.textContent,
        h1: Math.round(h1.getBoundingClientRect().height),
        hero: Math.round(document.getElementById("inicio").getBoundingClientRect().height),
        blockRight: block.getBoundingClientRect().right,
        colRight: col.right,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
      };
    });
    if (m.word) seen.add(m.word);
    h1Heights.add(m.h1);
    heroHeights.add(m.hero);
    if (m.overflow > 0) overflow = true;
    if (m.blockRight > m.colRight + 2) tooWide = true;
    await page.waitForTimeout(1100);
  }
  ok(EXPECTED.every((w) => seen.has(w)), `[${width}] rota por las 6 palabras (${[...seen].length} vistas)`);
  ok(h1Heights.size === 1, `[${width}] alto del H1 constante (${[...h1Heights].join(", ")} px)`);
  ok(heroHeights.size === 1, `[${width}] alto del hero constante (${[...heroHeights].join(", ")} px)`);
  ok(!tooWide, `[${width}] el bloque resaltado cabe en su columna`);
  ok(!overflow, `[${width}] sin overflow horizontal`);
  await page.close();
}

// Medida directa: cada palabra cabe en su columna, medida con el medidor invisible
{
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto(base, { waitUntil: "networkidle" });
  const r = await page.evaluate(() => {
    const h1 = document.getElementById("hero-title");
    const col = h1.parentElement.getBoundingClientRect().width;
    const widths = [...h1.querySelectorAll(".invisible em")].map((e) => Math.round(e.getBoundingClientRect().width));
    return { col: Math.round(col), widths };
  });
  ok(Math.max(...r.widths) <= r.col, `[375] la palabra más larga (${Math.max(...r.widths)} px) cabe en la columna (${r.col} px)`);
  await page.close();
}

// prefers-reduced-motion: fija en la primera palabra
{
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(5500);
  const w = await page.evaluate(() => [...document.querySelectorAll("#hero-title .highlight em")].map((e) => e.textContent));
  ok(w.length === 1 && w[0] === "videovigilancia.", `reduced-motion: palabra fija en "videovigilancia." (${w.join(" | ")})`);
  await ctx.close();
}

// LCP: la primera palabra está en el HTML del servidor (sin ejecutar JavaScript)
{
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "domcontentloaded" });
  const html = await page.locator("#hero-title .highlight").textContent();
  ok(html?.includes("videovigilancia."), "la primera palabra viene en el HTML inicial (sin JS)");
  const op = await page.evaluate(() => {
    let el = document.getElementById("hero-title");
    let min = 1;
    while (el) {
      min = Math.min(min, Number(getComputedStyle(el).opacity));
      el = el.parentElement;
    }
    return min;
  });
  ok(op === 1, "el H1 nunca parte de opacity 0");
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} fallas` : "\nTodo OK");
process.exit(failures ? 1 : 0);
