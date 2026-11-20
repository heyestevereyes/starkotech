const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "524420000000").replace(/\D/g, "") || "52";
const message = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || "Hola, necesito información sobre un servicio";

export const whatsappUrl = (text: string = message) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "";

/** Sin NEXT_PUBLIC_SITE_URL se usa localhost; configúrala en Vercel con el dominio final. */
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

/**
 * Modo revisión: mientras NEXT_PUBLIC_ALLOW_INDEXING no sea exactamente "true", el sitio se publica con noindex
 * (robots.txt con Disallow: / y metadata robots index:false). Al lanzar, define la variable en "true" y vuelve a desplegar
 * (es una variable NEXT_PUBLIC_, se fija al compilar).
 */
export const allowIndexing = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";
