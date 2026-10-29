import { useSearchParams, useNavigate, useLocation, Link } from "react-router";
import { Search, FileText } from "lucide-react";
import { Combobox } from "../components/Combobox";
import { HighlightedText } from "../components/HighlightedText";
import { ResourceHeader, ResourceFilterPanel, ResourceResults, ResourceCriteria,
  ResourceGroupHeading, ResourceEmpty, ResourceRelated } from "../components/ResourceUI";
import { documents } from "../data/documents";
import { pathFor, site } from "../data/site";
import { filterDocuments } from "../lib/document-search";
import { useHydrated } from "../lib/use-hydrated";
import "./documents.css";

const groups = [
  { id: "documentos-desde-2025", navigation: "Desde el 04/08/2025", historical: false, title: "Agrupación desde el 04/08/2025" },
  { id: "documentos-historicos", navigation: "Archivo histórico", historical: true, title: "Archivo histórico hasta el 03/08/2025" },
];
const filterKeys = ["q", "servicio", "tipo", "estado"];

export function DocumentsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { hash } = useLocation();
  function writeParams(next: URLSearchParams, replace = false) {
    navigate({ search: next.toString(), hash }, { replace, preventScrollReset: true });
  }
  const hydrated = useHydrated();
  const query = hydrated ? params.get("q") ?? "" : "";
  const service = hydrated ? params.get("servicio") ?? "" : "";
  const type = hydrated ? params.get("tipo") ?? "" : "";
  const status = hydrated ? params.get("estado") ?? "" : "";
  const filtered = filterDocuments(documents, { query, service, type, status });
  const restricted = Boolean(query || service || type || status);
  const visibleGroups = groups.map(group => ({ ...group,
    matches: filtered.filter(doc => (doc.sourceGrouping.kind === "historico") === group.historical),
  })).filter(group => group.matches.length);
  function focusDestination(id: string) {
    document.getElementById(id)?.focus({ preventScroll: true });
  }
  function update(key: string, value: string, replace = false) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    writeParams(next, replace);
  }
  function reset() {
    const next = new URLSearchParams(params);
    filterKeys.forEach(key => next.delete(key));
    writeParams(next);
  }
  const active = [
    { key: "servicio", label: "Servicio", value: service, remove: "Quitar filtro de servicio" },
    { key: "tipo", label: "Tipo", value: type, remove: "Quitar filtro de tipo" },
    { key: "estado", label: "Agrupación", value: status ? (status === "historico" ? "Histórico" : "Desde el 04/08/2025") : "", remove: "Quitar filtro de agrupación" },
    { key: "q", label: "Búsqueda", value: query, remove: "Quitar búsqueda" },
  ].filter(filter => filter.value);
  return (
    <div className="doclib-page">
      <ResourceHeader label="Recursos institucionales" title="Normativa y documentos" description="Consulta reglamentos, directivas, códigos de ética y fichas de Arbitraje y JPRD." />
      <div className="container doclib-content">
        <ResourceFilterPanel id="filtros-documentales" label="Búsqueda y filtros documentales">
          <div className="doclib-search-heading"><label htmlFor="doclib-search">Buscar documentos</label>{query && <button className="doclib-text-action" onClick={() => update("q", "")}>Borrar búsqueda</button>}</div>
          <div className="doclib-search-input"><Search size={21} strokeWidth={1.5} aria-hidden="true" /><input id="doclib-search" type="search" placeholder="Buscar por título, tipo o servicio" value={query} onChange={e => update("q", e.target.value, true)} /></div>
          <div className="doclib-filters">
            <fieldset className="doclib-service"><legend>Servicio</legend><div>{[{ label: "Todos", value: "" }, { label: "Arbitraje", value: "Arbitraje" }, { label: "JPRD", value: "JPRD" }].map(option => <button key={option.label} aria-pressed={service === option.value} onClick={() => update("servicio", option.value)}>{option.label}</button>)}</div></fieldset>
            <Combobox className="doclib-select" label="Tipo de documento" value={type} onValueChange={value => update("tipo", value)} options={[{ value: "", label: "Todos los tipos" }, ...[...new Set(documents.map(doc => doc.type))].map(value => ({ value, label: value }))]} />
            <Combobox className="doclib-select" label="Agrupación de origen" value={status} onValueChange={value => update("estado", value)} options={[{ value: "", label: "Todas las agrupaciones" }, { value: "reciente", label: "Desde el 04/08/2025" }, { value: "historico", label: "Histórico hasta el 03/08/2025" }]} />
          </div>
          <div className="doclib-panel-foot"><p>Las fechas corresponden a la agrupación de la fuente; no acreditan vigencia.</p><button className="doclib-text-action" onClick={reset} disabled={!restricted}>Restablecer filtros</button></div>
        </ResourceFilterPanel>
        <ResourceResults count={filtered.length} label={filtered.length === 1 ? "documento encontrado" : "documentos encontrados"} description="Los documentos compartidos aparecen una sola vez." note="Los PDF abren en otra pestaña." />
        <ResourceCriteria criteria={active} onRemove={key => update(key, "")} />
        {visibleGroups.length > 1 && <nav className="doclib-group-navigation" aria-label="Ir a una agrupación documental">
          {visibleGroups.map(group => <a key={group.id} href={`#${group.id}`} onClick={() => focusDestination(group.id)}>{group.navigation} · {group.matches.length}</a>)}
        </nav>}
        <div className="doclib-catalogue">
          {visibleGroups.map(group => <section className="doclib-group" key={group.id} aria-labelledby={group.id}>
              <ResourceGroupHeading id={group.id} title={group.title} countLabel={`${group.matches.length} ${group.matches.length === 1 ? "documento" : "documentos"}`} />
              <div className="doclib-rows">{group.matches.map(doc => <a className="doclib-row" key={doc.id} href={doc.urlPublic} target="_blank" rel="noopener noreferrer">
                <span className="doclib-file"><FileText size={23} strokeWidth={1.3} aria-hidden="true" /></span>
                <span className="doclib-document-copy"><span className="doclib-document-title"><HighlightedText text={doc.title} query={query} /></span><span className="doclib-document-meta"><span className="doclib-services">{doc.services.map(associated => <span key={associated}><HighlightedText text={associated} query={query} /></span>)}</span><span><HighlightedText text={doc.type} query={query} /> · PDF</span></span>{doc.validationStatus !== "Aplicación por confirmar" && <span className="doclib-observation">{doc.validationStatus}</span>}</span>
                <span className="doclib-open">Ver PDF<span className="sr-only"> · abre en otra pestaña</span></span>
              </a>)}</div>
            </section>)}
          {!filtered.length && <ResourceEmpty icon={<FileText size={30} strokeWidth={1.3} aria-hidden="true" />} title="No encontramos documentos con estos criterios" message="Prueba con otro término o elimina alguno de los filtros." action={<button className="button button-secondary" onClick={reset}>Restablecer filtros</button>} />}
        </div>
        {filtered.length > 0 && <a className="doclib-back-to-filters" href="#filtros-documentales" onClick={() => focusDestination("filtros-documentales")}>Volver a filtros</a>}

        <aside className="doclib-source"><h2>Sobre las fuentes y la vigencia</h2><p>Los documentos conservan sus enlaces públicos originales. Las agrupaciones reproducen la organización de la fuente y no acreditan la vigencia de cada archivo.</p><p className="doclib-pending">Pendiente de validación de CENARD: vigencia, versión y aplicación de cada documento.</p></aside>
        <ResourceRelated id="doclib-related-title">
          <article><h3>Certificaciones y constancias</h3><p>Consulta los documentos de certificación y autorización institucional.</p><Link to={pathFor("certificaciones")}>Consultar certificaciones</Link></article>
          <article><h3>Formato de reclamaciones</h3><p>Consulta el formato público de reclamaciones.</p><a href={site.claimsForm}>Obtener formato de reclamaciones · DOCX</a></article>
        </ResourceRelated>
      </div>
    </div>
  );
}
