import secretary from "../../data/secretary.json";
import { site } from "../../data/site";
import "./management-proposals.css";

const secretariatMembers = [secretary.technical];
const directorSummary = "Abogado egresado de la Pontificia Universidad Católica del Perú, con experiencia en el ámbito arbitral y corporativo.";

function DirectorProfile({ id }: { id: string }) {
  return <article className="management-director" aria-labelledby={`${id}-director-name`}>
    <div className="management-director-overview">
      <figure className="management-director-photo">
        <img src="/assets/team/angel-alcala-contreras.webp" width="853" height="1280" alt={secretary.name} loading="lazy" />
      </figure>
      <div className="management-director-copy">
        <p className="management-category">Dirección</p>
        <h3 id={`${id}-director-name`}>{secretary.name}</h3>
        <p className="management-published-role">{secretary.role}</p>
        <p className="management-director-summary">{directorSummary}</p>
      </div>
    </div>
    <details className="management-disclosure management-director-disclosure">
      <summary>
        <span className="management-disclosure-open">Ver perfil completo</span>
        <span className="management-disclosure-close">Cerrar perfil</span>
        <span className="sr-only"> de {secretary.name}</span>
      </summary>
      <div className="management-expanded-profile">
        <p>{secretary.intro}</p>
        {secretary.sections.map(section => <section key={section.title}>
          <h4>{section.title}</h4><p>{section.text}</p>
        </section>)}
      </div>
    </details>
  </article>;
}

function ProvisionalRoleDescription() {
  return <div className="management-role-description">
    <p className="management-provisional-label">Funciones generales · texto provisional</p>
    <p>Esta descripción sirve para visualizar el diseño. No es una biografía de Elizabeth ni una relación de funciones aprobada por CENARD.</p>
    <section><h5>Apoyo en la tramitación</h5><p>La secretaría arbitral asiste al tribunal en el desarrollo de las actuaciones del arbitraje y contribuye a su gestión administrativa.</p></section>
    <section><h5>Coordinación y comunicaciones</h5><p>De forma general, puede apoyar la organización de audiencias y mantener las comunicaciones entre las partes y el tribunal, según las reglas de la institución correspondiente.</p></section>
  </div>;
}

function SecretariatPanel({ id }: { id: string }) {
  return <section className="management-secretariat" aria-labelledby={`${id}-secretariat-title`}>
    <h3 id={`${id}-secretariat-title`}>Secretaría arbitral / técnica</h3>
    <div className="management-secretariat-list" data-multiple={secretariatMembers.length > 1}>
      {secretariatMembers.map((member, index) => <article className="management-secretariat-member" key={member.name} aria-labelledby={`${id}-secretary-${index}`}>
        <div className="management-secretariat-intro">
          <h4 id={`${id}-secretary-${index}`}>{member.name}</h4>
          <p className="management-secretariat-role">{member.role}</p>
          <p className="management-secretariat-description">Información profesional pendiente de aprobación institucional.</p>
        </div>
        <details className="management-disclosure management-role-disclosure">
          <summary>
            <span className="management-disclosure-open">Ver descripción provisional del rol</span>
            <span className="management-disclosure-close">Cerrar descripción provisional del rol</span>
            <span className="sr-only"> · {member.name}</span>
          </summary>
          <ProvisionalRoleDescription />
        </details>
      </article>)}
    </div>
  </section>;
}

export function ManagementProposals() {
  return <div className="management-selected">
    <div className="management-primary-layout">
      <DirectorProfile id="management-a" />
      <SecretariatPanel id="management-a" />
    </div>
    <p className="management-confirmation-note">Se conserva la denominación conjunta «{secretary.role}». La relación funcional con la «{secretary.technical.role}» y las descripciones están pendientes de confirmación institucional. El resumen profesional del director está pendiente de aprobación; el texto provisional de secretaría describe el rol y no es una biografía de Elizabeth.</p>
    <a href={`mailto:${site.emails[1]}`} className="button button-secondary">Contactar a Secretaría</a>
  </div>;
}
