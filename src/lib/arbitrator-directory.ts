import { normalize } from "./search.ts";

export interface ArbitratorRecord {
  id: string; name: string; profession: string; specialty: string;
  group: string; kind: string; period: string;
}
export interface DirectoryCriteria { query: string; group: string; profession: string; letter: string }
export const DIRECTORY_PAGE_SIZE = 20;
const collator = new Intl.Collator("es");

export function professionalResults(records: ArbitratorRecord[], criteria: DirectoryCriteria, pageParameter = "", kind: "arbitro" | "adjudicador" = "arbitro") {
  const filtered = records.filter(record => record.kind === kind
    && normalize(record.name).includes(normalize(criteria.query.trim()))
    && (!criteria.group || record.group === criteria.group)
    && (!criteria.profession || record.profession === criteria.profession)
    && (!criteria.letter || normalize(record.name).startsWith(normalize(criteria.letter))))
    .sort((a, b) => collator.compare(a.name, b.name) || collator.compare(a.group, b.group) || a.id.localeCompare(b.id));
  const pageCount = Math.max(1, Math.ceil(filtered.length / DIRECTORY_PAGE_SIZE));
  const requested = /^\d+$/.test(pageParameter) && Number.isSafeInteger(Number(pageParameter)) ? Number(pageParameter) : 1;
  const page = Math.min(pageCount, Math.max(1, requested));
  const start = (page - 1) * DIRECTORY_PAGE_SIZE;
  return { filtered, page, pageCount, items: filtered.slice(start, start + DIRECTORY_PAGE_SIZE),
    from: filtered.length ? start + 1 : 0, to: Math.min(start + DIRECTORY_PAGE_SIZE, filtered.length) };
}

export function arbitratorResults(records: ArbitratorRecord[], criteria: DirectoryCriteria, pageParameter = "") {
  return professionalResults(records, criteria, pageParameter, "arbitro");
}

export function directoryPageNumbers(page: number, total: number, compact = false): (number | "…")[] {
  const visible = [...new Set(compact ? [1, page, total] : [1, page - 1, page, page + 1, total])].filter(n => n >= 1 && n <= total).sort((a, b) => a - b);
  const output: (number | "…")[] = [];
  visible.forEach((number, i) => {
    const previous = visible[i - 1];
    if (i && number - previous === 2) output.push(previous + 1);
    else if (i && number - previous > 2) output.push("…");
    output.push(number);
  });
  return output;
}
