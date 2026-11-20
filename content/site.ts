import { whatsappUrl } from "@/lib/contact";

/**
 * Todo el copy del sitio vive aquí. Ningún texto visible se escribe directo en un componente.
 *
 * Convenciones:
 * - En titulares, el texto entre *asteriscos* se renderiza como acento
 *   (Instrument Serif itálica, o bloque signal en el H1).
 * - Los datos inventados para la demo llevan el comentario `// demo: validar con cliente`
 *   para poder rastrearlos y sustituirlos por los reales (`grep -rn "demo: validar" content`).
 * - Los datos aún por definir (si aparecieran) llevan [XX] o [confirmar].
 * - Regla de estilo: sin guiones largos ni guiones como puntuación en texto visible.
 */

export const site = {
  brand: {
    /** El nombre de marca vive solo aquí. */
    name: "Starko Tech",
    legalName: "Starko Tech", // demo: validar razón social con cliente
    tagline: "Soluciones integrales en seguridad, tecnología y automatización.",
    description:
      "Starko Tech es una empresa de seguridad electrónica, control de accesos, acceso vehicular, redes, automatización, mantenimiento técnico y soporte en Querétaro, para casas, empresas y fraccionamientos.", // demo: validar con cliente
  },

  /** Datos de contacto. Todos son de demo. */
  contact: {
    whatsapp: "442 000 0000", // demo: validar con cliente
    phone: "442 000 0000", // demo: validar con cliente
    email: "contacto@starkotech.mx", // demo: validar con cliente
    address: "Querétaro, Qro.", // demo: validar con cliente
    hours: "Lunes a viernes de 9:00 a 19:00 · Sábados de 9:00 a 14:00 · Emergencias en póliza 24/7", // demo: validar con cliente
    zones: ["Querétaro", "Corregidora", "El Marqués", "Juriquilla", "Zibatá", "Huimilpan", "San Juan del Río"], // demo: validar con cliente
  },

  seo: {
    title: "Starko Tech | Seguridad, tecnología y automatización en Querétaro",
    ogTitle: "Seguridad, tecnología y automatización en Querétaro",
    description:
      "Instalamos y mantenemos videovigilancia, control de acceso, barreras vehiculares, redes, cercas eléctricas y automatización para casas, empresas y fraccionamientos en Querétaro. Solicita tu cotización o visita técnica.",
    keywords: [
      "seguridad electrónica",
      "videovigilancia",
      "control de acceso",
      "acceso vehicular",
      "barreras vehiculares",
      "cercas eléctricas",
      "alarmas",
      "redes y cableado estructurado",
      "automatización",
      "mantenimiento de fraccionamientos",
      "pólizas de mantenimiento",
      "reparación de equipos FAAC",
      "seguridad electrónica Querétaro",
      "cámaras de seguridad Querétaro",
    ],
  },

  nav: {
    links: [
      { label: "Servicios", href: "#servicios" },
      { label: "Productos", href: "#productos" },
      { label: "Para quién", href: "#para-quien" },
      { label: "Cómo trabajamos", href: "#como-trabajamos" },
      { label: "Pólizas", href: "#polizas" },
      { label: "Preguntas", href: "#preguntas" },
    ],
    secondary: { label: "Hablar con un técnico", href: whatsappUrl("Hola, quiero hablar con un técnico") },
    primary: { label: "Solicitar cotización", href: "#cotizar" },
    mobileCta: "Cotizar",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    skip: "Saltar al contenido",
  },

  whatsappFab: "Escríbenos por WhatsApp",

  hero: {
    id: "inicio",
    chip: "Atención en Querétaro y zona metropolitana", // demo: validar con cliente
    /** H1: la primera línea es fija; la palabra resaltada rota entre los servicios. */
    title: {
      lead: "Instalamos y mantenemos",
      words: [
        "videovigilancia.",
        "control de acceso.",
        "barreras vehiculares.",
        "redes.",
        "cercas eléctricas.",
        "automatización.",
      ],
      /** Texto completo para lectores de pantalla (la parte animada va con aria-hidden). */
      srOnly:
        "Instalamos y mantenemos videovigilancia, control de acceso, barreras vehiculares, redes, cercas eléctricas y automatización",
      intervalMs: 2400,
    },
    subtitle:
      "Cámaras, accesos, plumas vehiculares, redes, alarmas y automatización para casas, empresas y fraccionamientos en Querétaro. Un solo equipo técnico, del diagnóstico al mantenimiento.",
    primary: { label: "Solicitar cotización", href: "#cotizar" },
    secondary: { label: "Agendar visita técnica", href: "#cotizar?tipo=visita" },
    social: "1,200+ cámaras instaladas y 45 fraccionamientos atendidos en Querétaro", // demo: validar con cliente
    image: {
      src: "/images/hero-tech-camera.jpg",
      alt: "Técnico con uniforme azul marino sobre una escalera instalando una cámara domo blanca en la fachada de un edificio moderno al atardecer",
    },
    /** Chips flotantes sobre la foto */
    floatChips: {
      top: { code: "CAM-07", text: "Domo IP 4MP · En línea" }, // demo: validar con cliente
    },
    /** Barra de estado de vidrio oscuro dentro de la foto (mismos datos que el panel de la sección de pólizas) */
    status: {
      id: "FRACC-014",
      place: "Acceso principal",
      state: "En línea",
      listLabel: "Estado de los sistemas del sitio",
      items: [
        { code: "CAM", value: "24/24 en línea" },
        { code: "ACC", value: "Pluma operativa" },
        { code: "PER", value: "Cerca armada" },
        { code: "RED", value: "Enlace 98%" },
      ],
    }, // demo: validar con cliente
  },

  metrics: [
    // demo: validar con cliente (las cuatro métricas)
    { value: 1200, display: "1,200", suffix: "+", label: "Cámaras instaladas" },
    { value: 45, display: "45", suffix: "+", label: "Fraccionamientos y condominios atendidos" },
    { value: 12, display: "12", suffix: "", label: "Años de experiencia" },
    { value: 24, display: "24", suffix: " h", label: "Respuesta para fallas en póliza" },
  ],

  problem: {
    id: "problema",
    eyebrow: "El problema",
    title: "Cuando un sistema falla, casi nunca es *solo una cámara*.",
    items: [
      {
        icon: "Blocks",
        title: "Un proveedor para cada cosa.",
        text: "Uno instaló las cámaras, otro la pluma y otro la red. Cuando algo falla, nadie responde por el sistema completo.",
      },
      {
        icon: "SearchX",
        title: "Fallas sin diagnóstico.",
        text: "La cámara no tiene señal, el portón no cierra o el NVR no graba, y nadie sabe si es eléctrico, mecánico o de configuración.",
      },
      {
        icon: "Replace",
        title: "Reemplazar cuando bastaba reparar.",
        text: "Te cotizan un equipo nuevo sin revisar si el actual tenía arreglo.",
      },
      {
        icon: "FileQuestion",
        title: "Instalaciones sin documentación.",
        text: "Cables sin orden, sin direcciones IP registradas y sin saber qué equipo está dónde.",
      },
    ],
  },

  benefits: {
    id: "beneficios",
    eyebrow: "Cómo lo resolvemos",
    title: "Un solo equipo técnico que responde por *toda tu instalación*.",
    items: [
      {
        title: "Todo integrado, un solo responsable.",
        text: "Cámaras, accesos, barreras, red, alarmas y automatización trabajando juntos y atendidos por el mismo equipo.",
        image: "/images/cctv-monitor.jpg",
        alt: "Persona en una sala acogedora viendo en su celular cuatro cámaras de seguridad de su casa: cochera, jardín y terraza",
        tag: "01",
      },
      {
        title: "Diagnóstico antes que reemplazo.",
        text: "Antes de cambiar un equipo completo revisamos si existe una reparación viable. Pagas lo que realmente necesitas.",
        image: "/images/tech-diagnostic.jpg",
        alt: "Manos de un técnico con guantes y un multímetro diagnosticando la tarjeta de control de un operador de portón, con sus herramientas ordenadas",
        tag: "02",
      },
      {
        title: "Instalaciones ordenadas y documentadas.",
        text: "Cableado limpio, equipos identificados y una memoria técnica para que siempre sepas qué tienes y dónde.",
        image: "/images/rack-organized.jpg",
        alt: "Rack de red perfectamente ordenado con switches PoE, patch panel y cables azules peinados con luces de estado verdes",
        tag: "03",
      },
    ],
  },

  audience: {
    id: "para-quien",
    eyebrow: "Para quién",
    title: "Desde una casa hasta un *fraccionamiento completo*.",
    items: [
      {
        title: "Fraccionamientos, condominios y administraciones.",
        text: "Accesos vehiculares, cámaras perimetrales, cercas, enlaces entre casetas y pólizas de mantenimiento.",
        tags: ["Accesos vehiculares", "Cámaras perimetrales", "Cercas", "Enlaces", "Pólizas"],
        image: "/images/fraccionamiento.jpg",
        alt: "Acceso de un fraccionamiento residencial al atardecer, con caseta de vigilancia, pluma vehicular y cámaras montadas en un poste",
      },
      {
        title: "Empresas, comercios, industria y estacionamientos.",
        text: "Videovigilancia, control de acceso de personal, barreras, redes y soporte con documentación técnica.",
        tags: ["Videovigilancia", "Acceso de personal", "Barreras", "Redes", "Soporte"],
        image: "/images/empresa.jpg",
        alt: "Lobby de oficinas moderno con torniquetes de cristal, una mujer acerca su tarjeta al lector de acceso y una cámara domo en el techo",
      },
      {
        title: "Casas y residencias.",
        text: "Cámaras con vista desde tu celular, videoporteros, portones automáticos, alarmas, cerrajería y domótica.",
        tags: ["Cámaras en tu celular", "Videoporteros", "Portones", "Alarmas", "Domótica"],
        image: "/images/residencia.jpg",
        alt: "Fachada de una casa contemporánea al anochecer, con portón corredizo automático, videoportero junto a la puerta y una cámara discreta bajo el alero",
      },
    ],
    closing: "Atendemos servicios individuales y proyectos completos.",
  },

  services: {
    id: "servicios",
    eyebrow: "Servicios",
    title: "Todo lo que tu instalación necesita, *en un solo lugar*.",
    openDetail: "Ver el detalle de",
    featuredCameras: {
      statusLabel: "En línea",
      rec: "REC",
      cams: [
        { id: "CAM-01", label: "Acceso principal" },
        { id: "CAM-02", label: "Estacionamiento" },
        { id: "CAM-03", label: "Perímetro norte" },
        { id: "CAM-04", label: "Recepción" },
      ],
      nvr: "NVR-01 · 4/4 canales",
    },
    vehicularNote: "Incluye diagnóstico y reparación de equipos hidráulicos como FAAC.",
    cta: {
      title: "¿No ves lo que necesitas?",
      text: "Cuéntanos tu caso y un técnico te dice cómo resolverlo.",
      label: "Cuéntanos tu caso",
      href: "#cotizar",
    },
    drawer: {
      close: "Cerrar",
      cta: "Cotizar este servicio",
      groupsLabel: "Qué incluye",
    },
  },

  process: {
    id: "como-trabajamos",
    eyebrow: "Cómo trabajamos",
    title: "Del diagnóstico al soporte, *sin dejarte solo*.",
    steps: [
      { n: "01", tag: "SITIO", title: "Visita y diagnóstico.", text: "Revisamos tus necesidades o las fallas existentes en sitio." },
      { n: "02", tag: "ALCANCE", title: "Propuesta.", text: "Definimos equipos, materiales y trabajos necesarios, con costo claro." },
      { n: "03", tag: "OBRA", title: "Instalación o reparación.", text: "Ejecutamos los trabajos técnicos con orden y limpieza." },
      { n: "04", tag: "CONFIG", title: "Configuración.", text: "Programamos y configuramos cada equipo, incluido el acceso desde tu celular." },
      { n: "05", tag: "PRUEBAS", title: "Pruebas.", text: "Verificamos que todo el sistema funcione correctamente." },
      { n: "06", tag: "ENTREGA", title: "Entrega.", text: "Te explicamos cómo funciona y te entregamos la documentación." },
      { n: "07", tag: "SOPORTE", title: "Soporte y mantenimiento.", text: "Seguimos atendiendo tu instalación después de la entrega." },
    ],
    note: "También intervenimos instalaciones existentes de otros proveedores.",
    cta: { label: "Agendar visita técnica", href: "#cotizar?tipo=visita" },
  },

  documentation: {
    id: "memoria-tecnica",
    eyebrow: "Memoria técnica",
    title: "Tu infraestructura, *documentada*.",
    text: "En proyectos empresariales, residenciales y de fraccionamientos entregamos documentación que facilita la administración futura del sistema. Así tu administración tiene control real sobre su infraestructura, aunque cambie el personal o el proveedor.",
    checks: [
      "Inventario de equipos",
      "Direcciones IP y segmentos de red",
      "Ubicación e identificación de dispositivos",
      "Información de NVR, cámaras, switches y antenas",
      "Diagramas de instalación",
      "Datos técnicos para mantenimiento",
    ],
    photo: {
      src: "/images/rack-organized.jpg",
      alt: "Rack de red ordenado con switches PoE, patch panel y cableado azul peinado, listo para documentarse",
      caption: "RACK-01 · Cableado peinado e identificado",
    },
    sheet: {
      title: "Memoria técnica",
      subtitle: "FRACC-014 · Rev. 03",
      columns: ["ID", "Equipo", "IP", "Ubicación", "Estado"],
      rows: [
        { id: "CAM-07", device: "Domo IP", ip: "192.168.1.47", place: "Caseta norte", state: "ok" },
        { id: "NVR-01", device: "NVR 32 canales", ip: "192.168.1.10", place: "Cuarto de control", state: "ok" },
        { id: "SW-POE-02", device: "Switch PoE 24p", ip: "192.168.1.2", place: "Rack principal", state: "ok" },
        { id: "ANT-03", device: "Antena punto a punto", ip: "192.168.1.61", place: "Torre 2", state: "ok" },
        { id: "PLM-01", device: "Pluma vehicular", ip: "192.168.1.80", place: "Acceso principal", state: "ok" },
        { id: "CAM-12", device: "Bala IP", ip: "192.168.1.52", place: "Perímetro sur", state: "mnt" },
      ],
      legend: { ok: "Operativo", mnt: "Mantenimiento programado" },
      diagramLabel: "Topología",
    },
  },

  differentiators: {
    id: "diferenciadores",
    eyebrow: "Por qué nosotros",
    title: "Lo que nos hace *distintos*.",
    items: [
      { icon: "Home", label: "Proyectos residenciales y empresariales" },
      { icon: "Building", label: "Experiencia en fraccionamientos y condominios" },
      { icon: "Layers", label: "Soluciones integrales" },
      { icon: "Wrench", label: "Instalación y mantenimiento" },
      { icon: "Stethoscope", label: "Diagnóstico y reparación" },
      { icon: "Workflow", label: "Integración de sistemas" },
      { icon: "CalendarCheck", label: "Mantenimiento preventivo y correctivo" },
      { icon: "LifeBuoy", label: "Soporte técnico" },
      { icon: "FileText", label: "Documentación técnica" },
      { icon: "UserCheck", label: "Atención personalizada" },
      { icon: "Ruler", label: "Propuestas a la medida" },
      { icon: "RefreshCcw", label: "Trabajamos sobre instalaciones existentes" },
      { icon: "Route", label: "Del diagnóstico al mantenimiento" },
    ],
    brandsLabel: "Marcas con las que trabajamos",
    // demo: validar con cliente. Solo se dejan marcas confirmadas; sin logos limpios se muestran en texto mono.
    brands: ["FAAC", "Hikvision", "Dahua", "Ubiquiti", "ZKTeco", "Hikvision AX Pro", "Nice", "TP-Link Omada"],
  },

  plans: {
    id: "polizas",
    eyebrow: "Pólizas y servicio",
    title: "Elige cómo quieres que *cuidemos tu instalación*.",
    lead: "Un solo equipo técnico para instalar, vigilar el estado de tus sistemas y responder cuando algo falla. Elige el nivel de acompañamiento que necesita tu sitio.",
    panelLabel: "ASÍ SE VE TU PÓLIZA",
    /** Panel de sitio de ejemplo (demo: validar con cliente) */
    panel: {
      label: "Sitio",
      id: "FRACC-014",
      place: "Acceso principal",
      status: "En línea",
      rows: [
        { k: "Cliente", v: "Fraccionamiento residencial" },
        { k: "Póliza", v: "Mantenimiento preventivo · Mensual" },
      ],
      checks: [
        { code: "CAM", label: "Videovigilancia", note: "24/24 en línea", state: "ok" },
        { code: "ACC", label: "Acceso vehicular", note: "Pluma operativa", state: "ok" },
        { code: "PER", label: "Cerca eléctrica", note: "Armada", state: "ok" },
        { code: "RED", label: "Enlace punto a punto", note: "98% señal", state: "ok" },
        { code: "MNT", label: "Próxima visita", note: "En 6 días", state: "next" },
      ],
      cta: "Ver memoria técnica",
      ctaHref: "#memoria-tecnica",
      listLabel: "Estado de los sistemas del sitio",
    },
    includedLabel: "Incluye",
    notIncludedLabel: "No incluye",
    items: [
      {
        id: "evento",
        name: "Servicio por evento",
        tag: "EVT",
        text: "Para una falla puntual, una instalación o una reparación.",
        price: "Diagnóstico desde $650 MXN", // demo: validar con cliente
        included: ["Visita de diagnóstico", "Cotización del correctivo", "Reparación o instalación", "Pruebas de funcionamiento"],
        notIncluded: ["Visitas programadas", "Soporte prioritario", "Memoria técnica"],
        cta: { label: "Solicitar diagnóstico", href: "#cotizar?tipo=falla" },
      },
      {
        id: "poliza",
        name: "Póliza de mantenimiento",
        tag: "POL",
        badge: "Recomendado para fraccionamientos",
        text: "Revisiones periódicas para que las fallas no te tomen por sorpresa.",
        price: "Desde $2,900 MXN al mes", // demo: validar con cliente
        photo: {
          src: "/images/maintenance.jpg",
          alt: "Técnico con uniforme azul limpiando una cámara bala en un muro con cerca eléctrica, mientras revisa su lista en una tableta",
        },
        included: [
          "Visitas preventivas programadas",
          "Revisión de cámaras, NVR, accesos, barreras, cercas y red",
          "Atención de incidencias",
          "Soporte remoto y asistido",
          "Reporte de cada visita",
        ],
        notIncluded: [],
        cta: { label: "Cotizar póliza", href: "#cotizar?tipo=mantenimiento" },
      },
      {
        id: "proyecto",
        name: "Proyecto integral",
        tag: "PRY",
        text: "Para obra nueva, ampliación o modernización completa.",
        price: "Levantamiento sin costo", // demo: validar con cliente
        included: [
          "Levantamiento técnico",
          "Propuesta técnica y económica",
          "Instalación e integración de sistemas",
          "Migración de equipos antiguos",
          "Memoria técnica",
          "Póliza opcional",
        ],
        notIncluded: [],
        cta: { label: "Agendar levantamiento", href: "#cotizar?tipo=visita" },
      },
    ],
    note: "Las condiciones y cobertura de cada póliza se definen según las necesidades de cada instalación.",
  },

  testimonials: {
    id: "clientes",
    eyebrow: "Clientes",
    title: "Administraciones y empresas que ya *duermen tranquilas*.",
    // demo: validar con cliente (los tres testimonios y la calificación son inventados).
    // `placeholder: true` se conserva en los datos pero ya no se muestra en pantalla.
    items: [
      {
        placeholder: true,
        quote:
          "Teníamos cámaras sin señal y una pluma que fallaba cada semana. Diagnosticaron todo en una visita y desde que tenemos póliza no hemos vuelto a tener una falla mayor.",
        author: "Laura Méndez",
        role: "Administración, Fraccionamiento Cumbres del Lago, Juriquilla",
        chip: "Póliza mensual desde 2023",
      },
      {
        placeholder: true,
        quote:
          "Nos repararon el operador hidráulico del portón cuando otro proveedor ya nos había cotizado uno nuevo. Nos ahorramos más de la mitad.",
        author: "Ricardo Salinas",
        role: "Gerente de Operaciones, Logística del Bajío, El Marqués",
        chip: "Reparación vs. reemplazo",
      },
      {
        placeholder: true,
        quote:
          "Instalaron cámaras, control de acceso y la red de la oficina, y nos entregaron todo documentado. Por fin sabemos qué tenemos.",
        author: "Andrea Ruiz",
        role: "Directora Administrativa, Grupo Contable Ruiz, Querétaro",
        chip: "32 cámaras IP",
      },
    ],
    rating: { score: "4.9", outOf: "/5", label: "86 reseñas en Google" },
  },

  quote: {
    id: "cotizar",
    eyebrow: "Cotizador",
    title: "Cuéntanos qué necesitas y te respondemos *hoy mismo*.",
    // demo: validar con cliente (tiempo de respuesta)
    subtitle: "Sin compromiso. Un técnico revisa tu caso y te contacta por WhatsApp en menos de 2 horas en horario laboral.",
    bullets: [
      { icon: "BadgeCheck", text: "Sin compromiso" },
      { icon: "RefreshCcw", text: "Atendemos instalaciones de otros proveedores" },
      { icon: "UserCheck", text: "Te responde un técnico real" },
    ],
    urgent: {
      title: "¿Es urgente?",
      text: "Escríbenos ahora y un técnico te atiende por WhatsApp.",
      cta: "Necesito soporte técnico",
      message: "Hola, necesito soporte técnico urgente",
    },
    loading: "Cargando el cotizador",
    stepLabel: "Paso",
    of: "de",
    next: "Continuar",
    back: "Atrás",
    submit: "Enviar solicitud",
    sending: "Enviando",
    error: "No pudimos enviar tu solicitud. Revisa tu conexión e inténtalo de nuevo, o escríbenos por WhatsApp.",
    steps: [
      { title: "¿Qué tipo de servicio buscas?", short: "Servicio" },
      { title: "¿En qué área?", short: "Área" },
      { title: "Tu instalación.", short: "Instalación" },
      { title: "Tus datos.", short: "Datos" },
    ],
    fields: {
      tipo: {
        label: "Tipo de servicio",
        options: [
          { value: "instalacion", label: "Instalación nueva", hint: "Sistema nuevo" },
          { value: "falla", label: "Falla o reparación", hint: "Algo dejó de funcionar" },
          { value: "mantenimiento", label: "Mantenimiento o póliza", hint: "Revisiones periódicas" },
          { value: "visita", label: "Visita técnica / levantamiento", hint: "Revisión en sitio" },
          { value: "modernizacion", label: "Modernización de un sistema existente", hint: "Actualizar lo que ya tienes" },
        ],
      },
      areas: {
        label: "Áreas de interés",
        hint: "Puedes elegir más de una.",
        unsure: { value: "no-seguro", label: "No estoy seguro" },
      },
      description: {
        label: "Cuéntanos brevemente (opcional)",
        placeholder: "Ej. La pluma de la entrada no baja y 3 cámaras no graban",
      },
      inmueble: {
        label: "Tipo de inmueble",
        options: [
          { value: "casa", label: "Casa o residencia" },
          { value: "fraccionamiento", label: "Fraccionamiento o condominio" },
          { value: "edificio", label: "Edificio o administración" },
          { value: "empresa", label: "Empresa u oficina" },
          { value: "comercio", label: "Comercio" },
          { value: "industria", label: "Industria" },
          { value: "estacionamiento", label: "Estacionamiento" },
        ],
      },
      urgencia: {
        label: "Urgencia",
        options: [
          { value: "urgente", label: "Urgente (hoy o mañana)" },
          { value: "semana", label: "Esta semana" },
          { value: "planeando", label: "Estoy planeando un proyecto" },
        ],
      },
      name: { label: "Nombre", placeholder: "Tu nombre" },
      company: { label: "Empresa o fraccionamiento (opcional)", placeholder: "Nombre de la empresa o del fraccionamiento" },
      whatsapp: { label: "WhatsApp", prefix: "+52", placeholder: "442 123 4567" },
      email: { label: "Correo", placeholder: "tu@correo.com" },
      colonia: { label: "Colonia", placeholder: "Tu colonia" },
      municipio: { label: "Municipio", placeholder: "Tu municipio" },
      privacy: {
        before: "Acepto el ",
        link: "Aviso de Privacidad",
        after: " y que me contacten para dar seguimiento a mi solicitud.",
      },
    },
    errors: {
      tipo: "Elige el tipo de servicio.",
      areas: "Elige al menos un área, o marca “No estoy seguro”.",
      description: "Máximo 1,000 caracteres.",
      inmueble: "Elige el tipo de inmueble.",
      urgencia: "Elige qué tan urgente es.",
      name: "Escribe tu nombre.",
      whatsapp: "Escribe un WhatsApp de 10 dígitos.",
      email: "Escribe un correo válido.",
      colonia: "Escribe tu colonia.",
      municipio: "Escribe tu municipio.",
      privacy: "Necesitamos que aceptes el Aviso de Privacidad.",
    },
    success: {
      title: "Listo, {name}. Un técnico revisará tu solicitud y te contactará por WhatsApp.",
      standard: "Recibimos tu solicitud. Si necesitas agregar algo, escríbenos por WhatsApp.",
      urgent: "Como es urgente, continúa por WhatsApp y un técnico te atiende de inmediato.",
      urgentCta: "Continuar por WhatsApp",
      urgentMessage: "Hola, soy {name}. Acabo de enviar una solicitud en el sitio y es urgente.",
      booking: "Si quieres adelantar tiempo, agenda ahora tu visita técnica.",
      bookingTitle: "Agenda de visitas técnicas",
      bookingFallback: "Agendar por WhatsApp",
      bookingMessage: "Hola, soy {name}. Quiero agendar una visita técnica.",
      again: "Enviar otra solicitud",
    },
  },

  faq: {
    id: "preguntas",
    eyebrow: "Preguntas frecuentes",
    title: "Lo que nos preguntan *antes de llamarnos*.",
    items: [
      {
        q: "¿Atienden instalaciones que hizo otro proveedor?",
        a: "Sí. Diagnosticamos, reparamos y damos mantenimiento a sistemas existentes, aunque no los hayamos instalado nosotros.",
      },
      {
        q: "¿Puedo pedir solo un diagnóstico?",
        a: "Sí. Hacemos visitas exclusivas de diagnóstico para saber por qué dejó de funcionar tu sistema, qué equipo falla y si conviene reparar o sustituir. Después te presentamos la cotización del correctivo. La visita de diagnóstico tiene un costo de $650 MXN, que se bonifica si realizas el trabajo con nosotros.", // demo: validar con cliente
      },
      {
        q: "¿Reparan o solo cambian equipos?",
        a: "Antes de reemplazar un equipo completo buscamos si existe una reparación viable. En automatismos hidráulicos, por ejemplo, hacemos cambio de aceite, purga, ajuste de válvulas, cambio de sellos y reparación de fugas.",
      },
      {
        q: "¿Trabajan con barreras y operadores FAAC?",
        a: "Sí. Hacemos diagnóstico, mantenimiento y reparación de equipos hidráulicos y automatismos de marcas especializadas como FAAC.",
      },
      {
        q: "¿Puedo ver mis cámaras desde el celular?",
        a: "Sí. Configuramos el acceso remoto para que veas tus cámaras desde celular, computadora o tablet.",
      },
      {
        q: "¿Qué incluye una póliza de mantenimiento?",
        a: "Visitas preventivas programadas, soporte técnico, atención de incidencias, soporte remoto y revisiones de cámaras, grabadores, redes, accesos, barreras y cercas. La cobertura se define según tu instalación.",
      },
      {
        q: "¿Atienden casas o solo empresas?",
        a: "Ambos. Atendemos desde un servicio residencial sencillo hasta proyectos completos para empresas y fraccionamientos.",
      },
      {
        q: "¿En qué zonas dan servicio?",
        a: "Atendemos Querétaro, Corregidora, El Marqués, Juriquilla, Zibatá, Huimilpan y San Juan del Río. Para proyectos fuera de esta zona, contáctanos y lo revisamos.", // demo: validar con cliente
      },
    ],
  },

  finalCta: {
    id: "contacto",
    title: "Desde una falla sencilla hasta *un proyecto completo*.",
    subtitle: "Cuéntanos qué está pasando en tu instalación y te decimos cómo resolverlo.",
    image: {
      src: "/images/hero-fraccionamiento-wide.jpg",
      alt: "Calle de un fraccionamiento residencial al anochecer con cerca eléctrica, pluma vehicular abierta y cámaras de seguridad sobre un poste",
    },
    primary: { label: "Solicitar cotización", href: "#cotizar" },
    secondary: { label: "Necesito soporte técnico", message: "Hola, necesito soporte técnico" },
  },

  /** Venta de equipo: sección del home, catálogo, detalle y lista de cotización. Los productos viven en content/products.ts. */
  shop: {
    section: {
      id: "productos",
      eyebrow: "PRODUCTOS",
      title: "Equipo profesional, *con o sin instalación*.",
      subtitle:
        "Vendemos los mismos equipos que instalamos: cámaras, grabadores, chapas de seguridad, controles de acceso, alarmas y más. Te asesoramos para elegir lo correcto y, si quieres, lo instalamos.",
      categoriesLabel: "Categorías de productos",
      note: "Precios con IVA, sujetos a disponibilidad. Te confirmamos existencia al cotizar.",
      allCard: { title: "Ver los {n} productos", text: "Cámaras, chapas, accesos, alarmas, redes y kits.", href: "/productos" },
      kit: {
        badge: "Kit",
        includesLabel: "Incluye",
        installFrom: "Instalación desde {price}",
        add: "Agregar a cotización",
        view: "Ver kit",
        bullets: ["4 cámaras IP 4MP, 2 domo y 2 bala", "NVR de 8 canales PoE con disco de 1 TB", "Cable y conectores para 4 puntos"],
      },
    },

    card: {
      add: "Agregar a cotización",
      addAria: "Agregar {name} a la cotización",
      added: "Agregado",
      addedAria: "{name} agregado a la cotización",
      installFrom: "Instalación desde {price}",
      chipsLabel: "Especificaciones clave",
      currency: "MXN",
    },

    catalog: {
      path: "/productos",
      seoTitle: "Productos de seguridad, accesos y automatización",
      seoDescription:
        "Cámaras IP, grabadores, chapas inteligentes, controles de acceso, barreras vehiculares, alarmas, cercas eléctricas y kits listos para instalar en Querétaro. Arma tu lista y cotiza por WhatsApp.",
      breadcrumbHome: "Inicio",
      breadcrumbLabel: "Ruta de navegación",
      eyebrow: "CATÁLOGO",
      title: "Productos",
      subtitle: "Equipo de seguridad, accesos y redes para casas, empresas y fraccionamientos. Arma tu lista y te la cotizamos.",
      count: "{n} productos",
      countOne: "1 producto",
      filtersLabel: "Filtros del catálogo",
      all: "Todos",
      categoriesLabel: "Categoría",
      searchLabel: "Buscar producto",
      searchPlaceholder: "Buscar por nombre",
      clearSearch: "Borrar búsqueda",
      sortLabel: "Ordenar por",
      sort: [
        { value: "destacados", label: "Destacados" },
        { value: "precio-asc", label: "Menor precio" },
        { value: "precio-desc", label: "Mayor precio" },
      ],
      results: "Resultados",
      empty: {
        title: "No encontramos productos con esos filtros.",
        text: "Prueba con otra categoría o cuéntanos qué buscas y te ayudamos a encontrarlo.",
        cta: "Cuéntanos qué buscas",
        message: "Hola, estoy buscando un producto y no lo encontré en el catálogo.",
        reset: "Quitar filtros",
      },
      help: {
        title: "¿No sabes qué equipo necesitas?",
        text: "Un técnico visita tu sitio, revisa qué hace falta y te entrega una propuesta con el equipo adecuado.",
        cta: "Agendar visita técnica",
        href: "/#cotizar?tipo=visita",
      },
    },

    detail: {
      priceNote: "Precio con IVA, sujeto a disponibilidad.",
      installShort: "instalación",
      quantity: "Cantidad",
      decrease: "Disminuir cantidad",
      increase: "Aumentar cantidad",
      install: {
        label: "Incluir instalación",
        hintFrom: "Desde {price} por pieza. Se confirma en la visita técnica.",
        hintNote: "{note}. Se confirma en la visita técnica.",
      },
      add: "Agregar a cotización",
      added: "Agregado a la cotización",
      viewList: "Ver mi cotización",
      whatsapp: "Preguntar por WhatsApp",
      whatsappMessage: "Hola, me interesa este producto: {name} ({price} MXN). ¿Me das más información?",
      specs: "Especificaciones",
      includes: "Qué incluye",
      idealFor: "Ideal para",
      galleryLabel: "Fotos del producto",
      service: { eyebrow: "¿Lo necesitas instalado?", title: "Conoce nuestro servicio de {service}", cta: "Ver el servicio", href: "/#servicios" },
      related: "Productos relacionados",
      skuLabel: "SKU",
    },

    list: {
      open: "Mi cotización",
      openAria: "Abrir mi cotización, {n} productos",
      title: "Mi cotización",
      close: "Cerrar mi cotización",
      count: "{n} productos",
      countOne: "1 producto",
      empty: "Tu lista está vacía. Agrega productos desde el catálogo.",
      emptyCta: "Ver productos",
      remove: "Quitar {name}",
      quantity: "Cantidad de {name}",
      decrease: "Disminuir cantidad de {name}",
      increase: "Aumentar cantidad de {name}",
      install: "Con instalación",
      installTbd: "Instalación a cotizar",
      each: "c/u",
      subtotalEquipment: "Equipo",
      subtotalInstall: "Instalación estimada, desde",
      note: "Precio final sujeto a visita técnica y disponibilidad.",
      whatsapp: "Enviar por WhatsApp",
      request: "Enviar solicitud",
      clear: "Vaciar lista",
      back: "Volver a la lista",
      formTitle: "Te contactamos con tu cotización",
      formText: "Déjanos tus datos y un asesor te escribe por WhatsApp para confirmar existencia y precio final.",
      fields: {
        name: { label: "Nombre", placeholder: "Tu nombre" },
        whatsapp: { label: "WhatsApp", prefix: "+52", placeholder: "442 123 4567" },
        colonia: { label: "Colonia", placeholder: "Tu colonia" },
        municipio: { label: "Municipio", placeholder: "Tu municipio" },
        privacy: {
          before: "Acepto el ",
          link: "Aviso de Privacidad",
          after: " y que me contacten para dar seguimiento a mi cotización.",
        },
      },
      errors: {
        name: "Escribe tu nombre.",
        whatsapp: "Escribe un WhatsApp de 10 dígitos.",
        colonia: "Escribe tu colonia.",
        municipio: "Escribe tu municipio.",
        privacy: "Necesitamos que aceptes el Aviso de Privacidad.",
      },
      submit: "Enviar solicitud",
      sending: "Enviando",
      error: "No pudimos enviar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.",
      success: {
        title: "Listo, {name}. Recibimos tu lista.",
        text: "Un asesor te escribirá por WhatsApp para confirmar existencia, precio final y, si la pediste, la visita técnica.",
        close: "Cerrar",
        clear: "Vaciar lista",
      },
      whatsappIntro: "Hola, quiero cotizar estos productos:",
      whatsappInstall: "con instalación",
      whatsappEquipment: "Total de equipo",
      whatsappInstallTotal: "Instalación estimada desde",
      whatsappNote: "Precio final sujeto a visita técnica y disponibilidad.",
    },
  },

  footer: {
    columns: {
      services: "Servicios",
      company: "Empresa",
      contact: "Contacto",
      social: "Redes",
    },
    company: [
      { label: "Productos", href: "/productos" },
      { label: "Para quién", href: "#para-quien" },
      { label: "Cómo trabajamos", href: "#como-trabajamos" },
      { label: "Pólizas", href: "#polizas" },
      { label: "Preguntas", href: "#preguntas" },
    ],
    /** Etiquetas de la columna Contacto; los valores vienen de site.contact */
    contactLabels: { whatsapp: "WhatsApp", phone: "Teléfono", email: "Correo", address: "Ciudad", hours: "Horario", zones: "Zonas" },
    // demo: validar con cliente (los enlaces `#` son de demo)
    socials: [
      { id: "instagram", label: "Instagram", href: "#" },
      { id: "facebook", label: "Facebook", href: "#" },
      { id: "whatsapp", label: "WhatsApp", href: "#" },
    ],
    legal: "© 2026 Starko Tech. Todos los derechos reservados.", // demo: validar con cliente
    privacy: { label: "Aviso de privacidad", href: "/aviso-de-privacidad" },
  },
} as const;

export type Site = typeof site;
