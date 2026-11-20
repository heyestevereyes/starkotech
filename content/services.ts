/**
 * Catálogo completo de servicios. Fuente única para el home y para las futuras
 * páginas /servicios/[slug] (fase 2).
 *
 * NOTA: el documento de servicios del cliente no estaba en el proyecto cuando se armó
 * este archivo. Los títulos de cada grupo siguen el mapeo del brief; los renglones de
 * cada lista están redactados a partir de esos títulos y del propio brief, y deben
 * cotejarse contra el documento del cliente antes de publicar.
 *
 * Regla de estilo: sin guiones largos ni guiones como puntuación en texto visible.
 */

export type Service = {
  slug: string;
  name: string;
  /** Descripción de 1 línea para la card del home */
  short: string;
  /** Párrafo introductorio para la página de detalle */
  intro: string;
  /** Nombre de icono Lucide (ver components/ui/icons.tsx) */
  icon: string;
  /** 3 chips para la card del home */
  highlights: string[];
  /** Listas completas del documento */
  groups: { title?: string; items: string[] }[];
  /** Frase de cierre del documento */
  note?: string;
  image?: string;
  /** Texto alternativo descriptivo de la imagen */
  imageAlt?: string;
};

export const services: Service[] = [
  {
    slug: "videovigilancia",
    name: "Videovigilancia",
    short: "Cámaras, CCTV, NVR, DVR y monitoreo desde tu celular.",
    intro:
      "Diseñamos, instalamos y damos soporte a sistemas de videovigilancia para casas, comercios, empresas y fraccionamientos, con grabación confiable y acceso remoto configurado.",
    icon: "Cctv",
    highlights: ["Cámaras IP", "NVR y DVR", "Vista desde el celular"],
    groups: [
      {
        title: "Servicios de videovigilancia",
        items: [
          "Instalación de cámaras IP y analógicas: domo, bala y PTZ",
          "Sistemas CCTV completos para casas, comercios, empresas y fraccionamientos",
          "Configuración de NVR y DVR con grabación continua, por movimiento y por evento",
          "Acceso remoto desde celular, computadora y tablet",
          "Ampliación y modernización de sistemas existentes",
          "Reubicación y reorientación de cámaras",
          "Cámaras para exterior, interior y condiciones de poca luz",
          "Diagnóstico de cámaras sin señal, sin imagen o sin grabación",
          "Reparación o sustitución de cámaras, fuentes de poder y cableado",
          "Revisión de discos duros, respaldos y tiempos de grabación",
          "Mantenimiento y limpieza de equipos",
        ],
      },
    ],
    note: "Realizamos levantamientos en sitio para definir ubicación, cantidad y tipo de cámaras antes de cotizar.",
  },
  {
    slug: "control-de-acceso",
    name: "Control de acceso",
    short: "Accesos peatonales, cerraduras, lectores, biométricos y videoporteros.",
    intro:
      "Controlamos quién entra, cuándo y por dónde, con soluciones para puertas, oficinas, edificios y accesos de personal, administradas de forma sencilla.",
    icon: "ScanFace",
    highlights: ["Lectores y tarjetas", "Biométricos", "Videoporteros"],
    groups: [
      {
        title: "Control de acceso peatonal",
        items: [
          "Cerraduras electromagnéticas y chapas eléctricas",
          "Lectores de tarjeta, tag y proximidad",
          "Lectores biométricos de huella y reconocimiento facial",
          "Teclados, botones de salida y botones de emergencia",
          "Controladores y software de administración de usuarios",
          "Alta, baja y programación de tarjetas y usuarios",
          "Videoporteros e intercomunicadores",
          "Torniquetes y puertas de acceso para personal",
          "Integración con puertas, portones y cámaras",
          "Reportes de entradas y salidas",
          "Reparación y mantenimiento de equipos existentes",
        ],
      },
    ],
  },
  {
    slug: "acceso-vehicular",
    name: "Acceso vehicular",
    short: "Plumas, barreras, motores, portones y automatismos.",
    intro:
      "Instalamos, programamos y reparamos accesos vehiculares para fraccionamientos, empresas, estacionamientos y casas, incluidos equipos hidráulicos de marcas especializadas como FAAC.",
    icon: "CarFront",
    highlights: ["Plumas y barreras", "Portones automáticos", "Equipos hidráulicos FAAC"],
    image: "/images/vehicular-barrier.jpg",
    imageAlt: "Pluma vehicular levantándose en un estacionamiento al atardecer mientras se acerca un auto, con la barra en movimiento",
    groups: [
      {
        title: "Trabajamos con",
        items: [
          "Plumas y barreras vehiculares",
          "Operadores para portones corredizos, abatibles y de garaje",
          "Equipos hidráulicos y electromecánicos, incluidos los de marcas especializadas como FAAC",
          "Motores, tarjetas de control y receptores",
          "Controles remotos, lectores de tarjeta y tags vehiculares",
        ],
      },
      {
        title: "Realizamos",
        items: [
          "Instalación de plumas, barreras y portones automáticos",
          "Programación de controles, tarjetas y lectores",
          "Instalación de sensores, fotoceldas y lazos inductivos",
          "Ajuste de tiempos, fuerza y finales de carrera",
          "Integración con control de acceso y videovigilancia",
        ],
      },
      {
        title: "Reparación y mantenimiento de automatismos",
        items: [
          "Diagnóstico de fallas eléctricas, mecánicas y de configuración",
          "Cambio de aceite y purga del sistema hidráulico",
          "Ajuste de válvulas y presiones",
          "Cambio de sellos y reparación de fugas",
          "Reparación o sustitución de tarjetas electrónicas, capacitores y motores",
          "Revisión de engranes, cremalleras, brazos y herrajes",
          "Lubricación, alineación y mantenimiento preventivo programado",
        ],
      },
    ],
    note: "Antes de reemplazar un equipo completo buscamos determinar si existe una reparación viable.",
  },
  {
    slug: "seguridad-perimetral",
    name: "Seguridad perimetral",
    short: "Cercas eléctricas y sistemas de alarma residencial y comercial.",
    intro:
      "Protegemos el perímetro de casas, comercios, bodegas y fraccionamientos con cercas eléctricas y alarmas instaladas, probadas y con mantenimiento.",
    icon: "Fence",
    highlights: ["Cercas eléctricas", "Alarmas", "Sensores"],
    groups: [
      {
        title: "Cercas eléctricas",
        items: [
          "Instalación de cercas eléctricas residenciales y comerciales",
          "Energizadores, aisladores, cable y señalización",
          "Sensores de corte y de tierra",
          "Ampliación de tramos y esquinas",
          "Diagnóstico y reparación de cercas existentes",
          "Mantenimiento preventivo y revisión de voltaje",
        ],
      },
      {
        title: "Sistemas de alarma",
        items: [
          "Paneles de alarma residencial y comercial",
          "Sensores de movimiento, puertas y ventanas",
          "Sirenas, teclados y controles remotos",
          "Botones de auxilio",
          "Notificaciones y control desde el celular",
          "Integración con cámaras y control de acceso",
          "Revisión, reprogramación y reparación de sistemas existentes",
        ],
      },
    ],
  },
  {
    slug: "redes",
    name: "Redes",
    short: "Cableado estructurado, switches PoE, racks y enlaces inalámbricos punto a punto.",
    intro:
      "Construimos la red sobre la que funcionan cámaras, accesos y automatización: cableado ordenado, equipos bien configurados y enlaces entre puntos distantes.",
    icon: "Network",
    highlights: ["Cableado estructurado", "Switches PoE", "Enlaces punto a punto"],
    image: "/images/wireless-link.jpg",
    imageAlt: "Técnico con casco y arnés alineando una antena de enlace punto a punto en un mástil sobre la azotea de un edificio",
    groups: [
      {
        title: "Redes y telecomunicaciones",
        items: [
          "Cableado estructurado de datos y voz",
          "Racks, gabinetes y patch panels",
          "Switches PoE y administrables",
          "Configuración de VLAN, segmentos y direccionamiento IP",
          "Access points y cobertura Wi-Fi",
          "Fibra óptica y troncales entre edificios",
          "Etiquetado, pruebas y certificación del cableado",
          "Reorganización de racks y cableado existentes",
        ],
      },
      {
        title: "Enlaces inalámbricos y punto a punto",
        items: [
          "Enlaces entre casetas, edificios y sucursales",
          "Antenas, mástiles y herrajes",
          "Alineación, pruebas de señal y estabilidad",
          "Enlaces de respaldo",
          "Mantenimiento, reorientación y reemplazo de equipos",
        ],
      },
    ],
  },
  {
    slug: "automatizacion",
    name: "Automatización",
    short: "Domótica, iluminación, accesos, portones y rutinas automatizadas.",
    intro:
      "Conectamos iluminación, accesos y portones para que tu casa o tu negocio respondan a rutinas que tú defines, con control desde el celular.",
    icon: "Cpu",
    highlights: ["Domótica", "Iluminación", "Rutinas"],
    image: "/images/smart-home.jpg",
    imageAlt: "Técnico configurando en un panel de pared el control de luces, cortinas y escenas de una sala moderna con luz tenue",
    groups: [
      {
        title: "Domótica y automatización",
        items: [
          "Control de iluminación y escenas",
          "Rutinas por horario, presencia o evento",
          "Control de portones y accesos desde el celular",
          "Cortinas, persianas y toldos motorizados",
          "Sensores y notificaciones",
          "Integración con asistentes de voz",
          "Automatización de riego y bombas",
          "Integración con cámaras, alarmas y control de acceso",
          "Paneles y botoneras de control",
        ],
      },
    ],
  },
  {
    slug: "mantenimiento",
    name: "Mantenimiento",
    short: "Preventivo, correctivo y pólizas para fraccionamientos, condominios y empresas.",
    intro:
      "Mantenemos tus sistemas funcionando con revisiones programadas, atención de fallas y pólizas a la medida de cada instalación.",
    icon: "Wrench",
    highlights: ["Preventivo", "Correctivo", "Pólizas"],
    image: "/images/maintenance.jpg",
    imageAlt: "Técnico limpiando una cámara bala en un muro con cerca eléctrica mientras revisa su lista de mantenimiento en una tableta",
    groups: [
      {
        title: "Mantenimiento preventivo",
        items: [
          "Revisión periódica de cámaras, grabadores, accesos, barreras, cercas y red",
          "Limpieza y ajuste de equipos",
          "Revisión de fuentes de poder, baterías y conexiones",
          "Verificación de grabación y respaldos",
          "Reporte de cada visita",
        ],
      },
      {
        title: "Mantenimiento correctivo",
        items: [
          "Atención de fallas y diagnóstico en sitio",
          "Reparación o sustitución de equipos dañados",
          "Corrección de cableado y conexiones",
          "Reprogramación y restauración de configuraciones",
        ],
      },
      {
        title: "Pólizas de mantenimiento",
        items: [
          "Visitas preventivas programadas",
          "Atención de incidencias",
          "Soporte remoto y asistido",
          "Cobertura definida según tu instalación",
          "Para fraccionamientos, condominios, edificios y empresas",
        ],
      },
    ],
  },
  {
    slug: "soporte-tecnico",
    name: "Soporte técnico",
    short: "Diagnóstico, reparación, reprogramación y configuración de equipos.",
    intro:
      "Cuando algo deja de funcionar, lo revisamos en sitio o a distancia, encontramos la causa y te decimos qué conviene: reparar, reprogramar o sustituir.",
    icon: "LifeBuoy",
    highlights: ["Diagnóstico", "Reparación", "Reprogramación"],
    groups: [
      {
        title: "Diagnósticos y revisiones",
        items: [
          "Visitas exclusivas de diagnóstico",
          "Detección de la causa de la falla: eléctrica, mecánica, de red o de configuración",
          "Revisión de instalaciones hechas por otros proveedores",
          "Recomendación entre reparar, reprogramar o sustituir",
          "Cotización del correctivo",
        ],
      },
      {
        title: "Instalaciones nuevas y modernización",
        items: [
          "Instalación y configuración de equipos nuevos",
          "Migración de sistemas antiguos a tecnología actual",
          "Reprogramación de equipos y recuperación de accesos",
          "Configuración de acceso remoto desde el celular",
          "Capacitación básica al usuario o administrador",
        ],
      },
    ],
  },
  {
    slug: "cerrajeria",
    name: "Cerrajería",
    short: "Soluciones residenciales y automotrices.",
    intro: "Atendemos aperturas, cambios y copias de llaves para casas, comercios y vehículos.",
    icon: "Key",
    highlights: ["Residencial", "Automotriz", "Llaves y chapas"],
    groups: [
      {
        title: "Residencial",
        items: [
          "Apertura de puertas y chapas",
          "Cambio e instalación de chapas y cerraduras",
          "Copias de llaves",
          "Cerraduras de seguridad y cerraduras electrónicas",
          "Ajuste y reparación de herrajes",
        ],
      },
      {
        title: "Automotriz",
        items: [
          "Apertura de vehículos",
          "Copias de llaves",
          "Duplicado y programación de llaves con chip",
          "Reparación de cerraduras de puertas y encendido",
        ],
      },
    ],
  },
  {
    slug: "computacion",
    name: "Computación",
    short: "Reparación, mantenimiento y optimización de computadoras.",
    intro: "Revisamos, reparamos y optimizamos equipos de cómputo para hogares y oficinas.",
    icon: "Laptop",
    highlights: ["Reparación", "Mantenimiento", "Optimización"],
    groups: [
      {
        title: "Reparación y soporte de equipos de cómputo",
        items: [
          "Diagnóstico y reparación de computadoras de escritorio y laptops",
          "Mantenimiento preventivo y limpieza interna",
          "Optimización de rendimiento",
          "Instalación y configuración de sistema operativo y programas",
          "Ampliación de memoria y cambio de disco duro",
          "Respaldo y recuperación de información",
          "Revisión y limpieza de virus y software no deseado",
          "Configuración de impresoras y red de oficina",
        ],
      },
    ],
  },
  {
    slug: "proyectos",
    name: "Proyectos empresariales",
    short:
      "Soluciones integrales para empresas, edificios, condominios y fraccionamientos, con levantamiento y memoria técnica.",
    intro:
      "Para obra nueva, ampliación o modernización completa: levantamos el sitio, diseñamos la solución, la instalamos y la documentamos.",
    icon: "Building2",
    highlights: ["Levantamiento", "Integración", "Memoria técnica"],
    groups: [
      {
        title: "Levantamientos técnicos",
        items: [
          "Visita al sitio para definir alcances, ubicaciones y materiales",
          "Revisión de infraestructura existente",
          "Propuesta técnica y económica",
          "Planeación por etapas",
        ],
      },
      {
        title: "Memorias técnicas y documentación",
        items: [
          "Inventario de equipos",
          "Direcciones IP y segmentos de red",
          "Ubicación e identificación de dispositivos",
          "Información de NVR, cámaras, switches y antenas",
          "Diagramas de instalación",
          "Datos técnicos para mantenimiento",
        ],
      },
    ],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
