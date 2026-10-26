import {
  ArrowDown,
  ArrowUpRight,
  BookOpenText,
  Compass,
  Mail,
  MapPin,
  Phone,
  Scale,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import {
  ArrowLink,
  ButtonLink,
  DocumentRow,
  ExternalLink,
  Eyebrow,
  InfoNote,
  SectionHeading,
} from "../components/UI";
import { notice, pathFor, site } from "../data/site";
import council from "../data/council.json";
import secretary from "../data/secretary.json";
import faq from "../data/faq.json";
import docs from "../data/documents.json";

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
          <ButtonLink to={pathFor("arbitraje")}>Nuestros servicios</ButtonLink>
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
          <div className="principles-grid">
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
        <div className="link-rows">
          <ArrowLink to={pathFor("secretaria-general")}>
            Secretaría General y Director
          </ArrowLink>
          <ArrowLink to={pathFor("alto-consejo")}>Alto Consejo</ArrowLink>
          <ArrowLink to={pathFor("organigrama")}>
            Estructura institucional
          </ArrowLink>
        </div>
        <details className="plain-details">
          <summary>
            Comunicado sobre identidad institucional
            <ArrowDown size={18} aria-hidden="true" />
          </summary>
          {notice.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </details>
      </section>
    </>
  );
}

export function SecretaryPage() {
  return (
    <div className="container page-content">
      <InfoNote>
        Perfiles reproducidos de la fuente institucional. La vigencia de los
        cargos y las biografías requiere confirmación antes de publicar.
      </InfoNote>
      <div className="profile-feature">
        <div className="profile-monogram" aria-hidden="true">
          <span>AC</span>
          <span>CENARD / DIRECCIÓN</span>
        </div>
        <div>
          <Eyebrow>{secretary.role}</Eyebrow>
          <h2>{secretary.name}</h2>
          <p className="lead">{secretary.intro}</p>
          <div className="bio-sections">
            {secretary.sections.map((s) => (
              <section key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
      <article className="technical-profile">
        <UsersRound size={30} strokeWidth={1.2} aria-hidden="true" />
        <div>
          <Eyebrow>Equipo de secretaría</Eyebrow>
          <h2>{secretary.technical.name}</h2>
          <p>{secretary.technical.role}</p>
        </div>
        <a href={`mailto:${site.emails[1]}`} className="text-link">
          Contactar a Secretaría
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </article>
      <p className="caption">
        Se ha conservado una sola fuente de contenido para cada perfil. No se
        atribuyen retratos sin identificación verificable en la fuente.
      </p>
    </div>
  );
}

export function CouncilPage() {
  return (
    <div className="container page-content">
      <InfoNote title="Composición publicada por CENARD">
        Se conservan los cinco nombres y sus biografías de la fuente. La
        composición vigente y las fotografías requieren confirmación
        institucional.
      </InfoNote>
      <div className="council-grid">
        {council.map((p, i) => (
          <article className="council-card" key={p.name}>
            <div className="council-image">
              <img
                src={p.image}
                width="600"
                height="900"
                alt={p.name}
                loading="lazy"
              />
              <span>0{i + 1}</span>
            </div>
            <div className="council-info">
              <p className="eyebrow">ALTO CONSEJO</p>
              <h2>{p.name}</h2>
              <details>
                <summary>
                  Ver perfil profesional
                  <ArrowDown size={16} aria-hidden="true" />
                </summary>
                <p>{p.bio}</p>
              </details>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const structure = [
  {
    title: "El Director",
    type: "Órgano Directivo",
    text: "Responsable de la conducción institucional y de definir las directrices generales del centro.",
  },
  {
    title: "El Alto Consejo",
    type: "Órgano Decisorio",
    text: "Analiza, delibera y adopta resoluciones clave para la institución.",
  },
  {
    title: "La Secretaría General",
    type: "Órgano de Gestión",
    text: "Ejecuta las políticas, coordina la administración y asegura el funcionamiento operativo del centro.",
  },
];
export function OrganizationPage() {
  return (
    <div className="container page-content">
      <div className="organization-layout">
        <div>
          <Eyebrow>Gobierno institucional</Eyebrow>
          <h2>
            Dirección, decisión
            <br />y gestión.
          </h2>
          <p>
            Una estructura jerárquica que articula la conducción institucional
            con el funcionamiento del centro.
          </p>
          <p className="caption">
            Jerarquía y funciones según el organigrama publicado por CENARD.
          </p>
          <ArrowLink to={pathFor("secretaria-general")}>
            Conocer la dirección
          </ArrowLink>
        </div>
        <ol className="org-chart">
          {structure.map((p, i) => (
            <li key={p.title}>
              <span className="org-step">0{i + 1}</span>
              <div>
                <span className="eyebrow">{p.type}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function ServicePage({ jprd = false }: { jprd?: boolean }) {
  const service = jprd ? "JPRD" : "Arbitraje";
  const selected = docs.filter(
    (d) => d.service === service && !d.status.startsWith("Histórico"),
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
          <ArrowLink to={pathFor("servicio-de-arbitraje")}>
            Resolver preguntas frecuentes
          </ArrowLink>
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
          <ArrowLink to={pathFor("calculadora")}>Consultar tarifas</ArrowLink>
          <ArrowLink to={pathFor("atalaya-de-integridad")}>
            Atalaya de Integridad
          </ArrowLink>
          <ArrowLink to={pathFor("contacto")}>
            Orientación institucional
          </ArrowLink>
        </aside>
      </div>
      <InfoNote title="Información normativa por validar">
        Las referencias a la Directiva 4–2025–OECE–CD y al límite de 2000 UIT
        aparecen en la fuente de este servicio. Su alcance y aplicación actual
        deben ser confirmados por CENARD. Consulta los textos originales; esta
        preview no establece criterios jurídicos nuevos.
      </InfoNote>
      {jprd && (
        <details className="plain-details">
          <summary>
            Leer descripción normativa publicada
            <ArrowDown size={18} aria-hidden="true" />
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
          Documentos agrupados en la fuente desde el 04 de agosto de 2025.
          Vigencia actual pendiente de validación.
        </p>
        <div className="document-list">
          {selected.map((d) => (
            <DocumentRow
              key={d.id}
              title={d.title}
              subtitle={`${d.type} · ${service} · PDF`}
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

export function FaqPage() {
  return (
    <div className="container page-content faq-layout">
      <aside>
        <Eyebrow>Orientación institucional</Eyebrow>
        <h2>Información para dar el primer paso.</h2>
        <p>
          Estas respuestas recogen el contenido publicado por CENARD. Para una
          consulta específica, comunícate con Secretaría General.
        </p>
        <ArrowLink to={pathFor("contacto")}>Ver canales de atención</ArrowLink>
        <p className="caption">
          Base editorial sujeta a revisión institucional y jurídica antes de
          publicar.
        </p>
      </aside>
      <div className="faq-list">
        {faq.map((f, i) => (
          <details key={f.q}>
            <summary>
              <span className="faq-number">0{i + 1}</span>
              <span>{f.q}</span>
              <ArrowDown size={18} aria-hidden="true" />
            </summary>
            <div>
              <p>{f.a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export function IntegrityPage() {
  return (
    <div className="container page-content">
      <div className="integrity-lead">
        <ShieldCheck size={44} strokeWidth={1} aria-hidden="true" />
        <h2>
          Información pública.
          <br />
          Acceso transparente.
        </h2>
        <p>
          Consulta los recursos publicados por CENARD. Cada categoría muestra su
          disponibilidad, sin sustituir documentos ni anticipar decisiones.
        </p>
      </div>
      <div className="integrity-list">
        <article>
          <span>01</span>
          <div>
            <span className="tag">Recurso público</span>
            <h2>Laudos arbitrales</h2>
            <p>Carpeta pública de laudos enlazada por la institución.</p>
          </div>
          <ExternalLink href={site.laudos}>Consultar laudos</ExternalLink>
        </article>
        {["Sanciones / Decisiones del Centro", "Decisiones de JPRD"].map(
          (title, i) => (
            <article key={title}>
              <span>0{i + 2}</span>
              <div>
                <h2>{title}</h2>
                <p>
                  El sitio de origen no proporciona un destino de consulta para
                  esta categoría.
                </p>
              </div>
              <span className="unpublished">Contenido no publicado</span>
            </article>
          ),
        )}
      </div>
      <InfoNote>
        El estado de disponibilidad describe el acceso al recurso publicado y no
        implica afirmar la existencia o inexistencia de sanciones o decisiones.
      </InfoNote>
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
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          ))}
          <a href={site.phoneHref}>
            <Phone size={25} strokeWidth={1.2} aria-hidden="true" />
            <span>
              <span className="eyebrow">Atención telefónica</span>
              <strong>{site.phone}</strong>
              <small>Llamar a CENARD</small>
            </span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
          <a href={site.whatsapp} target="_blank" rel="noreferrer">
            <UsersRound size={25} strokeWidth={1.2} aria-hidden="true" />
            <span>
              <span className="eyebrow">WhatsApp</span>
              <strong>Conversemos por WhatsApp</strong>
              <small>Abrir conversación en una nueva pestaña</small>
            </span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
