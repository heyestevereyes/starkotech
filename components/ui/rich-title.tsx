import { Fragment, type ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** Clase extra del fragmento acentuado */
  accentClassName?: string;
  id?: string;
};

/**
 * Renderiza un titular donde el fragmento entre *asteriscos* se muestra
 * en Instrument Serif itálica (acento editorial).
 */
export function RichTitle({ text, as: Tag = "h2", className = "", accentClassName = "", id }: Props) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <Tag id={id} className={className}>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") ? (
          <em
            key={i}
            className={`font-serif font-normal italic ${accentClassName}`}
            style={{ fontSize: "1.1em", letterSpacing: "-0.01em", lineHeight: 0.9 }}
          >
            {p.slice(1, -1)}
          </em>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </Tag>
  );
}

/** Eyebrow en Geist Mono. En oscuro usa signal; en claro usa cobalt (signal no contrasta sobre mist ni paper). */
export function Eyebrow({
  children,
  tone = "dark",
  className = "",
}: {
  children: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p className={`eyebrow inline-flex items-center gap-2.5 ${tone === "dark" ? "text-signal" : "text-cobalt"} ${className}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${tone === "dark" ? "bg-signal" : "bg-cobalt"}`} />
      {children}
    </p>
  );
}
