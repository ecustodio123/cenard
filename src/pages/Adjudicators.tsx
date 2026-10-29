import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { Search, UsersRound } from "lucide-react";
import { Combobox } from "../components/Combobox";
import { HighlightedText } from "../components/HighlightedText";
import { ResourceHeader, ResourceFilterPanel, ResourceResults, ResourceCriteria, ResourceEmpty } from "../components/ResourceUI";
import professionals from "../data/professionals.json";
import { documents } from "../data/documents";
import { pathFor, site } from "../data/site";
import { normalize } from "../lib/search";
import { professionalResults } from "../lib/arbitrator-directory";
import { DirectoryPagination } from "../components/DirectoryPagination";
import { useDirectoryMobile } from "../lib/use-directory-mobile";
import { useHydrated } from "../lib/use-hydrated";
import "./arbitrators.css";
import "./adjudicators.css";

const all = professionals.filter(person => person.kind === "adjudicador");
const groups = [...new Set(all.map(person => person.group))];
const professions = [...new Set(all.map(person => person.profession).filter(Boolean))];
const letters = [...new Set(all.map(person => normalize(person.name[0]).toUpperCase()))].sort();
const keys = ["q", "profesion", "inicial", "pagina"];
const directive = documents.find(document => document.id === "directiva-01-jprd")!;

export function AdjudicatorsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const hydrated = useHydrated();
  const mobile = useDirectoryMobile();
  const read = (key: string) => hydrated ? params.get(key) ?? "" : "";
  const query = read("q"), profession = read("profesion"), letter = normalize(read("inicial")).toUpperCase();
  const rawPage = read("pagina");
  const result = professionalResults(all, { query, group: "", profession, letter }, rawPage, "adjudicador");
  const focusOnPageChange = useRef(false);
  const resultsHeading = useRef<HTMLDivElement>(null);
  const restricted = Boolean(query || profession || letter || result.page > 1);

  function write(next: URLSearchParams, replace = false) {
    navigate({ search: next.toString(), hash }, { replace, preventScrollReset: true });
  }
  function update(key: string, value: string, replace = false) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.delete("pagina");
    write(next, replace);
  }
  function reset() {
    const next = new URLSearchParams(params);
    keys.forEach(key => next.delete(key));
    write(next);
  }
  function changePage(page: number) {
    if (page < 1 || page > result.pageCount || page === result.page) return;
    const next = new URLSearchParams(params);
    next.set("pagina", String(page));
    focusOnPageChange.current = true;
    write(next);
  }
  useEffect(() => {
    if (!hydrated || !rawPage || rawPage === String(result.page)) return;
    const next = new URLSearchParams(params);
    next.set("pagina", String(result.page));
    navigate({ search: next.toString(), hash }, { replace: true, preventScrollReset: true });
  }, [hydrated, rawPage, result.page, params, navigate, hash]);
  useEffect(() => {
    if (!focusOnPageChange.current) return;
    focusOnPageChange.current = false;
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({ block: "start" });
  }, [result.page]);

  const criteria = [
    { key: "q", label: "Búsqueda", value: query, remove: "Quitar búsqueda" },
    { key: "profesion", label: "Profesión", value: profession, remove: "Quitar filtro de profesión" },
    { key: "inicial", label: "Inicial", value: letter, remove: "Quitar filtro de inicial" },
  ].filter(criterion => criterion.value);

  return <div className="arb-directory adj-directory">
    <ResourceHeader label="Recursos institucionales" title="Nómina de adjudicadores" description="Consulta los registros de adjudicadores publicados por CENARD, con sus profesiones y especialidades.">
      <span className="arb-period">Periodo publicado: 2025</span>
    </ResourceHeader>
    <div className="container arb-content">
      <ResourceFilterPanel id="filtros-adjudicadores" label="Búsqueda y filtros de la nómina de adjudicadores">
        <div className="arb-search-heading"><label htmlFor="adj-search">Buscar por nombre o apellido</label>{query && <button className="arb-text-action" onClick={() => update("q", "")}>Borrar búsqueda</button>}</div>
        <div className="arb-search-input"><Search size={21} strokeWidth={1.5} aria-hidden="true" /><input id="adj-search" type="search" value={query} placeholder="Escribe el nombre o apellido del profesional" onChange={event => update("q", event.target.value, true)} /></div>
        <div className="adj-filter-row">
          <Combobox label="Profesión publicada" value={profession} onValueChange={value => update("profesion", value)} options={[{ value: "", label: "Todas las profesiones" }, ...professions.map(value => ({ value, label: value }))]} />
          <button className="arb-text-action" onClick={reset} disabled={!restricted}>Restablecer filtros</button>
        </div>
      </ResourceFilterPanel>
      <fieldset className="arb-alphabet"><legend>Filtrar por inicial del apellido</legend><div><button aria-pressed={!letter} onClick={() => update("inicial", "")}>Todas</button>{letters.map(initial => <button key={initial} aria-label={`Apellidos con ${initial}`} aria-pressed={letter === initial} onClick={() => update("inicial", initial)}>{initial}</button>)}</div></fieldset>
      <div id="resultados-adjudicadores" ref={resultsHeading} tabIndex={-1} role="region" aria-label="Resultados de la nómina" aria-describedby={result.filtered.length ? "adj-showing-range" : undefined}>
        <ResourceResults count={result.filtered.length} label={result.filtered.length === 1 ? "registro encontrado" : "registros encontrados"} description={`Grupo publicado: ${groups.join(", ")}`} />
        <ResourceCriteria criteria={criteria} onRemove={key => update(key, "")} />
      </div>
      {result.filtered.length ? <>
        <div className="arb-directory-context"><p id="adj-showing-range">Mostrando {result.from}–{result.to} de {result.filtered.length} registros</p><p>— Información no publicada en el registro de origen.</p></div>
        {mobile ? <div className="arb-record-cards">{result.items.map(person => <article key={person.id} data-record-id={person.id}>
          <h2><HighlightedText text={person.name} query={query} /></h2>
          <dl><div><dt>Profesión publicada</dt><dd>{person.profession || "—"}</dd></div><div><dt>Especialidad publicada</dt><dd>{person.specialty || "—"}</dd></div></dl>
        </article>)}</div> : <div className="arb-table"><table><caption className="sr-only">Registros de la nómina de adjudicadores · Periodo publicado 2025</caption><colgroup><col className="arb-col-name" /><col className="arb-col-profession" /><col className="arb-col-specialty" /></colgroup><thead><tr><th scope="col">Apellidos y nombres</th><th scope="col">Profesión publicada</th><th scope="col">Especialidad publicada</th></tr></thead><tbody>{result.items.map(person => <tr key={person.id} data-record-id={person.id}><th scope="row"><HighlightedText text={person.name} query={query} /></th><td>{person.profession || "—"}</td><td>{person.specialty || "—"}</td></tr>)}</tbody></table></div>}
        <DirectoryPagination page={result.page} pageCount={result.pageCount} from={result.from} to={result.to} total={result.filtered.length} compact={mobile} onPageChange={changePage} hideSingle />
      </> : <ResourceEmpty icon={<UsersRound size={30} strokeWidth={1.3} aria-hidden="true" />} title="No encontramos registros con estos criterios" message="Prueba con otro nombre o elimina alguno de los filtros." action={<button className="button button-secondary" onClick={reset}>Restablecer filtros</button>} />}
      <section className="arb-membership" aria-labelledby="adj-membership-title"><div><h2 id="adj-membership-title">Incorporación y renovación</h2><p>Consulta las fichas y la directiva correspondiente en nuestra biblioteca documental.</p></div><div className="arb-membership-links"><Link to={pathFor("documentos") + "?servicio=JPRD&tipo=Ficha"}>Consultar fichas</Link><a href={directive.urlPublic} target="_blank" rel="noopener noreferrer">Consultar Directiva 01 de JPRD<span className="sr-only"> · PDF, abre en otra pestaña</span></a></div><p>Para información sobre incorporación, escribe a <a href={`mailto:${site.emails[0]}`}>{site.emails[0]}</a>.</p></section>
      <p className="arb-validation">Periodo publicado: 2025. Su vigencia actual está pendiente de confirmación de CENARD. Los datos ausentes se mantienen como no publicados en el registro de origen.</p>
    </div>
  </div>;
}
