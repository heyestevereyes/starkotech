import { services } from "@/content/services";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/contact";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Benefits } from "@/components/sections/benefits";
import { Audience } from "@/components/sections/audience";
import { Services } from "@/components/sections/services";
import { Products } from "@/components/sections/products";
import { Process } from "@/components/sections/process";
import { Documentation } from "@/components/sections/documentation";
import { Differentiators } from "@/components/sections/differentiators";
import { Plans } from "@/components/sections/plans";
import { Testimonials } from "@/components/sections/testimonials";
import { Quote } from "@/components/sections/quote";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";
import { Floating } from "@/components/sections/floating";
import { HashScroll } from "@/components/hash-scroll";

/** Quita marcas internas como [confirmar] del texto que se expone a buscadores. */
const clean = (s: string) => s.replace(/\s*\[[^\]]*\]/g, "").trim();

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: site.brand.legalName,
    url: siteUrl,
    image: `${siteUrl}/opengraph-image`,
    logo: `${siteUrl}/icon.svg`,
    description: clean(site.brand.description),
    // Datos de demo (ver site.contact): se actualizan solos al cambiar el contenido
    telephone: `+52${site.contact.phone.replace(/\D/g, "")}`,
    email: site.contact.email,
    address: { "@type": "PostalAddress", addressLocality: "Querétaro", addressRegion: "Querétaro", addressCountry: "MX" },
    areaServed: site.contact.zones.map((z) => ({ "@type": "City", name: z })),
    knowsLanguage: "es-MX",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: site.services.eyebrow,
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, description: s.short },
      })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: site.faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: clean(f.a) },
    })),
  },
];

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main id="contenido">
        <Hero />
        <Problem />
        <Benefits />
        <Audience />
        <Services />
        <Products />
        <Process />
        <Documentation />
        <Differentiators />
        <Plans />
        <Testimonials />
        <Quote />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <Floating />
      <HashScroll />
    </>
  );
}
