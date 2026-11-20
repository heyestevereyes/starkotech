# Prompt para Claude Code: Sitio web de seguridad electrónica, tecnología y automatización

> Fase 1: home page completa (landing de conversión) con todo el contenido de servicios ya estructurado en datos, lista para escalar a páginas por servicio en la fase 2.
> Nombre de marca pendiente: usa `[NOMBRE]` en todo el sitio. Vive en un solo lugar (`site.brand.name`) para cambiarlo después en un minuto.

---

## Rol y objetivo

Actúa como diseñador de producto senior y desarrollador frontend senior. Vas a diseñar y construir el sitio de **[NOMBRE]**, una empresa mexicana de seguridad electrónica, control de accesos, acceso vehicular, redes, automatización, mantenimiento técnico y soporte. Atiende tanto a clientes residenciales como a fraccionamientos, condominios, administraciones de edificios, empresas, comercios, industria y estacionamientos.

La página tiene un trabajo principal: convertir visitas en **solicitudes de cotización, visitas técnicas o diagnósticos**. Cada sección empuja hacia esa acción.

Mensaje central que debe quedar claro en 5 segundos: **"Seguridad, tecnología y automatización en un solo proveedor."** No somos un instalador de cámaras: somos un proveedor técnico integral que atiende desde una falla sencilla hasta un proyecto completo de infraestructura, con diagnóstico, instalación, reparación, programación, mantenimiento y soporte.

La imagen debe sentirse: profesional, tecnológica, moderna, confiable, técnica, ordenada, premium pero accesible, y hablarle igual a una empresa que a un particular.

El resultado debe verse diseñado y codeado por un estudio profesional: criterio tipográfico, ritmo visual, espacios generosos y microinteracciones pulidas. Nada que se vea a plantilla genérica de "empresa de cámaras".

Sigue el `CLAUDE.md` del proyecto como estándar de desarrollo y calidad.

---

## Paso 0: Antes de escribir código

1. **Sistema base: Shipply.** Este sitio usa el mismo lenguaje de diseño y la misma arquitectura que la landing de Shipply (repo `https://github.com/heyestevereyes/shipply`). Clónalo en una carpeta temporal fuera del proyecto y estúdialo antes de empezar:
   - `app/globals.css`: estructura de tokens `@theme`, utilidades (`container-site`, `section-y`, `eyebrow`, `grain`), degradados `.bg-hero` y `.bg-final`, animaciones `rise`, `rise-soft`, `highlight-block`.
   - `components/ui/*`: `PillButton`, `RichTitle`, `Highlight`, `AnimatedSection`, `Counter`, `Diagonals`, `Wordmark`, `icons`.
   - `components/sections/*`: navbar con blur al scroll, hero de dos columnas con widget flotante, proceso con línea animada por GSAP, bento de servicios con mini dashboard en UI, planes con card central destacada, cotizador multi paso, FAQ, CTA final, footer, flotantes (WhatsApp y barra móvil).
   - `content/site.ts`, `lib/lead-schema.ts`, `lib/analytics.ts`, `lib/contact.ts`, `app/api/lead/route.ts`, `scripts/screenshots.mjs`.
2. **Reutiliza, no copies a ciegas.** Porta los componentes de `ui/`, la utilería de `lib/`, la API de leads y los scripts de Playwright, y adapta tokens, copy e iconos. Las secciones se rediseñan con el contenido de este brief, conservando el mismo nivel de acabado.
3. Escríbeme en 5 a 8 líneas la dirección visual y el plan de secciones. Luego construye sin esperar confirmación.
4. Construye sección por sección y verifica cada una visualmente antes de pasar a la siguiente.

---

## Stack y estándares técnicos

Igual que Shipply:

- **Next.js** (App Router) + TypeScript. Lee la guía local de Next en `node_modules/next/dist/docs/` antes de escribir código: la versión tiene cambios respecto a lo que conoces.
- **Tailwind v4** con tokens vía `@theme` en `globals.css` (sin `tailwind.config.ts`).
- **Framer Motion** para entradas y microinteracciones; **GSAP + ScrollTrigger** para la línea de red del proceso y momentos ligados al scroll.
- `AnimatedSection` reutilizable en lugar de animaciones ad hoc. Todo respeta `prefers-reduced-motion`.
- **react-hook-form + zod** para el cotizador.
- **Lucide** para iconografía, trazo 1.5px.
- **Todo el copy** vive en `/content/site.ts`. **Todo el catálogo de servicios** vive en `/content/services.ts` (ver estructura abajo). Los datos por confirmar llevan `[confirmar]` o `[XX]`.
- `next/image` con AVIF/WebP, `sizes` correctos, `priority` solo en el hero.
- Idioma `es-MX`. Metadata completa, Open Graph, favicon, JSON-LD de `LocalBusiness` (tipo `HomeAndConstructionBusiness` o `ProfessionalService`) con `areaServed` y `FAQPage`.
- Accesibilidad WCAG 2.1 AA, foco visible, teclado completo en menú, FAQ y formulario.
- Lighthouse móvil 90+ en las cuatro categorías. Despliegue en Vercel.

### Responsive

Escala fluida con `clamp()`. Móvil y tablet diseñados con criterio propio, no escritorio encogido. Tablet (768 a 1024px) diseñado explícitamente con `md:` y `lg:` en **todas** las secciones.

Verificación obligatoria con Playwright a **375, 768, 1024, 1366 y 1920px**. Revisa cada captura, corrige y repite hasta que todo esté limpio.

---

## Dirección visual

### Concepto

**"Todo conectado, todo bajo control."** Donde Shipply tenía una ruta de embarque, aquí el hilo gráfico es una **línea de red**: un trazo fino en azul señal que se dibuja con el scroll y conecta nodos (pequeños puntos con pulso, como dispositivos en una topología de red) entre las secciones clave. Debe sentirse técnico, preciso y elegante. Nada de clichés de "hacker", candados gigantes, escudos 3D ni código matrix.

Recursos gráficos permitidos con moderación: retícula fina tipo plano técnico (blueprint) en fondos oscuros a muy baja opacidad, indicadores de estado (punto verde "en línea"), etiquetas en mono tipo ID de dispositivo (`CAM-07`, `NVR-01`, `SW-POE-02`).

### Paleta (tokens en `@theme`)

Misma estructura de Shipply, trasladada a azules. Mantén los nombres de rol para que el port sea directo.

| Token | Hex | Equivale en Shipply | Uso |
|---|---|---|---|
| `--color-ink` | `#06132A` | ink | Fondo oscuro principal, footer |
| `--color-navy` | `#0C2347` | forest | Secciones oscuras secundarias, cards sobre ink |
| `--color-cobalt` | `#1C4F9C` | moss | Degradados, bordes en oscuro |
| `--color-signal` | `#5BC8FF` | lime | Acento, CTA principal, resaltados, números, línea de red |
| `--color-signal-soft` | `#D5F0FF` | lime-soft | Fondos de chips y estados |
| `--color-mist` | `#EDF2F8` | cream | Secciones claras |
| `--color-paper` | `#F8FAFD` | paper | Cards sobre mist |
| `--color-steel` | `#64738A` | stone | Texto secundario (solo tamaños grandes sobre claro) |
| `--color-graphite` | `#46526A` | graphite | Texto secundario sobre claro (pasa 4.5:1) |
| `--color-online` | `#3DDC97` | n/a | Solo para el punto de estado "en línea" en widgets |

Reglas de contraste: **signal sobre mist o paper NO pasa** como texto. Úsalo como texto solo sobre ink, navy o cobalt. Sobre claros, el acento se usa como fondo (botón signal con texto ink) o como elemento gráfico. Verifica cada combinación.

Alterna secciones oscuras y claras para crear ritmo. El hero usa un **degradado radial** de `ink` a `cobalt` con un brillo signal difuso en la parte inferior (mismo tratamiento de `.bg-hero` de Shipply) más grano sutil.

### Tipografía

La misma de Shipply vía `next/font`:

- **Geist** para titulares y cuerpo. Titulares 600/700, tracking `-0.03em`, line-height ajustado.
- **Instrument Serif** itálica para palabras de acento dentro de titulares.
- **Geist Mono** para eyebrows, IDs de dispositivos, estados, números de paso y datos técnicos. Aquí el mono tiene más protagonismo que en Shipply porque refuerza lo técnico.

### Lenguaje de componentes

- Botones píldora. Primario: fondo signal, texto ink. Secundario: outline. Flecha que se desplaza al hover y efecto magnético muy sutil.
- Cards con radio de 24 a 28px, sombras suaves, borde de 1px `cobalt` con opacidad en oscuro.
- **Palabra resaltada** con bloque signal detrás que se pinta al cargar (como en Shipply).
- **Formas diagonales** signal con moderación, máximo en 2 secciones: pólizas y CTA final.
- Grano sutil sobre degradados oscuros.

### Microinteracciones

- Contadores animados en métricas.
- Marquee lento con los diferenciadores o marcas (pausa al hover).
- Widget del hero vivo: los estados se van marcando en secuencia y el punto "en línea" pulsa.
- Cards con lift y cambio de borde al hover.
- FAQ con acordeón animado por altura.
- Navbar sólida con blur al hacer scroll.
- Móvil: barra fija inferior con "Cotizar" y "WhatsApp" que aparece después del hero.
- Botón flotante de WhatsApp con mensaje prellenado.

---

## Imágenes

Deben comunicar instalación profesional, orden y tecnología bien hecha. Sin logos de marcas reales en equipos, sin texto legible, sin imágenes de miedo (ladrones, pasamontañas, violencia), sin clichés de "hacker". El protagonista es el trabajo técnico limpio y el resultado.

Dirección fotográfica: luz natural o de atardecer, tonos fríos con grade azul que se integre a la paleta, composición limpia, sensación premium y documental. Técnicos latinoamericanos con uniforme neutro sin logos, en fraccionamientos, oficinas y casas en México.

Placeholders en `/public/images/` con estos nombres exactos (fondo `navy` con el nombre del archivo centrado mientras tanto):

| Archivo | Sección | Prompt sugerido |
|---|---|---|
| `hero-access.jpg` | Hero (fondo o lateral) | Modern gated residential community entrance in Mexico at blue hour, sleek vehicle barrier arm and access booth, subtle security cameras on poles, warm interior lights, cool blue sky, cinematic, no text, no logos |
| `tech-camera-install.jpg` | Beneficios | Latin American technician on a ladder installing a white dome security camera on a modern building facade, neutral uniform without logos, clean cable management, natural daylight, documentary style |
| `tech-diagnostic.jpg` | Beneficios | Technician hands with multimeter diagnosing an open hydraulic gate operator control board, tools neatly arranged, shallow depth of field, cool tones, no brand marks |
| `rack-organized.jpg` | Beneficios / Redes | Perfectly organized network rack with PoE switches, patch panel and labeled blue cables, soft LED status lights, cool blue tones, no readable brand text |
| `fraccionamiento.jpg` | Para quién | Upscale Mexican residential subdivision street with modern houses, discreet cameras and access gate, golden hour, calm and safe atmosphere |
| `empresa.jpg` | Para quién | Modern office lobby with card reader turnstile and glass doors, employee tapping access card, clean architecture, cool light |
| `residencia.jpg` | Para quién | Contemporary Mexican home entrance with video doorbell and automated sliding gate, warm evening light, elegant and secure |
| `cctv-monitor.jpg` | Servicios (card grande) | Person viewing multiple security camera feeds on a smartphone at home, screen content abstract and blurred, cozy light |
| `vehicular-barrier.jpg` | Servicios | Vehicle barrier arm at a parking entrance lifting as a car approaches, motion blur on the arm, dusk, cool tones |
| `wireless-link.jpg` | Servicios | Point to point wireless antennas mounted on a rooftop mast between two buildings, clear blue sky, technical and clean |
| `maintenance.jpg` | Pólizas | Technician cleaning and inspecting a bullet security camera on a wall, checklist on tablet, preventive maintenance feel |

---

## Estructura de datos de servicios (`/content/services.ts`)

Carga **todo** el contenido del documento de servicios del cliente en un arreglo tipado. La home muestra un resumen y la fase 2 generará `/servicios/[slug]` a partir de estos mismos datos sin tocar la estructura.

```ts
type Service = {
  slug: string;            // "videovigilancia"
  name: string;            // "Videovigilancia"
  short: string;           // descripción de 1 línea para la card del home
  intro: string;           // párrafo introductorio para la página de detalle
  icon: string;            // nombre de icono Lucide
  highlights: string[];    // 3 chips para la card del home
  groups: { title?: string; items: string[] }[]; // listas completas del documento
  note?: string;           // frase de cierre del documento (ej. levantamientos)
  image?: string;
};
```

Las 11 categorías del home, en este orden, con su línea corta:

1. **Videovigilancia** (`videovigilancia`): Cámaras, CCTV, NVR, DVR y monitoreo desde tu celular. Icono `Cctv`.
2. **Control de acceso** (`control-de-acceso`): Accesos peatonales, cerraduras, lectores, biométricos y videoporteros. Icono `ScanFace` o `KeyRound`.
3. **Acceso vehicular** (`acceso-vehicular`): Plumas, barreras, motores, portones y automatismos. Incluye diagnóstico y reparación de equipos hidráulicos como FAAC. Icono `CarFront`.
4. **Seguridad perimetral** (`seguridad-perimetral`): Cercas eléctricas y sistemas de alarma residencial y comercial. Icono `Fence` o `Siren`.
5. **Redes** (`redes`): Cableado estructurado, switches PoE, racks y enlaces inalámbricos punto a punto. Icono `Network`.
6. **Automatización** (`automatizacion`): Domótica, iluminación, accesos, portones y rutinas automatizadas. Icono `Cpu` o `Workflow`.
7. **Mantenimiento** (`mantenimiento`): Preventivo, correctivo y pólizas para fraccionamientos, condominios y empresas. Icono `Wrench`.
8. **Soporte técnico** (`soporte-tecnico`): Diagnóstico, reparación, reprogramación y configuración de equipos. Icono `LifeBuoy` o `Stethoscope`.
9. **Cerrajería** (`cerrajeria`): Soluciones residenciales y automotrices. Icono `Key`.
10. **Computación** (`computacion`): Reparación, mantenimiento y optimización de computadoras. Icono `Laptop`.
11. **Proyectos empresariales** (`proyectos`): Soluciones integrales para empresas, edificios, condominios y fraccionamientos, con levantamiento y memoria técnica. Icono `Building2`.

Mapea así el documento a cada `groups`:
- Videovigilancia: lista "Servicios de videovigilancia" + nota de levantamientos.
- Control de acceso: "Control de acceso peatonal".
- Acceso vehicular: "Trabajamos con" + "Realizamos" + todo "Reparación y mantenimiento de automatismos" + nota "Antes de reemplazar un equipo completo buscamos determinar si existe una reparación viable".
- Seguridad perimetral: "Cercas eléctricas" + "Sistemas de alarma".
- Redes: "Redes y telecomunicaciones" + "Enlaces inalámbricos y punto a punto".
- Automatización: "Domótica y automatización".
- Mantenimiento: "Mantenimiento preventivo" + "Mantenimiento correctivo" + "Pólizas de mantenimiento".
- Soporte técnico: "Diagnósticos y revisiones" + "Instalaciones nuevas y modernización".
- Cerrajería: "Residencial" + "Automotriz".
- Computación: "Reparación y soporte de equipos de cómputo".
- Proyectos empresariales: "Levantamientos técnicos" + "Memorias técnicas y documentación".

---

## Estructura y copy del home

Tono: profesional, directo, cercano, en tuteo, técnico sin ser frío, sin exageraciones ni discurso de miedo. **Regla de estilo: no uses guiones largos ni guiones como puntuación en ningún texto visible.** Usa puntos, comas o dos puntos.

### 1. Navbar

- Logo: wordmark `[NOMBRE]` en texto hasta tener el logo.
- Links: Servicios · Para quién · Cómo trabajamos · Pólizas · Preguntas
- Secundario: "Hablar con un técnico" (outline, abre WhatsApp). Primario: "Solicitar cotización" (signal).
- Móvil: menú a pantalla completa en `ink` con links grandes y los dos CTAs abajo.

### 2. Hero (oscuro, degradado radial, retícula blueprint muy sutil)

Dos columnas en escritorio, apilado en móvil.

- Chip superior: punto `online` pulsando + "Residencial, empresarial y fraccionamientos"
- **H1:** "Seguridad, tecnología y automatización. *En un solo proveedor.*" (la segunda parte con bloque signal detrás)
- **Subtítulo:** "Videovigilancia, control de acceso, barreras vehiculares, redes, alarmas, cercas eléctricas, automatización, mantenimiento y soporte técnico para hogares, empresas y fraccionamientos."
- CTA primario: "Solicitar cotización" → `#cotizar`
- CTA secundario: "Agendar visita técnica" → `#cotizar` con el tipo de solicitud preseleccionado en "Visita técnica / levantamiento"
- Prueba social: avatares + "[XX]+ instalaciones atendidas en [ciudad, confirmar]"

**Widget flotante: Panel de sitio** (card `paper` con sombra profunda, una línea de red signal que la atraviesa y conecta con el texto):

```
Sitio  FRACC-014 · Acceso principal        [● En línea]
Cliente    Fraccionamiento residencial
Póliza     Mantenimiento preventivo · Mensual
────────────────────────────────────────────────
CAM   Videovigilancia      24/24 en línea   ✓
ACC   Acceso vehicular     Pluma operativa   ✓
PER   Cerca eléctrica      Armada            ✓
RED   Enlace punto a punto 98% señal         ✓
MNT   Próxima visita       En 6 días         ◉
[ Ver memoria técnica → ]
```

Los renglones se marcan en secuencia al cargar (como el widget de tracking de Shipply). Los datos son ilustrativos, no requieren `[confirmar]`.

Debajo del hero, franja de métricas con contadores:
- "[000]+" cámaras instaladas
- "[00]+" fraccionamientos y condominios atendidos
- "[00]" años de experiencia
- "[24] h" tiempo de respuesta para fallas [confirmar]

### 3. El problema (mist)

- Eyebrow: `EL PROBLEMA`
- **H2:** "Cuando un sistema falla, casi nunca es *solo una cámara*."
- 4 cards compactas con icono:
  1. **Un proveedor para cada cosa.** Uno instaló las cámaras, otro la pluma y otro la red. Cuando algo falla, nadie responde por el sistema completo.
  2. **Fallas sin diagnóstico.** La cámara no tiene señal, el portón no cierra o el NVR no graba, y nadie sabe si es eléctrico, mecánico o de configuración.
  3. **Reemplazar cuando bastaba reparar.** Te cotizan un equipo nuevo sin revisar si el actual tenía arreglo.
  4. **Instalaciones sin documentación.** Cables sin orden, sin direcciones IP registradas y sin saber qué equipo está dónde.

### 4. Beneficios (mist, 3 cards con imagen)

- Eyebrow: `CÓMO LO RESOLVEMOS`
- **H2:** "Un solo equipo técnico que responde por *toda tu instalación*."
- 3 cards:
  1. **Todo integrado, un solo responsable.** Cámaras, accesos, barreras, red, alarmas y automatización trabajando juntos y atendidos por el mismo equipo. (imagen `tech-camera-install.jpg`)
  2. **Diagnóstico antes que reemplazo.** Antes de cambiar un equipo completo revisamos si existe una reparación viable. Pagas lo que realmente necesitas. (imagen `tech-diagnostic.jpg`)
  3. **Instalaciones ordenadas y documentadas.** Cableado limpio, equipos identificados y una memoria técnica para que siempre sepas qué tienes y dónde. (imagen `rack-organized.jpg`)

### 5. Para quién (oscuro, `id="para-quien"`)

- Eyebrow: `PARA QUIÉN`
- **H2:** "Desde una casa hasta un *fraccionamiento completo*."
- 3 cards con foto y lista corta:
  1. **Fraccionamientos, condominios y administraciones.** Accesos vehiculares, cámaras perimetrales, cercas, enlaces entre casetas y pólizas de mantenimiento. (`fraccionamiento.jpg`)
  2. **Empresas, comercios, industria y estacionamientos.** Videovigilancia, control de acceso de personal, barreras, redes y soporte con documentación técnica. (`empresa.jpg`)
  3. **Casas y residencias.** Cámaras con vista desde tu celular, videoporteros, portones automáticos, alarmas, cerrajería y domótica. (`residencia.jpg`)
- Línea final: "Atendemos servicios individuales y proyectos completos."

### 6. Servicios (mist, bento grid, `id="servicios"`)

- Eyebrow: `SERVICIOS`
- **H2:** "Todo lo que tu instalación necesita, *en un solo lugar*."
- Bento con las 11 categorías de `services.ts` + 1 card final de CTA (12 piezas). En escritorio:
  - **Videovigilancia** como card grande con un mini panel en UI (no imagen): cuadrícula de 4 "cámaras" abstractas con etiquetas mono `CAM-01` a `CAM-04`, indicador REC y estado en línea.
  - **Acceso vehicular** como card ancha con imagen `vehicular-barrier.jpg` y la mención de equipos hidráulicos FAAC.
  - El resto en cards medianas y chicas: icono, nombre, línea corta y 3 chips con `highlights`.
  - Card 12 en `ink`: "¿No ves lo que necesitas?" + "Cuéntanos tu caso" → `#cotizar`.
- Cada card tiene flecha circular. En fase 1 abre un drawer o modal (`<dialog>`, mismo patrón del lightbox de catálogos de Shipply) con la lista completa de `groups` y un CTA "Cotizar este servicio" que lleva a `#cotizar` con ese servicio preseleccionado. En fase 2 esa flecha llevará a `/servicios/[slug]`.
- En tablet: 2 columnas con la card grande a todo el ancho. En móvil: lista apilada con las dos destacadas primero.

### 7. Cómo trabajamos (oscuro, `id="como-trabajamos"`)

Aquí vive la **línea de red animada**: un trazo signal que se dibuja con el scroll y conecta los 7 pasos como nodos (vertical en móvil, zigzag u horizontal en escritorio). Cada nodo se enciende al llegar la línea.

- Eyebrow: `CÓMO TRABAJAMOS`
- **H2:** "Del diagnóstico al soporte, *sin dejarte solo*."
- Pasos (número en Geist Mono):
  - **01 Visita y diagnóstico.** Revisamos tus necesidades o las fallas existentes en sitio.
  - **02 Propuesta.** Definimos equipos, materiales y trabajos necesarios, con costo claro.
  - **03 Instalación o reparación.** Ejecutamos los trabajos técnicos con orden y limpieza.
  - **04 Configuración.** Programamos y configuramos cada equipo, incluido el acceso desde tu celular.
  - **05 Pruebas.** Verificamos que todo el sistema funcione correctamente.
  - **06 Entrega.** Te explicamos cómo funciona y te entregamos la documentación.
  - **07 Soporte y mantenimiento.** Seguimos atendiendo tu instalación después de la entrega.
- Nota debajo: "También intervenimos instalaciones existentes de otros proveedores."
- CTA: "Agendar visita técnica" → `#cotizar`

### 8. Documentación técnica (mist)

Sección corta y diferenciadora, en dos columnas.

- Eyebrow: `MEMORIA TÉCNICA`
- **H2:** "Tu infraestructura, *documentada*."
- Texto: "En proyectos empresariales, residenciales y de fraccionamientos entregamos documentación que facilita la administración futura del sistema. Así tu administración tiene control real sobre su infraestructura, aunque cambie el personal o el proveedor."
- Lista con checks: Inventario de equipos · Direcciones IP y segmentos de red · Ubicación e identificación de dispositivos · Información de NVR, cámaras, switches y antenas · Diagramas de instalación · Datos técnicos para mantenimiento
- Visual a la derecha en UI (no imagen): una "hoja" de memoria técnica estilizada, con tabla mono (ID, equipo, IP, ubicación, estado) con 5 o 6 filas ilustrativas tipo `CAM-07 · Domo IP · 192.168.1.47 · Caseta norte · ●` y un mini diagrama de nodos conectado por la línea de red.

### 9. Diferenciadores (oscuro, marquee)

- Marquee lento de dos filas en direcciones opuestas con los diferenciadores como píldoras con icono: Proyectos residenciales y empresariales · Experiencia en fraccionamientos y condominios · Soluciones integrales · Instalación y mantenimiento · Diagnóstico y reparación · Integración de sistemas · Mantenimiento preventivo y correctivo · Soporte técnico · Documentación técnica · Atención personalizada · Propuestas a la medida · Trabajamos sobre instalaciones existentes · Del diagnóstico al mantenimiento
- Debajo, fila de marcas con las que trabajan en gris: FAAC + placeholders `[confirmar marcas]`. Solo se dejan marcas confirmadas por el cliente.

### 10. Pólizas y modelos de servicio (mist con diagonales signal, `id="polizas"`)

Adaptación de la sección de planes de Shipply. 3 cards; la central destacada (más alta, fondo `ink`, badge "Recomendado para fraccionamientos").

- Eyebrow: `PÓLIZAS Y SERVICIO`
- **H2:** "Elige cómo quieres que *cuidemos tu instalación*."
- **Servicio por evento.** "Para una falla puntual, una instalación o una reparación." Incluye: visita de diagnóstico, cotización del correctivo, reparación o instalación, pruebas de funcionamiento. No incluye: visitas programadas, soporte prioritario, memoria técnica. Precio: "Según diagnóstico". CTA: "Solicitar diagnóstico"
- **Póliza de mantenimiento** (destacada). "Revisiones periódicas para que las fallas no te tomen por sorpresa." Incluye: visitas preventivas programadas, revisión de cámaras, NVR, accesos, barreras, cercas y red, atención de incidencias, soporte remoto y asistido, reporte de cada visita. Precio: "A la medida de tu instalación". CTA: "Cotizar póliza"
- **Proyecto integral.** "Para obra nueva, ampliación o modernización completa." Incluye: levantamiento técnico, propuesta técnica y económica, instalación e integración de sistemas, migración de equipos antiguos, memoria técnica, póliza opcional. Precio: "Propuesta a la medida". CTA: "Agendar levantamiento"
- Checks signal en lo incluido y check vacío en lo no incluido.
- Nota: "Las condiciones y cobertura de cada póliza se definen según las necesidades de cada instalación."

### 11. Testimonios (bloque `navy` grande con acentos signal)

- Eyebrow: `CLIENTES`
- **H2:** "Administraciones y empresas que ya *duermen tranquilas*."
- 3 testimonios **placeholder** marcados con `placeholder: true` en `site.ts`:
  1. "Teníamos cámaras sin señal y una pluma que fallaba cada semana. Diagnosticaron todo en una visita y desde que tenemos póliza no hemos vuelto a tener una falla mayor." **[Nombre], Administración, Fraccionamiento [Nombre], [Ciudad].** Chip: "Póliza mensual desde [año]"
  2. "Nos repararon el operador hidráulico del portón cuando otro proveedor ya nos había cotizado uno nuevo." **[Nombre], [Cargo], [Empresa], [Ciudad].** Chip: "Reparación vs. reemplazo"
  3. "Instalaron cámaras, control de acceso y la red de la oficina, y nos entregaron todo documentado. Por fin sabemos qué tenemos." **[Nombre], [Cargo], [Empresa], [Ciudad].** Chip: "[XX] cámaras IP"
- Calificación "[4.9]/5" con estrellas y "[XX] reseñas en Google".

### 12. Cotizador (oscuro, `id="cotizar"`). LA SECCIÓN MÁS IMPORTANTE

Porta el formulario multi paso de Shipply (barra de progreso, transición entre pasos, validación por paso, botón regresar) con estos pasos:

- **H2:** "Cuéntanos qué necesitas y te respondemos *hoy mismo*." [confirmar tiempo de respuesta]
- Subtítulo: "Sin compromiso. Un técnico revisa tu caso y te contacta por WhatsApp."
- A un lado: 3 bullets de confianza (sin compromiso, atendemos instalaciones de otros proveedores, respuesta de un técnico real) y bloque "¿Es urgente?" con botón grande a WhatsApp: "Necesito soporte técnico".

**Pasos:**

1. **¿Qué tipo de servicio buscas?** Cards seleccionables: Instalación nueva · Falla o reparación · Mantenimiento o póliza · Visita técnica / levantamiento · Modernización de un sistema existente.
2. **¿En qué área?** Chips multi selección con las 11 categorías de `services.ts` + "No estoy seguro". Textarea opcional: "Cuéntanos brevemente" (placeholder: "Ej. La pluma de la entrada no baja y 3 cámaras no graban").
3. **Tu instalación.** Tipo de inmueble (cards): Casa o residencia · Fraccionamiento o condominio · Edificio o administración · Empresa u oficina · Comercio · Industria · Estacionamiento. Urgencia: Urgente (hoy o mañana) · Esta semana · Estoy planeando un proyecto.
4. **Tus datos.** Nombre, empresa o fraccionamiento (opcional), WhatsApp (+52), correo, colonia y municipio. Checkbox de Aviso de Privacidad (obligatorio).

- Botón final: "Enviar solicitud"
- **Lógica de calificación en el éxito:**
  - Urgencia "Urgente" o tipo "Falla o reparación": mensaje + botón grande para continuar por WhatsApp con el resumen prellenado.
  - Inmueble fraccionamiento, edificio, empresa o industria y tipo "Mantenimiento o póliza", "Visita técnica" o "Modernización": mostrar el embed de agenda (`NEXT_PUBLIC_BOOKING_URL`) para agendar la visita.
  - Resto: mensaje estándar.
- Mensaje de éxito: "Listo, [Nombre]. Un técnico revisará tu solicitud y te contactará por WhatsApp."
- Los CTAs del sitio que dicen "Agendar visita técnica", "Solicitar diagnóstico" o "Cotizar este servicio" preseleccionan el paso 1 o 2 vía query param o hash (`#cotizar?tipo=visita`, `&servicio=acceso-vehicular`).
- **Envío:** `/api/lead` con zod, honeypot, UTMs, referrer y timestamp, POST a `LEAD_WEBHOOK_URL` (para n8n, Make o CRM). Igual que Shipply.
- **Analítica:** `cta_click` con ubicación, `form_step`, `generate_lead` con tipo, servicios, inmueble y urgencia. GA4 y Meta Pixel por variables de entorno, desactivados si no existen.

### 13. Preguntas frecuentes (mist, `id="preguntas"`)

- Eyebrow: `PREGUNTAS FRECUENTES`
- **H2:** "Lo que nos preguntan *antes de llamarnos*."
- Acordeón (el primero abierto):
  1. **¿Atienden instalaciones que hizo otro proveedor?** Sí. Diagnosticamos, reparamos y damos mantenimiento a sistemas existentes, aunque no los hayamos instalado nosotros.
  2. **¿Puedo pedir solo un diagnóstico?** Sí. Hacemos visitas exclusivas de diagnóstico para saber por qué dejó de funcionar tu sistema, qué equipo falla y si conviene reparar o sustituir. Después te presentamos la cotización del correctivo. [confirmar si la visita tiene costo]
  3. **¿Reparan o solo cambian equipos?** Antes de reemplazar un equipo completo buscamos si existe una reparación viable. En automatismos hidráulicos, por ejemplo, hacemos cambio de aceite, purga, ajuste de válvulas, cambio de sellos y reparación de fugas.
  4. **¿Trabajan con barreras y operadores FAAC?** Sí. Hacemos diagnóstico, mantenimiento y reparación de equipos hidráulicos y automatismos de marcas especializadas como FAAC.
  5. **¿Puedo ver mis cámaras desde el celular?** Sí. Configuramos el acceso remoto para que veas tus cámaras desde celular, computadora o tablet.
  6. **¿Qué incluye una póliza de mantenimiento?** Visitas preventivas programadas, soporte técnico, atención de incidencias, soporte remoto y revisiones de cámaras, grabadores, redes, accesos, barreras y cercas. La cobertura se define según tu instalación.
  7. **¿Atienden casas o solo empresas?** Ambos. Atendemos desde un servicio residencial sencillo hasta proyectos completos para empresas y fraccionamientos.
  8. **¿En qué zonas dan servicio?** [confirmar zonas y municipios]

### 14. CTA final (degradado radial `cobalt` a `signal`, diagonales)

- **H2:** "Desde una falla sencilla hasta *un proyecto completo*."
- Subtítulo: "Cuéntanos qué está pasando en tu instalación y te decimos cómo resolverlo."
- Botones: "Solicitar cotización" (sólido `ink`) y "Necesito soporte técnico" (outline, WhatsApp).

### 15. Footer (`ink`)

- Wordmark `[NOMBRE]` + línea: "Soluciones integrales en seguridad, tecnología y automatización."
- Columnas: **Servicios** (las 11 categorías) · **Empresa** (Para quién, Cómo trabajamos, Pólizas, Preguntas) · **Contacto** (WhatsApp, teléfono, correo, ciudad, horario: todo `[confirmar]`) · **Redes** [confirmar].
- Línea inferior: "© 2026 [NOMBRE]. Todos los derechos reservados." + Aviso de privacidad.
- Página `/aviso-de-privacidad` con texto base LFPDPPP marcado como borrador para revisión legal (porta la de Shipply).

---

## Variables de entorno (`.env.example`)

```
LEAD_WEBHOOK_URL=
NEXT_PUBLIC_WHATSAPP_NUMBER=52XXXXXXXXXX
NEXT_PUBLIC_WHATSAPP_MESSAGE=Hola, necesito información sobre un servicio
NEXT_PUBLIC_BOOKING_URL=
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_SITE_URL=
```

---

## Criterios de terminado (fase 1)

- [ ] Las 15 secciones construidas con copy de `site.ts`, sin guiones como puntuación en textos visibles.
- [ ] `services.ts` con el 100% del contenido del documento del cliente, organizado como se indica.
- [ ] Drawer de servicio funcionando con teclado, foco atrapado y cierre con Esc.
- [ ] Cotizador de punta a punta: validación, preselección por CTA, lógica de calificación, webhook, éxito y analítica.
- [ ] Línea de red con GSAP, widget del hero, contadores, marquee y highlight funcionando y desactivados con `prefers-reduced-motion`.
- [ ] Contraste AA verificado en cada combinación de la paleta azul, en especial signal sobre claros.
- [ ] Capturas de Playwright a 375, 768, 1024, 1366 y 1920px revisadas y limpias.
- [ ] Lighthouse móvil 90+ en las cuatro categorías.
- [ ] `npm run build` sin errores ni warnings.
- [ ] Al terminar, entrégame la lista de todos los `[NOMBRE]`, `[XX]`, `[confirmar]`, placeholders de imagen y testimonios por completar.

## Fase 2 (no construir todavía, solo dejar preparado)

- `/servicios/[slug]` con `generateStaticParams` desde `services.ts`: hero por servicio, listas completas, proceso, FAQ específica y cotizador con el servicio preseleccionado.
- Página de pólizas a detalle.
- Galería de proyectos realizados.
- SEO local por servicio y zona.
