import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { site } from "@/content/site";

export type Crumb = { label: string; href?: string };

/** Ruta de navegación para bandas oscuras. El último elemento es la página actual. */
export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label={site.shop.catalog.breadcrumbLabel}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[0.875rem] text-mist/70">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.label} className="flex items-center gap-1.5">
              {c.href && !last ? (
                <Link href={c.href} className="rounded-full py-1 transition-colors duration-300 hover:text-signal">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "py-1 text-mist" : "py-1"}>
                  {c.label}
                </span>
              )}
              {!last ? <ChevronRight className="h-3.5 w-3.5 text-mist/40" strokeWidth={1.75} aria-hidden /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
