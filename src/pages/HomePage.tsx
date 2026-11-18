import { ArrowUpRight, BookOpenText, Calculator, FileCheck2, UsersRound } from "lucide-react";
import { Link } from "react-router";
import { ArrowLink, ButtonLink, Eyebrow, SectionHeading } from "../components/UI";
import { pathFor } from "../data/site";
import "./home.css";

const shortcuts = [
  { icon: BookOpenText, title: "Normativa y documentos", text: "Reglamentos, directivas, tarifarios y formatos institucionales.", slug: "documentos" },
  { icon: UsersRound, title: "Nómina de árbitros", text: "Profesionales que integran nuestros registros institucionales.", slug: "listado-de-arbitros" },
  { icon: FileCheck2, title: "Nómina de adjudicadores", text: "Especialistas habilitados para integrar las JPRD.", slug: "nomina-de-adjudicadores" },
  { icon: Calculator, title: "Costos arbitrales", text: "Calculadora de costos arbitrales del Centro.", slug: "calculadora" },
];

export function HomePage() {
  return (
    <div className="cenard-home">
      <section className="home-hero">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <Eyebrow>Centro Nacional para la Resolución de Disputas · CENARD</Eyebrow>
            <h1 tabIndex={-1}>Arbitraje y prevención de disputas.</h1>
            <p className="home-hero-description">
              Administramos arbitrajes, Juntas de Prevención y Resolución de Disputas, y brindamos servicios de
              apoyo a procesos arbitrales no administrados por el Centro, bajo un marco institucional que
               privilegia la eficiencia, la imparcialidad y transparencia.
            </p>
            <div className="home-hero-actions">
              <a className="button" href="#servicios">Nuestros servicios</a>
              <ButtonLink secondary to={pathFor("contacto")}>Contactar a CENARD</ButtonLink>
            </div>
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
            <div className="home-identity-copy">
              <p>La Asociación para la Promoción Cultural de los Mecanismos Alternativos de Solución de Controversias informa que su Centro de Arbitraje opera bajo la denominación comercial <strong>“Centro Nacional para la Resolución de Disputas – CENARD”</strong>, formando parte integrante de la Asociación y sin constituir una entidad distinta o independiente de ésta.</p>
              <p>En consecuencia, la denominación o uso de los nombres <strong>“Centro Nacional para la Resolución de Disputas – CENARD” o “CENARD”</strong> identifican al mismo Centro de Arbitraje.</p>
            </div>
          </div>
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
          <SectionHeading label="Nuestros servicios">
          </SectionHeading>
          <div className="home-service-grid">
            <article className="home-service">
              <p className="home-service-label">Solución de controversias</p>
              <h3>Arbitraje</h3>
              <p className="home-service-description">Organizamos y administramos procesos arbitrales, brindando soporte
              institucional durante las distintas etapas del proceso.</p>
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
              <p className="home-service-description">Organizamos y administramos Juntas de Prevención y Resolución de Disputas, orientadas a prevenir y resolver oportunamente los desacuerdos que surjan durante la ejecución contractual.</p>
              <ArrowLink className="home-service-primary" to={pathFor("jprd")}>Conocer JPRD</ArrowLink>
              <div className="home-service-secondary">
                <Link to={pathFor("documentos") + "?servicio=JPRD"}>Normativa de JPRD</Link>
                <Link to={pathFor("nomina-de-adjudicadores")}>Nómina de adjudicadores</Link>
              </div>
            </article>
          </div>
          <div className="home-secondary-services">
            <article className="home-complementary-service">
              <p className="home-service-label">Servicios complementarios</p>
              <h3>Servicios de apoyo arbitral</h3>
              <p>Brindamos servicios especializados de secretaría arbitral ad hoc, designación de árbitros y atención de recusaciones y remociones en arbitrajes no administrados por el CENARD, conforme a la normativa aplicable.</p>
              <ArrowLink to={pathFor("servicios-complemementarios")}>Conocer otros servicios</ArrowLink>
            </article>

          </div>
        </div>
      </section>

      <section className="home-institution home-section" aria-label="Nuestra institución">
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
            <p>El Centro Nacional para la Resolución de Disputas - CENARD es una institución especializada en la administración de procesos arbitrales y en la prevención y resolución de disputas, comprometida con la independencia, la imparcialidad, la transparencia y la eficiencia en la prestación de sus servicios.</p>
            <ArrowLink to={pathFor("quienes-somos")}>Conocer la institución</ArrowLink>
            <div className="home-institution-links">
              <Link to={pathFor("organizacion-institucional")}>Organización institucional</Link>
              <Link to={pathFor("certificaciones")}>Registros y constancias institucionales</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-guidance home-section">
        <div className="container">
          <SectionHeading label="Información útil" />
          <div className="home-guidance-grid">
            <article>
              <h3>Preguntas frecuentes</h3>
              <p>Encuentra respuestas a las consultas más frecuentes sobre nuestros servicios y cómo iniciar un proceso arbitral ante el CENARD.</p>
              <ArrowLink to={pathFor("preguntas-frecuentes")}>Ver respuestas <ArrowUpRight size={18} aria-hidden="true" /></ArrowLink>
            </article>
            <article>
              <h3>Atalaya de Integridad</h3>
              <p>Accede a los laudos arbitrales publicados y a la información institucional disponible en materia de transparencia.</p>
              <ArrowLink to={pathFor("atalaya-de-integridad")}>Explorar Atalaya <ArrowUpRight size={18} aria-hidden="true" /></ArrowLink>
            </article>
          </div>
        </div>
      </section>


    </div>
  );
}
