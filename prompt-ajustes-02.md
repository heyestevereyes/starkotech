# Ajustes 02: marca Starko Tech y hero sin el panel encimado

Sigue `CLAUDE.md`. Todo el copy en `content/`. Sin guiones como puntuación en textos visibles.

---

## 1. Marca: Starko Tech

El nombre real de la empresa es **Starko Tech**. Reemplaza "Nodo" en todo el proyecto.

### Logo

- El logo oficial está en `public/brand/starko-logo.svg` (wordmark "STARKO TECH", relleno blanco, proporción 1290 × 114).
- Crea `components/ui/logo.tsx` con el SVG **inline** (no `<img>`), cambiando `fill="white"` por `fill="currentColor"` en todos los paths, para que tome el color del contexto: `text-mist` sobre fondos oscuros y `text-ink` sobre claros. `role="img"` y `aria-label="Starko Tech"`.
- Sustituye `Wordmark` por `Logo` en navbar, footer, aviso de privacidad y menú móvil. Borra `components/ui/wordmark.tsx` y el campo `descriptor` si ya no se usa.
- Alturas: navbar `h-[18px]` en móvil y `h-5` desde `md` (unos 226px de ancho). Footer `h-6` a `h-7`. Verifica que en 375px quepan logo y hamburguesa sin apretarse.
- Navbar en estado sólido (con blur): el logo sigue en `mist`.
- **Favicon y OG:** crea `app/icon.svg` con la "S" del logo (es el path que empieza con `M97.02 76.3699`, ocupa aprox. x 0 a 105, y 0 a 114) centrada en blanco sobre un cuadrado `cobalt` con radio 22%. En `app/opengraph-image.tsx` usa el logo completo en `mist` sobre el degradado del hero.

### Datos de marca (`site.ts`, `legal.ts`, `layout.tsx`, `opengraph-image.tsx`)

- `name`: "Starko Tech"
- `legalName`: "Starko Tech" // demo: validar razón social con cliente
- Correo: `contacto@starkotech.mx` // demo: validar con cliente
- Título SEO: "Starko Tech | Seguridad, tecnología y automatización en Querétaro"
- Descripción y JSON-LD: cambia "Nodo" por "Starko Tech".
- Footer legal: "© 2026 Starko Tech. Todos los derechos reservados."
- Aviso de privacidad: "Starko Tech (en adelante, “Starko Tech”)" y el correo nuevo.
- Al terminar, `grep -ri "nodo"` en `app`, `components`, `content` y `lib` debe dar cero resultados (cuida no romper palabras como "nodos" de la línea de red si aparecen en comentarios o nombres de clases; solo se cambia la marca).

---

## 2. Hero: el panel blanco ya no se encima en la foto

Problema actual: `SitePanel` (card blanca grande) tapa media foto del técnico y compite con el H1. Solución: la foto queda limpia y protagonista, y el estado del sitio pasa a una **barra de estado compacta en vidrio oscuro** dentro de la foto. El panel completo se mueve a la sección de pólizas, donde tiene más sentido.

### 2.1 Quita el panel del hero

- En `hero.tsx` elimina el bloque `<SitePanel />` y su contenedor con `-mt-20 / lg:absolute lg:-left-14`.
- Elimina también el chip `floatChips.mid` ("Instalación terminada"). Se queda solo el chip superior `CAM-07 · Domo IP 4MP · En línea`.

### 2.2 Nueva barra de estado dentro de la foto (`components/sections/hero-status.tsx`)

Card de vidrio oscuro anclada abajo dentro de la foto (`absolute inset-x-3 bottom-3`, `sm:inset-x-4 sm:bottom-4`), por encima del degradado que ya existe:

- Estilo: `bg-ink/60 backdrop-blur-md border border-mist/10 rounded-[20px]`, padding 14 a 16px, texto `mist`. Nada de fondo blanco.
- **Fila superior:** a la izquierda, en mono pequeño `FRACC-014 · Acceso principal`; a la derecha el badge `● En línea` (punto `online` pulsando, texto `signal` en mono).
- **Debajo, grid de 4 estados** (`grid-cols-2` en móvil y en la columna del hero; `grid-cols-4` en tablet cuando la foto va a todo el ancho). Cada celda:
  - Código en mono `signal` (`CAM`, `ACC`, `PER`, `RED`)
  - Valor en `mist` 14px: `24/24 en línea` · `Pluma operativa` · `Cerca armada` · `Enlace 98%`
  - Check pequeño a la derecha que aparece en secuencia al cargar (misma lógica de tiempos que tenía `SitePanel`, 600ms entre cada uno, todo visible de inmediato con `prefers-reduced-motion`).
- Altura total: no más del 30% de la foto. El encuadre de la imagen se ajusta para que la cara y las manos del técnico queden en el 60% superior (`object-position` aprox. `50% 22%`; revisa en cada ancho).
- Datos en `site.hero.status` (reutiliza los de `widget`, sin el renglón de próxima visita ni el botón).

### 2.3 Línea de red

La línea signal que conectaba el texto con el panel ahora conecta con el **borde izquierdo de la card de la foto**, entrando a la altura de la barra de estado y terminando en un nodo con pulso sobre ese borde. Solo en `lg+`, y sin cruzar por encima del H1 ni de los botones.

### 2.4 Responsive del hero

- **≥1280:** columna derecha 32rem, foto 3:4.
- **1024 a 1279:** columna 26rem, foto 3:4.5. Revisa que la barra de estado no se corte ni se amontone en 2 columnas.
- **768 a 1023:** foto a todo el ancho debajo del texto en 16:10, barra de estado en 4 columnas.
- **<768:** foto 4:5 (más alta que la actual 4:3 para que quepan técnico y barra), barra en 2 columnas.

### 2.5 El panel completo se muda a Pólizas

- Mueve `SitePanel` (tal cual, con su botón "Ver memoria técnica" que ahora apunta a `#memoria-tecnica`) a la sección de pólizas, a la derecha del encabezado en escritorio, en dos columnas: izquierda eyebrow + H2 + texto; derecha el panel con un leve `rotate(-2deg)` que se endereza al hacer hover. Encima del panel, una etiqueta en mono: "ASÍ SE VE TU PÓLIZA".
- En tablet y móvil va debajo del texto y antes de las 3 cards, centrado, `max-w-[22rem]`.
- Quita la línea de red alrededor del panel en esa ubicación (ya no conecta con nada); deja solo la sombra y el borde.

---

## 3. Verificación

- Capturas de Playwright a 375, 768, 1024, 1366 y 1920px del navbar, hero, pólizas y footer.
- Confirma en cada captura que la barra de estado no tapa la cara del técnico y que el logo se lee bien en navbar transparente y sólido.
- `npm run build` sin errores ni warnings.
- Lista final de datos `// demo: validar con cliente` actualizada.
