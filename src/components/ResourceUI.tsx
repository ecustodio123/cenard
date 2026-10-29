import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Eyebrow } from "./UI";
import "./resource-ui.css";

// Compositional visual pieces: content, filtering and row rendering stay with each page.
export function ResourceHeader({ label, title, description }: { label: string; title: string; description: string }) {
  return <section className="resource-header"><div className="container"><Eyebrow>{label}</Eyebrow><h1 tabIndex={-1}>{title}</h1><p>{description}</p></div></section>;
}
export function ResourceFilterPanel({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <section id={id} tabIndex={-1} className="resource-filter-panel" aria-label={label}>{children}</section>;
}
export function ResourceResults({ count, label, description, note }: { count: number; label: string; description: string; note?: string }) {
  return <div className="resource-results"><div><p className="resource-count" role="status" aria-live="polite" aria-atomic="true"><strong>{count}</strong> {label}</p><p>{description}</p></div>{note && <span className="resource-results-note">{note}</span>}</div>;
}
interface Criterion { key: string; label: string; value: string; remove: string }
export function ResourceCriteria({ criteria, onRemove }: { criteria: Criterion[]; onRemove: (key: string) => void }) {
  if (!criteria.length) return null;
  return <div className="resource-criteria" aria-label="Criterios activos">{criteria.map(filter => <button key={filter.key} aria-label={filter.remove} onClick={() => onRemove(filter.key)}><span>{filter.label}: {filter.value}</span><X size={14} aria-hidden="true" /></button>)}</div>;
}
export function ResourceGroupHeading({ id, title, countLabel }: { id: string; title: string; countLabel: string }) {
  return <div className="resource-group-heading"><h2 id={id} tabIndex={-1}>{title}</h2><span>{countLabel}</span></div>;
}
export function ResourceEmpty({ icon, title, message, action }: { icon: ReactNode; title: string; message: string; action: ReactNode }) {
  return <div className="resource-empty">{icon}<h2>{title}</h2><p>{message}</p>{action}</div>;
}
export function ResourceRelated({ id, children }: { id: string; children: ReactNode }) {
  return <section className="resource-related" aria-labelledby={id}><div className="resource-related-heading"><Eyebrow>Otros recursos</Eyebrow><h2 id={id}>Recursos relacionados</h2></div><div className="resource-related-grid">{children}</div></section>;
}
