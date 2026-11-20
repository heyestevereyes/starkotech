/**
 * BORRADOR PARA REVISIÓN LEGAL. Los datos de identidad (razón social, domicilio, correo y fecha) son de demo:
 * demo: validar con cliente.
 * Texto base conforme a la Ley Federal de Protección de Datos Personales en Posesión
 * de los Particulares (LFPDPPP). Debe validarlo un abogado antes de publicarse.
 */
export const legal = {
  back: "Volver al inicio",
  draft: "Borrador para revisión legal",
  title: "Aviso de privacidad",
  intro:
    "En Starko Tech cuidamos tus datos personales. Este aviso explica qué datos recabamos, para qué los usamos y cómo puedes ejercer tus derechos.",
  sections: [
    {
      title: "1. Identidad y domicilio del responsable",
      body: [
        "Starko Tech (en adelante, “Starko Tech”), con domicilio en Querétaro, Qro., es responsable del tratamiento de tus datos personales conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, su Reglamento y los Lineamientos del Aviso de Privacidad.",
      ],
    },
    {
      title: "2. Datos personales que recabamos",
      body: [
        "Para las finalidades descritas en este aviso recabamos los siguientes datos: nombre, empresa o fraccionamiento, número de WhatsApp, correo electrónico, colonia y municipio, así como información sobre el servicio que solicitas: tipo de servicio, áreas de interés, tipo de inmueble y urgencia.",
        "También podemos obtener datos de navegación como fuente de la visita (parámetros UTM), página de referencia y fecha y hora de envío del formulario. No recabamos datos personales sensibles.",
      ],
    },
    {
      title: "3. Finalidades del tratamiento",
      body: [
        "Finalidades primarias (necesarias para la relación que solicitas): contactarte para atender tu solicitud de cotización, visita técnica o diagnóstico; elaborar y enviarte una propuesta; dar seguimiento comercial y operativo a tu servicio; y cumplir obligaciones legales y fiscales aplicables.",
        "Finalidades secundarias (no necesarias): enviarte información comercial, contenidos y promociones relacionados con nuestros servicios, y realizar análisis estadísticos para mejorar nuestro sitio. Si no deseas que tus datos se traten para estas finalidades, puedes indicarlo en cualquier momento escribiendo a contacto@starkotech.mx.",
      ],
    },
    {
      title: "4. Transferencias de datos",
      body: [
        "Para cumplir las finalidades primarias, tus datos podrán compartirse con proveedores que nos prestan servicios (por ejemplo, herramientas de gestión de clientes y comunicación), únicamente en la medida necesaria para ejecutar el servicio solicitado. Estas transferencias no requieren tu consentimiento conforme al artículo 37 de la LFPDPPP. No vendemos tus datos personales.",
      ],
    },
    {
      title: "5. Derechos ARCO y revocación del consentimiento",
      body: [
        "Tienes derecho a Acceder, Rectificar y Cancelar tus datos personales, así como a Oponerte a su tratamiento (derechos ARCO), y a revocar el consentimiento otorgado. Para ejercerlos, envía una solicitud a contacto@starkotech.mx indicando tu nombre, un medio para comunicarte la respuesta, copia de una identificación oficial, la descripción clara de los datos y el derecho que deseas ejercer.",
        "Responderemos en un plazo máximo de 20 días hábiles contados desde la recepción de tu solicitud, y en su caso la haremos efectiva dentro de los 15 días hábiles siguientes.",
      ],
    },
    {
      title: "6. Limitación del uso o divulgación",
      body: [
        "Puedes limitar el uso o divulgación de tus datos enviando tu solicitud al correo indicado. También puedes inscribirte en el Registro Público para Evitar Publicidad (REPEP) de la PROFECO.",
      ],
    },
    {
      title: "7. Cookies y tecnologías de rastreo",
      body: [
        "Nuestro sitio puede utilizar cookies y tecnologías similares (como Google Analytics y Meta Pixel) para medir visitas y mejorar la experiencia. Puedes deshabilitarlas desde la configuración de tu navegador.",
      ],
    },
    {
      title: "8. Cambios al aviso de privacidad",
      body: [
        "Este aviso puede modificarse. Cualquier cambio se publicará en esta misma página. Última actualización: noviembre de 2026.",
      ],
    },
  ],
} as const;
