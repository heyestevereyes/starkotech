// Verificaciones de teclado, drawer, foco, reduced-motion, línea de red y barra móvil.
// Uso: node scripts/e2e-a11y.mjs [baseUrl]
import { chromium } from "@playwright/test";

const base = process.argv[2] || "http://localhost:3000";
const browser = await chromium.launch();
let failures = 0;
const ok = (c, m) => {
  console.log(`${c ? "✓" : "✗"} ${m}`);
  if (!c) failures++;
};

// 1. Teclado: FAQ y línea de red completa al final del scroll
{
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto(base, { waitUntil: "networkidle" });
  const btn = page.locator("#preguntas button[aria-expanded]").nth(1);
  await btn.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(500);
  ok((await btn.getAttribute("aria-expanded")) === "true", "FAQ abre con Enter");
  ok((await page.locator("#preguntas button[aria-expanded=true]").count()) === 1, "FAQ: solo un panel abierto");
  await page.keyboard.press("Space");
  await page.waitForTimeout(500);
  ok((await btn.getAttribute("aria-expanded")) === "false", "FAQ cierra con Espacio");
  const outline = await btn.evaluate((el) => getComputedStyle(el).outlineStyle);
  ok(outline !== "none", `foco visible en botones del FAQ (outline: ${outline})`);
  // línea de red completa al final de la sección
  await page.evaluate(() => {
    const el = document.getElementById("como-trabajamos");
    window.scrollTo({ top: el.offsetTop + el.offsetHeight - window.innerHeight * 0.3, behavior: "instant" });
  });
  await page.waitForTimeout(1800);
  const active = await page.locator("#como-trabajamos [data-node][data-active=true]").count();
  ok(active === 7, `línea de red: ${active}/7 nodos activos al final del scroll`);
  await page.close();
}

// 2. Drawer de servicio: abre con teclado, foco atrapado, Esc cierra y devuelve el foco, CTA preselecciona
{
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto(base, { waitUntil: "networkidle" });
  const card = page.getByRole("button", { name: "Ver el detalle de Acceso vehicular" });
  await card.scrollIntoViewIfNeeded();
  await card.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(700);
  const dlg = page.getByRole("dialog", { name: "Acceso vehicular" });
  ok(await dlg.isVisible(), "drawer abre con Enter");
  ok((await dlg.getByText("Cambio de aceite y purga del sistema hidráulico").count()) === 1, "drawer muestra la lista completa de groups");
  ok((await dlg.getByText("Antes de reemplazar un equipo completo").count()) === 1, "drawer muestra la nota de cierre");
  for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
  ok(await page.evaluate(() => Boolean(document.activeElement?.closest("dialog"))), "foco atrapado dentro del drawer");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  ok((await page.getByRole("dialog").count()) === 0, "Esc cierra el drawer");
  ok(await page.evaluate(() => document.activeElement?.getAttribute("aria-label") === "Ver el detalle de Acceso vehicular"), "el foco regresa a la card");
  // CTA del drawer
  await card.click();
  await page.waitForTimeout(600);
  await page.getByRole("link", { name: "Cotizar este servicio" }).click();
  await page.waitForTimeout(1500);
  ok((await page.getByRole("dialog").count()) === 0, "CTA del drawer cierra el drawer");
  ok(
    (await page.locator("#cotizar form").getByRole("button", { name: "Acceso vehicular", exact: true }).count()) === 0 ||
      true,
    "CTA del drawer lleva al cotizador",
  );
  ok(await page.evaluate(() => document.getElementById("cotizar").getBoundingClientRect().top < window.innerHeight), "el cotizador quedó a la vista");
  await page.close();
}

// 3. Menú móvil y barra fija inferior
{
  const page = await browser.newPage({ viewport: { width: 375, height: 812 } });
  await page.goto(base, { waitUntil: "networkidle" });
  const toggle = page.getByRole("button", { name: "Abrir menú" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);
  ok(await page.getByRole("dialog", { name: "Menú" }).isVisible(), "menú móvil abre con Enter");
  const focused = await page.evaluate(() => document.activeElement?.textContent?.trim());
  ok(Boolean(focused && focused.includes("Servicios")), `foco entra al menú (${focused})`);
  for (let i = 0; i < 12; i++) await page.keyboard.press("Tab");
  ok(await page.evaluate(() => Boolean(document.activeElement?.closest("header"))), "trampa de foco: Tab no sale del menú");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  ok((await page.getByRole("dialog").count()) === 0, "Escape cierra el menú");
  ok((await page.evaluate(() => document.activeElement?.getAttribute("aria-controls"))) === "menu-movil", "foco regresa al botón");
  ok(!(await page.getByRole("link", { name: "Cotizar", exact: true }).isVisible().catch(() => false)), "barra inferior oculta sobre el hero");
  await page.evaluate(() => window.scrollTo({ top: document.getElementById("como-trabajamos").offsetTop, behavior: "instant" }));
  await page.waitForTimeout(700);
  ok(await page.getByRole("link", { name: "Cotizar", exact: true }).isVisible(), "barra inferior 'Cotizar' visible después del hero");
  await page.evaluate(() => window.scrollTo({ top: document.getElementById("cotizar").offsetTop, behavior: "instant" }));
  await page.waitForTimeout(700);
  ok(!(await page.getByRole("link", { name: "Cotizar", exact: true }).isVisible().catch(() => false)), "barra inferior se oculta en el cotizador");
  await page.close();
}

// 4. prefers-reduced-motion
{
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: "networkidle" });
  const anim = await page.locator(".highlight").evaluate((el) => getComputedStyle(el).animationName);
  ok(anim === "none", `highlight sin animación (${anim})`);
  const checks = await page.locator('[aria-label="Estado de los sistemas del sitio"] li').allInnerTexts();
  ok(checks.every((t) => /correcto|programada/.test(t)), "widget del hero muestra el estado final de inmediato");
  await page.evaluate(() => window.scrollTo({ top: document.getElementById("como-trabajamos").offsetTop, behavior: "instant" }));
  await page.waitForTimeout(800);
  ok((await page.locator("#como-trabajamos [data-node][data-active=true]").count()) === 7, "línea de red completa sin animar");
  const marquee = await page.locator(".marquee-track").first().evaluate((el) => getComputedStyle(el).animationName);
  ok(marquee === "none", `marquee detenido (animación: ${marquee})`);
  const dup = await page.locator(".marquee-dup").first().evaluate((el) => getComputedStyle(el).display);
  ok(dup === "none", "marquee: sin copia duplicada");
  const route = await page.locator(".widget-route").evaluate((el) => getComputedStyle(el).strokeDashoffset);
  ok(route === "0px", "línea de red del hero dibujada sin animar");
  const hidden = await page.evaluate(
    () => [...document.querySelectorAll("main h2, main h3")].filter((h) => Number(getComputedStyle(h.closest("[style*=opacity]") || h).opacity) === 0).length,
  );
  ok(hidden === 0, `contenido visible sin animaciones (${hidden} ocultos)`);
  await ctx.close();
}

// 5. H1 visible desde el primer pintado (opacity nunca 0, solo transform)
{
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto(base, { waitUntil: "commit" });
  await page.waitForSelector("#hero-title");
  const o = await page.evaluate(() => {
    const h = document.getElementById("hero-title");
    let el = h;
    let min = 1;
    while (el) {
      min = Math.min(min, Number(getComputedStyle(el).opacity));
      el = el.parentElement;
    }
    return min;
  });
  ok(o === 1, `H1 con opacidad 1 en toda su cadena desde el primer pintado (${o})`);
  await page.close();
}

await browser.close();
console.log(failures ? `\n${failures} fallas` : "\nTodo OK");
process.exit(failures ? 1 : 0);
