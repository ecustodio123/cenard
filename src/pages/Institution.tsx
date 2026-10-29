import type { ReactNode } from "react";
import { ResourceHeader } from "../components/ResourceUI";
import "./contact.css";
import { contactLocation } from "../data/contact";
import {
  BookOpenText,
  Compass,
  ChevronDown,
  Mail,
  Phone,
  Scale,
  UsersRound,
} from "lucide-react";
import {
  ArrowLink,
  ButtonLink,
  DocumentRow,
  Eyebrow,
  SectionHeading,
} from "../components/UI";
import { features, notice, pathFor, site } from "../data/site";
import council from "../data/council.json";
import { ManagementProposals } from "../components/institution/ManagementProposals";
import { documents as docs, sourceGroupingLabel } from "../data/documents";

export function AboutPage() {
  return (
    <>
      <section className="container page-content about-intro">
        <div>
          <Eyebrow>Quiénes somos</Eyebrow>
          <h2>
            Una institución dedicada
            <br />a encontrar soluciones.
          </h2>
          <p>
            El Centro Nacional para la Resolución de Disputas — CENARD forma
            parte de la Asociación para la Promoción Cultural de los Mecanismos
            Alternativos de Solución de Controversias.
          </p>
          <p>
            La misión publicada por CENARD es ofrecer servicios de solución de
            controversias de manera eficiente, transparente y confiable, con
            procesos imparciales y especializados.
          </p>
          <ButtonLink to="/web/#servicios">Nuestros servicios</ButtonLink>
        </div>
        <figure>
          <img
            src="/images/meeting-1400.webp"
            width="1400"
            height="934"
            alt="Reunión de profesionales. Fotografía ilustrativa del sitio original."
          />
          <figcaption>
            El diálogo y la especialización como base de la solución de
            controversias. Imagen ilustrativa.
          </figcaption>
        </figure>
      </section>
      <section className="section muted-section">
        <div className="container">
          <SectionHeading
            label="Nuestra forma de trabajar"
            title="Un compromiso compartido."
          />
          <div className="principles-grid about-principles">
            {[
              {
                icon: Compass,
                title: "Promoción de la cultura arbitral",
                text: "CENARD orienta su actividad a promover los mecanismos alternativos de solución de controversias entre empresas, instituciones y ciudadanos.",
              },
              {
                icon: Scale,
                title: "Especialización y ética",
                text: "La imparcialidad, la confidencialidad y la transparencia son principios declarados por la institución para la conducción de los procesos.",
              },
              {
                icon: UsersRound,
                title: "Gestión y acompañamiento",
                text: "La administración institucional acompaña las distintas etapas del proceso arbitral y la gestión documental.",
              },
            ].map((p) => (
              <article key={p.title}>
                <p.icon size={32} strokeWidth={1.2} aria-hidden="true" />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
          <p className="caption">
            Síntesis editorial del contenido institucional publicado, pendiente
            de aprobación de CENARD.
          </p>
        </div>
      </section>
      <section className="container section">
        <SectionHeading
          label="Conoce la organización"
          title="Las personas detrás de la institución."
        />
        <div className="link-rows about-organization-links">
          <ArrowLink to={pathFor("organizacion-institucional") + "#estructura-institucional"}>
            Estructura institucional
          </ArrowLink>
          <ArrowLink to={pathFor("organizacion-institucional") + "#direccion-secretaria"}>
            Dirección y Secretaría General
          </ArrowLink>
          <ArrowLink to={pathFor("organizacion-institucional") + "#alto-consejo"}>Alto Consejo</ArrowLink>
        </div>
        <details className="plain-details about-notice">
          <summary>
            <span>Comunicado sobre identidad institucional</span>
            <span className="about-notice-action">
              <span className="about-notice-read">Leer comunicado</span>
              <span className="about-notice-close">Cerrar comunicado</span>
            </span>
          </summary>
          <div className="about-notice-body">
            {notice.map((p) => <p key={p}>{p}</p>)}
          </div>
        </details>
      </section>
    </>
  );
}

const councilSpecialties = [
  ["Ingeniería civil", "Obras públicas y privadas"],
  ["Derecho corporativo", "Transacciones internacionales"],
  ["Derecho societario", "Fusiones y adquisiciones"],
  ["Gestión pública", "Contratación y arbitraje"],
  ["Ingeniería civil", "Gestión de proyectos"],
];

function InstitutionalProfile({
  id, name, role, image, initials, specialties = [], biography, subheading = false, placeholder = false, rolePreview = false, showDisclosure = true,
}: {
  id: string;
  name: string;
  role: string;
  image?: string;
  initials?: string;
  specialties?: string[];
  biography?: ReactNode;
  subheading?: boolean;
  placeholder?: boolean;
  description?: string;
  rolePreview?: boolean;
  showDisclosure?: boolean;
}) {
  const Heading = subheading ? "h4" : "h3";
  return (
    <article className="council-profile" aria-labelledby={id}>
      <div className="council-profile-overview">
        {image ? (
          <div className="council-portrait">
            <img src={image} width="600" height="900" alt={placeholder ? `Foto de muestra del secretario general, utilizada provisionalmente en la tarjeta de ${name}` : name} loading="lazy" />
            {placeholder && <span className="profile-photo-sample">Foto de muestra</span>}
          </div>
        ) : (
          <div className={`institutional-neutral-portrait${placeholder ? " institutional-photo-placeholder" : ""}`} role={placeholder ? "img" : undefined} aria-label={placeholder ? `Fotografía pendiente de ${name}` : undefined} aria-hidden={placeholder ? undefined : true}>
            {initials ? <span>{initials}</span> : <UsersRound size={64} strokeWidth={1} />}
            <small>{placeholder ? "Foto pendiente" : "CENARD"}</small>
          </div>
        )}
        <div className="council-profile-heading">
          <p className="council-role">{role}</p>
          <Heading id={id}>{name}</Heading>
          {specialties.length > 0 && (
            <ul className="council-specialties" aria-label="Áreas de experiencia">
              {specialties.map((specialty) => <li key={specialty}>{specialty}</li>)}
            </ul>
          )}
          {!biography && <p className="institutional-profile-caption">La fuente disponible no incluye una biografía profesional.</p>}
        </div>
      </div>
      {biography && (
        <details className="council-biography">
          <summary>
            <span className="council-profile-open">{rolePreview ? "Ver funciones del rol" : "Ver perfil profesional"}</span>
            <span className="council-profile-close">{rolePreview ? "Cerrar funciones del rol" : "Cerrar perfil profesional"}</span>
            <span className="sr-only"> de {name}</span>
            {showDisclosure && <ChevronDown className="profile-disclosure" size={18} aria-hidden="true" />}
          </summary>
          <div className="council-biography-text">{biography}</div>
        </details>
      )}
    </article>
  );
}

export function InstitutionalOrganizationPage() {
  return (
    <div className="container page-content institutional-organization">
      <nav className="organization-section-nav" aria-label="Secciones de Organización institucional">
        <a href="#estructura-institucional">Estructura institucional</a>
        <a href="#direccion-secretaria">Dirección y Secretaría General</a>
        <a href="#alto-consejo">Alto Consejo</a>
      </nav>

      <section className="organization-section" aria-labelledby="structure-title">
        <div id="estructura-institucional" className="council-directory-heading organization-anchor">
          <div><Eyebrow>Gobierno institucional</Eyebrow><h2 id="structure-title">Estructura institucional</h2></div>
        </div>
        <p className="organ-intro">Una estructura jerárquica que articula la conducción institucional con el funcionamiento del centro.</p>
        <div className="organ-reference-layout">
          <figure className="organ-source-figure">
            <img src="/assets/institution/organigrama.webp" width="600" height="600" loading="lazy" alt="Organigrama de CENARD: El Director, El Alto Consejo y La Secretaría General, de dirección a gestión." />
          </figure>
          <div className="organ-description">
            <p>El organigrama del <strong>CENARD Arbitraje</strong> muestra una estructura jerárquica clara y formal. En la cima se ubica <strong>El Director</strong> como <strong>Órgano Directivo</strong>, responsable de la conducción institucional y de definir las directrices generales. En el nivel intermedio está <strong>El Alto Consejo</strong>, <strong>Órgano Decisorio</strong> que analiza, delibera y adopta resoluciones clave. En la base se encuentra <strong>La Secretaría General</strong>, <strong>Órgano de Gestión</strong> encargado de ejecutar las políticas, coordinar la administración y asegurar el funcionamiento operativo del centro.</p>
          </div>
        </div>
      </section>

      <section className="organization-section council-gallery" aria-labelledby="management-title">
        <div id="direccion-secretaria" className="council-directory-heading organization-anchor">
          <div><Eyebrow>Dirección y gestión</Eyebrow><h2 id="management-title">Dirección y Secretaría General</h2></div>
        </div>
        <ManagementProposals />
      </section>

      <section className="organization-section council-gallery" aria-labelledby="council-title">
        <div id="alto-consejo" className="council-directory-heading organization-anchor">
          <div><Eyebrow>Integrantes</Eyebrow><h2 id="council-title">Alto Consejo</h2></div>
          <span className="council-count">{council.length} integrantes</span>
        </div>
        <div className="council-directory">
          {council.map((person, index) => (
            <InstitutionalProfile key={person.name} id={`council-name-${index}`} name={person.name} role="Alto Consejo · CENARD" image={person.image} specialties={councilSpecialties[index]} biography={<><p className="council-biography-label">Trayectoria y formación</p><p>{person.bio}</p></>} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function ServicePage({ jprd = false }: { jprd?: boolean }) {
  const service = jprd ? "JPRD" : "Arbitraje";
  const selected = docs.filter(
    (d) =>
      d.services.includes(service) && d.sourceGrouping.kind !== "historico",
  );
  return (
    <div className="container page-content">
      <div className="service-intro-grid">
        <div>
          <Eyebrow>
            {jprd ? "Prevención y resolución" : "Solución de controversias"}
          </Eyebrow>
          <h2>
            {jprd
              ? "Acompañar el contrato. Abordar las disputas."
              : "Una vía especializada para resolver controversias."}
          </h2>
          {jprd ? (
            <>
              <p>
                La Junta de Prevención y Resolución de Disputas es un órgano
                especializado que fomenta la prevención y resolución de
                conflictos que puedan presentarse durante la ejecución de
                contratos de obras y de suministro.
              </p>
              <p>
                La fuente institucional describe funciones de consulta sobre
                aspectos técnicos o contractuales y resolución de disputas en
                esos ámbitos.
              </p>
            </>
          ) : (
            <>
              <p>
                CENARD ofrece administración institucional de arbitrajes,
                designación de árbitros y asistencia administrativa durante el
                proceso.
              </p>
              <p>
                La información publicada comprende controversias civiles,
                comerciales y contractuales susceptibles de arbitraje, cuando
                las partes han acordado acudir a este mecanismo.
              </p>
            </>
          )}
        </div>
        <aside className="service-resource-box">
          <span className="eyebrow">RECURSOS DEL SERVICIO</span>
          <ArrowLink
            to={pathFor(
              jprd ? "nomina-de-adjudicadores" : "listado-de-arbitros",
            )}
          >
            Consultar nómina de {jprd ? "adjudicadores" : "árbitros"}
          </ArrowLink>
          {features.tariffCalculator && (
            <ArrowLink to={pathFor("calculadora")}>Consultar tarifas</ArrowLink>
          )}
          <ArrowLink to={pathFor(`atalaya-de-integridad/${jprd ? "jprd" : "arbitraje"}`)}>
            Atalaya de Integridad
          </ArrowLink>
          <ArrowLink to={pathFor("contacto")}>
            Orientación institucional
          </ArrowLink>
        </aside>
      </div>
      {jprd && (
        <details className="plain-details">
          <summary>
            Leer descripción normativa publicada
          </summary>
          <p>
            Según la descripción institucional, las funciones de la JPRD se
            enmarcan en el Reglamento de la Ley N.º 32069 y comprenden desde el
            inicio de ejecución del contrato hasta el pago o entrega final en
            suministros, o la recepción completa de obras, según corresponda.
          </p>
          <p>
            La fuente indica que también comprende controversias relacionadas
            con prestaciones adicionales autorizadas por la entidad, salvo
            excepciones legales, y que las resoluciones son de cumplimiento
            obligatorio e inmediato. Este texto requiere validación jurídica
            antes de publicación.
          </p>
        </details>
      )}
      {!jprd && (
        <section className="service-functions">
          <SectionHeading
            label="Administración institucional"
            title="Acompañamiento durante el proceso."
          />
          <div className="principles-grid">
            <article>
              <h3>Administración de arbitrajes</h3>
              <p>
                Administración integral de arbitrajes ad hoc o institucionales,
                supervisión del cumplimiento del reglamento, gestión del
                calendario y actos procesales, y custodia del expediente
                arbitral.
              </p>
            </article>
            <article>
              <h3>Designación de árbitros</h3>
              <p>
                Provisión de listas de profesionales, nombramiento según lo
                pactado o ante ausencia de acuerdo, y sustitución por
                impedimento, renuncia o recusación.
              </p>
            </article>
            <article>
              <h3>Asistencia administrativa</h3>
              <p>
                Apoyo en audiencias virtuales o presenciales, soporte
                secretarial, gestión de salas, actas, notificaciones, archivo y
                comunicaciones entre las partes y los árbitros.
              </p>
            </article>
          </div>
          <p className="caption">
            Alcance descrito en la información institucional de origen, sujeto a
            revisión editorial.
          </p>
        </section>
      )}
      <section className="service-documents">
        <SectionHeading
          label="Documentación del servicio"
          title="Normativa para consultar."
        >
          <ArrowLink to={pathFor("documentos") + `?servicio=${service}`}>
            Ver toda la normativa
          </ArrowLink>
        </SectionHeading>
        <p className="caption">
          Agrupación de origen: desde el 04/08/2025 · Aplicación por confirmar.
          Esta agrupación no establece la fecha de publicación individual de los
          archivos.
        </p>
        <div className="document-list">
          {selected.map((d) => (
            <DocumentRow
              key={d.id}
              title={d.title}
              services={d.services}
              subtitle={`${d.type} · ${sourceGroupingLabel(d)} · PDF`}
              href={d.urlPublic}
            />
          ))}
        </div>
        {!jprd && (
          <div className="archive-callout">
            <BookOpenText size={25} strokeWidth={1.3} aria-hidden="true" />
            <div>
              <h3>¿Buscas una versión anterior?</h3>
              <p>
                Conservamos el archivo histórico publicado hasta el 03 de agosto
                de 2025.
              </p>
            </div>
            <ArrowLink
              to={
                pathFor("documentos") + "?servicio=Arbitraje&estado=historico"
              }
            >
              Consultar históricos
            </ArrowLink>
          </div>
        )}
      </section>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="contact-resource-page">
      <ResourceHeader
        label="Atención"
        title="Contacto"
        description="Encuentra nuestros canales de atención y la ubicación de la sede."
      />
      <div className="container contact-resource-content">
        <section className="contact-resource-channels" aria-labelledby="contact-channels-title">
          <div className="contact-resource-intro">
            <Eyebrow>Atención institucional</Eyebrow>
            <h2 id="contact-channels-title">Conversemos.</h2>
            <p>
              Para consultas sobre los servicios y recursos de CENARD,
              elige uno de nuestros canales de atención.
            </p>
          </div>
          <div className="contact-resource-channel-list">
            <a className="contact-resource-whatsapp" href={site.whatsapp} target="_blank" rel="noopener noreferrer">
              <UsersRound size={24} strokeWidth={1.3} aria-hidden="true" />
              <span>
                <span className="contact-resource-channel-label">WhatsApp</span>
                <strong>{site.phone}</strong>
                <span className="contact-resource-channel-action">Escribir por WhatsApp</span>
                <span className="sr-only"> (se abre en otra pestaña)</span>
              </span>
            </a>
            <a href={site.phoneHref}>
              <Phone size={24} strokeWidth={1.3} aria-hidden="true" />
              <span>
                <span className="contact-resource-channel-label">Atención telefónica</span>
                <strong>{site.phone}</strong>
                <span className="contact-resource-channel-action">Llamar a CENARD</span>
              </span>
            </a>
            {site.emails.map((email, i) => (
              <a key={email} href={`mailto:${email}`}>
                <Mail size={24} strokeWidth={1.3} aria-hidden="true" />
                <span>
                  <span className="contact-resource-channel-label">
                    {i ? "Secretaría General" : "Correspondencia institucional"}
                  </span>
                  <strong>{email}</strong>
                  <span className="contact-resource-channel-action">Escribir un correo</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="contact-resource-location" aria-labelledby="contact-location-title">
          <div className="contact-resource-location-info">
            <Eyebrow>Sede central</Eyebrow>
            <h2 id="contact-location-title">Encuéntranos</h2>
            <address>
              <span>{contactLocation.street}</span>
              <span>{contactLocation.district}</span>
              <span>{contactLocation.office}</span>
            </address>
            <div className="contact-resource-hours">
              <h3>Horario de atención</h3>
              <p>{site.hours}</p>
            </div>
            <a className="contact-resource-map-link" href={contactLocation.externalUrl} target="_blank" rel="noopener noreferrer">
              Abrir en Google Maps
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
            <p className="contact-resource-location-note">
              Dirección, horario y canales reproducidos del sitio institucional.
              Datos pendientes de confirmación antes de publicar.
            </p>
            <p className="contact-resource-location-note">
              Mapa basado en la dirección del edificio, sin verificación de una ficha
              oficial de CENARD. La posición exacta del marcador está pendiente de confirmación.
            </p>
          </div>
          <div className="contact-resource-map">
            <iframe
              src={contactLocation.embedUrl}
              title="Google Maps: búsqueda de Av. del Ejército 1180, Magdalena del Mar, Lima"
              width="800"
              height="400"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </section>

        <section id="reclamaciones" className="contact-resource-claims" aria-labelledby="reclamaciones-titulo">
          <Eyebrow>Recurso público</Eyebrow>
          <h2 id="reclamaciones-titulo" tabIndex={-1}>Libro de Reclamaciones</h2>
          <p>
            Formato público disponible para descarga. Las instrucciones de
            presentación, los plazos y los canales de recepción están pendientes
            de confirmación de CENARD.
          </p>
          <a className="contact-resource-claims-link" href={site.claimsForm}>
            Descargar libro de reclamaciones 
          </a>
        </section>
      </div>
    </div>
  );
}
