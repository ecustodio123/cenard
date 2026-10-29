import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Combobox } from "../Combobox";
import { arbitratorProfessions, adjudicatorProfessions, draftFromRecord, emptyRosterDraft, groupOptions, qualificationOptions, searchRoster } from "../../lib/admin/rosters";
import type { RosterDraft, RosterErrors, RosterKind, RosterRecord } from "../../lib/admin/rosters";
import { deleteRosterRecord, saveRosterRecord, setRosterVisibility } from "../../lib/admin/memory-rosters";
import { DeleteRosterDialog } from "./DeleteRosterDialog";

const sectionLabels: Record<RosterKind, string> = { arbitrators: "Nómina de árbitros", adjudicators: "Nómina de adjudicadores" };

function RosterSection({ kind, records, onRecordsChange }: { kind: RosterKind; records: RosterRecord[]; onRecordsChange: (records: RosterRecord[]) => void }) {
  const [draft, setDraft] = useState(emptyRosterDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<RosterErrors>({});
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<RosterRecord | null>(null);
  const nameField = useRef<HTMLInputElement>(null);
  const professionField = useRef<HTMLButtonElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const listHeading = useRef<HTMLHeadingElement>(null);
  const isArbitrator = kind === "arbitrators";
  const noun = isArbitrator ? "árbitro" : "adjudicador";
  const professions = isArbitrator ? arbitratorProfessions : adjudicatorProfessions;
  const ownRecords = records.filter(record => record.kind === kind);
  const visibleRecords = searchRoster(records, kind, query);
  const id = (field: string) => `admin-${kind}-${field}`;

  function update<K extends keyof RosterDraft>(field: K, value: RosterDraft[K]) {
    setDraft(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined }));
    setMessage("");
  }
  function resetForm() { setDraft(emptyRosterDraft()); setEditingId(null); setErrors({}); }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = saveRosterRecord(records, kind, draft, editingId);
    if (!result.ok) {
      setErrors(result.errors);
      setMessage(result.message ?? "Revisa los campos indicados antes de guardar.");
      const first = Object.keys(result.errors)[0];
      requestAnimationFrame(() => {
        if (first === "profession") professionField.current?.focus();
        else form.current?.querySelector<HTMLElement>(`[data-field="${first}"] input, input[data-field="${first}"], textarea[data-field="${first}"]`)?.focus();
      });
      return;
    }
    const wasEditing = editingId !== null;
    onRecordsChange(result.records);
    resetForm();
    setMessage(`${result.record.name}: ${wasEditing ? "cambios guardados" : `${noun} agregado`}.`);
    nameField.current?.focus();
  }
  function edit(record: RosterRecord) {
    setDraft(draftFromRecord(record)); setEditingId(record.id); setErrors({});
    setMessage(`Editando a ${record.name}.`);
    requestAnimationFrame(() => nameField.current?.focus());
  }
  function toggle(record: RosterRecord) {
    onRecordsChange(setRosterVisibility(records, kind, record.id, !record.visible));
    setMessage(`${record.name}: ${record.visible ? "oculto" : "visible"} en esta demostración. La nómina pública no se modifica.`);
  }
  function confirmDelete() {
    if (!deleteTarget) return;
    onRecordsChange(deleteRosterRecord(records, kind, deleteTarget.id));
    if (editingId === deleteTarget.id) resetForm();
    setMessage(`${deleteTarget.name}: registro eliminado.`);
    setDeleteTarget(null);
    requestAnimationFrame(() => listHeading.current?.focus());
  }
  function checks(field: "groups" | "qualifications", legend: string, options: readonly string[]) {
    return <fieldset className="admin-check-group" data-field={field} aria-describedby={errors[field] ? id(`${field}-error`) : undefined}>
      <legend>{legend} <span>(obligatorio)</span></legend>
      <div>{options.map(option => <label key={option}>
        <input type="checkbox" checked={draft[field].includes(option)} onChange={event => update(field, event.target.checked ? [...draft[field], option] : draft[field].filter(value => value !== option))} />
        <span>{option}</span>
      </label>)}</div>
      {errors[field] && <p className="admin-field-error" id={id(`${field}-error`)}>{errors[field]}</p>}
    </fieldset>;
  }
  return <div className="admin-roster-content">
    <h2 className="admin-roster-title" id={id("title")}>{sectionLabels[kind]}</h2>
    <p className="admin-dashboard-demo">Gestión de nóminas en demostración: los cambios aún no se guardan en la base de datos</p>
    <section className="admin-roster-form-panel" aria-labelledby={id("form-title")}>
      <h3 id={id("form-title")}>{editingId ? `Editar ${noun}` : `Agregar ${noun}`}</h3>
      {editingId && <p className="admin-edit-context">Editando el registro de {ownRecords.find(record => record.id === editingId)?.name}. Su estado se conservará.</p>}
      <form ref={form} className="admin-roster-form" noValidate onSubmit={save}>
        <div className="admin-roster-fields">
          <div className="admin-field">
            <label htmlFor={id("name")}>Apellidos y nombres <span>(obligatorio)</span></label>
            <input ref={nameField} id={id("name")} data-field="name" type="text" required value={draft.name} onChange={event => update("name", event.target.value)} aria-invalid={!!errors.name || undefined} aria-describedby={errors.name ? id("name-error") : undefined} />
            {errors.name && <p className="admin-field-error" id={id("name-error")}>{errors.name}</p>}
          </div>
          <div className="admin-field">
            <Combobox id={id("profession")} triggerRef={professionField} label="Profesión publicada (obligatorio)" value={draft.profession} options={[{ value: "", label: "Selecciona una profesión" }, ...professions.map(value => ({ value, label: value }))]} onValueChange={value => update("profession", value)} invalid={!!errors.profession} describedBy={errors.profession ? id("profession-error") : undefined} />
            {errors.profession && <p className="admin-field-error" id={id("profession-error")}>{errors.profession}</p>}
          </div>
          {isArbitrator && checks("groups", "Grupo", groupOptions)}
          <div className="admin-field admin-specialty-field">
            <label htmlFor={id("specialty")}>Especialidad publicada <span>(obligatorio)</span></label>
            <textarea id={id("specialty")} data-field="specialty" rows={3} required value={draft.specialty} onChange={event => update("specialty", event.target.value)} aria-invalid={!!errors.specialty || undefined} aria-describedby={errors.specialty ? id("specialty-error") : undefined} />
            {errors.specialty && <p className="admin-field-error" id={id("specialty-error")}>{errors.specialty}</p>}
          </div>
          {isArbitrator && checks("qualifications", "Habilitaciones", qualificationOptions)}
        </div>
        <div className="admin-roster-form-actions">
          <button className="button" type="submit">{editingId ? "Guardar cambios" : `Agregar ${noun}`}</button>
          {editingId && <button className="button button-secondary" type="button" onClick={() => { resetForm(); setMessage("Edición cancelada. El registro conserva sus datos."); nameField.current?.focus(); }}>Cancelar edición</button>}
        </div>
      </form>
    </section>
    <p className="admin-roster-feedback" role="status" aria-live="polite" aria-atomic="true">{message}</p>
    <section className="admin-roster-list" aria-labelledby={id("list-title")}>
      <div className="admin-list-heading"><h3 id={id("list-title")} tabIndex={-1} ref={listHeading}>Registros de la demostración</h3><span>{ownRecords.length} registro{ownRecords.length === 1 ? "" : "s"}</span></div>
      <div className="admin-field admin-roster-search">
        <label htmlFor={id("search")}>Buscar por apellidos y nombres</label>
        <input id={id("search")} type="search" value={query} onChange={event => setQuery(event.target.value)} />
      </div>
      {ownRecords.length === 0 ? <div className="admin-empty-state"><h4>Aún no hay {isArbitrator ? "árbitros" : "adjudicadores"} registrados</h4><p>Agrega una persona con el formulario para comenzar esta demostración.</p></div>
        : visibleRecords.length === 0 ? <div className="admin-empty-state"><h4>No se encontraron registros</h4><p>Prueba otro nombre o limpia la búsqueda.</p><button type="button" className="admin-text-action" onClick={() => setQuery("")}>Limpiar búsqueda</button></div>
        : <div className="admin-record-list">{visibleRecords.map(record => <article className="admin-record" key={record.id} data-record-id={record.id} aria-labelledby={`admin-record-${record.id}`}>
          <div className="admin-record-heading"><h4 id={`admin-record-${record.id}`}>{record.name}</h4><span className="admin-visibility" data-visible={record.visible}>{record.visible ? "Visible" : "Oculto"}</span></div>
          <dl className="admin-record-data">
            <div><dt>Profesión publicada</dt><dd>{record.profession}</dd></div>
            {record.kind === "arbitrators" && <div><dt>Grupo</dt><dd className="admin-record-tags">{record.groups.map(value => <span key={value}>{value}</span>)}</dd></div>}
            <div><dt>Especialidad publicada</dt><dd>{record.specialty}</dd></div>
            {record.kind === "arbitrators" && <div><dt>Habilitaciones</dt><dd className="admin-record-tags">{record.qualifications.map(value => <span key={value}>{value}</span>)}</dd></div>}
          </dl>
          <div className="admin-record-actions">
            <button type="button" onClick={() => edit(record)} aria-label={`Editar ${record.name}`}>Editar</button>
            <button type="button" onClick={() => toggle(record)} aria-label={`${record.visible ? "Ocultar" : "Mostrar"} ${record.name}`}>{record.visible ? "Ocultar" : "Mostrar"}</button>
            <button className="admin-record-delete" type="button" onClick={() => setDeleteTarget(record)} aria-label={`Eliminar ${record.name}`}>Eliminar</button>
          </div>
        </article>)}</div>}
    </section>
    {deleteTarget && <DeleteRosterDialog name={deleteTarget.name} onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />}
  </div>;
}

export function AdminDashboard({ onExit }: { onExit: () => void }) {
  const [section, setSection] = useState<RosterKind>("arbitrators");
  const [records, setRecords] = useState<RosterRecord[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <main className="admin-shell admin-shell-dashboard">
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div><img className="admin-logo" src="/images/logo.png" width="1600" height="624" alt="CNR CENARD Arbitraje" /><h1 ref={heading} tabIndex={-1}>Administración CENARD</h1></div>
        <button className="button button-secondary" type="button" onClick={onExit}>Salir</button>
      </header>
      <div className="admin-dashboard-demo"><p>Los cambios locales se perderán al salir o recargar. Las nóminas públicas no se modifican.</p></div>
      <nav id="admin-roster-nav" className="admin-roster-nav" aria-label="Nóminas administrativas">
        {(["arbitrators", "adjudicators"] as const).map(kind => <button key={kind} type="button" aria-pressed={section === kind} aria-controls={`admin-section-${kind}`} onClick={() => setSection(kind)}>{sectionLabels[kind]}</button>)}
      </nav>
      {(["arbitrators", "adjudicators"] as const).map(kind => <section key={kind} id={`admin-section-${kind}`} className="admin-roster-panel" hidden={section !== kind} aria-labelledby={`admin-${kind}-title`}>
        <RosterSection kind={kind} records={records} onRecordsChange={setRecords} />
      </section>)}
    </div>
  </main>;
}
