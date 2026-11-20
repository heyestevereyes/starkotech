/**
 * Catálogo de productos. Fuente única para el home (sección Productos), /productos, /productos/[slug],
 * la lista de cotización y el JSON-LD.
 *
 * Todos los precios, instalaciones y especificaciones son de demo: validar con cliente.
 * La estructura (slug, sku, price, image) está pensada para conectar Shopify o un checkout más adelante
 * sin rehacer componentes: basta con sustituir este módulo por una fuente remota con la misma forma.
 *
 * Regla de estilo: sin guiones largos ni guiones como puntuación en texto visible.
 */

export type ProductCategory = {
  slug: string;
  name: string;
  /** Nombre de icono Lucide (ver components/ui/icons.tsx) */
  icon: string;
};

export type ProductBadge = "Más vendido" | "Kit" | "Nuevo" | "Recomendado";

export type Product = {
  slug: string;
  name: string;
  /** Slug de categoría */
  category: string;
  /** 1 línea para la card */
  short: string;
  /** 2 especificaciones clave que se muestran como chips en la card */
  chips: [string, string];
  /** Párrafo para el detalle */
  description: string;
  /** Imagen principal (la galería puede sumar más en `gallery`) */
  image: string;
  /** Fotos adicionales para la galería del detalle (vacío por ahora) */
  gallery?: string[];
  /** Texto alternativo descriptivo de la imagen */
  imageAlt: string;
  /** MXN con IVA */
  price: number;
  /** "Desde" cuando aplica */
  priceLabel?: string;
  /** Instalación desde, MXN */
  installFrom?: number;
  /** Texto de instalación cuando no hay monto fijo (se cotiza en sitio) */
  installNote?: string;
  badge?: ProductBadge;
  /** 4 a 6 especificaciones */
  specs: { label: string; value: string }[];
  includes?: string[];
  /** "Casas", "Fraccionamientos", "Empresas"... */
  idealFor: string[];
  /** Slug de services.ts */
  relatedService?: string;
  /** Aparece en el home */
  featured?: boolean;
  /** Para conectar inventario después */
  sku?: string;
};

export const productCategories: ProductCategory[] = [
  { slug: "videovigilancia", name: "Cámaras y videovigilancia", icon: "Cctv" },
  { slug: "grabadores-redes", name: "Grabadores y redes", icon: "Network" },
  { slug: "control-de-acceso", name: "Control de acceso", icon: "ScanFace" },
  { slug: "chapas", name: "Chapas y cerraduras", icon: "LockKeyhole" },
  { slug: "acceso-vehicular", name: "Acceso vehicular", icon: "CarFront" },
  { slug: "alarmas-cercas", name: "Alarmas y cercas", icon: "Siren" },
  { slug: "kits", name: "Kits listos para instalar", icon: "PackageCheck" },
];

/** Producto que se muestra como banner ancho en el home (no entra al grid de destacados). */
export const kitBannerSlug = "kit-4-camaras-ip";

const img = (slug: string) => `/images/productos/${slug}.jpg`;

export const products: Product[] = [
  {
    slug: "camara-domo-ip-4mp",
    name: "Cámara domo IP 4MP",
    category: "videovigilancia",
    short: "Domo antivandálico con visión nocturna y vista desde el celular.",
    chips: ["4MP", "IR 30 m"],
    description:
      "Cámara domo de 4MP pensada para accesos, pasillos, recepciones y estacionamientos. Su carcasa resistente al impacto y a la intemperie la hace práctica para interior y exterior, y se alimenta por el mismo cable de red gracias a PoE.",
    image: img("camara-domo-ip-4mp"),
    imageAlt: "Cámara domo IP blanca con lente negro y anillo de luces infrarrojas sobre fondo claro",
    price: 1290, // demo: validar con cliente
    installFrom: 650, // demo: validar con cliente
    badge: "Más vendido",
    specs: [
      { label: "Resolución", value: "4MP" },
      { label: "Lente", value: "2.8 mm" },
      { label: "Visión nocturna", value: "IR 30 m" },
      { label: "Alimentación", value: "PoE" },
      { label: "Protección", value: "IP67 e IK10" },
      { label: "App móvil", value: "Compatible" },
    ],
    includes: ["Cámara domo IP 4MP", "Kit de tornillería y taquetes", "Guía de instalación rápida"],
    idealFor: ["Casas", "Comercios", "Fraccionamientos", "Empresas"],
    relatedService: "videovigilancia",
    featured: true,
    sku: "STK-CAM-DOM-4MP",
  },
  {
    slug: "camara-bala-ip-4mp-color",
    name: "Cámara bala IP 4MP con visión nocturna a color",
    category: "videovigilancia",
    short: "Imagen a color también de noche, con micrófono integrado.",
    chips: ["4MP", "Color 24/7"],
    description:
      "Cámara tipo bala para exteriores que mantiene la imagen a color durante la noche gracias a su iluminación suplementaria. Con micrófono integrado y alcance de 40 m, es una buena opción para fachadas, patios y perímetros.",
    image: img("camara-bala-ip-4mp-color"),
    imageAlt: "Cámara bala IP blanca con antena y base de montaje sobre fondo claro",
    price: 1490, // demo: validar con cliente
    installFrom: 650, // demo: validar con cliente
    specs: [
      { label: "Resolución", value: "4MP" },
      { label: "Visión nocturna", value: "A color 24/7" },
      { label: "Alcance", value: "40 m" },
      { label: "Audio", value: "Micrófono integrado" },
      { label: "Alimentación", value: "PoE" },
      { label: "Protección", value: "IP67" },
    ],
    includes: ["Cámara bala IP 4MP", "Base de montaje", "Kit de tornillería y taquetes"],
    idealFor: ["Casas", "Comercios", "Bodegas", "Fraccionamientos"],
    relatedService: "videovigilancia",
    featured: true,
    sku: "STK-CAM-BAL-4MP-C",
  },
  {
    slug: "camara-ptz-ip-4mp-25x",
    name: "Cámara PTZ IP 4MP con zoom 25x",
    category: "videovigilancia",
    short: "Giro, inclinación y zoom óptico para cubrir áreas amplias.",
    chips: ["Zoom 25x", "IR 100 m"],
    description:
      "Cámara motorizada con zoom óptico de 25x para vigilar estacionamientos, patios de maniobra y perímetros extensos desde un solo punto. Puede seguir automáticamente a una persona o vehículo en movimiento.",
    image: img("camara-ptz-ip-4mp-25x"),
    imageAlt: "Cámara PTZ blanca y negra montada en soporte colgante sobre fondo claro",
    price: 11900, // demo: validar con cliente
    installFrom: 1800, // demo: validar con cliente
    specs: [
      { label: "Resolución", value: "4MP" },
      { label: "Zoom óptico", value: "25x" },
      { label: "Visión nocturna", value: "IR 100 m" },
      { label: "Seguimiento", value: "Automático" },
      { label: "Alimentación", value: "PoE+" },
      { label: "Protección", value: "IP66" },
    ],
    includes: ["Cámara PTZ IP 4MP", "Soporte de montaje", "Fuente o inyector PoE+ según instalación"],
    idealFor: ["Fraccionamientos", "Empresas", "Estacionamientos", "Industria"],
    relatedService: "videovigilancia",
    sku: "STK-CAM-PTZ-25X",
  },
  {
    slug: "nvr-8-canales-poe",
    name: "Grabador NVR 8 canales PoE 4K",
    category: "grabadores-redes",
    short: "Graba hasta 8 cámaras IP y las alimenta por el mismo cable.",
    chips: ["8 canales PoE", "4K"],
    description:
      "Grabador de red con 8 puertos PoE integrados: conectas las cámaras directo al equipo, sin fuentes de poder aparte. Detecta personas y vehículos para que revises solo lo que importa, y permite ver todo desde el celular.",
    image: img("nvr-8-canales-poe"),
    imageAlt: "Grabador NVR negro con puertos de red en el panel trasero sobre fondo claro",
    price: 3890, // demo: validar con cliente
    installFrom: 900, // demo: validar con cliente
    specs: [
      { label: "Puertos PoE", value: "8" },
      { label: "Grabación", value: "Hasta 8MP (4K)" },
      { label: "Almacenamiento", value: "1 bahía, hasta 10 TB" },
      { label: "Analíticos", value: "Personas y vehículos" },
      { label: "App móvil", value: "Compatible" },
    ],
    includes: ["Grabador NVR", "Fuente de poder", "Mouse y cable HDMI"],
    idealFor: ["Casas", "Comercios", "Empresas"],
    relatedService: "videovigilancia",
    sku: "STK-NVR-8P",
  },
  {
    slug: "switch-poe-8-puertos",
    name: "Switch PoE+ 8 puertos administrable",
    category: "grabadores-redes",
    short: "Energía y datos para cámaras, antenas y puntos de acceso.",
    chips: ["8 puertos PoE+", "120 W"],
    description:
      "Switch administrable con 8 puertos PoE+ y 120 W de potencia total, ideal para alimentar cámaras, antenas y puntos de acceso desde un solo equipo. Con VLAN y QoS puedes separar el tráfico de seguridad del resto de la red.",
    image: img("switch-poe-8-puertos"),
    imageAlt: "Switch de red negro con ocho puertos y cables azules conectados sobre fondo claro",
    price: 2190, // demo: validar con cliente
    installFrom: 500, // demo: validar con cliente
    specs: [
      { label: "Puertos", value: "8 PoE+" },
      { label: "Potencia total", value: "120 W" },
      { label: "Uplink", value: "2 puertos gigabit" },
      { label: "Gestión", value: "VLAN y QoS" },
      { label: "Montaje", value: "Rack o escritorio" },
    ],
    includes: ["Switch PoE+", "Cable de corriente", "Orejas para rack"],
    idealFor: ["Empresas", "Fraccionamientos", "Comercios"],
    relatedService: "redes",
    sku: "STK-SW-POE-8",
  },
  {
    slug: "enlace-punto-a-punto",
    name: "Kit de enlace inalámbrico punto a punto 5 GHz",
    category: "grabadores-redes",
    short: "Conecta dos puntos lejanos sin tender cable.",
    chips: ["Hasta 3 km", "450 Mbps"],
    description:
      "Par de antenas de 5 GHz para llevar la red a casetas, torres, bodegas o edificios separados sin abrir zanjas. Con línea de vista alcanza hasta 3 km, suficiente para unir un acceso lejano con el cuarto de control.",
    image: img("enlace-punto-a-punto"),
    imageAlt: "Par de antenas blancas de exterior montadas en postes metálicos sobre fondo claro",
    price: 3990, // demo: validar con cliente
    installFrom: 2200, // demo: validar con cliente
    specs: [
      { label: "Frecuencia", value: "Par de antenas 5 GHz" },
      { label: "Alcance", value: "Hasta 3 km con línea de vista" },
      { label: "Velocidad", value: "Hasta 450 Mbps" },
      { label: "Uso", value: "Exterior IP65" },
      { label: "Montaje", value: "Brackets incluidos" },
    ],
    includes: ["2 antenas", "Brackets de montaje", "Inyectores PoE"],
    idealFor: ["Fraccionamientos", "Empresas", "Industria"],
    relatedService: "redes",
    sku: "STK-PTP-5G",
  },
  {
    slug: "videoportero-ip-7",
    name: 'Videoportero IP con monitor de 7"',
    category: "control-de-acceso",
    short: "Ve quién llama y abre la puerta desde el monitor o el celular.",
    chips: ["Monitor de 7\"", "App móvil"],
    description:
      "Videoportero con monitor táctil de 7 pulgadas y frente de calle con cámara. Contesta desde la pantalla o desde la app, y abre la chapa de forma remota aunque no estés en casa.",
    image: img("videoportero-ip-7"),
    imageAlt: "Monitor táctil de videoportero con imagen de una entrada y frente de calle con cámara sobre fondo claro",
    price: 4590, // demo: validar con cliente
    installFrom: 1200, // demo: validar con cliente
    badge: "Recomendado",
    specs: [
      { label: "Monitor", value: 'Táctil de 7"' },
      { label: "Frente de calle", value: "Cámara de 2MP" },
      { label: "Apertura", value: "Remota de chapa" },
      { label: "App móvil", value: "Compatible" },
      { label: "Alimentación", value: "PoE" },
    ],
    includes: ["Monitor interior", "Frente de calle", "Soportes y tornillería"],
    idealFor: ["Casas", "Oficinas", "Condominios"],
    relatedService: "control-de-acceso",
    featured: true,
    sku: "STK-VID-IP7",
  },
  {
    slug: "lector-biometrico",
    name: "Control de acceso biométrico con huella y tarjeta",
    category: "control-de-acceso",
    short: "Huella, tarjeta o PIN para puertas de personal y oficinas.",
    chips: ["3,000 huellas", "TCP/IP"],
    description:
      "Terminal de control de acceso con lector de huella, tarjeta y teclado. Registra cada entrada, sirve también como reloj checador y se integra con chapas eléctricas o electromagnéticas por red o Wiegand.",
    image: img("lector-biometrico"),
    imageAlt: "Terminal biométrica negra con pantalla, lector de huella, teclado y zona para tarjeta sobre fondo claro",
    price: 3290, // demo: validar con cliente
    installFrom: 1500, // demo: validar con cliente
    specs: [
      { label: "Huellas", value: "3,000" },
      { label: "Tarjetas", value: "10,000" },
      { label: "Métodos", value: "Teclado y PIN" },
      { label: "Conectividad", value: "TCP/IP y Wiegand" },
      { label: "Registro", value: "Asistencia de personal" },
    ],
    includes: ["Terminal biométrica", "Fuente de poder", "10 tarjetas de proximidad"],
    idealFor: ["Empresas", "Oficinas", "Industria", "Fraccionamientos"],
    relatedService: "control-de-acceso",
    featured: true,
    sku: "STK-BIO-HT",
  },
  {
    slug: "chapa-inteligente-huella",
    name: "Chapa inteligente con huella y teclado",
    category: "chapas",
    short: "Entra con huella, código, tarjeta, app o llave.",
    chips: ["Huella y código", "100 huellas"],
    description:
      "Chapa de manija con cinco formas de apertura y alarma antimanipulación. Funciona con baterías AA y avisa con tiempo cuando necesitan cambio, para que no te quedes afuera.",
    image: img("chapa-inteligente-huella"),
    imageAlt: "Chapa de manija negra con teclado numérico y lector de huella sobre fondo claro",
    price: 4290, // demo: validar con cliente
    installFrom: 850, // demo: validar con cliente
    badge: "Nuevo",
    specs: [
      { label: "Apertura", value: "Huella, código, tarjeta, app y llave" },
      { label: "Capacidad", value: "Hasta 100 huellas" },
      { label: "Seguridad", value: "Alarma antimanipulación" },
      { label: "Energía", value: "Baterías AA con aviso de carga baja" },
      { label: "Puertas", value: "De 35 a 55 mm" },
    ],
    includes: ["Chapa con manija", "Llaves de respaldo", "Tarjetas de acceso", "Kit de instalación"],
    idealFor: ["Casas", "Departamentos", "Oficinas"],
    relatedService: "cerrajeria",
    featured: true,
    sku: "STK-CHP-SMART",
  },
  {
    slug: "cerrojo-alta-seguridad",
    name: "Cerrojo de alta seguridad antiganzúa",
    category: "chapas",
    short: "Cilindro antiganzúa y antibumping en acero endurecido.",
    chips: ["Antiganzúa", "3 llaves"],
    description:
      "Cerrojo de embutir con cilindro de alta seguridad que resiste ganzúa y la técnica de bumping. Un refuerzo sencillo y económico para la puerta principal de casas, departamentos y oficinas.",
    image: img("cerrojo-alta-seguridad"),
    imageAlt: "Cerrojo de níquel satinado con llaves, pestillo y tornillos sobre fondo claro",
    price: 1190, // demo: validar con cliente
    installFrom: 450, // demo: validar con cliente
    specs: [
      { label: "Cilindro", value: "Antiganzúa y antibumping" },
      { label: "Material", value: "Acero endurecido" },
      { label: "Llaves", value: "3" },
      { label: "Acabado", value: "Níquel satinado" },
    ],
    includes: ["Cerrojo completo", "3 llaves", "Contrachapa y tornillería"],
    idealFor: ["Casas", "Departamentos", "Oficinas"],
    relatedService: "cerrajeria",
    sku: "STK-CER-AGZ",
  },
  {
    slug: "cerradura-electromagnetica",
    name: "Cerradura electromagnética 600 lb",
    category: "chapas",
    short: "Retención de 600 lb con sensor de estado de la puerta.",
    chips: ["600 lb", "12 V DC"],
    description:
      "Cerradura electromagnética para puertas de oficinas, accesos de personal y salidas controladas. Sin partes móviles, libera la puerta al instante cuando se corta la energía, y su sensor te dice si quedó cerrada.",
    image: img("cerradura-electromagnetica"),
    imageAlt: "Cerradura electromagnética de aluminio con soportes en L y Z sobre fondo claro",
    price: 1390, // demo: validar con cliente
    installFrom: 900, // demo: validar con cliente
    specs: [
      { label: "Fuerza de retención", value: "600 lb" },
      { label: "Voltaje", value: "12 V DC" },
      { label: "Sensor", value: "Estado de puerta" },
      { label: "Soportes", value: "Brackets L y Z incluidos" },
    ],
    includes: ["Cerradura electromagnética", "Contraplaca", "Brackets L y Z"],
    idealFor: ["Empresas", "Oficinas", "Industria", "Escuelas"],
    relatedService: "control-de-acceso",
    sku: "STK-EMG-600",
  },
  {
    slug: "chapa-electrica-porton",
    name: "Chapa eléctrica para portón",
    category: "chapas",
    short: "Abre el portón con botón, interfón o control de acceso.",
    chips: ["12 V", "Uso exterior"],
    description:
      "Chapa eléctrica de uso exterior que se abre a distancia con un botón, un interfón o un lector de acceso. Una mejora práctica para portones de casas, bodegas y accesos peatonales de fraccionamientos.",
    image: img("chapa-electrica-porton"),
    imageAlt: "Chapa eléctrica negra de sobreponer con llaves y cables sobre fondo claro",
    price: 1590, // demo: validar con cliente
    installFrom: 700, // demo: validar con cliente
    specs: [
      { label: "Voltaje", value: "12 V" },
      { label: "Apertura", value: "Botón, interfón o control de acceso" },
      { label: "Uso", value: "Exterior" },
      { label: "Llaves", value: "2 incluidas" },
    ],
    includes: ["Chapa eléctrica", "Contrachapa", "2 llaves"],
    idealFor: ["Casas", "Bodegas", "Fraccionamientos"],
    relatedService: "control-de-acceso",
    featured: true,
    sku: "STK-CHP-PTN",
  },
  {
    slug: "barrera-vehicular",
    name: "Barrera vehicular con brazo de 3 m",
    category: "acceso-vehicular",
    short: "Pluma de uso intensivo para accesos de autos.",
    chips: ["Brazo de 3 m", "Apertura 3 s"],
    description:
      "Barrera vehicular de uso intensivo con brazo de 3 m y apertura en 3 segundos. Se integra con lectores, tags y controles para ordenar el acceso de residentes, visitas y proveedores en fraccionamientos, empresas y estacionamientos.",
    image: img("barrera-vehicular"),
    imageAlt: "Barrera vehicular gris con brazo a rayas rojas y blancas sobre fondo claro",
    price: 28900, // demo: validar con cliente
    priceLabel: "Desde",
    installFrom: 4500, // demo: validar con cliente
    specs: [
      { label: "Brazo", value: "3 m" },
      { label: "Apertura", value: "3 s" },
      { label: "Uso", value: "Intensivo" },
      { label: "Incluye", value: "2 controles y fotoceldas" },
      { label: "Integración", value: "Lectores y tags" },
    ],
    includes: ["Barrera con brazo de 3 m", "2 controles remotos", "Par de fotoceldas"],
    idealFor: ["Fraccionamientos", "Empresas", "Estacionamientos", "Industria"],
    relatedService: "acceso-vehicular",
    sku: "STK-BAR-3M",
  },
  {
    slug: "electrificador-cerca",
    name: "Electrificador para cerca eléctrica",
    category: "alarmas-cercas",
    short: "Cubre hasta 5,000 m lineales con alarma y sirena.",
    chips: ["Hasta 5,000 m", "Con batería"],
    description:
      "Energizador para cercas eléctricas perimetrales con alarma y sirena integradas. Mantiene la protección aun sin luz gracias a su batería de respaldo, y se activa o desactiva con control remoto.",
    image: img("electrificador-cerca"),
    imageAlt: "Electrificador gris con luces indicadoras, aisladores blancos y rollo de cable sobre fondo claro",
    price: 3490, // demo: validar con cliente
    installNote: "Instalación según metros", // demo: validar con cliente
    specs: [
      { label: "Cobertura", value: "Hasta 5,000 m lineales" },
      { label: "Alarma", value: "Sirena integrada" },
      { label: "Respaldo", value: "Batería" },
      { label: "Activación", value: "Por control" },
    ],
    includes: ["Electrificador", "Control remoto", "Aisladores de arranque"],
    idealFor: ["Casas", "Bodegas", "Fraccionamientos", "Industria"],
    relatedService: "seguridad-perimetral",
    sku: "STK-ELE-5K",
  },
  {
    slug: "kit-alarma-inalambrica",
    name: "Kit de alarma inalámbrica con app",
    category: "alarmas-cercas",
    short: "Panel con WiFi y 4G, sensores y avisos en tu celular.",
    chips: ["WiFi y 4G", "App móvil"],
    description:
      "Kit de alarma inalámbrica listo para casas y negocios pequeños. El panel se conecta por WiFi y 4G, así que sigue avisándote aunque se caiga el internet, y todo se arma o desarma desde la app.",
    image: img("kit-alarma-inalambrica"),
    imageAlt: "Kit de alarma blanco con panel central, sensor de movimiento, sirena, contactos magnéticos y control remoto sobre fondo claro",
    price: 5490, // demo: validar con cliente
    installFrom: 900, // demo: validar con cliente
    specs: [
      { label: "Panel", value: "WiFi y 4G" },
      { label: "Sensores", value: "1 de movimiento y 2 contactos magnéticos" },
      { label: "Control", value: "Remoto incluido" },
      { label: "Sirena", value: "Interior" },
      { label: "Avisos", value: "Notificaciones en app" },
    ],
    includes: ["Panel central", "Sensor de movimiento", "2 contactos magnéticos", "Control remoto", "Sirena interior"],
    idealFor: ["Casas", "Departamentos", "Comercios"],
    relatedService: "seguridad-perimetral",
    featured: true,
    sku: "STK-ALM-KIT",
  },
  {
    slug: "kit-4-camaras-ip",
    name: "Kit 4 cámaras IP + NVR + disco 1 TB",
    category: "kits",
    short: "Todo para vigilar 4 puntos, listo para instalar.",
    chips: ["4 cámaras", "NVR y 1 TB"],
    description:
      "Kit completo para empezar con videovigilancia: cuatro cámaras IP de 4MP, grabador de 8 canales PoE, disco duro y cableado para cuatro puntos. Llega configurado para que lo veas desde tu celular el mismo día de la instalación.",
    image: img("kit-4-camaras-ip"),
    imageAlt: "Kit de cuatro cámaras IP, dos domo y dos bala, con grabador negro y cuatro cables de red sobre fondo claro",
    price: 8990, // demo: validar con cliente
    installFrom: 2500, // demo: validar con cliente
    badge: "Kit",
    specs: [
      { label: "Cámaras", value: "4 IP 4MP (2 domo y 2 bala)" },
      { label: "Grabador", value: "NVR 8 canales PoE" },
      { label: "Disco duro", value: "1 TB" },
      { label: "Cableado", value: "Cable y conectores para 4 puntos" },
      { label: "App", value: "Configuración incluida con instalación" },
    ],
    includes: ["4 cámaras IP 4MP", "NVR 8 canales PoE", "Disco duro de 1 TB", "Cable y conectores para 4 puntos"],
    idealFor: ["Casas", "Comercios", "Oficinas pequeñas"],
    relatedService: "videovigilancia",
    featured: true,
    sku: "STK-KIT-4C",
  },
];

export const productBySlug = (slug: string) => products.find((p) => p.slug === slug);
export const categoryBySlug = (slug: string) => productCategories.find((c) => c.slug === slug);
export const productsByCategory = (category: string) => products.filter((p) => p.category === category);

/** Destacados del home, sin el kit que va en el banner. */
export const featuredProducts = products.filter((p) => p.featured && p.slug !== kitBannerSlug);

/** Relacionados: misma categoría primero y, si faltan, de otras categorías hasta completar `n`. */
export function relatedProducts(product: Product, n = 4): Product[] {
  const same = products.filter((p) => p.category === product.category && p.slug !== product.slug);
  const rest = products.filter((p) => p.category !== product.category && p.slug !== product.slug);
  return [...same, ...rest].slice(0, n);
}

/** 1290 → "$1,290" (sin Intl para que servidor y cliente den siempre el mismo texto). */
export const formatMXN = (n: number) => {
  const digits = String(Math.round(n));
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += ",";
    out += digits[i];
  }
  return `$${out}`;
};
