# Ajustes 01: hero más directo, datos reales de demo e imágenes

Sigue `CLAUDE.md`. Todo el copy y los datos se editan en `content/site.ts` y `content/services.ts`, nunca directo en componentes. Recuerda: nada de guiones como puntuación en textos visibles.

---

## 1. Imágenes

Las fotos finales ya están en `/public/images/` como **PNG** con su nombre definitivo. Junto a ellas siguen los **JPG placeholder** que generaste en la fase 1 (archivos de unos 15 KB). Haz lo siguiente:

1. Crea `scripts/optimize-images.mjs` con `sharp` que convierta cada PNG a JPG (calidad 82, máximo 2400px del lado largo, `mozjpeg: true`) **sobrescribiendo el JPG placeholder del mismo nombre** cuando exista.
2. Ejecútalo y confirma que cada JPG nuevo pese más de 100 KB (si no, la conversión falló).
3. Borra los PNG originales y los placeholders que ya no se usan: `hero-access.jpg` y `tech-camera-install.jpg`. Actualiza cualquier referencia en `content/` y `components/` a esos dos archivos según la tabla.
4. Abre cada imagen y revísala antes de usarla. Si alguna trae texto o logos visibles, avísame en lugar de usarla.

PNG en la carpeta → JPG final:

```
hero-tech-camera.png          → hero-tech-camera.jpg          (nuevo, reemplaza a hero-access.jpg)
hero-fraccionamiento-wide.png → hero-fraccionamiento-wide.jpg (nuevo)
cctv-monitor.png              → cctv-monitor.jpg              (reemplaza placeholder; sustituye a tech-camera-install.jpg en Beneficios card 1)
tech-diagnostic.png           → tech-diagnostic.jpg           (reemplaza placeholder)
rack-organized.png            → rack-organized.jpg            (reemplaza placeholder)
fraccionamiento.png           → fraccionamiento.jpg           (reemplaza placeholder)
empresa.png                   → empresa.jpg                   (reemplaza placeholder)
residencia.png                → residencia.jpg                (reemplaza placeholder)
vehicular-barrier.png         → vehicular-barrier.jpg         (reemplaza placeholder)
wireless-link.png             → wireless-link.jpg             (reemplaza placeholder)
maintenance.png               → maintenance.jpg               (reemplaza placeholder)
smart-home.png                → smart-home.jpg                (nuevo)
```

Luego usa `next/image` con AVIF/WebP, `sizes` correctos y `priority` solo en la del hero. Escríbeles `alt` descriptivos en español.

| Archivo | Dónde va |
|---|---|
| `hero-tech-camera.jpg` | Hero, columna derecha (vertical 3:4) |
| `hero-fraccionamiento-wide.jpg` | Fondo del CTA final (panorámica, espacio libre a la izquierda) |
| `tech-diagnostic.jpg` | Beneficios, card 2 (Diagnóstico antes que reemplazo) |
| `rack-organized.jpg` | Beneficios, card 3 (Instalaciones documentadas) y sección Memoria técnica como apoyo |
| `fraccionamiento.jpg` | Para quién, card 1 |
| `empresa.jpg` | Para quién, card 2 |
| `residencia.jpg` | Para quién, card 3 |
| `cctv-monitor.jpg` | Beneficios, card 1 (Todo integrado) |
| `vehicular-barrier.jpg` | Bento de servicios, card Acceso vehicular |
| `wireless-link.jpg` | Bento de servicios, card Redes |
| `maintenance.jpg` | Pólizas, encabezado o card destacada |
| `smart-home.jpg` | Bento de servicios, card Automatización |

Tratamiento consistente: radio de card, overlay sutil `ink` de abajo hacia arriba cuando lleven texto encima, y un leve zoom (scale 1.04) en hover de las cards.

---

## 2. Hero: título directo a lo que hacemos

El H1 actual se siente genérico. El título ahora dice exactamente qué hacemos, y el resaltado signal rota entre los servicios.

**Estructura del H1:**

```
Instalamos y mantenemos
[videovigilancia.]        ← palabra en bloque signal + Instrument Serif itálica, rotando
```

- La palabra rota cada 2.4s con transición vertical (sale hacia arriba, entra desde abajo) y el bloque signal ajusta su ancho suavemente con Framer Motion (`layout`).
- Secuencia: `videovigilancia.` · `control de acceso.` · `barreras vehiculares.` · `redes.` · `cercas eléctricas.` · `automatización.`
- Accesibilidad: el `h1` tiene texto completo para lectores de pantalla ("Instalamos y mantenemos videovigilancia, control de acceso, barreras vehiculares, redes, cercas eléctricas y automatización") y la parte animada lleva `aria-hidden`.
- Con `prefers-reduced-motion`: se queda fija en `videovigilancia.`
- LCP: la primera palabra se pinta desde el primer render, sin esperar hidratación.
- Reserva el ancho de la palabra más larga en móvil para que no salte el layout (o permite que baje a segunda línea de forma estable con `min-height`).

**Subtítulo nuevo:**
"Cámaras, accesos, plumas vehiculares, redes, alarmas y automatización para casas, empresas y fraccionamientos en Querétaro. Un solo equipo técnico, del diagnóstico al mantenimiento."

**Chip superior:** punto online pulsando + "Atención en Querétaro y zona metropolitana"

**CTAs:** sin cambios ("Solicitar cotización" y "Agendar visita técnica").

**Prueba social:** "1,200+ cámaras instaladas y 45 fraccionamientos atendidos en Querétaro" con los avatares.

### Columna derecha del hero

Conserva el widget de Panel de sitio, pero ahora vive **encima de una foto real**:

- Fondo de la columna: `hero-tech-camera.jpg` (técnico instalando una cámara domo) en card vertical con radio grande, overlay `ink` suave abajo.
- El widget se reduce un poco (unos 85%) y flota sobre la parte inferior izquierda de la foto, sobresaliendo del borde de la card hacia el texto. La línea de red sigue conectándolo.
- Dos chips flotantes pequeños sobre la foto, con animación de flotación lenta y desfasada:
  - Arriba a la derecha: `● CAM-07 · Domo IP 4MP · En línea`
  - A media altura a la izquierda: `Instalación terminada · 2:40 h`
- En tablet: foto y widget a todo el ancho debajo del texto, foto en 16:10. En móvil: foto recortada en 4:3 con el widget encimado abajo a todo el ancho.

---

## 3. Datos de demo (reemplazar TODOS los placeholders)

No dejes ningún `[XX]`, `[confirmar]` ni `[NOMBRE]` visible. Usa estos datos. En `site.ts` deja un comentario `// demo: validar con cliente` junto a cada dato inventado para poder rastrearlos después.

### Marca provisional
- `site.brand.name`: **Nodo**. Wordmark: "Nodo" + descriptor pequeño en mono "SEGURIDAD · TECNOLOGÍA". (Encaja con el concepto de línea de red; es provisional hasta definir el naming.)

### Métricas (franja del hero)
- **1,200+** cámaras instaladas
- **45+** fraccionamientos y condominios atendidos
- **12** años de experiencia
- **24 h** respuesta para fallas en póliza

### Contacto
- WhatsApp y teléfono: `442 000 0000` (valor de demo en `.env.example`, formato visible "442 000 0000")
- Correo: `contacto@nodoseguridad.mx`
- Dirección: "Querétaro, Qro."
- Horario: "Lunes a viernes de 9:00 a 19:00 · Sábados de 9:00 a 14:00 · Emergencias en póliza 24/7"
- Zonas: Querétaro, Corregidora, El Marqués, Juriquilla, Zibatá, Huimilpan y San Juan del Río
- Redes: Instagram, Facebook y WhatsApp (enlaces `#` de demo)

### Marcas con las que trabajan (fila en gris)
FAAC, Hikvision, Dahua, Ubiquiti, ZKTeco, Hikvision AX Pro (alarmas), Nice, TP-Link Omada. Usa el nombre en texto con tipografía mono en gris si no hay logos SVG limpios; nada de logos pixelados.

### Hero y respuesta
- Cotizador H2: "Cuéntanos qué necesitas y te respondemos *hoy mismo*."
- Subtítulo: "Sin compromiso. Un técnico revisa tu caso y te contacta por WhatsApp en menos de 2 horas en horario laboral."

### Testimonios (quita `placeholder: true` del render, conserva el campo en datos)
1. "Teníamos cámaras sin señal y una pluma que fallaba cada semana. Diagnosticaron todo en una visita y desde que tenemos póliza no hemos vuelto a tener una falla mayor." **Laura Méndez, Administración, Fraccionamiento Cumbres del Lago, Juriquilla.** Chip: "Póliza mensual desde 2023"
2. "Nos repararon el operador hidráulico del portón cuando otro proveedor ya nos había cotizado uno nuevo. Nos ahorramos más de la mitad." **Ricardo Salinas, Gerente de Operaciones, Logística del Bajío, El Marqués.** Chip: "Reparación vs. reemplazo"
3. "Instalaron cámaras, control de acceso y la red de la oficina, y nos entregaron todo documentado. Por fin sabemos qué tenemos." **Andrea Ruiz, Directora Administrativa, Grupo Contable Ruiz, Querétaro.** Chip: "32 cámaras IP"
- Calificación: **4.9/5** · "86 reseñas en Google"

### Pólizas (precios de referencia)
- Servicio por evento: "Diagnóstico desde $650 MXN"
- Póliza de mantenimiento: "Desde $2,900 MXN al mes"
- Proyecto integral: "Levantamiento sin costo"

### FAQ
- Pregunta 2 (diagnóstico): cierra con "La visita de diagnóstico tiene un costo de $650 MXN, que se bonifica si realizas el trabajo con nosotros."
- Pregunta 8 (zonas): "Atendemos Querétaro, Corregidora, El Marqués, Juriquilla, Zibatá, Huimilpan y San Juan del Río. Para proyectos fuera de esta zona, contáctanos y lo revisamos."

### Footer
"© 2026 Nodo Seguridad y Tecnología. Todos los derechos reservados."

---

## 4. Verificación

- Capturas de Playwright a 375, 768, 1024, 1366 y 1920px del hero y de cada sección con imágenes nuevas. Revisa que la palabra rotativa no mueva el layout en ningún ancho.
- `grep` en el proyecto: cero `[XX]`, `[confirmar]` o `[NOMBRE]` en texto visible.
- `npm run build` sin errores.
- Al terminar, dame la lista de todos los datos marcados `// demo: validar con cliente`.
