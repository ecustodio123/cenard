import type { ReactNode } from "react";
import { ResourceHeader } from "../components/ResourceUI";
import "./integrity.css";
import {
  BookOpenText,
  Compass,
  ChevronDown,
  Mail,
  MapPin,
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
import secretary from "../data/secretary.json";
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
        <p className="management-role-context">Se conserva la denominación conjunta «{secretary.role}». La relación funcional con la «{secretary.technical.role}» está pendiente de confirmación institucional.</p>
        <div className="management-editorial">
            <div className="organization-management-grid">
              <div>
                <h3 className="organization-office-title">Dirección y Secretaría General</h3>
                <InstitutionalProfile id="director-name" name={secretary.name} role={secretary.role} image="/assets/team/angel-alcala-contreras.webp" subheading showDisclosure biography={<><p>{secretary.intro}</p>{secretary.sections.map((section) => <section className="institutional-bio-section" key={section.title}><h5>{section.title}</h5><p>{section.text}</p></section>)}</>} />
              </div>
              <div>
                <h3 className="organization-office-title">Secretaría arbitral / técnica</h3>
                <InstitutionalProfile id="secretary-name" name={secretary.technical.name} role={secretary.technical.role} image="/assets/team/angel-alcala-contreras.webp" placeholder subheading rolePreview showDisclosure description="La secretaría arbitral brinda apoyo al tribunal en la tramitación del arbitraje y facilita la coordinación de las actuaciones y comunicaciones del proceso." biography={<>
                  <p className="profile-role-sample">Funciones generales · texto provisional</p>
                  <p>Esta descripción sirve para visualizar el diseño. No es una biografía de Elizabeth ni una relación de funciones aprobada por CENARD.</p>
                  <section className="institutional-bio-section"><h5>Apoyo en la tramitación</h5><p>La secretaría arbitral asiste al tribunal en el desarrollo de las actuaciones del arbitraje y contribuye a su gestión administrativa.</p></section>
                  <section className="institutional-bio-section"><h5>Coordinación y comunicaciones</h5><p>De forma general, puede apoyar la organización de audiencias y mantener las comunicaciones entre las partes y el tribunal, según las reglas de la institución correspondiente.</p></section>
                </>} />
              </div>
            </div>
        </div>
        <p className="caption organization-profile-note">Contenido provisional: la fotografía del secretario general se repite provisionalmente en la tarjeta de Elizabeth. Su texto describe el rol de secretaría arbitral y está pendiente de validación institucional.</p>
        <a href={`mailto:${site.emails[1]}`} className="button button-secondary">Contactar a Secretaría</a>
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
          <ArrowLink to={pathFor("atalaya-de-integridad")}>
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

export function IntegrityPage() {
  return (
    <div className="integrity-resource-page">
      <ResourceHeader
        label="Integridad"
        title="Atalaya de Integridad"
        description="Consulta los laudos arbitrales publicados por CENARD y la disponibilidad de otras categorías de información institucional."
      />
      <div className="container integrity-resource-content">
        <section className="integrity-resource-primary" aria-labelledby="integrity-laudos-title">
          <div className="integrity-resource-copy">
            <p className="integrity-resource-label">Disponible para consulta</p>
            <h2 id="integrity-laudos-title">Laudos arbitrales</h2>
            <p className="integrity-resource-description">Accede a la carpeta pública de laudos arbitrales de CENARD.</p>
          </div>
          <div className="integrity-resource-access">
            <a
              className="button integrity-resource-action"
              href={site.laudos}
              target="_blank"
              rel="noopener noreferrer"
            >
              Consultar laudos
              <span className="sr-only"> (se abre en otra pestaña)</span>
            </a>
            <p className="integrity-resource-external-note">Carpeta pública en Google Drive · Se abre en otra pestaña.</p>
          </div>
        </section>
        <section className="integrity-resource-categories" aria-labelledby="integrity-categories-title">
          <h2 id="integrity-categories-title">Otras categorías de información</h2>
          <div className="integrity-resource-category-grid">
            {[
              { id: "integrity-centre-title", title: "Sanciones / Decisiones del Centro" },
              { id: "integrity-jprd-title", title: "Decisiones de JPRD" },
            ].map(category => (
              <article className="integrity-resource-category" key={category.id} aria-labelledby={category.id}>
                <h3 id={category.id}>{category.title}</h3>
                <p>Consulta no habilitada actualmente en esta web.</p>
                <p className="integrity-resource-status">No disponible por ahora</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="container page-content">
      <div className="contact-layout">
        <div>
          <Eyebrow>Atención institucional</Eyebrow>
          <h2>
            Estamos a un
            <br />
            mensaje de distancia.
          </h2>
          <p>
            Para consultas sobre los servicios y recursos de CENARD, elige uno
            de nuestros canales de atención.
          </p>
          <div className="contact-address">
            <MapPin size={25} strokeWidth={1.3} aria-hidden="true" />
            <div>
              <h3>Sede central</h3>
              <p>{site.address}</p>
              <p>{site.hours}</p>
            </div>
          </div>
          <p className="caption">
            Dirección, horario y canales reproducidos del sitio institucional.
            Datos pendientes de confirmación antes de publicar.
          </p>
        </div>
        <div className="contact-channels">
          {site.emails.map((email, i) => (
            <a key={email} href={`mailto:${email}`}>
              <Mail size={25} strokeWidth={1.2} aria-hidden="true" />
              <span>
                <span className="eyebrow">
                  {i ? "Secretaría General" : "Correspondencia institucional"}
                </span>
                <strong>{email}</strong>
                <small>Escribir un correo</small>
              </span>
            </a>
          ))}
          <a href={site.phoneHref}>
            <Phone size={25} strokeWidth={1.2} aria-hidden="true" />
            <span>
              <span className="eyebrow">Atención telefónica</span>
              <strong>{site.phone}</strong>
              <small>Llamar a CENARD</small>
            </span>
          </a>
          <a href={site.whatsapp} target="_blank" rel="noreferrer">
            <UsersRound size={25} strokeWidth={1.2} aria-hidden="true" />
            <span>
              <span className="eyebrow">WhatsApp</span>
              <strong>Conversemos por WhatsApp</strong>
              <small>Abrir conversación en una nueva pestaña</small>
            </span>
          </a>
        </div>
      </div>
      <section
        id="reclamaciones"
        className="related-information claims-section"
        aria-labelledby="reclamaciones-titulo"
      >
        <Eyebrow>Recurso público</Eyebrow>
        <h2 id="reclamaciones-titulo" tabIndex={-1}>
          Libro de Reclamaciones
        </h2>
        <p>
          Formato público disponible para descarga. Las instrucciones de
          presentación, los plazos y los canales de recepción están pendientes
          de confirmación de CENARD.
        </p>
        <a className="text-link" href={site.claimsForm}>
          Descargar formato de reclamaciones (DOCX)
        </a>
      </section>
    </div>
  );
}
