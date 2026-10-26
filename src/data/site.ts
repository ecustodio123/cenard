export const site = {
  name: "Centro Nacional para la Resolución de Disputas",
  shortName: "CENARD",
  phone: "+51 912 175 995",
  phoneHref: "tel:+51912175995",
  whatsapp: "https://wa.me/51912175995",
  emails: [
    "mesadepartes@cenardarbitraje.com",
    "secretariageneral@cenardarbitraje.com",
  ],
  address: "Av. del Ejército 1180, Magdalena del Mar, Oficina 1404",
  hours: "Lunes a viernes · 09:00 a 16:30",
  laudos:
    "https://drive.google.com/drive/folders/1s9m-DFrRpSkRRe-YKwb4CwGePuy1zJOa?usp=sharing",
};

export const pages = [
  {
    slug: "",
    title: "Inicio",
    section: "CENARD",
    description:
      "Centro Nacional para la Resolución de Disputas. Servicios de arbitraje y JPRD, información institucional y recursos públicos.",
  },
  {
    slug: "conocenos",
    title: "Conócenos",
    section: "Institución",
    description:
      "Nuestra institución, misión y compromiso con la cultura de solución de controversias.",
  },
  {
    slug: "secretaria-general",
    title: "Secretaría General y Director",
    section: "Institución",
    description:
      "Dirección institucional y equipo de Secretaría General de CENARD.",
  },
  {
    slug: "alto-consejo",
    title: "Alto Consejo",
    section: "Institución",
    description:
      "Conoce a los profesionales que conforman el Alto Consejo de CENARD.",
  },
  {
    slug: "organigrama",
    title: "Organigrama",
    section: "Institución",
    description:
      "La estructura de dirección, decisión y gestión de nuestra institución.",
  },
  {
    slug: "certificaciones",
    title: "Certificaciones",
    section: "Institución",
    description:
      "Consulta la licencia, certificados y constancias publicados por CENARD.",
  },
  {
    slug: "arbitraje",
    title: "Arbitraje",
    section: "Servicios",
    description:
      "Administración de controversias a través de un proceso arbitral. Información, normativa y recursos del servicio.",
  },
  {
    slug: "jprd",
    title: "Junta de Prevención y Resolución de Disputas",
    section: "Servicios",
    description:
      "Prevención y resolución de disputas durante la ejecución de contratos de obras y de suministro.",
  },
  {
    slug: "documentos",
    title: "Normativa y documentos",
    section: "Recursos",
    description:
      "Reglamentos, directivas, código de ética y fichas. La documentación institucional en un solo lugar.",
  },
  {
    slug: "listado-de-arbitros",
    title: "Nómina de árbitros",
    section: "Recursos",
    description:
      "Consulta los profesionales de las nóminas nacionales y de contratación pública publicadas por CENARD.",
  },
  {
    slug: "nomina-de-adjudicadores",
    title: "Nómina de adjudicadores",
    section: "Recursos",
    description:
      "Consulta los nombres, profesiones y especialidades de la nómina de adjudicadores.",
  },
  {
    slug: "calculadora",
    title: "Calculadora de tarifas",
    section: "Recursos",
    description:
      "Consulta las modalidades de costos de arbitraje y JPRD. Interfaz de estimación en revisión institucional.",
  },
  {
    slug: "servicio-de-arbitraje",
    title: "Preguntas frecuentes",
    section: "Recursos",
    description:
      "Respuestas institucionales sobre el arbitraje, sus ventajas y el inicio de un proceso en CENARD.",
  },
  {
    slug: "atalaya-de-integridad",
    title: "Atalaya de Integridad",
    section: "Integridad",
    description:
      "Acceso a la información pública y a las categorías de transparencia institucional.",
  },
  {
    slug: "contacto",
    title: "Contacto",
    section: "Atención",
    description:
      "Nuestros canales institucionales de atención, dirección y horario.",
  },
];
export const pathFor = (slug = "") => `/web/${slug ? `${slug}/` : ""}`;
export const navigation = [
  {
    label: "Institución",
    slugs: [
      "conocenos",
      "secretaria-general",
      "alto-consejo",
      "organigrama",
      "certificaciones",
    ],
  },
  { label: "Servicios", slugs: ["arbitraje", "jprd"] },
  {
    label: "Recursos",
    slugs: [
      "documentos",
      "listado-de-arbitros",
      "nomina-de-adjudicadores",
      "calculadora",
      "servicio-de-arbitraje",
    ],
  },
];
export const notice = [
  "La Asociación para la Promoción Cultural de los Mecanismos Alternativos de Solución de Controversias informa que su Centro de Arbitraje opera bajo la denominación comercial “Centro Nacional para la Resolución de Disputas – CENARD”.",
  "En consecuencia, el Centro Nacional para la Resolución de Disputas – CENARD no constituye una entidad distinta ni independiente de la Asociación, sino que forma parte integral de ésta.",
  "Por lo tanto, toda referencia o uso de los nombres “Centro de Arbitraje de la Asociación para la Promoción Cultural de los Mecanismos Alternativos de Solución de Controversias” o “Centro Nacional para la Resolución de Disputas – CENARD” debe entenderse como referida a la misma institución.",
];
