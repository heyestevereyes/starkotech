import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { site } from "@/content/site";
import { allowIndexing, siteUrl } from "@/lib/contact";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { MotionProvider } from "@/components/motion-provider";
import { QuoteHost } from "@/components/products/quote-host";
import { QuoteListProvider } from "@/lib/quote-list";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.seo.title,
    template: `%s | ${site.brand.name}`,
  },
  description: site.seo.description,
  applicationName: site.brand.name,
  alternates: { canonical: "/" },
  keywords: site.seo.keywords as unknown as string[],
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "/",
    siteName: site.brand.name,
    title: site.seo.ogTitle,
    description: site.seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.ogTitle,
    description: site.seo.description,
  },
  // Modo revisión: noindex y nofollow salvo que NEXT_PUBLIC_ALLOW_INDEXING sea "true"
  robots: allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#06132a",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es-MX"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body>
        <a
          href="#contenido"
          className="sr-only z-[100] rounded-full bg-signal px-5 py-3 font-medium text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          {site.nav.skip}
        </a>
        <MotionProvider>
          <QuoteListProvider>
            {children}
            <QuoteHost />
          </QuoteListProvider>
        </MotionProvider>
        <AnalyticsScripts />
      </body>
    </html>
  );
}
