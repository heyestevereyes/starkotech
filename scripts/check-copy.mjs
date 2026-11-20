// Busca guiones largos o guiones usados como puntuación en el copy visible (content/*.ts).
// Uso: node scripts/check-copy.mjs
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const dirs = ["content", "components", "app"];
let bad = 0;
const walk = (d) =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(d, e.name)) : /\.(ts|tsx)$/.test(e.name) ? [path.join(d, e.name)] : [],
  );

for (const f of dirs.flatMap(walk)) {
  const lines = readFileSync(f, "utf8").split("\n");
  lines.forEach((line, i) => {
    const code = line.trim();
    if (code.startsWith("//") || code.startsWith("*") || code.startsWith("/*")) return;
    // guión largo, guión medio, o guion simple rodeado de espacios dentro de un texto entre comillas
    const strings = [...line.matchAll(/(["'`])((?:\\.|(?!\1).)*)\1/g)].map((m) => m[2]);
    for (const s of strings) {
      if (s.includes("${")) continue; // expresiones de código, no copy
      if (/[—–]/.test(s) || /\s-\s/.test(s)) {
        console.log(`✗ ${f}:${i + 1}  ${s.slice(0, 90)}`);
        bad++;
      }
    }
  });
}
console.log(bad ? `\n${bad} textos con guiones como puntuación` : "Sin guiones largos ni guiones como puntuación en el copy");
process.exit(bad ? 1 : 0);
