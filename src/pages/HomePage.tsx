import {
  ArrowDown,
  ArrowUpRight,
  BookOpenText,
  Calculator,
  FileCheck2,
  FileText,
  Scale,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router";
import {
  ArrowLink,
  ButtonLink,
  Eyebrow,
  SectionHeading,
} from "../components/UI";
import { notice, pathFor } from "../data/site";

const shortcuts = [
  {
    icon: BookOpenText,
    title: "Normativa y documentos",
    text: "Reglamentos y recursos institucionales.",
    slug: "documentos",
    n: "01",
  },
  {
    icon: UsersRound,
    title: "Nómina de árbitros",
    text: "Consulta nuestros profesionales.",
    slug: "listado-de-arbitros",
    n: "02",
  },
  {
    icon: FileCheck2,
    title: "Nómina de adjudicadores",
    text: "Especialistas en resolución de disputas.",
    slug: "nomina-de-adjudicadores",
    n: "03",
  },
  {
    icon: Calculator,
    title: "Calculadora de tarifas",
    text: "Información sobre costos y modalidades.",
    slug: "calculadora",
    n: "04",
  },
];
export function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-layout">
          <div className="hero-copy">
            <Eyebrow>Diálogo que construye soluciones</Eyebrow>
            <h1 tabIndex={-1}>
              Centro Nacional
              <br />
              para la Resolución
              <br />
              de <em>Disputas.</em>
            </h1>
            <p>
              Promovemos la cultura de solución de controversias a través del
              arbitraje y la prevención de disputas.
            </p>
            <div className="hero-actions">
              <ButtonLink to="/web/#servicios">Conocer servicios</ButtonLink>
              <ButtonLink secondary to={pathFor("documentos")}>
                Consultar normativa
              </ButtonLink>
            </div>
            <div className="hero-footnote">
              <span className="small-rule" />
              Imparcialidad. Especialización. Transparencia.
            </div>
          </div>
          <div className="hero-visual">
            <img
              className="hero-photo"
              src="/images/hero-1400.webp"
              srcSet="/images/hero-640.webp 640w, /images/hero-1400.webp 1400w"
              sizes="(min-width: 1200px) 40vw, (min-width: 768px) 45vw, 100vw"
              width="1400"
              height="876"
              fetchPriority="high"
              alt="Balanza de justicia y documentos sobre un escritorio jurídico. Imagen ilustrativa."
            />
            <div className="hero-image-shade" />
            <div className="hero-image-caption">
              <Scale size={28} strokeWidth={1.2} aria-hidden="true" />
              <span>
                Una cultura de diálogo.
                <br />
                <strong>Un camino hacia la solución.</strong>
              </span>
            </div>
            <span className="hero-vertical">CENARD · ARBITRAJE Y JPRD</span>
          </div>
        </div>
        <div className="hero-bottom container">
          <span>Institución · Servicios · Recursos</span>
          <a href="#recursos" aria-label="Explorar recursos">
            Explora CENARD
            <ArrowDown size={15} aria-hidden="true" />
          </a>
        </div>
      </section>
      <section className="quick-access" id="recursos">
        <div className="container">
          <div className="quick-label">
            <span>Tu consulta, más cerca</span>
            <span>ACCESOS RÁPIDOS</span>
          </div>
          <div className="shortcut-grid">
            {shortcuts.map((s) => (
              <Link className="shortcut" key={s.slug} to={pathFor(s.slug)}>
                <div className="shortcut-top">
                  <s.icon size={25} strokeWidth={1.4} aria-hidden="true" />
                  <span>{s.n}</span>
                </div>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
                <ArrowUpRight
                  size={19}
                  aria-hidden="true"
                  className="shortcut-arrow"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section id="servicios" className="section services-section">
        <div className="container">
          <SectionHeading
            label="Nuestros servicios"
            title="Distintos caminos. Un mismo propósito."
          >
            <p>
              Mecanismos especializados para abordar controversias y acompañar
              la ejecución de contratos.
            </p>
          </SectionHeading>
          <div className="services-grid">
            <article className="service-panel">
              <div className="service-number">01 / ARBITRAJE</div>
              <Scale
                className="service-icon"
                size={48}
                strokeWidth={1}
                aria-hidden="true"
              />
              <h3>Arbitraje</h3>
              <p>
                Un mecanismo de solución de controversias con administración
                institucional y profesionales especializados.
              </p>
              <ArrowLink to={pathFor("arbitraje")}>
                Conocer el servicio
              </ArrowLink>
              <div className="service-bottom">
                <Link to={pathFor("documentos") + "?servicio=Arbitraje"}>
                  Normativa
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
                <Link to={pathFor("listado-de-arbitros")}>
                  Nómina de árbitros
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>
            <article className="service-panel service-panel-light">
              <div className="service-number">02 / PREVENCIÓN Y RESOLUCIÓN</div>
              <ShieldCheck
                className="service-icon"
                size={48}
                strokeWidth={1}
                aria-hidden="true"
              />
              <h3>JPRD</h3>
              <p>
                Juntas de Prevención y Resolución de Disputas para acompañar la
                ejecución de contratos de obras y de suministro.
              </p>
              <ArrowLink to={pathFor("jprd")}>Conocer el servicio</ArrowLink>
              <div className="service-bottom">
                <Link to={pathFor("documentos") + "?servicio=JPRD"}>
                  Normativa
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
                <Link to={pathFor("nomina-de-adjudicadores")}>
                  Nómina de adjudicadores
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="section institution-section">
        <div className="container institution-grid">
          <div className="institution-image">
            <img
              src="/images/meeting-1400.webp"
              srcSet="/images/meeting-640.webp 640w, /images/meeting-1400.webp 1400w"
              sizes="(min-width: 768px) 45vw, 100vw"
              width="1400"
              height="934"
              alt="Profesionales dialogando en una reunión. Imagen ilustrativa, no representa al equipo de CENARD."
              loading="lazy"
            />
            <span>EL VALOR DEL ENTENDIMIENTO</span>
          </div>
          <div className="institution-copy">
            <Eyebrow>Nuestra institución</Eyebrow>
            <h2>El diálogo como punto de partida.</h2>
            <p>
              Somos el Centro Nacional para la Resolución de Disputas. Nuestra
              misión es promover mecanismos de solución de controversias con
              imparcialidad, transparencia y especialización.
            </p>
            <p>
              Conoce nuestra organización, a las personas que la integran y los
              documentos que respaldan nuestra actividad.
            </p>
            <ArrowLink to={pathFor("conocenos")}>Conoce CENARD</ArrowLink>
            <div className="institution-links">
              <Link to={pathFor("alto-consejo")}>
                Alto Consejo
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <Link to={pathFor("organigrama")}>
                Estructura institucional
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
              <Link to={pathFor("certificaciones")}>
                Certificaciones y constancias
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section transparency-section">
        <div className="container">
          <SectionHeading
            label="Información a tu alcance"
            title="La confianza se construye con claridad."
          />
          <div className="transparency-grid">
            <article>
              <BookOpenText size={30} strokeWidth={1.3} aria-hidden="true" />
              <div>
                <h3>Una biblioteca para consultar.</h3>
                <p>
                  Reglamentos, directivas, códigos y fichas organizados para
                  encontrar lo que necesitas.
                </p>
                <ArrowLink to={pathFor("documentos")}>
                  Explorar documentos
                </ArrowLink>
              </div>
            </article>
            <article>
              <ShieldCheck size={30} strokeWidth={1.3} aria-hidden="true" />
              <div>
                <h3>Una mirada a la integridad.</h3>
                <p>
                  Accede a la información pública de la institución en nuestra
                  Atalaya de Integridad.
                </p>
                <ArrowLink to={pathFor("atalaya-de-integridad")}>
                  Visitar Atalaya
                </ArrowLink>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="notice-section">
        <div className="container">
          <details className="institutional-notice">
            <summary>
              <FileText size={22} strokeWidth={1.4} aria-hidden="true" />
              <div>
                <span className="notice-title">
                  Nuestra identidad institucional
                </span>
                <span>
                  CENARD forma parte de la Asociación para la Promoción Cultural
                  de los Mecanismos Alternativos de Solución de Controversias.
                </span>
              </div>
              <span className="notice-open">
                Leer comunicado
                <ArrowDown size={16} aria-hidden="true" />
              </span>
            </summary>
            <div className="notice-content">
              {notice.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <a
                className="text-link"
                href="/images/notice.png"
                target="_blank"
                rel="noreferrer"
              >
                Ver comunicado original
                <ArrowUpRight size={16} aria-hidden="true" />
                <span className="sr-only"> (abre en otra pestaña)</span>
              </a>
              <p className="caption">
                Transcripción para revisión institucional antes de publicar.
              </p>
            </div>
          </details>
        </div>
      </section>
    </>
  );
}
