import { Calculator, FileCheck2, UsersRound, PanelsTopLeft } from "lucide-react";
import { ArrowLink, ButtonLink, Eyebrow } from "../components/UI";
import { documents } from "../data/documents";
import { pathFor } from "../data/site";
import "./arbitration.css";
import "./jprd.css";

// PROVISIONAL: Bernd Dittrich / Unsplash License. Fuente y licencia:
// docs/qa/jprd/conservacion.md. Sustituir este recurso sin cambiar la composición.
const heroImage = {
  src: "/assets/jprd/construccion-provisional.webp",
  width: 960,
  height: 720,
  alt: "Edificio en construcción y grúa. Obra ilustrativa ajena a CENARD.",
};
const resources = [
  { title: "Cálculo de tarifas", text: "Accede a la herramienta de cálculo de tarifas.", action: "Calcular tarifas", href: "/web/calculadora", icon: Calculator },
  { title: "Atalaya de Integridad", text: "Consulta la información pública de integridad institucional.", action: "Consultar Atalaya", href: "/web/atalaya-de-integridad/jprd/", icon: FileCheck2 },
  { title: "Nómina de adjudicadores", text: "Consulta la nómina de adjudicadores publicada por CENARD.", action: "Consultar nómina", href: "/web/nomina-de-adjudicadores", icon: UsersRound },
  { title: "Portal Atenea", text: "Accede al portal Atenea.", action: "Ingresar a Atenea", href: "https://sistema.cenardarbitraje.com/login", icon: PanelsTopLeft, external: true },
];
const functions = [
  { title: "Prevención de disputas", text: "La información institucional describe una función de prevención de conflictos durante la ejecución de contratos de obras y de suministro." },
  { title: "Consultas técnicas y contractuales", text: "La fuente describe la atención de consultas de las partes sobre asuntos técnicos o contractuales vinculados con la ejecución del contrato." },
  { title: "Resolución de disputas", text: "La información publicada incluye la resolución de disputas relacionadas con los ámbitos técnicos y contractuales descritos." },
];

// El orden viene de las referencias JPRD del catálogo único, sin copiar archivos
// exclusivos de Arbitraje ni reemplazar la Directiva 01 de JPRD.
const jprdDocuments = documents.filter(d => d.services.includes("JPRD"))
  .sort((a, b) => {
    const order = (doc: typeof a) => Number(doc.references.find(r => r.service === "JPRD")?.id.split("-").at(-1));
    return order(a) - order(b);
  });

export function JprdPage() {
  return (
    <div className="arbitration-page jprd-page">
      <section className="arbitration-hero">
        <div className="container arbitration-hero-grid">
          <div className="arbitration-hero-copy">
            <Eyebrow>Servicios</Eyebrow>
            <h1 tabIndex={-1}>JPRD</h1>
            <p className="jprd-full-name">Junta de Prevención y Resolución de Disputas</p>
            <p className="arbitration-introduction">Prevención y resolución de disputas durante la ejecución de contratos de obras y de suministro.</p>
            <div className="arbitration-actions">
              <ButtonLink to="#normativa-jprd">Consultar normativa</ButtonLink>
              <ButtonLink to={pathFor("contacto")} secondary>Solicitar orientación</ButtonLink>
            </div>
          </div>
          <figure className="arbitration-hero-image" data-provisional="true">
            <img {...heroImage} fetchPriority="high" />
            <figcaption>Imagen ilustrativa provisional. No representa una obra ni al personal de CENARD.</figcaption>
          </figure>
        </div>
      </section>
      <section className="arbitration-tools" aria-labelledby="jprd-tools-title">
        <div className="container">
          <div className="arbitration-tools-heading"><span className="arbitration-kicker">Accesos del servicio</span><h2 id="jprd-tools-title">Herramientas y recursos</h2></div>
          <div className="arbitration-tools-grid">
            {resources.map(resource => <article key={resource.href}>
              <resource.icon size={27} strokeWidth={1.3} aria-hidden="true" />
              <h3 className="uppercase">{resource.title}</h3><p>{resource.text}</p>
              <a href={resource.href} {...(resource.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {resource.action}
                {resource.external && <span className="arbitration-external">Sitio externo<span className="sr-only"> · abre en otra pestaña</span></span>}
              </a>
            </article>)}
          </div>
        </div>
      </section>
      <section className="container arbitration-accompaniment" aria-labelledby="jprd-functions-title">
        <div className="arbitration-section-heading"><div><Eyebrow>Funciones de la JPRD</Eyebrow><h2 id="jprd-functions-title">Prevención y resolución durante el contrato</h2></div></div>
        <div className="arbitration-accompaniment-grid">
          {functions.map((item, i) => <article key={item.title}><span className="arbitration-number">0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
        <p className="arbitration-editorial-note">Adaptación editorial de la información institucional de origen, pendiente de aprobación de CENARD. Estas funciones no representan etapas obligatorias de un procedimiento.</p>
      </section>
      <section className="arbitration-library" aria-labelledby="normativa-jprd">
        <div className="container">
          <div className="arbitration-section-heading">
            <div><Eyebrow>Biblioteca del servicio</Eyebrow><h2 id="normativa-jprd">Normativa y documentos de JPRD</h2></div>
            <ArrowLink to="/web/documentos/?servicio=JPRD">Ver toda la normativa</ArrowLink>
          </div>
          <p className="arbitration-library-note">La fecha corresponde a la agrupación de la fuente original desde el 04/08/2025. Su aplicación y vigencia están pendientes de confirmación institucional; no indica la aprobación ni la publicación individual de los archivos.</p>
          <div className="arbitration-document-groups">
            <details className="arbitration-document-group" open>
              <summary><span><span className="arbitration-group-label">Agrupación de origen</span><span className="arbitration-group-title">Desde el 04/08/2025</span></span><span className="arbitration-disclosure"><span className="arbitration-show">Mostrar documentos</span><span className="arbitration-hide">Ocultar documentos</span></span></summary>
              <div className="arbitration-document-rows">
                {jprdDocuments.map(doc => <a key={doc.id} className="arbitration-document" href={doc.urlPublic} target="_blank" rel="noopener noreferrer">
                  <span><span className="arbitration-document-title">{doc.title}</span><span className="arbitration-document-type">{doc.type} · PDF</span></span>
                  <span className="arbitration-pdf-action">Ver PDF<span className="sr-only"> · abre en otra pestaña</span></span>
                </a>)}
              </div>
            </details>
          </div>
          <section className="jprd-legal" aria-labelledby="jprd-legal-title">
            <h3 id="jprd-legal-title">Información normativa complementaria</h3>
            <p className="jprd-legal-validation">Las afirmaciones de la fuente antigua requieren validación jurídica de CENARD y no constituyen una confirmación de vigencia actual.</p>
            <details className="jprd-legal-details">
              <summary><span className="jprd-legal-read">Leer información normativa</span><span className="jprd-legal-close">Cerrar información normativa</span></summary>
              <div className="jprd-legal-body">
                <p>La página institucional de origen describe a la JPRD como un órgano especializado encargado de fomentar la prevención y la resolución de conflictos durante la ejecución de contratos de obras y de suministro. Señala la atención de consultas técnicas o contractuales, la resolución de disputas en esos ámbitos y otras funciones establecidas en el Reglamento de la Ley N.º 32069.</p>
                <p>Según esa fuente, su jurisdicción abarca desde el inicio del plazo de ejecución del contrato hasta el pago o entrega final en los contratos de suministro, o hasta la recepción completa en los contratos de obra, según corresponda.</p>
                <p>La descripción también incluye controversias relacionadas con prestaciones adicionales autorizadas por la entidad contratante, salvo en los casos exceptuados por la ley. La fuente indica que las resoluciones emitidas por la JPRD son de cumplimiento obligatorio e inmediato.</p>
                <p>La página antigua cita la Directiva 4–2025–OECE–CD, numeral 8.2.7.2, e indica que CENARD solo puede administrar controversias en contrataciones del Estado hasta 2000 UIT. Esta referencia histórica queda pendiente de confirmación jurídica institucional; no se presenta como un límite vigente confirmado del servicio.</p>
              </div>
            </details>
          </section>
        </div>
      </section>
    </div>
  );
}
