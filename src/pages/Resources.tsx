import { useMemo, useState } from "react";
import {
  FileCheck2,
  Search,
  X,
} from "lucide-react";
import {
  EmptyState,
} from "../components/UI";
import professionals from "../data/professionals.json";
import certificates from "../data/certifications.json";
import { pathFor, site } from "../data/site";
import { Link } from "react-router";

import { Combobox } from "../components/Combobox";
import { normalize } from "../lib/search";

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
  const groups = [...new Set(all.map((person) => person.group))];
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
          {groups.length > 1 && <Combobox label="Grupo" value={group} onValueChange={setGroup} options={[{ value: "", label: "Todos los grupos" }, ...groups.map(value => ({ value, label: value }))]} />}
          <Combobox label="Profesión publicada" value={profession} onValueChange={setProfession} options={[{ value: "", label: "Todas las profesiones" }, ...[...new Set(all.map(person => person.profession).filter(Boolean))].map(value => ({ value, label: value }))]} />
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
          <strong>{filtered.length}</strong>{" "}
          {filtered.length === 1
            ? "registro encontrado"
            : "registros encontrados"}
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
        </Link>
      </div>
      <p className="caption">
        {groups.length > 1
          ? "Los registros de distintos grupos se conservan por separado. "
          : "Los registros corresponden al grupo publicado de contratación pública. "}
        Para información sobre incorporación, escribe a{" "}
        <a href={`mailto:${site.emails[0]}`}>{site.emails[0]}</a>.
      </p>
    </div>
  );
}

const certificatePresentation = [
  { id: "2", image: "/assets/certificates/iso-9001.webp", title: "ISO 9001", category: "Gestión de la calidad", description: "Consulta el certificado publicado y revisa su alcance, versión y periodo de validez." },
  { id: "1", image: "/assets/certificates/iso-37001.webp", title: "ISO 37001", category: "Gestión antisoborno", description: "Accede al certificado para conocer la norma de referencia y el alcance documentado." },
  { id: "4", image: "/assets/certificates/oece-arbitraje.webp", title: "Constancia de Arbitraje", category: "OECE · Arbitraje", description: "Documento institucional correspondiente al servicio de arbitraje." },
  { id: "3", image: "/assets/certificates/oece-jprd.webp", title: "Constancia de JPRD", category: "OECE · JPRD", description: "Documento correspondiente a Juntas de Prevención y Resolución de Disputas." },
  { id: "0", image: "/assets/certificates/licencia-funcionamiento.webp", title: "Licencia de funcionamiento", category: "Autorización municipal", description: "Consulta la licencia de funcionamiento publicada por CENARD." },
];

export function CertificationsPage() {
  return (
    <div className="container page-content credentials-page">
      {[
        { id: "iso", label: "01 / Sistemas de gestión", title: "Certificaciones ISO", items: certificatePresentation.slice(0, 2) },
        { id: "institucional", label: "02 / Documentación institucional", title: "Constancias y licencia", items: certificatePresentation.slice(2) },
      ].map((group) => (
        <section className={`credentials-section credentials-section--${group.id}`} key={group.id} aria-labelledby={`credentials-${group.id}`}>
          <div className="credentials-heading">
            <div>
              <p className="credentials-kicker">{group.label}</p>
              <h2 id={`credentials-${group.id}`}>{group.title}</h2>
            </div>
          </div>
          <div className="credentials-grid">
            {group.items.map((item) => {
              const certificate = certificates.find((entry) => entry.id === item.id)!;
              return (
                <article className="credential-card" key={item.id}>
                  <div className="credential-logo">
                    <img src={item.image} alt={item.title === "Licencia de funcionamiento" ? "Municipalidad de Magdalena del Mar · Licencia de funcionamiento" : item.category.startsWith("OECE") ? `OECE · ${item.title}` : `Sello ${item.title}`} width={item.id === "1" || item.id === "2" ? 150 : 300} height={item.id === "1" || item.id === "2" ? 150 : item.id === "0" ? 86 : item.id === "3" ? 106 : 110} />
                  </div>
                  <div className="credential-body">
                    <p className="credential-category">{item.category}</p>
                    <h3>{item.title}</h3>
                    <p className="credential-description">{item.description}</p>
                    <a href={certificate.url} className="credential-action" target="_blank" rel="noreferrer">
                      Ver documento
                      <span className="sr-only"> · {item.title} (PDF, abre en otra pestaña)</span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
