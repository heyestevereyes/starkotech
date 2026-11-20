import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { LOGO_PATHS } from "@/components/ui/logo";

export const alt = site.seo.ogTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse no lee variables CSS: aquí los valores de la paleta se repiten a mano (ink, navy, cobalt, signal, mist).
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#EDF2F8",
          background:
            "radial-gradient(60% 50% at 50% 115%, rgba(91,200,255,0.55) 0%, rgba(91,200,255,0) 70%), radial-gradient(90% 80% at 75% 35%, #1C4F9C 0%, #06132A 70%)",
        }}
      >
        {/* Logo oficial completo en mist (proporción 1290 × 114) */}
        <svg width={452} height={40} viewBox="0 0 1290 114" fill="none">
          {LOGO_PATHS.map((d, i) => (
            <path key={i} d={d} fill="#EDF2F8" />
          ))}
        </svg>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3.5, lineHeight: 1.02 }}>{site.hero.title.lead}</div>
          <div style={{ display: "flex", marginTop: 16 }}>
            <div
              style={{
                background: "#5BC8FF",
                color: "#06132A",
                fontSize: 84,
                fontWeight: 700,
                letterSpacing: -3.5,
                lineHeight: 1.05,
                padding: "0 18px",
                borderRadius: 10,
              }}
            >
              {site.hero.title.words[0]}
            </div>
          </div>
        </div>
        <div style={{ fontSize: 28, color: "rgba(237,242,248,0.75)" }}>{site.brand.tagline}</div>
      </div>
    ),
    size,
  );
}
