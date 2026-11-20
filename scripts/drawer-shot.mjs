// Captura el drawer de un servicio abierto. Uso: node scripts/drawer-shot.mjs [slug] [baseUrl]
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const slug = process.argv[2] || "acceso-vehicular";
const name = { "acceso-vehicular": "Acceso vehicular", redes: "Redes", mantenimiento: "Mantenimiento" }[slug] || slug;
const base = process.argv[3] || "http://localhost:3000";
mkdirSync("screenshots", { recursive: true });
const browser = await chromium.launch();
for (const [w, h] of [[375, 812], [768, 1000], [1366, 900]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(base, { waitUntil: "networkidle" });
  const card = page.getByRole("button", { name: `Ver el detalle de ${name}` });
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `screenshots/drawer-${slug}-${w}.png` });
  console.log("✓", `drawer-${slug}-${w}.png`);
  await page.close();
}
await browser.close();
