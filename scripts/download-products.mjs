// Descarga las 16 fotos de producto (Higgsfield), las convierte a JPG (calidad 82, máx 1600 px, mozjpeg)
// y las guarda como public/images/productos/<slug>.jpg. No deja PNG en disco.
// Si ya hay PNG hf_<...>_<id>.png en la carpeta, los usa (por el id del final del nombre) y los borra.
// Uso: node scripts/download-products.mjs
import sharp from "sharp";
import { mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "public", "images", "productos");
mkdirSync(dir, { recursive: true });

const C = "https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/";
const items = [
  ["camara-domo-ip-4mp", "0fbe31c8", "hf_20261118_220608_0fbe31c8-9c35-47c9-a60a-de89ee0f29b7.png"],
  ["camara-bala-ip-4mp-color", "59e0f46f", "hf_20261118_220608_59e0f46f-f0f0-4c85-97ad-cfe5aef06cb4.png"],
  ["camara-ptz-ip-4mp-25x", "f184d06b", "hf_20261118_220608_f184d06b-3979-489d-891b-3cef0ba246ae.png"],
  ["nvr-8-canales-poe", "1e1471eb", "hf_20261118_220608_1e1471eb-ef0b-4ab4-b6e9-511158299446.png"],
  ["kit-4-camaras-ip", "7e02393b", "hf_20261118_220607_7e02393b-90d5-4c54-94a2-6b628787aa8b.png"],
  ["switch-poe-8-puertos", "631428a2", "hf_20261118_220607_631428a2-2b87-48ba-81dd-e0ee8f05091e.png"],
  ["videoportero-ip-7", "0c20d3cc", "hf_20261118_220610_0c20d3cc-7b18-426c-9fdf-18612a21aee7.png"],
  ["lector-biometrico", "29ac3c55", "hf_20261118_220610_29ac3c55-98e2-4a04-811c-0c80557fa909.png"],
  ["barrera-vehicular", "28f33527", "hf_20261118_220609_28f33527-66cc-4359-9315-695ecdf5eb99.png"],
  ["electrificador-cerca", "89991b28", "hf_20261118_220607_89991b28-aa52-4ff0-bcfd-192e685e3ebf.png"],
  ["kit-alarma-inalambrica", "56d432b1", "hf_20261118_220608_56d432b1-43cf-4718-949a-27bccd005b89.png"],
  ["enlace-punto-a-punto", "c2e28aed", "hf_20261118_220610_c2e28aed-e8b8-4bd1-9a1f-c4222b692d64.png"],
  ["chapa-inteligente-huella", "62887005", "hf_20261118_220700_62887005-93f6-4a46-8aac-993ee5f07c82.png"],
  ["cerrojo-alta-seguridad", "f64686ae", "hf_20261118_220659_f64686ae-93ab-4833-bedf-a8e42b4349c1.png"],
  ["cerradura-electromagnetica", "b6da825d", "hf_20261118_220659_b6da825d-50f0-4088-9ab1-7b3c7021febc.png"],
  ["chapa-electrica-porton", "dff1fab9", "hf_20261118_220659_dff1fab9-a0ca-4e75-8df1-b9606882c650.png"],
];

const local = readdirSync(dir).filter((f) => /^hf_.*\.png$/i.test(f));
let failures = 0;
for (const [slug, id, file] of items) {
  const found = local.find((f) => f.includes(id));
  let input;
  try {
    if (found) {
      input = readFileSync(path.join(dir, found));
    } else {
      const res = await fetch(C + file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      input = Buffer.from(await res.arrayBuffer());
    }
    const out = path.join(dir, `${slug}.jpg`);
    const buf = await sharp(input).rotate().resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
    writeFileSync(out, buf);
    const kb = Math.round(statSync(out).size / 1024);
    const meta = await sharp(buf).metadata();
    // Fotos de estudio sobre fondo plano comprimen muy bien: falla solo si parece vacía (≤ 15 KB), avisa por debajo de 60 KB.
    const bad = kb <= 15;
    if (bad) failures++;
    console.log(`${bad ? "✗" : kb <= 60 ? "!" : "✓"} ${slug}.jpg  ${meta.width}x${meta.height}  ${kb} KB${bad ? "  (parece vacía)" : kb <= 60 ? "  (< 60 KB: revisada a ojo, fondo plano)" : ""}`);
    if (found) unlinkSync(path.join(dir, found));
  } catch (e) {
    failures++;
    console.log(`✗ ${slug}: ${e.message}`);
  }
}
console.log(failures ? `\n${failures} con problemas` : "\n16 imágenes listas");
process.exit(failures ? 1 : 0);
