// Capturas a 375, 768, 1024, 1366 y 1920px (página completa o una sección).
// Uso: node scripts/screenshots.mjs [baseUrl] [--only=375,1366] [--path=/] [--sel=#servicios] [--name=servicios]
// Con --sel captura solo ese elemento y genera montajes para revisar los 5 anchos con pocas imágenes:
//   <name>-narrow.png (375 + 768), <name>-1024.png, <name>-wide.png (1366 + 1920 escalados)
import { chromium } from "@playwright/test";
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const arg = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split("=").slice(1).join("=");
const base = args.find((a) => a.startsWith("http")) || "http://localhost:3000";
const only = arg("only")?.split(",").map(Number);
const route = arg("path") || "/";
const sel = arg("sel");
const label = arg("name") || (sel ? sel.replace(/\W+/g, "") : route === "/" ? "home" : route.replace(/\W+/g, ""));
const widths = only ?? [375, 768, 1024, 1366, 1920];
const outDir = path.join(process.cwd(), "screenshots");
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const files = [];
for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: width < 768 ? 812 : 900 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(base + route, { waitUntil: "networkidle" });
  // recorre la página para disparar animaciones de viewport y carga diferida
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.35;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 160));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    await new Promise((r) => setTimeout(r, 2200));
  });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const file = path.join(outDir, `${label}-${width}.png`);
  if (sel) {
    await page.addStyleTag({ content: "header, [data-floating]{visibility:hidden!important}" });
    const el = page.locator(sel).first();
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1600);
    await el.screenshot({ path: file });
  } else {
    await page.screenshot({ path: file, fullPage: true });
  }
  files.push({ file, width });
  console.log(
    `✓ ${path.basename(file)}${overflow > 0 ? `  ⚠ overflow horizontal ${overflow}px` : ""}${
      errors.length ? `  ⚠ errores: ${errors.slice(0, 2).join(" | ")}` : ""
    }`,
  );
  await page.close();
}
await browser.close();

async function montage(name, list, maxW) {
  const present = files.filter((f) => list.includes(f.width));
  if (present.length < 2) return;
  const gap = 24;
  const natural = present.reduce((a, f) => a + f.width, 0) + gap * (present.length - 1);
  const k = Math.min(1, maxW / natural);
  const tiles = await Promise.all(
    present.map(async ({ file }) => {
      const meta = await sharp(file).metadata();
      const buf = await sharp(file)
        .resize(Math.round(meta.width * k))
        .png()
        .toBuffer();
      const m2 = await sharp(buf).metadata();
      return { buf, w: m2.width, h: m2.height };
    }),
  );
  const H = Math.max(...tiles.map((t) => t.h));
  const W = tiles.reduce((a, t) => a + t.w, 0) + gap * (tiles.length - 1);
  let x = 0;
  const comps = tiles.map((t) => {
    const c = { input: t.buf, left: x, top: 0 };
    x += t.w + gap;
    return c;
  });
  await sharp({ create: { width: W, height: H, channels: 3, background: "#ff00ff" } })
    .composite(comps)
    .png()
    .toFile(path.join(outDir, `${label}-${name}.png`));
  console.log(`✓ ${label}-${name}.png`);
}
if (sel) {
  await montage("narrow", [375, 768], 1200);
  await montage("wide", [1366, 1920], 1560);
}
