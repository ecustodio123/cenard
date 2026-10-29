import { pages, pathFor, site } from "../data/site";
import { officialOrigin } from "../data/seo-config";

const titles: Record<string, string> = {
  "": "CENARD | Arbitraje y JPRD en Lima, Perú",
  conocenos: "Conoce CENARD | Centro Nacional para la Resolución de Disputas",
  "organizacion-institucional": "Organización institucional y Alto Consejo | CENARD",
  certificaciones: "Certificaciones y constancias institucionales | CENARD",
  arbitraje: "Arbitraje institucional: servicios y normativa | CENARD",
  jprd: "JPRD: prevención y resolución de disputas | CENARD",
  documentos: "Normativa y documentos de Arbitraje y JPRD | CENARD",
  "listado-de-arbitros": "Nómina de árbitros: registros publicados | CENARD",
  "nomina-de-adjudicadores": "Nómina de adjudicadores de JPRD | CENARD",
  "preguntas-frecuentes": "Preguntas frecuentes sobre arbitraje | CENARD",
  "atalaya-de-integridad": "Atalaya de Integridad: laudos arbitrales | CENARD",
  contacto: "Contacto y ubicación en Magdalena del Mar, Lima | CENARD",
};
const descriptions: Record<string, string> = {
  "": "Conoce CENARD, Centro Nacional para la Resolución de Disputas en Lima, Perú. Consulta servicios de Arbitraje y JPRD, normativa y nóminas publicadas.",
  conocenos: "Conoce la presentación institucional de CENARD, su misión y su compromiso con la cultura de solución de controversias mediante el arbitraje y las JPRD.",
  "organizacion-institucional": "Conoce la estructura institucional de CENARD, su Dirección y Secretaría General, así como los integrantes y perfiles publicados del Alto Consejo.",
  certificaciones: "Consulta los certificados ISO, las constancias de los servicios y la licencia de funcionamiento publicados por CENARD, con acceso a sus documentos.",
  arbitraje: "Conoce el servicio de arbitraje institucional de CENARD y accede a su normativa, documentos y nómina de árbitros para consultar información del servicio.",
  jprd: "Conoce las Juntas de Prevención y Resolución de Disputas de CENARD para contratos de obras y de suministro. Consulta normativa y nómina de adjudicadores.",
  documentos: "Encuentra reglamentos, directivas, códigos de ética y fichas de Arbitraje y JPRD publicados por CENARD. Filtra los documentos por servicio y tipo.",
  "listado-de-arbitros": "Consulta las nóminas de árbitros nacionales y de contratación pública publicadas por CENARD. Busca por nombre y filtra los registros disponibles.",
  "nomina-de-adjudicadores": "Consulta la nómina de adjudicadores de JPRD publicada por CENARD. Busca por nombre y revisa las profesiones y especialidades consignadas en los registros.",
  "preguntas-frecuentes": "Consulta respuestas generales sobre el arbitraje, sus modalidades y el inicio de un proceso en CENARD, con acceso al reglamento publicado.",
  "atalaya-de-integridad": "Accede a la carpeta pública de laudos arbitrales de CENARD y consulta la disponibilidad de otras categorías de información institucional.",
  contacto: "Encuentra los canales de atención de CENARD: WhatsApp, teléfono y correos institucionales. Consulta dirección, horario y ubicación en Magdalena del Mar, Lima.",
};

export function getPageSeo(pathname: string, indexable: boolean) {
  const path = pathname.split(/[?#]/)[0];
  const normalized = path === "/" ? pathFor() : path.endsWith("/") ? path : `${path}/`;
  const page = pages.find((entry) => pathFor(entry.slug) === normalized);
  const title = page ? titles[page.slug] || `${page.title} | CENARD` : "Página no encontrada | CENARD";
  const description = page ? descriptions[page.slug] || page.description : "Esta página no existe en el sitio de CENARD. Consulta los servicios y recursos institucionales desde el inicio.";
  const canonical = page ? new URL(pathFor(page.slug), officialOrigin).href : null;
  const image = `${officialOrigin}/images/logo.png`;
  const meta: Record<string, string> = {
    description,
    robots: indexable && page ? "index,follow,max-image-preview:large" : "noindex,follow",
    "og:title": title,
    "og:description": description,
    "og:type": "website",
    "og:site_name": "CENARD",
    "og:locale": "es_PE",
    "og:image": image,
    "og:image:width": "1600",
    "og:image:height": "624",
    "og:image:alt": "CNR CENARD Arbitraje — Centro Nacional para la Resolución de Disputas",
    "twitter:card": "summary_large_image",
    "twitter:title": title,
    "twitter:description": description,
    "twitter:image": image,
    "twitter:image:alt": "CNR CENARD Arbitraje",
  };
  if (canonical) meta["og:url"] = canonical;
  const organizationId = `${officialOrigin}/#organization`;
  const websiteId = `${officialOrigin}/#website`;
  const graph: object[] = page ? [
    {
      "@type": "Organization", "@id": organizationId,
      name: site.name, alternateName: "CENARD", url: `${officialOrigin}/web/`,
      logo: { "@type": "ImageObject", url: image, width: 1600, height: 624 },
    },
    {
      "@type": "WebSite", "@id": websiteId, url: `${officialOrigin}/web/`,
      name: "CENARD", alternateName: site.name, inLanguage: "es-PE",
      publisher: { "@id": organizationId },
    },
    {
      "@type": page.slug === "contacto" ? "ContactPage" : page.slug === "conocenos" ? "AboutPage" : "WebPage",
      "@id": `${canonical}#webpage`, url: canonical, name: title, description,
      inLanguage: "es-PE", isPartOf: { "@id": websiteId }, about: { "@id": organizationId },
    },
  ] : [];
  return { title, canonical, meta, structuredData: graph.length ? { "@context": "https://schema.org", "@graph": graph } : null };
}

export function updatePageSeo(pathname: string, indexable: boolean) {
  const seo = getPageSeo(pathname, indexable);
  document.title = seo.title;
  for (const [key, content] of Object.entries(seo.meta)) {
    const attribute = key.startsWith("og:") ? "property" : "name";
    let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute, key);
      document.head.append(element);
    }
    element.content = content;
  }
  if (!seo.canonical) document.head.querySelector('meta[property="og:url"]')?.remove();
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (seo.canonical) {
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.append(canonical); }
    canonical.href = seo.canonical;
  } else canonical?.remove();
  document.getElementById("cenard-structured-data")?.remove();
  if (seo.structuredData) {
    const script = document.createElement("script");
    script.id = "cenard-structured-data";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(seo.structuredData).replace(/</g, "\\u003c");
    document.head.append(script);
  }
}
