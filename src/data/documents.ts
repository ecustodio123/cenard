import data from "./documents.json";

export interface InstitutionalDocument {
  id: string;
  title: string;
  services: string[];
  type: string;
  sourceGrouping: { kind: string; label: string };
  validationStatus: string;
  urlPublic: string;
  references: { id: string; service: string; urlOrigin: string }[];
  // Unknown metadata stays absent; source grouping does not establish these dates.
  publicationDate?: string;
  version?: string;
  applicationPeriod?: { from?: string; until?: string };
}

export const documents: InstitutionalDocument[] = data;

export function sourceGroupingLabel(document: InstitutionalDocument) {
  return `${document.sourceGrouping.kind === "historico" ? "Agrupación histórica de origen" : "Agrupación de origen"}: ${document.sourceGrouping.label} · ${document.validationStatus}`;
}
