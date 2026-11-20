// Aproximación a las métricas de Lighthouse móvil con Playwright (emulación móvil + CPU 4x + red 4G lenta),
// más revisiones básicas de SEO y accesibilidad. No sustituye a Lighthouse: úsalo para detectar regresiones.
// Uso: node scripts/perf-check.mjs [baseUrl]
import { chromium, devices } from "@playwright/test";

const base = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices["Pixel 7"] });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
await cdp.send("Network.enable");
await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });

await page.addInitScript(() => {
  window.__m = { lcp: 0, cls: 0, longTasks: [] };
  new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__m.lcp = e.startTime))).observe({ type: "largest-contentful-paint", buffered: true });
  new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (window.__m.cls += e.value))).observe({ type: "layout-shift", buffered: true });
  new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__m.longTasks.push({ s: e.startTime, d: e.duration }))).observe({ type: "longtask", buffered: true });
});

await page.goto(base, { waitUntil: "load" });
await page.waitForTimeout(4000);
const m = await page.evaluate(() => {
  const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? 0;
  const tbt = window.__m.longTasks.filter((t) => t.s > fcp).reduce((a, t) => a + Math.max(0, t.d - 50), 0);
  return { fcp, lcp: window.__m.lcp, cls: window.__m.cls, tbt };
});
console.log(`FCP ${(m.fcp / 1000).toFixed(2)} s  (bueno < 1.8 s)`);
console.log(`LCP ${(m.lcp / 1000).toFixed(2)} s  (bueno < 2.5 s)`);
console.log(`CLS ${m.cls.toFixed(3)}      (bueno < 0.1)`);
console.log(`TBT ${Math.round(m.tbt)} ms     (bueno < 200 ms)`);

// SEO y a11y básicos
const seo = await page.evaluate(() => {
  const q = (s) => document.querySelector(s);
  return {
    lang: document.documentElement.lang,
    title: document.title,
    description: q('meta[name="description"]')?.content?.length ?? 0,
    canonical: q('link[rel="canonical"]')?.href,
    og: !!q('meta[property="og:title"]') && !!q('meta[property="og:image"]'),
    jsonld: [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => [JSON.parse(s.textContent)].flat().map((o) => o["@type"])),
    h1: document.querySelectorAll("h1").length,
    imgsSinAlt: [...document.images].filter((i) => !i.hasAttribute("alt")).length,
    botonesSinNombre: [...document.querySelectorAll("button, a")].filter((el) => !(el.textContent || "").trim() && !el.getAttribute("aria-label") && !el.getAttribute("aria-labelledby")).length,
    skip: !!q('a[href="#contenido"]'),
    viewport: !!q('meta[name="viewport"]'),
  };
});
console.log("SEO / a11y:", JSON.stringify(seo));
const robots = await fetch(`${base}/robots.txt`).then((r) => r.status);
const sitemap = await fetch(`${base}/sitemap.xml`).then((r) => r.status);
console.log(`robots.txt ${robots}, sitemap.xml ${sitemap}`);
await browser.close();
