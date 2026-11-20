type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/** Empuja un evento a dataLayer (GTM y GA4) y, si aplica, a Meta Pixel. Sin scripts configurados no hace nada visible. */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
  if (event === "generate_lead" && typeof window.fbq === "function") {
    window.fbq("track", "Lead", params);
  }
}

export const trackCta = (location: string, label: string) =>
  track("cta_click", { cta_location: location, cta_label: label });
