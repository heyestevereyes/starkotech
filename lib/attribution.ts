const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
const META_STORE = "starko_attribution";

/** Atribución de la visita (UTM, referrer, página). Se guarda en sessionStorage para conservarla entre páginas. */
export function readAttribution() {
  const meta: Record<string, string> = {};
  try {
    const saved = sessionStorage.getItem(META_STORE);
    if (saved) Object.assign(meta, JSON.parse(saved));
  } catch {}
  const params = new URLSearchParams(window.location.search);
  UTM_KEYS.forEach((k) => {
    const v = params.get(k);
    if (v) meta[k] = v.slice(0, 200);
  });
  if (!meta.referrer && document.referrer) meta.referrer = document.referrer.slice(0, 500);
  meta.page = window.location.href.slice(0, 500);
  try {
    sessionStorage.setItem(META_STORE, JSON.stringify(meta));
  } catch {}
  return meta;
}
