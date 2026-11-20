/**
 * Preselección del cotizador desde cualquier CTA del sitio.
 * Formato del enlace: `#cotizar?tipo=visita&servicio=acceso-vehicular`.
 */

export const QUOTE_ID = "cotizar";
export const PRESET_EVENT = "quote-preset";

export type QuotePreset = { tipo?: string; servicio?: string };

/** Valores del paso 1 (tipo de servicio). Los CTAs usan los alias cortos. */
export const tipoAliases: Record<string, string> = {
  instalacion: "instalacion",
  falla: "falla",
  mantenimiento: "mantenimiento",
  visita: "visita",
  modernizacion: "modernizacion",
};

/** Convierte `#cotizar?tipo=visita&servicio=x` en { id, preset }. */
export function parseQuoteHash(hash: string): { id: string; preset: QuotePreset } {
  const raw = decodeURIComponent(hash.replace(/^#/, ""));
  const [id, query = ""] = raw.split("?");
  const params = new URLSearchParams(query);
  const preset: QuotePreset = {};
  const tipo = params.get("tipo");
  const servicio = params.get("servicio");
  if (tipo && tipoAliases[tipo]) preset.tipo = tipoAliases[tipo];
  if (servicio) preset.servicio = servicio;
  return { id, preset };
}

/** Avisa al formulario (esté o no montado) de la preselección pedida. */
export function announcePreset(preset: QuotePreset) {
  window.__quotePreset = preset;
  window.dispatchEvent(new CustomEvent<QuotePreset>(PRESET_EVENT, { detail: preset }));
}

declare global {
  interface Window {
    /** Última preselección, para el formulario que se monta tarde (carga diferida). */
    __quotePreset?: QuotePreset;
  }
}
