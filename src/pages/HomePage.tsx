import { BookOpenText, FileCheck2, UsersRound } from "lucide-react";
import { Link } from "react-router";
import { ArrowLink, ButtonLink, Eyebrow, SectionHeading } from "../components/UI";
import { notice, pathFor } from "../data/site";
import "./home.css";

const shortcuts = [
  { icon: BookOpenText, title: "Normativa y documentos", text: "Reglamentos, directivas y fichas.", slug: "documentos" },
  { icon: UsersRound, title: "Nómina de árbitros", text: "Consulta los registros publicados.", slug: "listado-de-arbitros" },
  { icon: FileCheck2, title: "Nómina de adjudicadores", text: "Consulta los registros publicados.", slug: "nomina-de-adjudicadores" },
];

export function HomePage() {
  return (
    <div className="cenard-home">
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <Eyebrow>CENARD · Centro Nacional para la Resolución de Disputas</Eyebrow>
            <h1 tabIndex={-1}>Arbitraje y prevención de disputas.</h1>
            <p className="home-hero-description">
              Promovemos la solución de controversias mediante el arbitraje y
              las Juntas de Prevención y Resolución de Disputas.
            </p>
            <div className="home-hero-actions">
              <a className="button" href="#servicios">Conocer servicios</a>
              <ButtonLink secondary to={pathFor("contacto")}>Contactar a CENARD</ButtonLink>
            </div>
            <p className="home-hero-values">Imparcialidad. Especialización. Transparencia.</p>
          </div>
          <div className="home-hero-image">
            <img
              src="/images/hero-1400.webp"
              srcSet="/images/hero-640.webp 640w, /images/hero-1400.webp 1400w"
              sizes="(min-width: 1200px) 540px, (min-width: 768px) 45vw, 100vw"
              width="1400" height="876" fetchPriority="high"
              alt="Balanza de justicia y documentos sobre un escritorio jurídico. Imagen ilustrativa."
            />
          </div>
        </div>
      </section>

      <section className="home-notice-section" id="identidad-institucional" aria-labelledby="identidad-institucional-titulo">
        <div className="container">
          <div className="home-identity-intro">
            <h2 id="identidad-institucional-titulo" tabIndex={-1}>Nuestra identidad institucional</h2>
            <p>El Centro Nacional para la Resolución de Disputas — CENARD forma parte de la Asociación para la Promoción Cultural de los Mecanismos Alternativos de Solución de Controversias. No constituye una entidad distinta ni independiente de la Asociación.</p>
          </div>
          <details className="home-notice">
            <summary>
              <span className="home-notice-action">
                <span className="home-notice-read">Leer comunicado completo</span>
                <span className="home-notice-close">Cerrar comunicado</span>
              </span>
            </summary>
            <div className="home-notice-content">
              {notice.map((p) => <p key={p}>{p}</p>)}
            </div>
          </details>
        </div>
      </section>

      <section className="home-shortcuts" id="recursos" aria-labelledby="home-shortcuts-title">
        <div className="container">
          <h2 id="home-shortcuts-title">Accesos rápidos</h2>
          <div className="home-shortcut-grid">
            {shortcuts.map(({ icon: Icon, title, text, slug }) => (
              <Link className="home-shortcut" key={slug} to={pathFor(slug)}>
                <Icon size={25} strokeWidth={1.4} aria-hidden="true" />
                <div><h3>{title}</h3><p>{text}</p></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="servicios" className="home-services home-section">
        <div className="container">
          <SectionHeading label="Nuestros servicios" title="Nuestros servicios">
            <p>Conoce nuestros servicios de solución de controversias y prevención de disputas.</p>
          </SectionHeading>
          <div className="home-service-grid">
            <article className="home-service">
              <p className="home-service-label">Solución de controversias</p>
              <h3>Arbitraje</h3>
              <p className="home-service-description">Administración institucional de procesos arbitrales para la solución de controversias.</p>
              <ArrowLink className="home-service-primary" to={pathFor("arbitraje")}>Conocer Arbitraje</ArrowLink>
              <div className="home-service-secondary">
                <Link to={pathFor("documentos") + "?servicio=Arbitraje"}>Normativa de Arbitraje</Link>
                <Link to={pathFor("listado-de-arbitros")}>Nómina de árbitros</Link>
              </div>
            </article>
            <article className="home-service home-service-light">
              <p className="home-service-label">Prevención y resolución de disputas</p>
              <h3>JPRD</h3>
              <p className="home-service-full-name">Juntas de Prevención y Resolución de Disputas</p>
              <p className="home-service-description">Prevención y resolución de disputas durante la ejecución de contratos de obras y de suministro.</p>
              <ArrowLink className="home-service-primary" to={pathFor("jprd")}>Conocer JPRD</ArrowLink>
              <div className="home-service-secondary">
                <Link to={pathFor("documentos") + "?servicio=JPRD"}>Normativa de JPRD</Link>
                <Link to={pathFor("nomina-de-adjudicadores")}>Nómina de adjudicadores</Link>
              </div>
            </article>
          </div>
          <div className="home-secondary-services">
            <article>
              <h3>Dispute Boards</h3>
              <p>Consulta el alcance y las modalidades de este servicio.</p>
              <ArrowLink to={pathFor("contacto")}>Consultar información</ArrowLink>
            </article>
            <article>
              <h3>Mediación</h3>
              <p>Consulta información sobre el servicio de mediación.</p>
              <ArrowLink to={pathFor("contacto")}>Consultar información</ArrowLink>
            </article>
          </div>
        </div>
      </section>

      <section className="home-institution home-section" aria-labelledby="home-institution-title">
        <div className="container home-institution-grid">
          <div className="home-institution-image">
            <img
              src="/images/meeting-1400.webp"
              srcSet="/images/meeting-640.webp 640w, /images/meeting-1400.webp 1400w"
              sizes="(min-width: 1200px) 540px, (min-width: 768px) 45vw, 100vw"
              width="1400" height="934" loading="lazy"
              alt="Profesionales dialogando en una reunión. Imagen ilustrativa, no representa al equipo de CENARD."
            />
          </div>
          <div className="home-institution-copy">
            <Eyebrow>Nuestra institución</Eyebrow>
            <h2 id="home-institution-title">Conoce CENARD</h2>
            <p>Somos el Centro Nacional para la Resolución de Disputas. Conoce nuestra presentación institucional, nuestra organización y los documentos institucionales disponibles.</p>
            <ArrowLink to={pathFor("conocenos")}>Conocer la institución</ArrowLink>
            <div className="home-institution-links">
              <Link to={pathFor("organizacion-institucional")}>Organización institucional</Link>
              <Link to={pathFor("certificaciones")}>Certificaciones y constancias</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-guidance home-section">
        <div className="container">
          <SectionHeading label="Información útil" title="Orientación e integridad" />
          <div className="home-guidance-grid">
            <article>
              <h3>Preguntas frecuentes</h3>
              <p>Consulta respuestas generales sobre el arbitraje y el inicio de un proceso en CENARD.</p>
              <ArrowLink to={pathFor("preguntas-frecuentes")}>Consultar preguntas frecuentes</ArrowLink>
            </article>
            <article>
              <h3>Atalaya de Integridad</h3>
              <p>Accede a los laudos arbitrales publicados y consulta la disponibilidad de otras categorías de información.</p>
              <ArrowLink to={pathFor("atalaya-de-integridad")}>Visitar Atalaya</ArrowLink>
            </article>
          </div>
        </div>
      </section>


    </div>
  );
}
