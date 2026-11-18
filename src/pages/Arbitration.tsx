import { Calculator, CalendarDays, FileDown, FileText, UsersRound, PanelsTopLeft } from "lucide-react";
import { ButtonLink, Eyebrow, ArrowLink } from "../components/UI";
import { documents } from "../data/documents";
import { pathFor } from "../data/site";
import { arbitrationRequestPdf } from "../data/service-assets";
import "./arbitration.css";

// PROVISIONAL: fotografía ilustrativa reutilizada de la web antigua por autorización
// del usuario. Fuente, licencia pendiente y sustitución: docs/qa/arbitraje/conservacion.md.
const heroImage = {
  src: "/assets/arbitration/arbitraje-provisional.webp",
  width: 760,
  height: 507,
  alt: "Mazo de madera y una persona trabajando en un escritorio. Fotografía ilustrativa, ajena al equipo de CENARD.",
};

const resources = [
  { title: "Costos arbitrales", text: "Calcula los costos arbitrales del Centro.", action: "Calcular costos", href: pathFor("calculadora"), icon: Calculator },
  { title: "Normativa arbitral", text: "Consulta el Reglamento Procesal y los documentos aplicables.", action: "Consultar normativa", href: "#normativa-arbitraje", icon: FileText },
  { title: "Nómina de árbitros", text: "Conoce a los profesionales que integran la nómina del CENARD.", action: "Consultar nómina", href: pathFor("listado-de-arbitros"), icon: UsersRound },
  { title: "Portal Atenea", text: "Accede a la plataforma digital de gestión de expedientes del CENARD.", action: "Ingresar a Atenea", href: "https://sistema.cenardarbitraje.com/login", icon: PanelsTopLeft, external: true },
];

const startingSteps = [
  { title: "Revisa el convenio arbitral", text: "Identifica las características del arbitraje, como su modalidad institucional o ad hoc, su ámbito nacional o internacional y si se ha previsto la intervención de un árbitro único o de un tribunal arbitral." },
  { title: "Elabora tu solicitud arbitral", text: "Reúne la información y documentación necesaria para presentar tu solicitud, conforme a los requisitos establecidos en el Reglamento Procesal aplicable." },
  { title: "Presenta tu solicitud", text: "Presenta tu solicitud arbitral y anexos a través de la Mesa de Partes del Centro, acompañando la documentación exigida por el Reglamento Procesal aplicable." },
];

export function ArbitrationPage() {
  const arbitrationDocuments = documents.filter(d => d.services.includes("Arbitraje"));
  return (
    <div className="arbitration-page">
      <section className="arbitration-hero">
        <div className="container arbitration-hero-grid">
          <div className="arbitration-hero-copy">
            <Eyebrow>Servicios</Eyebrow>
            <h1 tabIndex={-1}>Arbitraje</h1>
            <p className="arbitration-introduction">El CENARD administra procesos arbitrales derivados de controversias entre privados y de contrataciones públicas, conforme a su Reglamento Procesal y a la normativa aplicable.</p>
            <div className="arbitration-actions">
              <a className="button" href="https://sistema.cenardarbitraje.com/mesa-partes" target="_blank" rel="noopener noreferrer">Iniciar arbitraje<span className="sr-only"> · abre en otra pestaña</span></a>
              <ButtonLink to="#normativa-arbitraje" secondary>Consultar normativa</ButtonLink>
            </div>
          </div>
          <figure className="arbitration-hero-image" data-provisional="true">
            <img {...heroImage} fetchPriority="high" />
          </figure>
        </div>
      </section>

      <section className="arbitration-tools" aria-labelledby="arbitration-tools-title">
        <div className="container">
          <div className="arbitration-tools-heading"><span className="arbitration-kicker">Consulta y gestión</span><h2 id="arbitration-tools-title">Herramientas y recursos</h2></div>
          <div className="arbitration-tools-grid">
            {resources.map(resource => (
              <article key={resource.href}>
                <resource.icon size={27} strokeWidth={1.3} aria-hidden="true" />
                <h3 className="uppercase">{resource.title}</h3>
                <p>{resource.text}</p>
                <a href={resource.href} {...(resource.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  {resource.action}
                  {resource.external && <span className="arbitration-external">Sitio externo<span className="sr-only"> · abre en otra pestaña</span></span>}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container arbitration-accompaniment" aria-labelledby="arbitration-start-title">
        <div className="arbitration-section-heading">
          <div><Eyebrow>Guía del servicio</Eyebrow><h2 id="arbitration-start-title">¿Cómo iniciar un arbitraje?</h2></div>
        </div>
        <div className="arbitration-accompaniment-grid">
          {startingSteps.map((item, i) => <article key={item.title}><span className="arbitration-number">0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
        <div className="arbitration-request-download">
          {arbitrationRequestPdf ? <a className="arbitration-download-link" href={arbitrationRequestPdf} download><FileDown size={28} aria-hidden="true" /><span>Descargar modelo de solicitud arbitral</span><span className="sr-only"> · PDF</span></a>
            : <><button className="arbitration-download-link" type="button" disabled aria-describedby="arbitration-model-status"><FileDown size={28} aria-hidden="true" /><span>Descargar modelo de solicitud arbitral</span></button><p id="arbitration-model-status">Modelo de solicitud no disponible para descarga.</p></>}
        </div>
      </section>

      <section className="arbitration-library" aria-labelledby="normativa-arbitraje">
        <div className="container">
          <div className="arbitration-section-heading">
            <div><Eyebrow>Biblioteca del servicio</Eyebrow><h2 id="normativa-arbitraje">Normativa y documentos de arbitraje</h2></div>
            <ArrowLink to={pathFor("documentos") + "?servicio=Arbitraje"}>Ver toda la normativa</ArrowLink>
          </div>
          <p className="arbitration-library-note">La aplicación de cada reglamento se determina conforme a sus disposiciones de vigencia y aplicación temporal.</p>
          <div className="arbitration-document-groups">
            {[{ historical: false, label: "Normativa y documentos 2025", subtitle: "01 / Documentación institucional", date: "Desde el 04/08/2025" }, { historical: true, label: "Normativa y documentos anteriores", subtitle: "02 / Versiones anteriores", date: "Hasta el 03/08/2025" }].map(group => (
              <details className="arbitration-document-group" key={group.label} open={!group.historical}>
                <summary><span><span className="arbitration-group-label">{group.subtitle}</span><span className="arbitration-group-title">{group.label}</span><span className="arbitration-group-date"><CalendarDays size={17} aria-hidden="true" />{group.date}</span></span><span className="arbitration-disclosure"><span className="arbitration-show">Mostrar documentos</span><span className="arbitration-hide">Ocultar documentos</span></span></summary>
                <div className="arbitration-document-rows">
                  {arbitrationDocuments.filter(d => (d.sourceGrouping.kind === "historico") === group.historical).map(d => (
                    <a key={d.id} className="arbitration-document" href={d.urlPublic} target="_blank" rel="noopener noreferrer">
                      <span><span className="arbitration-document-title">{d.title}</span><span className="arbitration-document-type">{d.type} · PDF</span></span>
                      <span className="arbitration-pdf-action">Ver PDF<span className="sr-only"> · abre en otra pestaña</span></span>
                    </a>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <aside className="arbitration-validation-note">
            <p>De conformidad con el numeral 8.2.7.2 de la Directiva N° 004-2025-OECE/CD, el Centro Nacional para la Resolución de Disputas – CENARD, en su condición de institución incorporada al REGAJU bajo la categoría de recién constituida, puede administrar controversias en materia de contratación pública hasta dos mil (2 000) Unidades Impositivas Tributarias (UIT).</p>
          </aside>
        </div>
      </section>
    </div>
  );
}
