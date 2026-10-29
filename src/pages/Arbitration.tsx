import { Calculator, FileCheck2, UsersRound, PanelsTopLeft } from "lucide-react";
import { ButtonLink, Eyebrow, ArrowLink } from "../components/UI";
import { documents } from "../data/documents";
import { pathFor } from "../data/site";
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
  { title: "Cálculo de tarifas", text: "Accede a la herramienta de cálculo de tarifas.", action: "Calcular tarifas", href: "/calculadora", icon: Calculator },
  { title: "Atalaya de Integridad", text: "Consulta la información pública de integridad institucional.", action: "Consultar Atalaya", href: "/web/atalaya-de-integridad", icon: FileCheck2 },
  { title: "Nómina de árbitros", text: "Consulta la nómina de profesionales publicada por CENARD.", action: "Consultar nómina", href: "/web/listado-de-arbitros", icon: UsersRound },
  { title: "Portal Atenea", text: "Accede al portal Atenea.", action: "Ingresar a Atenea", href: "https://sistema.cenardarbitraje.com/login", icon: PanelsTopLeft, external: true },
];

// Textos V2 conservados; respaldo específico pendiente de aprobación institucional.
const accompaniment = [
  { title: "Administración de arbitrajes", text: "Administración integral de arbitrajes ad hoc o institucionales, supervisión del cumplimiento del reglamento, gestión del calendario y actos procesales, y custodia del expediente arbitral." },
  { title: "Designación de árbitros", text: "Provisión de listas de profesionales, nombramiento según lo pactado o ante ausencia de acuerdo, y sustitución por impedimento, renuncia o recusación." },
  { title: "Asistencia administrativa", text: "Apoyo en audiencias virtuales o presenciales, soporte secretarial, gestión de salas, actas, notificaciones, archivo y comunicaciones entre las partes y los árbitros." },
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
            <p className="arbitration-introduction">Información sobre el servicio de arbitraje de CENARD y acceso a sus herramientas, profesionales y documentación institucional.</p>
            <div className="arbitration-actions">
              <ButtonLink to="#normativa-arbitraje">Consultar normativa</ButtonLink>
              <ButtonLink to={pathFor("contacto")} secondary>Solicitar orientación</ButtonLink>
            </div>
          </div>
          <figure className="arbitration-hero-image" data-provisional="true">
            <img {...heroImage} fetchPriority="high" />
            <figcaption>Imagen ilustrativa provisional. No representa al equipo ni a las instalaciones de CENARD.</figcaption>
          </figure>
        </div>
      </section>

      <section className="arbitration-tools" aria-labelledby="arbitration-tools-title">
        <div className="container">
          <div className="arbitration-tools-heading"><span className="arbitration-kicker">Accesos del servicio</span><h2 id="arbitration-tools-title">Herramientas y recursos</h2></div>
          <div className="arbitration-tools-grid">
            {resources.map(resource => (
              <article key={resource.href}>
                <resource.icon size={27} strokeWidth={1.3} aria-hidden="true" />
                <h3>{resource.title}</h3>
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

      <section className="container arbitration-accompaniment" aria-labelledby="arbitration-accompaniment-title">
        <div className="arbitration-section-heading">
          <div><Eyebrow>El servicio</Eyebrow><h2 id="arbitration-accompaniment-title">Acompañamiento institucional</h2></div>
          <ArrowLink to={pathFor("preguntas-frecuentes")}>Consultar preguntas frecuentes</ArrowLink>
        </div>
        <div className="arbitration-accompaniment-grid">
          {accompaniment.map((item, i) => <article key={item.title}><span className="arbitration-number">0{i + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
        </div>
        <p className="arbitration-editorial-note">Contenido editorial de V2 pendiente de aprobación de CENARD. La fuente antigua de Arbitraje no confirma el alcance de estas funciones.</p>
      </section>

      <section className="arbitration-library" aria-labelledby="normativa-arbitraje">
        <div className="container">
          <div className="arbitration-section-heading">
            <div><Eyebrow>Biblioteca del servicio</Eyebrow><h2 id="normativa-arbitraje">Normativa y documentos de arbitraje</h2></div>
            <ArrowLink to={pathFor("documentos") + "?servicio=Arbitraje"}>Ver toda la normativa</ArrowLink>
          </div>
          <p className="arbitration-library-note">Las fechas corresponden a la agrupación de la fuente original. Su aplicación y vigencia están pendientes de confirmación institucional; no indican la fecha de publicación de cada archivo.</p>
          <div className="arbitration-document-groups">
            {[{ historical: false, label: "Desde el 04/08/2025", subtitle: "Agrupación de origen" }, { historical: true, label: "Hasta el 03/08/2025", subtitle: "Agrupación histórica de origen" }].map(group => (
              <details className="arbitration-document-group" key={group.label} open={!group.historical}>
                <summary><span><span className="arbitration-group-label">{group.subtitle}</span><span className="arbitration-group-title">{group.label}</span></span><span className="arbitration-disclosure"><span className="arbitration-show">Mostrar documentos</span><span className="arbitration-hide">Ocultar documentos</span></span></summary>
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
            <strong>Referencia normativa pendiente de validación</strong>
            <p>La página original cita la Directiva 4–2025–OECE–CD, numeral 8.2.7.2, y un límite de 2000 UIT para la administración de controversias en contrataciones del Estado. Esta referencia histórica requiere confirmación jurídica de CENARD y no constituye una afirmación de vigencia actual.</p>
          </aside>
        </div>
      </section>
    </div>
  );
}
