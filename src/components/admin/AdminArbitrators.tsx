import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Combobox } from "../Combobox";
import { DeleteRosterDialog } from "./DeleteRosterDialog";
import { arbitratorProfessions, emptyRosterDraft, groupOptions, qualificationOptions } from "../../lib/admin/rosters";
import type { RosterDraft, RosterErrors } from "../../lib/admin/rosters";
import { AdminArbitratorError, arbitratorDraft, createAdminArbitratorsApi, sortAdminArbitrators, validateArbitratorDraft } from "../../lib/admin/arbitrators";
import type { AdminArbitrator } from "../../lib/admin/arbitrators";
import { adminDirectoryPage } from "../../lib/admin/pagination";
import { DIRECTORY_PAGE_SIZE } from "../../lib/arbitrator-directory";
import { DirectoryPagination } from "../DirectoryPagination";
import { useDirectoryMobile } from "../../lib/use-directory-mobile";

type Api = ReturnType<typeof createAdminArbitratorsApi>;
export function AdminArbitrators({ userId, onAccessLost }: { userId: string; onAccessLost: () => void }) {
  const [records, setRecords] = useState<AdminArbitrator[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "error" | "ready">("loading");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState(emptyRosterDraft);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<RosterErrors>({});
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const compact = useDirectoryMobile();
  const [deleteTarget, setDeleteTarget] = useState<AdminArbitrator | null>(null);
  const nameField = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const listHeading = useRef<HTMLHeadingElement>(null);
  const lock = useRef(false);
  const generation = useRef(0);
  const pending = useRef<AbortController | null>(null);
  const queryClient = useQueryClient();
  const pagination = adminDirectoryPage(records, query, page);
  const visibleRecords = pagination.filtered;
  function updateQuery(value: string) { setQuery(value); setPage(1); }
  function changePage(next: number) {
    if (lock.current || loadState !== "ready" || next < 1 || next > pagination.pageCount) return;
    setPage(next);
    requestAnimationFrame(() => listHeading.current?.focus());
  }
  const disabled = busy || loadState !== "ready";
  const id = (field: string) => `admin-arbitrators-${field}`;

  // Administrative rows stay in this mounted component, never in persistent/query storage.
  const load = useCallback(async () => {
    if (lock.current) return;
    lock.current = true;
    const ticket = generation.current;
    const controller = new AbortController(); pending.current = controller;
    setLoadState("loading"); setErrorMessage("");
    try {
      const client = (await import("../../lib/supabase")).getPublicSupabaseClient();
      const rows = await createAdminArbitratorsApi(client, userId).list(controller.signal);
      if (ticket !== generation.current) return;
      setRecords(rows); setPage(1); setLoadState("ready");
    } catch (error) {
      if (ticket !== generation.current) return;
      setLoadState("error");
      setErrorMessage(error instanceof Error ? error.message : "No pudimos cargar la nómina. Reintenta la consulta.");
      if (error instanceof AdminArbitratorError && error.accessLost) onAccessLost();
    } finally { if (ticket === generation.current) { lock.current = false; pending.current = null; } }
  }, [userId, onAccessLost]);
  const cancelPending = useCallback(() => { generation.current++; pending.current?.abort(); lock.current = false; }, []);
  useEffect(() => {
    generation.current++;
    const timer = setTimeout(() => { void load(); }, 0);
    return () => { clearTimeout(timer); cancelPending(); };
  }, [load, cancelPending]);

  function update<K extends keyof RosterDraft>(field: K, value: RosterDraft[K]) {
    setDraft(current => ({ ...current, [field]: value }));
    setErrors(current => ({ ...current, [field]: undefined })); setMessage("");
  }
  function resetForm() { setDraft(emptyRosterDraft()); setEditingId(null); setErrors({}); }
  async function mutate<T>(operation: (api: Api, signal: AbortSignal) => Promise<T>, success: (result: T) => void) {
    if (lock.current || loadState !== "ready") return;
    lock.current = true; setBusy(true); setMessage(""); setErrorMessage("");
    const ticket = generation.current;
    const controller = new AbortController(); pending.current = controller;
    try {
      const client = (await import("../../lib/supabase")).getPublicSupabaseClient();
      const result = await operation(createAdminArbitratorsApi(client, userId), controller.signal);
      if (ticket !== generation.current) return;
      success(result);
      void queryClient.invalidateQueries({ queryKey: ["public", "nomina_arbitros"] });
    } catch (error) {
      if (ticket !== generation.current) return;
      setErrorMessage(error instanceof Error ? error.message : "No pudimos guardar el cambio. Reintenta después de comprobar el listado.");
      if (error instanceof AdminArbitratorError && error.accessLost) { setLoadState("error"); onAccessLost(); }
    } finally { if (ticket === generation.current) { lock.current = false; pending.current = null; setBusy(false); } }
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (lock.current || disabled) return;
    const result = validateArbitratorDraft(draft);
    setErrors(result.errors);
    if (Object.keys(result.errors).length) {
      setMessage("");
      requestAnimationFrame(() => {
        const first = Object.keys(result.errors)[0];
        form.current?.querySelector<HTMLElement>(`[data-field="${first}"] input, input[data-field="${first}"], textarea[data-field="${first}"], [data-field="${first}"] button`)?.focus();
      }); return;
    }
    const selectedId = editingId;
    void mutate((api, signal) => api.save(draft, selectedId, signal), record => {
      setRecords(current => sortAdminArbitrators([...current.filter(item => item.id !== record.id), record]));
      setPage(1); resetForm(); setMessage(`${record.name}: ${selectedId ? "cambios guardados" : "árbitro agregado"}.`);
      requestAnimationFrame(() => nameField.current?.focus());
    });
  }
  function edit(record: AdminArbitrator) {
    if (lock.current || disabled) return;
    setDraft(arbitratorDraft(record)); setEditingId(record.id); setErrors({}); setErrorMessage("");
    setMessage(`Editando a ${record.name}.`);
    requestAnimationFrame(() => nameField.current?.focus());
  }
  function toggle(record: AdminArbitrator) {
    void mutate((api, signal) => api.visibility(record.id, !record.visible, signal), updated => {
      setRecords(current => sortAdminArbitrators(current.map(item => item.id === updated.id ? updated : item)));
      setMessage(`${updated.name}: ${updated.visible ? "visible" : "oculto"} en la nómina pública.`);
    });
  }
  function confirmDelete() {
    if (!deleteTarget) return;
    const target = deleteTarget;
    void mutate((api, signal) => api.remove(target.id, signal), removedId => {
      setRecords(current => current.filter(item => item.id !== removedId));
      setPage(current => Math.min(current, Math.max(1, Math.ceil((visibleRecords.length - 1) / DIRECTORY_PAGE_SIZE))));
      if (editingId === removedId) resetForm();
      setDeleteTarget(null); setMessage(`${target.name}: eliminado de la nómina de árbitros.`);
      requestAnimationFrame(() => listHeading.current?.focus());
    });
  }
  function checks(field: "groups" | "qualifications", legend: string, options: readonly string[]) {
    return <fieldset className="admin-check-group" data-field={field} aria-describedby={errors[field] ? id(`${field}-error`) : undefined}>
      <legend>{legend} {field === "groups" && <span>(obligatorio)</span>}</legend>
      <div>{options.map(option => <label key={option}><input type="checkbox" checked={draft[field].includes(option)} onChange={event => update(field, event.target.checked ? [...draft[field], option] : draft[field].filter(value => value !== option))} /><span>{option}</span></label>)}</div>
      {errors[field] && <p className="admin-field-error" id={id(`${field}-error`)}>{errors[field]}</p>}
    </fieldset>;
  }
  return <div className="admin-roster-content">
    <h2 className="admin-roster-title" id={id("title")}>Nómina de árbitros</h2>
    <section className="admin-roster-form-panel" aria-labelledby={id("form-title")}>
      <h3 id={id("form-title")}>{editingId ? "Editar árbitro" : "Agregar árbitro"}</h3>
      {editingId && <p className="admin-edit-context">Editando a {records.find(record => record.id === editingId)?.name}. La visibilidad se gestiona desde el listado.</p>}
      <form ref={form} className="admin-roster-form" noValidate onSubmit={save} aria-busy={busy}>
        <fieldset className="admin-write-fields" disabled={disabled}><legend className="sr-only">Datos del árbitro</legend>
          <div className="admin-roster-fields">
            <div className="admin-field"><label htmlFor={id("name")}>Apellidos y nombres <span>(obligatorio)</span></label><input ref={nameField} id={id("name")} data-field="name" type="text" required value={draft.name} onChange={event => update("name", event.target.value)} aria-invalid={!!errors.name || undefined} aria-describedby={errors.name ? id("name-error") : undefined} />{errors.name && <p className="admin-field-error" id={id("name-error")}>{errors.name}</p>}</div>
            <div className="admin-field" data-field="profession"><Combobox disabled={disabled} id={id("profession")} label="Profesión publicada" value={draft.profession} options={[{ value: "", label: "Sin información publicada" }, ...arbitratorProfessions.map(value => ({ value, label: value }))]} onValueChange={value => update("profession", value)} invalid={!!errors.profession} describedBy={errors.profession ? id("profession-error") : undefined} />{errors.profession && <p className="admin-field-error" id={id("profession-error")}>{errors.profession}</p>}</div>
            {checks("groups", "Grupo", groupOptions)}
            <div className="admin-field admin-specialty-field"><label htmlFor={id("specialty")}>Especialidad publicada</label><textarea id={id("specialty")} data-field="specialty" aria-invalid={!!errors.specialty || undefined} aria-describedby={errors.specialty ? id("specialty-error") : undefined} rows={3} value={draft.specialty} onChange={event => update("specialty", event.target.value)} />{errors.specialty && <p className="admin-field-error" id={id("specialty-error")}>{errors.specialty}</p>}</div>
            {checks("qualifications", "Habilitaciones", qualificationOptions)}
          </div>
          <div className="admin-roster-form-actions"><button className="button" type="submit">{busy ? "Procesando…" : editingId ? "Guardar cambios" : "Agregar árbitro"}</button>{editingId && <button className="button button-secondary" type="button" onClick={() => { resetForm(); setErrorMessage(""); setMessage("Edición cancelada. El registro conserva sus datos."); nameField.current?.focus(); }}>Cancelar edición</button>}</div>
        </fieldset>
      </form>
    </section>
    <p className="admin-roster-feedback" role="status" aria-live="polite" aria-atomic="true">{message || (busy ? "Procesando operación. Espera la confirmación." : "")}</p>
    {errorMessage && <p className="admin-field-error" role="alert">{errorMessage}</p>}
    <section className="admin-roster-list" aria-labelledby={id("list-title")} aria-busy={loadState === "loading"}>
      <div className="admin-list-heading"><h3 id={id("list-title")} tabIndex={-1} ref={listHeading}>Nómina de árbitros</h3>{loadState === "ready" && <span>{visibleRecords.length} de {records.length} registros</span>}</div>
      <div className="admin-field admin-roster-search"><label htmlFor={id("search")}>Buscar por apellidos y nombres</label><input disabled={loadState !== "ready"} id={id("search")} type="search" value={query} onChange={event => updateQuery(event.target.value)} /></div>
      {loadState === "loading" ? <p role="status">Cargando nómina de árbitros…</p> : loadState === "error" ? <div className="admin-empty-state"><h4>No pudimos cargar la nómina</h4><button className="button" type="button" onClick={() => { void load(); }}>Reintentar consulta</button></div>
      : <>
        <button className="admin-text-action" type="button" disabled={busy} onClick={() => { void load(); }}>Recargar listado</button>
        {records.length === 0 ? <div className="admin-empty-state"><h4>No hay árbitros registrados</h4><p>Agrega un árbitro con el formulario superior.</p></div>
        : visibleRecords.length === 0 ? <div className="admin-empty-state"><h4>No se encontraron registros</h4><p>Prueba otro nombre o limpia la búsqueda.</p><button className="admin-text-action" type="button" onClick={() => updateQuery("")}>Limpiar búsqueda</button></div>
        : <div className="admin-record-list">{pagination.items.map(record => <article className="admin-record" key={record.id} data-record-id={record.id} aria-labelledby={`admin-record-${record.id}`}>
          <div className="admin-record-heading"><h4 id={`admin-record-${record.id}`}>{record.name}</h4><span className="admin-visibility" data-visible={record.visible}>{record.visible ? "Visible" : "Oculto"}</span></div>
          <dl className="admin-record-data"><div><dt>Profesión publicada</dt><dd>{record.profession ?? "—"}</dd></div><div><dt>Grupo</dt><dd className="admin-record-tags">{record.groups.map(value => <span key={value}>{value}</span>)}</dd></div><div><dt>Especialidad publicada</dt><dd>{record.specialty ?? "—"}</dd></div><div><dt>Habilitaciones</dt><dd className="admin-record-tags">{record.qualifications.length ? record.qualifications.map(value => <span key={value}>{value}</span>) : "—"}</dd></div></dl>
          <div className="admin-record-actions"><button type="button" disabled={disabled} onClick={() => edit(record)} aria-label={`Editar ${record.name}`}>Editar</button><button type="button" disabled={disabled} onClick={() => toggle(record)} aria-label={`${record.visible ? "Ocultar" : "Mostrar"} ${record.name}`}>{record.visible ? "Ocultar" : "Mostrar"}</button><button className="admin-record-delete" type="button" disabled={disabled} onClick={() => { setErrorMessage(""); setDeleteTarget(record); }} aria-label={`Eliminar ${record.name}`}>Eliminar</button></div>
        </article>)}</div>}
        {visibleRecords.length > 0 && <DirectoryPagination page={pagination.page} pageCount={pagination.pageCount} from={pagination.from} to={pagination.to} total={visibleRecords.length} compact={compact} hideSingle onPageChange={changePage} />}
      </>}
    </section>
    {deleteTarget && <DeleteRosterDialog name={deleteTarget.name} description={`¿Eliminar a «${deleteTarget.name}» de la nómina de árbitros? Esta acción no elimina registros de la nómina de adjudicadores.`} pending={busy} error={errorMessage} onCancel={() => { if (!lock.current) setDeleteTarget(null); }} onConfirm={confirmDelete} />}
  </div>;
}
