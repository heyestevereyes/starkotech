// Capturas de ajustes 02: navbar (transparente y sólido), hero (con línea de red ya dibujada), pólizas y footer.
// Uso: node scripts/ajustes02-shots.mjs [baseUrl]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import path from "node:path";

const base = process.argv[2] || "http://localhost:3000";
const out = path.join(process.cwd(), "screenshots", "a02");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
for (const width of [375, 768, 1024, 1366, 1920]) {
  const page = await browser.newPage({ viewport: { width, height: width < 768 ? 812 : 900 } });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(4200);
  await page.screenshot({ path: path.join(out, `nav-top-${width}.png`), clip: { x: 0, y: 0, width, height: 80 } });
  await page.addStyleTag({ content: "header, [data-floating]{visibility:hidden!important}" });
  await page.locator("#inicio").screenshot({ path: path.join(out, `hero-${width}.png`) });
  await page.addStyleTag({ content: "header{visibility:visible!important}" });
  await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
  await page.waitForTimeout(900);
  await page.screenshot({ path: path.join(out, `nav-solid-${width}.png`), clip: { x: 0, y: 0, width, height: 80 } });
  await page.addStyleTag({ content: "header, [data-floating]{visibility:hidden!important}" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 90));
    }
  });
  const pol = page.locator("#polizas");
  await pol.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  await pol.screenshot({ path: path.join(out, `polizas-${width}.png`) });
  const foot = page.locator("footer");
  await foot.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await foot.screenshot({ path: path.join(out, `footer-${width}.png`) });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  console.log(width, overflow > 0 ? `OVERFLOW ${overflow}` : "sin overflow");
  await page.close();
}
await browser.close();
