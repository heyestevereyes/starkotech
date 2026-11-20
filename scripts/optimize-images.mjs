// Convierte cada PNG de public/images a JPG (calidad 82, máximo 2400px del lado largo, mozjpeg),
// sobrescribiendo el JPG placeholder del mismo nombre si existe.
// Uso: node scripts/optimize-images.mjs [--delete-png]
import sharp from "sharp";
import { readdirSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "public", "images");
const removePng = process.argv.includes("--delete-png");
let failed = 0;

for (const f of readdirSync(dir).filter((x) => x.toLowerCase().endsWith(".png"))) {
  const src = path.join(dir, f);
  const dest = path.join(dir, f.replace(/\.png$/i, ".jpg"));
  await sharp(src)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(dest);
  const kb = Math.round(statSync(dest).size / 1024);
  // Un placeholder pesa ~15 KB: si el resultado no pasa de 30 KB la conversión falló.
  // Entre 30 y 100 KB es normal en imágenes suaves, pero se avisa para revisarlas a ojo.
  const ok = kb > 30;
  if (!ok) failed++;
  const note = !ok ? "  (parece un placeholder: la conversión falló)" : kb < 100 ? "  (menos de 100 KB: revisar a ojo)" : "";
  console.log(`${ok ? "✓" : "✗"} ${path.basename(dest)}  ${kb} KB${note}`);
  if (ok && removePng) unlinkSync(src);
}
process.exit(failed ? 1 : 0);
