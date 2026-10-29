import { Link, NavLink } from "react-router";
import { ResourceHeader } from "../components/ResourceUI";
import { integrityPath, integrityServiceOrder, integrityServices } from "../data/integrity";
import type { IntegrityService } from "../data/integrity";
import "./integrity.css";

export function IntegrityPage({ service }: { service?: IntegrityService }) {
  const config = service ? integrityServices[service] : null;
  return <div className="integrity-resource-page">
    <ResourceHeader
      label={config ? `Integridad · ${config.label}` : "Integridad"}
      title="Atalaya de Integridad"
      description={config?.description ?? "Selecciona el servicio para consultar sus categorías de información."}
    >
      {service && <nav className="integrity-context-nav" aria-label="Servicio de Atalaya de Integridad">
        {integrityServiceOrder.map(context => <NavLink key={context} to={integrityPath(context)} end>{integrityServices[context].label}</NavLink>)}
      </nav>}
    </ResourceHeader>
    <div className="container integrity-resource-content">
      {service && config ? <div className={`integrity-service-categories integrity-service-${service}`}>
        {config.categories.map(category => category.available ? (
          <section className="integrity-resource-primary" key={category.id} aria-labelledby={`integrity-${service}-${category.id}-title`}>
            <div className="integrity-resource-copy">
              <p className="integrity-resource-label">Disponible para consulta</p>
              <h2 id={`integrity-${service}-${category.id}-title`}>{category.title}</h2>
              <p className="integrity-resource-description">{category.description}</p>
            </div>
            <div className="integrity-resource-access">
              <a className="button integrity-resource-action" href={category.href} target="_blank" rel="noopener noreferrer">
                {category.action}<span className="sr-only"> (se abre en otra pestaña)</span>
              </a>
              <p className="integrity-resource-external-note">{category.externalNote}</p>
            </div>
          </section>
        ) : (
          <article className="integrity-resource-category" key={category.id} aria-labelledby={`integrity-${service}-${category.id}-title`}>
            <h2 id={`integrity-${service}-${category.id}-title`}>{category.title}</h2>
            <p>Consulta no habilitada actualmente en esta web.</p>
            <p className="integrity-resource-status">No disponible por ahora</p>
          </article>
        ))}
      </div> : <div className="integrity-entry-grid">
        {integrityServiceOrder.map(context => <Link className="integrity-entry-card" key={context} to={integrityPath(context)}>
          <h2>{integrityServices[context].label}</h2>
          <p>{integrityServices[context].selectionDescription}</p>
          <span className="integrity-entry-action">Consultar {integrityServices[context].label}</span>
        </Link>)}
      </div>}
    </div>
  </div>;
}
