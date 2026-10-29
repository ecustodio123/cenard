import { validateRosterDraft } from "./rosters.ts";
import type { RosterDraft, RosterErrors, RosterKind, RosterRecord } from "./rosters.ts";

// Immutable operations, isolated from React and the public rosters. No shared global store.
export type SaveRosterResult = { ok: true; records: RosterRecord[]; record: RosterRecord } | { ok: false; errors: RosterErrors; message?: string };
export function saveRosterRecord(records: readonly RosterRecord[], kind: RosterKind, draft: RosterDraft, editingId: string | null, newId: () => string = () => crypto.randomUUID()): SaveRosterResult {
  const validation = validateRosterDraft(kind, draft);
  if (!validation.ok) return validation;
  const existing = editingId === null ? undefined : records.find(record => record.id === editingId && record.kind === kind);
  if (editingId !== null && !existing) return { ok: false, errors: {}, message: "El registro ya no existe en esta nómina." };
  const id = existing?.id ?? newId();
  if (!id || (!existing && records.some(record => record.id === id))) throw new Error("The record identifier must be unique and nonempty");
  const record: RosterRecord = { ...validation.data, id, visible: existing?.visible ?? true };
  return { ok: true, record, records: existing ? records.map(item => item.id === id ? record : item) : [...records, record] };
}
export function setRosterVisibility(records: readonly RosterRecord[], kind: RosterKind, id: string, visible: boolean): RosterRecord[] {
  return records.map(record => record.id === id && record.kind === kind ? { ...record, visible } : record);
}
export function deleteRosterRecord(records: readonly RosterRecord[], kind: RosterKind, id: string): RosterRecord[] {
  return records.filter(record => record.id !== id || record.kind !== kind);
}
