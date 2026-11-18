import secretary from "../../data/secretary.json";
import { site } from "../../data/site";
import "./management-proposals.css";

const secretariatMembers = secretary.team;
const directorSummary = "Abogado titulado por la Pontificia Universidad Católica del Perú, con más de 25 años de experiencia profesional. Especialista en arbitraje, contratación pública y derecho administrativo, con trayectoria en la resolución de controversias y en la asesoría jurídica a entidades públicas y empresas privadas.";

function DirectorProfile({ id }: { id: string }) {
  return <article className="management-director" aria-labelledby={`${id}-director-name`}>
    <div className="management-director-overview">
      <figure className="management-director-photo">
        <img src="/assets/team/angel-alcala-contreras.webp" width="853" height="1280" alt={secretary.name} loading="lazy" />
      </figure>
      <div className="management-director-copy">
        <h3 id={`${id}-director-name`}>{secretary.name}</h3>
        <p className="management-published-role">{secretary.role}</p>
        <p className="management-director-summary">{directorSummary}</p>
      </div>
    </div>
    <details className="management-disclosure management-director-disclosure">
      <summary>
        <span className="management-disclosure-open">Ver perfil profesional</span>
        <span className="management-disclosure-close">Cerrar perfil</span>
        <span className="sr-only"> de {secretary.name}</span>
      </summary>
      <div className="management-expanded-profile">
        {secretary.sections.map(section => <section key={section.title}>
          <h4>{section.title}</h4><p>{section.text}</p>
        </section>)}
      </div>
    </details>
  </article>;
}

function SecretariatPanel({ id }: { id: string }) {
  return <section className="management-secretariat" aria-labelledby={`${id}-secretariat-title`}>
    <h3 id={`${id}-secretariat-title`}>Equipo de Secretaría Arbitral y Técnica</h3>
    <div className="management-secretariat-list" data-multiple={secretariatMembers.length > 1}>
      {secretariatMembers.map((member, index) => <article className="management-secretariat-member" key={member.name} aria-labelledby={`${id}-secretary-${index}`}>
        <div className="management-secretariat-intro">
          <h4 id={`${id}-secretary-${index}`}>{member.name}</h4>
          <p className="management-secretariat-role">{member.role}</p>
          <p className="management-secretariat-description">{member.description}</p>
        </div>
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
    <a href={`mailto:${site.emails[1]}`} className="button button-secondary">Contactar a Secretaría</a>
  </div>;
}
