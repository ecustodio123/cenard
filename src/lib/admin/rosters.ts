import { normalize } from "../search.ts";

export const arbitratorProfessions = ["Abogado", "Ingeniero"] as const;
export const adjudicatorProfessions = ["Abogado", "Ingeniero Electrónico", "Ingeniero Civil"] as const;
export const groupOptions = ["Nacionales", "Contratación pública"] as const;
export const qualificationOptions = ["Presidente de tribunal arbitral", "Árbitro único", "Árbitro de parte"] as const;
export type RosterKind = "arbitrators" | "adjudicators";
export interface RosterDraft { name: string; profession: string; specialty: string; groups: string[]; qualifications: string[] }
export type RosterErrors = Partial<Record<keyof RosterDraft, string>>;
interface SharedData { name: string; specialty: string }
export type RosterData =
  | (SharedData & { kind: "arbitrators"; profession: typeof arbitratorProfessions[number]; groups: typeof groupOptions[number][]; qualifications: typeof qualificationOptions[number][] })
  | (SharedData & { kind: "adjudicators"; profession: typeof adjudicatorProfessions[number] });
export type RosterRecord = RosterData & { id: string; visible: boolean };
export const emptyRosterDraft = (): RosterDraft => ({ name: "", profession: "", specialty: "", groups: [], qualifications: [] });

export function validateRosterDraft(kind: RosterKind, draft: RosterDraft): { ok: true; data: RosterData } | { ok: false; errors: RosterErrors } {
  const name = draft.name.trim(), profession = draft.profession.trim(), specialty = draft.specialty.trim();
  const errors: RosterErrors = {};
  if (!name) errors.name = "Ingresa los apellidos y nombres.";
  const professions: readonly string[] = kind === "arbitrators" ? arbitratorProfessions : adjudicatorProfessions;
  if (!professions.includes(profession)) errors.profession = "Selecciona una profesión de esta nómina.";
  if (!specialty) errors.specialty = "Ingresa la especialidad publicada.";
  if (kind === "arbitrators") {
    if (!draft.groups.length || draft.groups.some(value => !(groupOptions as readonly string[]).includes(value))) errors.groups = "Selecciona al menos un grupo válido.";
    if (!draft.qualifications.length || draft.qualifications.some(value => !(qualificationOptions as readonly string[]).includes(value))) errors.qualifications = "Selecciona al menos una habilitación válida.";
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  if (kind === "arbitrators") return { ok: true, data: {
    kind, name, specialty, profession: profession as typeof arbitratorProfessions[number],
    groups: groupOptions.filter(value => draft.groups.includes(value)),
    qualifications: qualificationOptions.filter(value => draft.qualifications.includes(value)),
  } };
  return { ok: true, data: { kind, name, specialty, profession: profession as typeof adjudicatorProfessions[number] } };
}
export function draftFromRecord(record: RosterRecord): RosterDraft {
  return { name: record.name, profession: record.profession, specialty: record.specialty,
    groups: record.kind === "arbitrators" ? [...record.groups] : [],
    qualifications: record.kind === "arbitrators" ? [...record.qualifications] : [],
  };
}
export function searchRoster(records: readonly RosterRecord[], kind: RosterKind, query: string): RosterRecord[] {
  const term = normalize(query.trim());
  return records.filter(record => record.kind === kind && (!term || normalize(record.name).includes(term)));
}
