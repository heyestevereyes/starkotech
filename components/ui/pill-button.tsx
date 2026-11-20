"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { trackCta } from "@/lib/analytics";

type Variant = "signal" | "ink" | "outline-dark" | "outline-light";

const styles: Record<Variant, string> = {
  signal:
    "bg-signal text-ink shadow-[0_10px_30px_-12px_color-mix(in_srgb,var(--color-signal)_60%,transparent)] hover:bg-signal-soft active:bg-signal",
  ink: "bg-ink text-mist hover:bg-navy active:bg-ink",
  "outline-dark": "border border-mist/30 text-mist hover:border-signal hover:text-signal active:bg-mist/5",
  "outline-light": "on-light border border-ink/30 text-ink hover:border-ink hover:bg-ink/[0.05] active:bg-ink/10",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: "md" | "lg";
  /** Ubicación del CTA para analítica */
  location: string;
  className?: string;
  arrow?: boolean;
  icon?: ReactNode;
  external?: boolean;
  onClick?: () => void;
};

/** Botón píldora con flecha que se desplaza y efecto magnético sutil. */
export function PillButton({
  href,
  children,
  variant = "signal",
  size = "md",
  location,
  className = "",
  arrow = true,
  icon,
  external,
  onClick,
}: Props) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 6);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const sizes = size === "lg" ? "h-14 px-7 text-[1.0625rem]" : "h-12 px-6 text-[0.9375rem]";
  const label = typeof children === "string" ? children : "";

  return (
    <m.a
      href={href}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => {
        trackCta(location, label);
        onClick?.();
      }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group relative inline-flex select-none items-center justify-center gap-2.5 whitespace-nowrap rounded-full font-medium tracking-[-0.01em] transition-[background-color,border-color,color] duration-300 ease-out-expo ${sizes} ${styles[variant]} ${className}`}
    >
      {icon ? <span className="inline-flex h-[1.15em] w-[1.15em] [&>svg]:h-full [&>svg]:w-full">{icon}</span> : null}
      <span>{children}</span>
      {arrow ? (
        <span className="relative -mr-1 inline-flex h-[1.1em] w-[1.1em] overflow-hidden" aria-hidden>
          <ArrowRight
            className="absolute inset-0 h-full w-full transition-transform duration-300 ease-out-expo group-hover:translate-x-[120%]"
            strokeWidth={1.75}
          />
          <ArrowRight
            className="absolute inset-0 h-full w-full -translate-x-[120%] transition-transform duration-300 ease-out-expo group-hover:translate-x-0"
            strokeWidth={1.75}
          />
        </span>
      ) : null}
    </m.a>
  );
}
