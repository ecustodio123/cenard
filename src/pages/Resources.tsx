import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import {
  ArrowUpRight,
  Check,
  FileCheck2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  DocumentRow,
  EmptyState,
  ExternalLink,
  InfoNote,
} from "../components/UI";
import docs from "../data/documents.json";
import professionals from "../data/professionals.json";
import certificates from "../data/certifications.json";
import { pathFor, site } from "../data/site";
import { Link } from "react-router";

import { normalize } from "../lib/search";
import { useHydrated } from "../lib/use-hydrated";

export function DocumentsPage() {
  const [params, setParams] = useSearchParams();
  const hydrated = useHydrated();
  const query = hydrated ? (params.get("q") ?? "") : "",
    service = hydrated ? (params.get("servicio") ?? "") : "",
    type = hydrated ? (params.get("tipo") ?? "") : "",
    status = hydrated ? (params.get("estado") ?? "") : "";
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true, preventScrollReset: true });
  }
  const filtered = docs.filter(
    (d) =>
      normalize(d.title).includes(normalize(query)) &&
      (!service || d.service === service) &&
      (!type || d.type === type) &&
      (!status ||
        (status === "historico"
          ? d.status.startsWith("Histórico")
          : !d.status.startsWith("Histórico"))),
  );
  return (
    <div className="container page-content">
      <InfoNote title="Consulta con contexto">
        Las agrupaciones temporales reproducen lo publicado por CENARD. La
        vigencia y versión de cada documento requieren confirmación
        institucional.
      </InfoNote>
      <div className="filter-panel">
        <label className="search-field">
          <span>Buscar un documento</span>
          <div>
            <Search size={20} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => update("q", e.target.value)}
              placeholder="Reglamento, directiva, código de ética…"
            />
          </div>
        </label>
        <div className="filter-row">
          <label>
            Servicio
            <select
              value={service}
              onChange={(e) => update("servicio", e.target.value)}
            >
              <option value="">Todos los servicios</option>
              <option>Arbitraje</option>
              <option>JPRD</option>
            </select>
          </label>
          <label>
            Tipo de documento
            <select
              value={type}
              onChange={(e) => update("tipo", e.target.value)}
            >
              <option value="">Todos los tipos</option>
              {[...new Set(docs.map((d) => d.type))].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Contexto de publicación
            <select
              value={status}
              onChange={(e) => update("estado", e.target.value)}
            >
              <option value="">Todos los documentos</option>
              <option value="reciente">
                Desde el 04/08/2025 · Por validar
              </option>
              <option value="historico">Archivo histórico de la fuente</option>
            </select>
          </label>
          <button className="reset-button" onClick={() => setParams({})}>
            <X size={16} aria-hidden="true" />
            Restablecer
          </button>
        </div>
      </div>
      <div className="results-header">
        <p role="status">
          <strong>{filtered.length}</strong> documentos encontrados
        </p>
        <span>
          <SlidersHorizontal size={15} aria-hidden="true" />
          Biblioteca institucional
        </span>
      </div>
      <div className="document-list">
        {filtered.map((d) => (
          <DocumentRow
            key={d.id}
            href={d.urlPublic}
            title={d.title}
            subtitle={`${d.service} · ${d.type} · ${d.context} · PDF`}
          />
        ))}
      </div>
      {!filtered.length && <EmptyState reset={() => setParams({})} />}
      <p className="caption source-caption">
        Se conservan los archivos en sus URLs públicas originales. Las
        directivas de Arbitraje y JPRD se muestran como referencias separadas.
      </p>
    </div>
  );
}

export function ProfessionalsPage({
  kind,
}: {
  kind: "arbitro" | "adjudicador";
}) {
  const [query, setQuery] = useState(""),
    [group, setGroup] = useState(""),
    [profession, setProfession] = useState(""),
    [letter, setLetter] = useState("");
  const all = useMemo(
    () => professionals.filter((p) => p.kind === kind),
    [kind],
  );
  const reset = () => {
    setQuery("");
    setGroup("");
    setProfession("");
    setLetter("");
  };
  const filtered = all
    .filter(
      (p) =>
        normalize(p.name).includes(normalize(query)) &&
        (!group || p.group === group) &&
        (!profession || p.profession === profession) &&
        (!letter || normalize(p.name).startsWith(normalize(letter))),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
  const letters = [
    ...new Set(all.map((p) => normalize(p.name[0]).toUpperCase())),
  ].sort();
  return (
    <div className="container page-content">
      <InfoNote title="Periodo publicado: 2025">
        Esta nómina conserva el periodo indicado en la fuente. Su vigencia
        actual está pendiente de confirmación; no se presenta como nómina
        vigente de 2026.
      </InfoNote>
      <div className="filter-panel">
        <label className="search-field">
          <span>Buscar por nombre o apellido</span>
          <div>
            <Search size={20} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe el nombre del profesional…"
            />
          </div>
        </label>
        <div className="filter-row">
          <label>
            Grupo
            <select value={group} onChange={(e) => setGroup(e.target.value)}>
              <option value="">Todos los grupos</option>
              {[...new Set(all.map((p) => p.group))].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label>
            Profesión publicada
            <select
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
            >
              <option value="">Todas las profesiones</option>
              {[...new Set(all.map((p) => p.profession).filter(Boolean))].map(
                (t) => (
                  <option key={t}>{t}</option>
                ),
              )}
            </select>
          </label>
          <button className="reset-button" onClick={reset}>
            <X size={16} aria-hidden="true" />
            Limpiar filtros
          </button>
        </div>
      </div>
      <div className="alphabet" aria-label="Filtrar por inicial del apellido">
        <button onClick={() => setLetter("")} aria-pressed={!letter}>
          Todos
        </button>
        {letters.map((l) => (
          <button
            aria-label={`Apellidos con ${l}`}
            aria-pressed={letter === l}
            key={l}
            onClick={() => setLetter(letter === l ? "" : l)}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="results-header">
        <p role="status">
          <strong>{filtered.length}</strong> registros encontrados
        </p>
        <span>Periodo 2025 · Fuente institucional</span>
      </div>
      {filtered.length > 0 ? (
        <>
          <div className="professional-table">
            <table>
              <caption className="sr-only">
                Nómina de {kind === "arbitro" ? "árbitros" : "adjudicadores"} ·
                Periodo publicado 2025
              </caption>
              <thead>
                <tr>
                  <th scope="col">Apellidos y nombres</th>
                  <th scope="col">Profesión</th>
                  <th scope="col">Grupo / Especialidad</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <th scope="row">{p.name}</th>
                    <td>{p.profession || "No publicado"}</td>
                    <td>
                      <span className="tag">{p.group}</span>
                      <span className="table-specialty">
                        {p.specialty || "Especialidad no publicada"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="professional-cards">
            {filtered.map((p) => (
              <article key={p.id}>
                <span className="tag">{p.group}</span>
                <h2>{p.name}</h2>
                <dl>
                  <div>
                    <dt>Profesión</dt>
                    <dd>{p.profession || "No publicado"}</dd>
                  </div>
                  <div>
                    <dt>Especialidad</dt>
                    <dd>{p.specialty || "No publicado"}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </>
      ) : (
        <EmptyState reset={reset} />
      )}
      <div className="membership-note">
        <FileCheck2 size={26} strokeWidth={1.3} aria-hidden="true" />
        <div>
          <h2>Incorporación y renovación</h2>
          <p>
            Consulta las fichas y la directiva correspondiente en nuestra
            biblioteca documental.
          </p>
        </div>
        <Link className="text-link" to={pathFor("documentos") + "?tipo=Ficha"}>
          Ver fichas
          <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <p className="caption">
        Los registros de distintos grupos se conservan por separado. Para
        información sobre incorporación, escribe a{" "}
        <a href={`mailto:${site.emails[0]}`}>{site.emails[0]}</a>.
      </p>
    </div>
  );
}

export function CertificationsPage() {
  return (
    <div className="container page-content">
      <InfoNote title="Documentación pública, con información verificable">
        La publicación de estos documentos no implica una afirmación de
        vigencia. La fuente presenta una diferencia de versión para ISO 37001
        que debe confirmar CENARD.
      </InfoNote>
      <div className="certification-grid">
        {certificates.map((c, i) => (
          <article className="certification-card" key={c.id}>
            <div className="certification-top">
              <FileCheck2 size={32} strokeWidth={1.2} aria-hidden="true" />
              <span>0{i + 1} / DOCUMENTO</span>
            </div>
            <h2>{c.title}</h2>
            <p>
              {i === 0
                ? "Documento de licencia de funcionamiento publicado por la institución."
                : i < 3
                  ? "Certificado publicado en la sección institucional. Consulta el documento para revisar su denominación y alcance."
                  : "Constancia publicada por CENARD. Consulta el documento original para revisar su contenido."}
            </p>
            <div className="validation-status">
              <Check size={15} aria-hidden="true" />
              {c.status}
            </div>
            <ExternalLink href={c.url}>Ver {c.title} (PDF)</ExternalLink>
          </article>
        ))}
      </div>
    </div>
  );
}
