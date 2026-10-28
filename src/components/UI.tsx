import {
  FileText,
  Info,
} from "lucide-react";
import { Link } from "react-router";
import type { ReactNode } from "react";

export function ArrowLink({
  to,
  children,
  className = "",
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link to={to} className={`text-link ${className}`}>
      {children}
    </Link>
  );
}
export function ButtonLink({
  to,
  children,
  secondary = false,
}: {
  to: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`button ${secondary ? "button-secondary" : ""}`} to={to}>
      {children}
    </Link>
  );
}
export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`text-link ${className}`}
      target="_blank"
      rel="noreferrer"
    >
      {children}
      <span className="sr-only"> (abre en otra pestaña)</span>
    </a>
  );
}
export function Eyebrow({
  children,
  light = false,
}: {
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}>
      <span />
      {children}
    </p>
  );
}
export function SectionHeading({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="section-heading">
      <div>
        <Eyebrow>{label}</Eyebrow>
        <h2>{title}</h2>
      </div>
      {children && <div className="heading-aside">{children}</div>}
    </div>
  );
}
export function InfoNote({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <aside className="info-note">
      <Info size={20} aria-hidden="true" />
      <div>
        {title && <strong>{title}</strong>}
        <div>{children}</div>
      </div>
    </aside>
  );
}
export function PageIntro({
  title,
  description,
  section,
}: {
  title: string;
  description: string;
  section: string;
}) {
  return (
    <section className="page-intro">
      <div className="container">
        <Eyebrow>{section}</Eyebrow>
        <h1 tabIndex={-1}>{title}</h1>
        <p className="lead">{description}</p>
      </div>
    </section>
  );
}
export function DocumentRow({
  title,
  subtitle,
  href,
  services = [],
}: {
  title: string;
  subtitle: string;
  href: string;
  services?: string[];
}) {
  return (
    <a className="document-row" href={href} target="_blank" rel="noreferrer">
      <span className="file-icon">
        <FileText size={23} aria-hidden="true" />
      </span>
      <span className="document-text">
        <span className="document-title">{title}</span>
        {services.length > 0 && (
          <span className="document-services">
            {services.map((service) => (
              <span className="tag" key={service}>
                {service}
              </span>
            ))}
          </span>
        )}
        <span className="document-subtitle">{subtitle}</span>
      </span>
      <span className="document-action">
        Ver PDF
      </span>
      <span className="sr-only"> (abre en otra pestaña)</span>
    </a>
  );
}
export function EmptyState({ reset }: { reset: () => void }) {
  return (
    <div className="empty-state">
      <FileText size={30} aria-hidden="true" />
      <h3>No encontramos resultados</h3>
      <p>Prueba con otro término o restablece los filtros.</p>
      <button className="button button-secondary" onClick={reset}>
        Restablecer filtros
      </button>
    </div>
  );
}
