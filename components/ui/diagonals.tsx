/** Formas diagonales signal. Solo en dos secciones: pólizas y CTA final. */
export function Diagonals({ variant = "plans", className = "" }: { variant?: "plans" | "cta"; className?: string }) {
  if (variant === "cta") {
    // Bandas signal inclinadas sobre el borde derecho de la foto; en móvil se ocultan para no tapar el texto
    return (
      <svg
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 hidden h-full w-full md:block ${className}`}
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path d="M80 100 L 90 0 L 94 0 L 84 100 Z" fill="var(--color-signal)" />
        <path d="M87 100 L 97 0 L 98.2 0 L 88.2 100 Z" fill="var(--color-signal)" opacity="0.55" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
    >
      <path d="M-10 62 L 110 34 L 110 46 L -10 76 Z" fill="var(--color-signal)" />
      <path d="M-10 80 L 110 52 L 110 55 L -10 83 Z" fill="var(--color-signal)" opacity="0.55" />
    </svg>
  );
}
