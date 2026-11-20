// Verifica el contraste WCAG 2.1 de cada combinación de la paleta que usa el sitio.
// Uso: npm run test:contrast   (lee los tokens de app/globals.css)
import { readFileSync } from "node:fs";

const css = readFileSync("app/globals.css", "utf8");
const tok = Object.fromEntries([...css.matchAll(/--color-([a-z-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));

const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
/** Mezcla fg con alpha sobre bg (para texto con opacidad) */
const over = (fg, bg, a) => {
  const mix = (i) => Math.round(parseInt(fg.slice(i, i + 2), 16) * a + parseInt(bg.slice(i, i + 2), 16) * (1 - a));
  return "#" + [1, 3, 5].map((i) => mix(i).toString(16).padStart(2, "0")).join("");
};
const ratio = (a, b) => {
  const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

// [texto, fondo, mínimo, descripción, alpha opcional]
const pairs = [
  // Sobre oscuros
  ["mist", "ink", 4.5, "Texto principal sobre ink"],
  ["mist", "navy", 4.5, "Texto principal sobre navy"],
  ["mist", "cobalt", 4.5, "Texto principal sobre cobalt"],
  ["mist", "ink", 4.5, "Texto secundario mist/75 sobre ink", 0.75],
  ["mist", "navy", 4.5, "Texto secundario mist/70 sobre navy", 0.7],
  ["mist", "ink", 4.5, "Texto terciario mist/60 sobre ink", 0.6],
  ["signal", "ink", 4.5, "Signal (eyebrow, números) sobre ink"],
  ["signal", "navy", 4.5, "Signal sobre navy"],
  ["signal", "cobalt", 3, "Signal sobre cobalt (solo texto grande o gráfico)"],
  ["online", "ink", 4.5, "Estado en línea sobre ink"],
  // Botones
  ["ink", "signal", 4.5, "Botón primario: ink sobre signal"],
  ["mist", "ink", 4.5, "Botón ink: mist sobre ink"],
  ["ink", "signal-soft", 4.5, "Chip: ink sobre signal-soft"],
  // Sobre claros
  ["ink", "mist", 4.5, "Texto principal sobre mist"],
  ["ink", "paper", 4.5, "Texto principal sobre paper"],
  ["graphite", "mist", 4.5, "Texto secundario graphite sobre mist"],
  ["graphite", "paper", 4.5, "Texto secundario graphite sobre paper"],
  ["cobalt", "mist", 4.5, "Eyebrow y acentos cobalt sobre mist"],
  ["cobalt", "paper", 4.5, "Acentos cobalt sobre paper"],
  ["cobalt", "signal-soft", 4.5, "Cobalt sobre signal-soft (chips)"],
  ["alert", "paper", 4.5, "Error sobre paper"],
  ["alert", "alert-soft", 4.5, "Error sobre su fondo suave"],
  ["steel", "mist", 3, "Steel sobre mist (solo texto grande ≥ 24px o gráfico)"],
  // Debe FALLAR: confirma la regla
  ["signal", "mist", 4.5, "REGLA: signal como texto sobre mist NO debe usarse", undefined, true],
  ["signal", "paper", 4.5, "REGLA: signal como texto sobre paper NO debe usarse", undefined, true],
];

let bad = 0;
for (const [fg, bg, min, desc, alpha, shouldFail] of pairs) {
  const f = alpha ? over(tok[fg], tok[bg], alpha) : tok[fg];
  const r = ratio(f, tok[bg]);
  const pass = r >= min;
  const ok = shouldFail ? !pass : pass;
  if (!ok) bad++;
  console.log(`${ok ? "✓" : "✗"} ${r.toFixed(2).padStart(5)}:1  (mín ${min})  ${desc}${shouldFail ? "  [falla a propósito: confirmado]" : ""}`);
}
console.log(bad ? `\n${bad} combinaciones fuera de norma` : "\nContraste AA verificado en todas las combinaciones");
process.exit(bad ? 1 : 0);
