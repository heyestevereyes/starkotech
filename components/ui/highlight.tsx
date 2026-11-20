/**
 * Palabra o frase resaltada con bloque signal que se "pinta" de izquierda a derecha al cargar.
 * CSS puro (no espera a la hidratación): es parte del LCP del hero y el texto es visible desde el primer pintado.
 * Funciona aunque la frase se parta en varias líneas.
 */
export function Highlight({ children }: { children: string }) {
  return (
    <em
      className="highlight px-[0.14em] font-serif font-normal italic"
      style={{ fontSize: "1.1em", letterSpacing: "-0.01em", lineHeight: 1.12 }}
    >
      {children}
    </em>
  );
}
