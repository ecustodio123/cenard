import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { Search, UsersRound } from "lucide-react";
import { Combobox } from "../components/Combobox";
import { HighlightedText } from "../components/HighlightedText";
import { ResourceHeader, ResourceFilterPanel, ResourceResults, ResourceCriteria, ResourceEmpty } from "../components/ResourceUI";
import { useQuery } from "@tanstack/react-query";
import { fetchVisibleArbitrators } from "../lib/api/public-arbitrators";
import { publicArbitratorFacets, publicArbitratorResults } from "../lib/public-arbitrators";
import { documents } from "../data/documents";
import { pathFor, site } from "../data/site";
import { normalize } from "../lib/search";
import { DirectoryPagination } from "../components/DirectoryPagination";
import { useDirectoryMobile } from "../lib/use-directory-mobile";
import { useHydrated } from "../lib/use-hydrated";
import "./arbitrators.css";

const keys = ["q", "grupo", "profesion", "inicial", "pagina"];
const directive = documents.find(document => document.id === "directiva-01-arbitraje")!;
const displaySpecialty = (value: string | null) =>
  (value ?? "").replace(/\p{L}/u, letter => letter.toLocaleUpperCase("es")) || "—";

export function ArbitratorsPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const hydrated = useHydrated();
  const mobile = useDirectoryMobile();
  const directory = useQuery({ queryKey: ["public", "nomina_arbitros"], queryFn: ({ signal }) => fetchVisibleArbitrators(signal), enabled: hydrated, retry: false });
  const all = directory.data ?? [];
  const { groups, professions, letters } = publicArbitratorFacets(all);
  const ready = hydrated && directory.isSuccess;
  const loading = !hydrated || directory.isPending;
  const read = (key: string) => hydrated ? params.get(key) ?? "" : "";
  const query = read("q"), group = read("grupo"), profession = read("profesion"), letter = normalize(read("inicial")).toUpperCase();
  const rawPage = read("pagina");
  const result = publicArbitratorResults(all, { query, group, profession, letter }, rawPage);
  const focusOnPageChange = useRef(false);
  const resultsHeading = useRef<HTMLDivElement>(null);
  const restricted = Boolean(query || group || profession || letter || result.page > 1);

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
    if (!ready || !rawPage || rawPage === String(result.page)) return;
    const next = new URLSearchParams(params);
    next.set("pagina", String(result.page));
    navigate({ search: next.toString(), hash }, { replace: true, preventScrollReset: true });
  }, [ready, rawPage, result.page, params, navigate, hash]);
  useEffect(() => {
    if (!ready || !focusOnPageChange.current) return;
    focusOnPageChange.current = false;
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({ block: "start" });
  }, [ready, result.page]);

  const criteria = [
    { key: "q", label: "Búsqueda", value: query, remove: "Quitar búsqueda" },
    { key: "grupo", label: "Grupo", value: group, remove: "Quitar filtro de grupo" },
    { key: "profesion", label: "Profesión", value: profession, remove: "Quitar filtro de profesión" },
    { key: "inicial", label: "Inicial", value: letter, remove: "Quitar filtro de inicial" },
  ].filter(criterion => criterion.value);

  return <div className="arb-directory">
    <ResourceHeader label="Recursos institucionales" title="Nómina de árbitros" description="Consulta los registros publicados por CENARD en sus nóminas nacionales y de contratación pública.">
    </ResourceHeader>
    <div className="container arb-content">
      <ResourceFilterPanel id="filtros-arbitros" label="Búsqueda y filtros de la nómina de árbitros">
        <div className="arb-search-heading"><label htmlFor="arb-search">Buscar por nombre o apellido</label>{query && <button className="arb-text-action" onClick={() => update("q", "")}>Borrar búsqueda</button>}</div>
        <div className="arb-search-input"><Search size={21} strokeWidth={1.5} aria-hidden="true" /><input id="arb-search" type="search" disabled={!ready} value={query} placeholder="Escribe el nombre o apellido del profesional" onChange={event => update("q", event.target.value, true)} /></div>
        <div className="arb-filters">
          <fieldset className="arb-groups"><legend>Grupo</legend><div>{[{ value: "", label: "Todos" }, ...groups.map(value => ({ value, label: value }))].map(option => <button key={option.label} disabled={!ready} aria-pressed={group === option.value} onClick={() => update("grupo", option.value)}>{option.label}</button>)}</div></fieldset>
          <Combobox disabled={!ready} label="Profesión publicada" value={profession} onValueChange={value => update("profesion", value)} options={[{ value: "", label: "Todas las profesiones" }, ...professions.map(value => ({ value, label: value }))]} />
        </div>
        <div className="arb-panel-foot"><p>Los grupos reproducen las nóminas publicadas por CENARD.</p><button className="arb-text-action" onClick={reset} disabled={!ready || !restricted}>Restablecer filtros</button></div>
      </ResourceFilterPanel>
      <fieldset className="arb-alphabet"><legend>Filtrar por inicial del apellido</legend><div><button disabled={!ready} aria-pressed={!letter} onClick={() => update("inicial", "")}>Todas</button>{letters.map(initial => <button disabled={!ready} key={initial} aria-label={`Apellidos con ${initial}`} aria-pressed={letter === initial} onClick={() => update("inicial", initial)}>{initial}</button>)}</div></fieldset>
      <div id="resultados-arbitros" ref={resultsHeading} tabIndex={-1} role="region" aria-label="Resultados de la nómina" aria-describedby={ready && result.filtered.length ? "arb-showing-range" : undefined} aria-busy={loading}>
        {ready && <ResourceResults count={result.filtered.length} label={result.filtered.length === 1 ? "registro encontrado" : "registros encontrados"} description="Cada registro se muestra una sola vez y puede pertenecer a uno o ambos grupos." />}
        <ResourceCriteria criteria={criteria} onRemove={key => update(key, "")} />
      </div>
      {loading ? <div className="arb-load-state" role="status"><h2>Cargando nómina de árbitros</h2><p>Estamos consultando los registros visibles publicados por CENARD.</p></div>
      : directory.isError ? <div className="arb-load-state" role="alert"><h2>No pudimos cargar la nómina</h2><p>{directory.error.message}</p><button className="button button-secondary" type="button" onClick={() => { void directory.refetch(); }}>Reintentar consulta</button></div>
      : all.length === 0 ? <ResourceEmpty icon={<UsersRound size={30} strokeWidth={1.3} aria-hidden="true" />} title="No hay registros visibles" message="La nómina no contiene registros disponibles para consulta pública en este momento." action={<button className="button button-secondary" type="button" onClick={() => { void directory.refetch(); }}>Actualizar nómina</button>} />
      : result.filtered.length ? <>
        <div className="arb-directory-context"><p id="arb-showing-range">Mostrando {result.from}–{result.to} de {result.filtered.length} registros</p><p>— Información no consignada en el registro.</p></div>
        {mobile ? <div className="arb-record-cards">{result.items.map(person => <article key={person.id} data-record-id={person.id}>
          <h2><HighlightedText text={person.name} query={query} /></h2>
          <dl><div><dt>Grupo</dt><dd><span className="arb-group-tags">{person.groups.map(value => <span className="arb-group-tag" key={value}>{value}</span>)}</span></dd></div><div><dt>Profesión publicada</dt><dd>{person.profession || "—"}</dd></div><div><dt>Especialidad publicada</dt><dd>{displaySpecialty(person.specialty)}</dd></div><div><dt>Habilitaciones</dt><dd>{person.qualifications.length ? <ul className="arb-qualification-list">{person.qualifications.map(value => <li key={value}>{value}</li>)}</ul> : "—"}</dd></div></dl>
        </article>)}</div> : <div className="arb-table"><table><caption className="sr-only">Registros visibles de la nómina de árbitros de CENARD</caption><colgroup><col className="arb-col-name" /><col className="arb-col-profession" /><col className="arb-col-group" /><col className="arb-col-specialty" /><col className="arb-col-qualifications" /></colgroup><thead><tr><th scope="col">Apellidos y nombres</th><th scope="col">Profesión publicada</th><th scope="col">Grupo</th><th scope="col">Especialidad publicada</th><th scope="col">Habilitaciones</th></tr></thead><tbody>{result.items.map(person => <tr key={person.id} data-record-id={person.id}><th scope="row"><HighlightedText text={person.name} query={query} /></th><td>{person.profession || "—"}</td><td><span className="arb-group-tags">{person.groups.map(value => <span className="arb-group-tag" key={value}>{value}</span>)}</span></td><td>{displaySpecialty(person.specialty)}</td><td>{person.qualifications.length ? <ul className="arb-qualification-list">{person.qualifications.map(value => <li key={value}>{value}</li>)}</ul> : "—"}</td></tr>)}</tbody></table></div>}
        <DirectoryPagination page={result.page} pageCount={result.pageCount} from={result.from} to={result.to} total={result.filtered.length} compact={mobile} onPageChange={changePage} />
      </> : <ResourceEmpty icon={<UsersRound size={30} strokeWidth={1.3} aria-hidden="true" />} title="No encontramos registros con estos criterios" message="Prueba con otro nombre o elimina alguno de los filtros." action={<button className="button button-secondary" onClick={reset}>Restablecer filtros</button>} />}
      <section className="arb-membership" aria-labelledby="arb-membership-title"><div><h2 id="arb-membership-title">Incorporación y renovación</h2><p>Consulta las fichas y la directiva correspondiente en nuestra biblioteca documental.</p></div><div className="arb-membership-links"><Link to={pathFor("documentos") + "?servicio=Arbitraje&tipo=Ficha"}>Consultar fichas</Link><a href={directive.urlPublic} target="_blank" rel="noopener noreferrer">Consultar Directiva 01 de Arbitraje<span className="sr-only"> · PDF, abre en otra pestaña</span></a></div><p>Para información sobre incorporación, escribe a <a href={`mailto:${site.emails[0]}`}>{site.emails[0]}</a>.</p></section>
      <p className="arb-validation">La consulta muestra los registros visibles publicados por CENARD. Para información sobre incorporación y renovación, utiliza los recursos y el canal de atención indicados.</p>
    </div>
  </div>;
}
