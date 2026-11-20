import { services } from "@/content/services";
import { site } from "@/content/site";
import { SocialIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";

const f = site.footer;

const link =
  "inline-block py-1 text-[0.9688rem] text-mist/75 transition-colors duration-300 ease-out-expo hover:text-signal active:text-mist";

/** homePrefix: "/" cuando el footer vive fuera del home (los enlaces con ancla apuntan a la página principal). */
export function Footer({ homePrefix = "" }: { homePrefix?: string }) {
  return (
    <footer className="grain relative overflow-hidden bg-ink text-mist">
      <div aria-hidden className="bg-blueprint pointer-events-none absolute inset-0 -z-0 opacity-40" />
      <div className="container-site relative z-10 pb-10 pt-[clamp(3.5rem,2.5rem+4vw,6rem)]">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_0.8fr_1fr] lg:gap-10">
          <div className="max-w-[22rem]">
            <Logo className="h-6 text-mist md:h-7" />
            <p className="mt-5 text-[1rem] leading-relaxed text-mist/75">{site.brand.tagline}</p>
          </div>

          <nav aria-label={f.columns.services}>
            <h2 className="eyebrow text-signal">{f.columns.services}</h2>
            <ul className="mt-5 grid gap-0.5 sm:grid-cols-2 lg:grid-cols-1">
              {services.map((s) => (
                <li key={s.slug}>
                  <a href={`${homePrefix}#cotizar?servicio=${s.slug}`} className={link}>
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={f.columns.company}>
            <h2 className="eyebrow text-signal">{f.columns.company}</h2>
            <ul className="mt-5 grid gap-0.5">
              {f.company.map((l) => (
                <li key={l.href}>
                  <a href={l.href.startsWith("/") ? l.href : `${homePrefix}${l.href}`} className={link}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow text-signal">{f.columns.contact}</h2>
            <dl className="mt-5 grid gap-3">
              {(Object.keys(f.contactLabels) as (keyof typeof f.contactLabels)[]).map((k) => {
                const raw = site.contact[k];
                const value: string = Array.isArray(raw) ? raw.join(", ") : (raw as string);
                return (
                  <div key={k} className="grid grid-cols-[5.5rem_1fr] gap-3 text-[0.9688rem]">
                    <dt className="font-mono text-[0.75rem] uppercase leading-6 tracking-[0.08em] text-mist/60">{f.contactLabels[k]}</dt>
                    <dd className="text-mist/85">
                      {k === "email" ? (
                        <a href={`mailto:${value}`} className="transition-colors duration-300 hover:text-signal">
                          {value}
                        </a>
                      ) : k === "phone" ? (
                        <a href={`tel:+52${value.replace(/\D/g, "")}`} className="transition-colors duration-300 hover:text-signal">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <h2 className="eyebrow mt-8 text-signal">{f.columns.social}</h2>
            <ul className="mt-4 flex gap-3">
              {f.socials.map((so) => (
                <li key={so.id}>
                  <a
                    href={so.href}
                    aria-label={so.label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-cobalt/60 text-mist/85 transition-[border-color,color,background-color] duration-300 ease-out-expo hover:border-signal hover:text-signal active:bg-mist/10"
                  >
                    <SocialIcon id={so.id} className="h-5 w-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cobalt/40 pt-6 text-[0.875rem] text-mist/70 sm:flex-row sm:items-center sm:justify-between">
          <p>{f.legal}</p>
          <a href={f.privacy.href} className="underline underline-offset-4 transition-colors duration-300 hover:text-signal">
            {f.privacy.label}
          </a>
        </div>
      </div>
    </footer>
  );
}
