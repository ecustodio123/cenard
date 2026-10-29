import { useSearchParams, Link } from "react-router";
import { Search, FileText, X } from "lucide-react";
import { Combobox } from "../components/Combobox";
import { Eyebrow } from "../components/UI";
import { documents } from "../data/documents";
import { pathFor, site } from "../data/site";
import { filterDocuments } from "../lib/document-search";
import { useHydrated } from "../lib/use-hydrated";
import "./documents.css";

const groups = [
  { historical: false, title: "Agrupación desde el 04/08/2025" },
  { historical: true, title: "Archivo histórico hasta el 03/08/2025" },
];
const filterKeys = ["q", "servicio", "tipo", "estado"];

export function DocumentsPage() {
  const [params, setParams] = useSearchParams();
  const hydrated = useHydrated();
  const query = hydrated ? params.get("q") ?? "" : "";
  const service = hydrated ? params.get("servicio") ?? "" : "";
  const type = hydrated ? params.get("tipo") ?? "" : "";
  const status = hydrated ? params.get("estado") ?? "" : "";
  const filtered = filterDocuments(documents, { query, service, type, status });
  const restricted = Boolean(query || service || type || status);
  function update(key: string, value: string, replace = false) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace, preventScrollReset: true });
  }
  function reset() {
    const next = new URLSearchParams(params);
    filterKeys.forEach(key => next.delete(key));
    setParams(next, { preventScrollReset: true });
  }
  const active = [
    { key: "servicio", label: "Servicio", value: service, remove: "Quitar filtro de servicio" },
    { key: "tipo", label: "Tipo", value: type, remove: "Quitar filtro de tipo" },
    { key: "estado", label: "Agrupación", value: status ? (status === "historico" ? "Histórico" : "Desde el 04/08/2025") : "", remove: "Quitar filtro de agrupación" },
    { key: "q", label: "Búsqueda", value: query, remove: "Quitar búsqueda" },
  ].filter(filter => filter.value);
  return (
    <div className="doclib-page">
      <section className="doclib-hero">
        <div className="container">
          <Eyebrow>Recursos institucionales</Eyebrow>
          <h1 tabIndex={-1}>Normativa y documentos</h1>
          <p>Consulta reglamentos, directivas, códigos de ética y fichas de Arbitraje y JPRD.</p>
        </div>
      </section>
      <div className="container doclib-content">
        <section className="doclib-panel" aria-label="Búsqueda y filtros documentales">
          <div className="doclib-search-heading"><label htmlFor="doclib-search">Buscar documentos</label>{query && <button className="doclib-text-action" onClick={() => update("q", "")}>Borrar búsqueda</button>}</div>
          <div className="doclib-search-input"><Search size={21} strokeWidth={1.5} aria-hidden="true" /><input id="doclib-search" type="search" placeholder="Buscar por título, tipo o servicio" value={query} onChange={e => update("q", e.target.value, true)} /></div>
          <div className="doclib-filters">
            <fieldset className="doclib-service"><legend>Servicio</legend><div>{[{ label: "Todos", value: "" }, { label: "Arbitraje", value: "Arbitraje" }, { label: "JPRD", value: "JPRD" }].map(option => <button key={option.label} aria-pressed={service === option.value} onClick={() => update("servicio", option.value)}>{option.label}</button>)}</div></fieldset>
            <Combobox className="doclib-select" label="Tipo de documento" value={type} onValueChange={value => update("tipo", value)} options={[{ value: "", label: "Todos los tipos" }, ...[...new Set(documents.map(doc => doc.type))].map(value => ({ value, label: value }))]} />
            <Combobox className="doclib-select" label="Agrupación de origen" value={status} onValueChange={value => update("estado", value)} options={[{ value: "", label: "Todas las agrupaciones" }, { value: "reciente", label: "Desde el 04/08/2025" }, { value: "historico", label: "Histórico hasta el 03/08/2025" }]} />
          </div>
          <div className="doclib-panel-foot"><p>Las fechas corresponden a la agrupación de la fuente; no acreditan vigencia.</p><button className="doclib-text-action" onClick={reset} disabled={!restricted}>Restablecer filtros</button></div>
        </section>
        <div className="doclib-result-heading"><div><p className="doclib-count" role="status" aria-live="polite" aria-atomic="true"><strong>{filtered.length}</strong> {filtered.length === 1 ? "documento encontrado" : "documentos encontrados"}</p><p>Los documentos compartidos aparecen una sola vez.</p></div><span className="doclib-pdf-note">Los PDF abren en otra pestaña.</span></div>
        {active.length > 0 && <div className="doclib-active" aria-label="Criterios activos">{active.map(filter => <button key={filter.key} aria-label={filter.remove} onClick={() => update(filter.key, "")}><span>{filter.label}: {filter.value}</span><X size={14} aria-hidden="true" /></button>)}</div>}
        <div className="doclib-catalogue">
          {groups.map(group => {
            const matches = filtered.filter(doc => (doc.sourceGrouping.kind === "historico") === group.historical);
            if (!matches.length) return null;
            return <section className="doclib-group" key={group.title} aria-label={group.title}>
              <div className="doclib-group-heading"><h2>{group.title}</h2><span>{matches.length} {matches.length === 1 ? "documento" : "documentos"}</span></div>
              <div className="doclib-rows">{matches.map(doc => <a className="doclib-row" key={doc.id} href={doc.urlPublic} target="_blank" rel="noopener noreferrer">
                <span className="doclib-file"><FileText size={23} strokeWidth={1.3} aria-hidden="true" /></span>
                <span className="doclib-document-copy"><span className="doclib-document-title">{doc.title}</span><span className="doclib-document-meta"><span className="doclib-services">{doc.services.map(associated => <span key={associated}>{associated}</span>)}</span><span>{doc.type} · PDF</span></span>{doc.validationStatus !== "Aplicación por confirmar" && <span className="doclib-observation">{doc.validationStatus}</span>}</span>
                <span className="doclib-open">Ver PDF<span className="sr-only"> · abre en otra pestaña</span></span>
              </a>)}</div>
            </section>;
          })}
          {!filtered.length && <div className="doclib-empty"><FileText size={30} strokeWidth={1.3} aria-hidden="true" /><h2>No encontramos documentos con estos criterios</h2><p>Prueba con otro término o elimina alguno de los filtros.</p><button className="button button-secondary" onClick={reset}>Restablecer filtros</button></div>}
        </div>
        <aside className="doclib-source"><h2>Sobre las fuentes y la vigencia</h2><p>Los documentos conservan sus enlaces públicos originales. Las agrupaciones reproducen la organización de la fuente y no acreditan la vigencia de cada archivo.</p><p className="doclib-pending">Pendiente de validación de CENARD: vigencia, versión y aplicación de cada documento.</p></aside>
        <section className="doclib-related" aria-labelledby="doclib-related-title"><div className="doclib-related-heading"><Eyebrow>Otros recursos</Eyebrow><h2 id="doclib-related-title">Recursos relacionados</h2></div><div className="doclib-related-grid"><article><h3>Certificaciones y constancias</h3><p>Consulta los documentos de certificación y autorización institucional.</p><Link to={pathFor("certificaciones")}>Consultar certificaciones</Link></article><article><h3>Formato de reclamaciones</h3><p>Descarga el formato público de libro de reclamaciones.</p><a href={site.claimsForm}>Libro de Reclamaciones</a></article></div></section>
      </div>
    </div>
  );
}
