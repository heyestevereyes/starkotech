# CLAUDE.md · Estándares del proyecto

Sitio web de [NOMBRE], empresa de seguridad electrónica, tecnología y automatización. Sistema de diseño derivado de Shipply (`heyestevereyes/shipply`) en paleta azul.

## Stack

- Next.js (App Router) + TypeScript estricto. Antes de escribir código lee la guía local en `node_modules/next/dist/docs/`: esta versión tiene cambios respecto a tu entrenamiento. Atiende avisos de deprecación.
- Tailwind v4 con tokens en `@theme` dentro de `app/globals.css`. No existe `tailwind.config.ts` y no se crea.
- Framer Motion para entradas y microinteracciones. GSAP + ScrollTrigger solo para animaciones ligadas al scroll (línea de red).
- react-hook-form + zod para formularios. Lucide para iconos (trazo 1.5px).
- Despliegue en Vercel. Dominio en GoDaddy.

## Arquitectura

- `content/site.ts`: todo el copy del sitio en un objeto tipado. Ningún texto visible se escribe directo en un componente.
- `content/services.ts`: catálogo completo de servicios. Fuente única para el home y las futuras páginas `/servicios/[slug]`.
- `components/ui/*`: primitivas reutilizables (`PillButton`, `RichTitle`, `Highlight`, `AnimatedSection`, `Counter`, `Diagonals`, `Wordmark`).
- `components/sections/*`: una sección por archivo.
- `lib/*`: analítica, contacto, esquema de leads. `app/api/lead/route.ts`: envío al webhook.
- Datos pendientes de confirmar se marcan `[confirmar]` o `[XX]` dentro del texto. El nombre de marca vive solo en `site.brand.name`.

## Diseño

- Usa exclusivamente los tokens de `@theme` (ink, navy, cobalt, signal, signal-soft, mist, paper, steel, graphite, online). Nada de hex sueltos en componentes.
- Tipografía: Geist (titulares y cuerpo), Instrument Serif itálica (acentos), Geist Mono (eyebrows, IDs, datos técnicos).
- Escala fluida con `clamp()`. Radios de card 24 a 28px. Sombras de los tokens.
- Alternar secciones oscuras y claras. Diagonales signal en máximo 2 secciones.
- Iconografía lineal y consistente. Nada de candados gigantes, escudos 3D ni estética hacker.

## Copy

- Español de México, tuteo, tono profesional y cercano.
- Prohibido usar guiones largos o guiones como puntuación en cualquier texto visible. Usa puntos, comas o dos puntos.
- Sin discurso de miedo ni exageraciones.

## Responsive

- Diseñar móvil, tablet y escritorio con criterio propio. Tablet (768 a 1024px) se diseña explícitamente con `md:` y `lg:` en todas las secciones.
- Verificación obligatoria con Playwright (devDependency) a 375, 768, 1024, 1366 y 1920px. Revisar cada captura y corregir antes de dar algo por terminado.

## Interacción y calidad

- Toda animación de entrada usa `AnimatedSection`. Nada de animaciones ad hoc por sección.
- Todo respeta `prefers-reduced-motion`.
- Hover, focus y active definidos en cada elemento interactivo. Transiciones con curvas `cubic-bezier(0.22, 1, 0.36, 1)`.
- El H1 y el subtítulo del hero son visibles desde el primer pintado (solo transform, sin opacity 0) para cuidar el LCP.

## Accesibilidad

- WCAG 2.1 AA. Contraste verificado en cada combinación: signal no se usa como texto sobre mist ni paper.
- Foco visible, navegación completa por teclado, `<dialog>` con foco atrapado y cierre con Esc, `alt` descriptivos, enlace "Saltar al contenido".

## Rendimiento y SEO

- `next/image` con AVIF/WebP, `sizes` correctos, `priority` solo en el hero.
- Lighthouse móvil 90+ en las cuatro categorías.
- Metadata completa, Open Graph, sitemap, robots, JSON-LD `LocalBusiness` y `FAQPage`.

## Definición de terminado

- `npm run build` y `npm run lint` sin errores ni warnings.
- Capturas de Playwright revisadas en los 5 anchos.
- Al cerrar cada tarea, listar los `[confirmar]`, `[XX]` y placeholders nuevos.
