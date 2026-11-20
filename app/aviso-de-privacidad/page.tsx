import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { legal } from "@/content/legal";
import { site } from "@/content/site";
import { Logo } from "@/components/ui/logo";
import { Footer } from "@/components/sections/footer";

export const metadata: Metadata = {
  title: legal.title,
  description: `${legal.title} de ${site.brand.name} conforme a la LFPDPPP.`,
  alternates: { canonical: "/aviso-de-privacidad" },
  robots: { index: false, follow: true },
};

export default function AvisoPrivacidad() {
  return (
    <>
      <header className="bg-ink text-mist">
        <div className="container-site flex h-[4.5rem] items-center justify-between">
          <Link href="/" aria-label={`${site.brand.name}, ir al inicio`}>
            <Logo className="h-[18px] md:h-5" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 text-[0.9375rem] text-mist/75 transition-colors hover:text-signal">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {legal.back}
          </Link>
        </div>
      </header>
      <main id="contenido" className="on-light bg-mist py-16 md:py-24">
        <article className="container-site max-w-[46rem]">
          <p className="eyebrow inline-flex rounded-full bg-signal-soft px-3 py-2 text-cobalt">{legal.draft}</p>
          <h1 className="mt-6 text-[length:var(--text-h2)] font-semibold leading-[1.05] tracking-[var(--tracking-tight)] text-ink">
            {legal.title}
          </h1>
          <p className="mt-6 text-[1.0625rem] leading-relaxed text-graphite">{legal.intro}</p>
          <div className="mt-12 grid gap-10">
            {legal.sections.map((s) => (
              <section key={s.title} className="scroll-mt-24">
                <h2 className="text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">{s.title}</h2>
                {s.body.map((p, i) => (
                  <p key={i} className="mt-3 text-[1rem] leading-relaxed text-graphite">
                    {p}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer homePrefix="/" />
    </>
  );
}
