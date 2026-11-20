# Ajustes 03: venta de productos

Sigue `CLAUDE.md`. Todo el copy en `content/`. Sin guiones como puntuación en textos visibles. Mismo nivel de acabado que el resto del sitio.

Starko Tech también va a **comercializar equipo**: cámaras, grabadores, chapas de seguridad, controles de acceso, alarmas, cercas, redes y kits. En esta fase el flujo es **catálogo + lista de cotización** (el cliente arma su lista y la manda por WhatsApp o formulario). No hay checkout ni pagos todavía; la estructura de datos debe permitir conectar Shopify o un checkout más adelante sin rehacer componentes.

---

## 1. Imágenes de producto

16 fotos de estudio sobre fondo `mist`, generadas en Higgsfield. Van en `public/images/productos/` como `<slug>.jpg`.

- Si ya están en `public/images/productos/` con nombre `hf_...png`, renómbralas usando el id del final del nombre (tabla abajo).
- Si no están, crea `scripts/download-products.mjs`, descárgalas de las URLs y guárdalas con el slug.
- Conviértelas a JPG con `sharp` (calidad 82, máximo 1600px, `mozjpeg: true`), borra los PNG y confirma que cada JPG pese más de 60 KB.
- Ábrelas y revísalas. Si alguna trae texto o logo visible, avísame en lugar de usarla.

```
camara-domo-ip-4mp           0fbe31c8  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220608_0fbe31c8-9c35-47c9-a60a-de89ee0f29b7.png
camara-bala-ip-4mp-color     59e0f46f  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220608_59e0f46f-f0f0-4c85-97ad-cfe5aef06cb4.png
camara-ptz-ip-4mp-25x        f184d06b  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220608_f184d06b-3979-489d-891b-3cef0ba246ae.png
nvr-8-canales-poe            1e1471eb  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220608_1e1471eb-ef0b-4ab4-b6e9-511158299446.png
kit-4-camaras-ip             7e02393b  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220607_7e02393b-90d5-4c54-94a2-6b628787aa8b.png
switch-poe-8-puertos         631428a2  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220607_631428a2-2b87-48ba-81dd-e0ee8f05091e.png
videoportero-ip-7            0c20d3cc  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220610_0c20d3cc-7b18-426c-9fdf-18612a21aee7.png
lector-biometrico            29ac3c55  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220610_29ac3c55-98e2-4a04-811c-0c80557fa909.png
barrera-vehicular            28f33527  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220609_28f33527-66cc-4359-9315-695ecdf5eb99.png
electrificador-cerca         89991b28  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220607_89991b28-aa52-4ff0-bcfd-192e685e3ebf.png
kit-alarma-inalambrica       56d432b1  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220608_56d432b1-43cf-4718-949a-27bccd005b89.png
enlace-punto-a-punto         c2e28aed  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220610_c2e28aed-e8b8-4bd1-9a1f-c4222b692d64.png
chapa-inteligente-huella     62887005  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220700_62887005-93f6-4a46-8aac-993ee5f07c82.png
cerrojo-alta-seguridad       f64686ae  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220659_f64686ae-93ab-4833-bedf-a8e42b4349c1.png
cerradura-electromagnetica   b6da825d  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220659_b6da825d-50f0-4088-9ab1-7b3c7021febc.png
chapa-electrica-porton       dff1fab9  https://d8j0ntlcm91z4.cloudfront.net/user_31CxX4cPrgQdvmx3KQknNtxJQPH/hf_20261118_220659_dff1fab9-a0ca-4e75-8df1-b9606882c650.png
```

---

## 2. Datos: `content/products.ts`

```ts
type ProductCategory = {
  slug: string;   // "videovigilancia"
  name: string;   // "Cámaras y videovigilancia"
  icon: string;   // Lucide
};

type Product = {
  slug: string;
  name: string;
  category: string;            // slug de categoría
  short: string;               // 1 línea para la card
  description: string;         // párrafo para el detalle
  image: string;
  price: number;               // MXN con IVA
  priceLabel?: string;         // "Desde" cuando aplica
  installFrom?: number;        // instalación desde, MXN
  badge?: "Más vendido" | "Kit" | "Nuevo" | "Recomendado";
  specs: { label: string; value: string }[];   // 4 a 6
  includes?: string[];
  idealFor: string[];          // "Casas", "Fraccionamientos", "Empresas"...
  relatedService?: string;     // slug de services.ts
  featured?: boolean;          // aparece en el home
  sku?: string;                // para conectar inventario después
};
```

Cada precio lleva `// demo: validar con cliente`.

### Categorías (en este orden)

1. `videovigilancia` · Cámaras y videovigilancia · `Cctv`
2. `grabadores-redes` · Grabadores y redes · `Network`
3. `control-de-acceso` · Control de acceso · `ScanFace`
4. `chapas` · Chapas y cerraduras · `LockKeyhole`
5. `acceso-vehicular` · Acceso vehicular · `CarFront`
6. `alarmas-cercas` · Alarmas y cercas · `Siren`
7. `kits` · Kits listos para instalar · `PackageCheck`

### Productos

| slug | Nombre | Cat. | Precio | Instalación desde | Badge | Home |
|---|---|---|---|---|---|---|
| camara-domo-ip-4mp | Cámara domo IP 4MP | videovigilancia | 1,290 | 650 | Más vendido | sí |
| camara-bala-ip-4mp-color | Cámara bala IP 4MP con visión nocturna a color | videovigilancia | 1,490 | 650 | | sí |
| camara-ptz-ip-4mp-25x | Cámara PTZ IP 4MP con zoom 25x | videovigilancia | 11,900 | 1,800 | | |
| nvr-8-canales-poe | Grabador NVR 8 canales PoE 4K | grabadores-redes | 3,890 | 900 | | |
| switch-poe-8-puertos | Switch PoE+ 8 puertos administrable | grabadores-redes | 2,190 | 500 | | |
| enlace-punto-a-punto | Kit de enlace inalámbrico punto a punto 5 GHz | grabadores-redes | 3,990 | 2,200 | | |
| videoportero-ip-7 | Videoportero IP con monitor de 7" | control-de-acceso | 4,590 | 1,200 | Recomendado | sí |
| lector-biometrico | Control de acceso biométrico con huella y tarjeta | control-de-acceso | 3,290 | 1,500 | | sí |
| chapa-inteligente-huella | Chapa inteligente con huella y teclado | chapas | 4,290 | 850 | Nuevo | sí |
| cerrojo-alta-seguridad | Cerrojo de alta seguridad antiganzúa | chapas | 1,190 | 450 | | |
| cerradura-electromagnetica | Cerradura electromagnética 600 lb | chapas | 1,390 | 900 | | |
| chapa-electrica-porton | Chapa eléctrica para portón | chapas | 1,590 | 700 | | sí |
| barrera-vehicular | Barrera vehicular con brazo de 3 m | acceso-vehicular | 28,900 (Desde) | 4,500 | | |
| electrificador-cerca | Electrificador para cerca eléctrica | alarmas-cercas | 3,490 | según metros | | |
| kit-alarma-inalambrica | Kit de alarma inalámbrica con app | alarmas-cercas | 5,490 | 900 | | sí |
| kit-4-camaras-ip | Kit 4 cámaras IP + NVR + disco 1 TB | kits | 8,990 | 2,500 | Kit | sí (banner) |

Specs de demo (inventa el resto con el mismo criterio realista):
- **Domo 4MP:** Resolución 4MP · Lente 2.8 mm · Visión nocturna IR 30 m · Alimentación PoE · Protección IP67 e IK10 · Compatible con app móvil.
- **Bala color:** 4MP · Visión nocturna a color 24/7 · Alcance 40 m · Micrófono integrado · PoE · IP67.
- **PTZ:** 4MP · Zoom óptico 25x · IR 100 m · Seguimiento automático · PoE+ · IP66.
- **NVR 8:** 8 puertos PoE · Grabación hasta 8MP (4K) · 1 bahía de disco hasta 10 TB · Detección de personas y vehículos · App móvil.
- **Switch PoE:** 8 puertos PoE+ · 120 W de potencia · 2 puertos uplink gigabit · VLAN y QoS · Montaje en rack o escritorio.
- **Enlace PtP:** Par de antenas 5 GHz · Hasta 3 km con línea de vista · Hasta 450 Mbps · Exterior IP65 · Incluye brackets.
- **Videoportero:** Monitor táctil 7" · Frente de calle con cámara 2MP · Apertura remota de chapa · App móvil · Alimentación PoE.
- **Biométrico:** 3,000 huellas · 10,000 tarjetas · Teclado y PIN · TCP/IP y Wiegand · Registro de asistencia.
- **Chapa inteligente:** Huella, código, tarjeta, app y llave · Hasta 100 huellas · Alarma antimanipulación · Baterías AA con aviso de carga baja · Para puertas de 35 a 55 mm.
- **Cerrojo:** Cilindro antiganzúa y antibumping · Acero endurecido · 3 llaves · Acabado níquel satinado.
- **Electromagnética:** Fuerza de retención 600 lb · 12 V DC · Sensor de estado de puerta · Incluye brackets L y Z.
- **Chapa eléctrica portón:** 12 V · Apertura con botón, interfón o control de acceso · Uso exterior · Incluye 2 llaves.
- **Barrera:** Brazo de 3 m · Apertura en 3 s · Uso intensivo · Incluye 2 controles y fotoceldas · Compatible con lectores y tags.
- **Electrificador:** Hasta 5,000 m lineales · Alarma y sirena integradas · Batería de respaldo · Activación por control.
- **Kit alarma:** Panel con WiFi y 4G · Sensor de movimiento · 2 contactos magnéticos · Control remoto · Sirena interior · Notificaciones en app.
- **Kit 4 cámaras:** 4 cámaras IP 4MP (2 domo y 2 bala) · NVR 8 canales PoE · Disco duro de 1 TB · Cable y conectores para 4 puntos · Configuración de app incluida con instalación.

---

## 3. Sección de productos en el home

Va **después de Servicios** y antes de Cómo trabajamos, con fondo `navy` para alternar (`id="productos"`). Agrega "Productos" al navbar entre Servicios y Para quién.

- Eyebrow: `PRODUCTOS`
- **H2:** "Equipo profesional, *con o sin instalación*."
- Subtítulo: "Vendemos los mismos equipos que instalamos: cámaras, grabadores, chapas de seguridad, controles de acceso, alarmas y más. Te asesoramos para elegir lo correcto y, si quieres, lo instalamos."
- Fila de chips con las 7 categorías (cada una lleva a `/productos?categoria=<slug>`).
- **Banner del kit** (`kit-4-camaras-ip`): card ancha en dos columnas, foto a la izquierda sobre `mist`, a la derecha badge "Kit", nombre, 3 bullets de lo que incluye, precio grande en mono `signal` "$8,990 MXN", línea "Instalación desde $2,500" y botones "Agregar a cotización" (signal) y "Ver kit" (outline).
- **Grid de destacados** (los `featured` sin el kit, 7 productos + 1 card final "Ver los 16 productos" en `ink` con flecha). Escritorio 4 columnas, tablet 2 o 3, móvil carrusel horizontal con scroll snap y peek de la siguiente card.
- Nota pequeña: "Precios con IVA, sujetos a disponibilidad. Te confirmamos existencia al cotizar."

### Card de producto (`components/products/product-card.tsx`, reutilizable en home y catálogo)

- Contenedor `paper`, radio 24px, imagen cuadrada sobre `mist` con `object-contain` y padding, zoom suave al hover.
- Badge arriba a la izquierda si existe.
- Categoría en mono pequeño, nombre (2 líneas máximo), 2 specs clave como chips.
- Precio en mono "$1,290" + "MXN" pequeño, y debajo "Instalación desde $650".
- Botón circular `+` "Agregar a cotización" (al agregar se vuelve check con micro animación y el contador del botón flotante rebota). Toda la card enlaza al detalle.

---

## 4. Catálogo `/productos`

- Hero compacto oscuro: breadcrumb, H1 "Productos", subtítulo corto, contador "16 productos".
- Barra de filtros sticky bajo el navbar: chips de categoría (con "Todos"), búsqueda por nombre y orden (Destacados, Menor precio, Mayor precio). Sincroniza con la URL (`?categoria=chapas&orden=precio-asc`).
- Grid 1 / 2 / 3 / 4 columnas (375 / 768 / 1024 / 1366+).
- Estado vacío con CTA "Cuéntanos qué buscas" a WhatsApp.
- Bloque al final: "¿No sabes qué equipo necesitas?" + "Agendar visita técnica" (lleva a `/#cotizar` con tipo visita).
- Metadata y JSON-LD `ItemList`.

## 5. Detalle `/productos/[slug]`

- `generateStaticParams` desde `products.ts`.
- Dos columnas: imagen grande sobre `mist` (deja preparado el componente para galería de varias fotos) y a la derecha categoría, nombre, descripción, precio, "Instalación desde", selector de cantidad, **toggle "Incluir instalación"**, botón "Agregar a cotización" y botón secundario "Preguntar por WhatsApp" con mensaje prellenado con el producto.
- Debajo: tabla de especificaciones (mono en etiquetas), "Qué incluye", "Ideal para" en chips, y card que enlaza al servicio relacionado ("¿Lo necesitas instalado? Conoce nuestro servicio de videovigilancia").
- Productos relacionados (misma categoría, 4).
- Metadata por producto y JSON-LD `Product` con `offers` (MXN, `InStock`).

## 6. Lista de cotización

- Estado en un contexto cliente (`lib/quote-list.tsx`), persistido en `localStorage` con try/catch (si falla, sigue en memoria).
- **Botón flotante** "Mi cotización" con contador, visible solo cuando hay productos. En móvil se integra a la barra inferior existente (no se encima con WhatsApp).
- **Drawer** (`<dialog>`, mismo patrón del drawer de servicios): lista con foto mini, nombre, stepper de cantidad, toggle de instalación por producto, eliminar, subtotal de equipo y subtotal estimado de instalación, y la nota "Precio final sujeto a visita técnica y disponibilidad".
- Dos salidas:
  1. **Enviar por WhatsApp:** abre WhatsApp con mensaje prellenado: "Hola, quiero cotizar estos productos:" + lista con cantidades y si llevan instalación + totales.
  2. **Enviar solicitud:** mini formulario (nombre, WhatsApp, colonia y municipio, aviso de privacidad) que hace POST a `/api/lead` con `source: "productos"` y el detalle de la lista. Extiende el esquema zod sin romper el cotizador actual.
- Analítica: `add_to_quote`, `view_item`, `begin_quote`, `generate_lead` con `source: "productos"`.

---

## 7. Verificación

- Capturas de Playwright a 375, 768, 1024, 1366 y 1920px de: sección de productos del home, `/productos`, `/productos/chapa-inteligente-huella` y el drawer abierto.
- Prueba de punta a punta: agregar 3 productos, cambiar cantidades, activar instalación, recargar la página (la lista persiste), enviar por formulario y revisar el payload.
- Teclado completo en filtros, cards, stepper y drawer.
- `npm run build` sin errores. Lista final de precios y datos `// demo: validar con cliente`.
