import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  FileText,
  Info,
} from "lucide-react";
import { Link } from "react-router";
import type { ReactNode } from "react";
import { pathFor } from "../data/site";

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
      <ArrowRight size={18} aria-hidden="true" />
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
      <ArrowRight size={18} aria-hidden="true" />
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
      <ArrowUpRight size={18} aria-hidden="true" />
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
        <nav className="breadcrumbs" aria-label="Ruta de navegación">
          <Link to={pathFor()}>Inicio</Link>
          <span aria-hidden="true">/</span>
          <span>{section}</span>
        </nav>
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
}: {
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <a className="document-row" href={href} target="_blank" rel="noreferrer">
      <span className="file-icon">
        <FileText size={23} aria-hidden="true" />
      </span>
      <span className="document-text">
        <span className="document-title">{title}</span>
        <span className="document-subtitle">{subtitle}</span>
      </span>
      <span className="document-action">
        Ver PDF
        <ArrowUpRight size={18} aria-hidden="true" />
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
        <ArrowDown size={17} aria-hidden="true" />
      </button>
    </div>
  );
}
