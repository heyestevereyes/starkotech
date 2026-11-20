"use client";

import Image from "next/image";
import { useState } from "react";
import { site } from "@/content/site";

export type GalleryImage = { src: string; alt: string };

/**
 * Galería del producto. Hoy cada producto trae una sola foto; con varias imágenes aparecen miniaturas
 * (botones con aria-pressed) sin tocar nada más. La imagen principal es la de mayor peso visual de la página.
 */
export function ProductGallery({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) return null;
  return (
    <div>
      <div className="on-light relative aspect-square overflow-hidden rounded-[var(--radius-card-lg)] border border-ink/[0.08] bg-mist shadow-[var(--shadow-soft)]">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          preload={active === 0}
          sizes="(min-width: 1280px) 40rem, (min-width: 1024px) 45vw, (min-width: 768px) 90vw, 100vw"
          quality={80}
          className="object-contain p-8 sm:p-12"
        />
      </div>
      {images.length > 1 ? (
        <ul aria-label={site.shop.detail.galleryLabel} className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                aria-label={img.alt}
                className={`relative h-20 w-20 overflow-hidden rounded-2xl border bg-mist transition-[border-color,transform] duration-300 ease-out-expo active:scale-95 ${
                  i === active ? "border-cobalt" : "border-ink/15 hover:border-ink/45"
                }`}
              >
                <Image src={img.src} alt="" fill sizes="80px" quality={70} className="object-contain p-2" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
