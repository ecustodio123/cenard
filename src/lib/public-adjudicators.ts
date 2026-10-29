import { z } from "zod";
import { normalize } from "./search.ts";
import { DIRECTORY_PAGE_SIZE } from "./arbitrator-directory.ts";
import type { DirectoryCriteria } from "./arbitrator-directory.ts";

const rowSchema = z.object({
  id: z.uuid(),
  apellidos_nombres: z.string().min(1),
  profesion_publicada: z.enum(["Abogado", "Ingeniero Civil", "Ingeniero Electrónico"]).nullable(),
  especialidad_publicada: z.string().nullable(),
});
export interface PublicAdjudicator {
  id: string;
  name: string;
  profession: string | null;
  specialty: string | null;
}
export function adaptPublicAdjudicators(data: unknown): PublicAdjudicator[] {
  const parsed = z.array(rowSchema).safeParse(data);
  if (!parsed.success) throw new Error("No pudimos interpretar los registros de adjudicadores. Reintenta la consulta o comunícate con CENARD.");
  const ids = new Set<string>();
  return parsed.data.map(row => {
    if (ids.has(row.id)) throw new Error("La consulta devolvió identificadores repetidos. Reintenta la carga de la nómina.");
    ids.add(row.id);
    return { id: row.id, name: row.apellidos_nombres, profession: row.profesion_publicada, specialty: row.especialidad_publicada };
  });
}
const collator = new Intl.Collator("es");
export function publicAdjudicatorResults(records: readonly PublicAdjudicator[], criteria: Pick<DirectoryCriteria, "query" | "profession" | "letter">, pageParameter = "") {
  const filtered = records.filter(record => normalize(record.name).includes(normalize(criteria.query.trim()))
    && (!criteria.profession || record.profession === criteria.profession)
    && (!criteria.letter || normalize(record.name).startsWith(normalize(criteria.letter))))
    .sort((a, b) => collator.compare(a.name, b.name) || a.id.localeCompare(b.id));
  const pageCount = Math.max(1, Math.ceil(filtered.length / DIRECTORY_PAGE_SIZE));
  const requested = /^\d+$/.test(pageParameter) && Number.isSafeInteger(Number(pageParameter)) ? Number(pageParameter) : 1;
  const page = Math.min(pageCount, Math.max(1, requested));
  const start = (page - 1) * DIRECTORY_PAGE_SIZE;
  return { filtered, page, pageCount, items: filtered.slice(start, start + DIRECTORY_PAGE_SIZE),
    from: filtered.length ? start + 1 : 0, to: Math.min(start + DIRECTORY_PAGE_SIZE, filtered.length) };
}
export function publicAdjudicatorFacets(records: readonly PublicAdjudicator[]) {
  return {
    professions: [...new Set(records.map(person => person.profession).filter((value): value is string => !!value))].sort(collator.compare),
    letters: [...new Set(records.map(person => normalize(person.name.trim().charAt(0)).toUpperCase()).filter(Boolean))].sort(collator.compare),
  };
}
