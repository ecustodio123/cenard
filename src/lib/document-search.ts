import type { InstitutionalDocument } from "../data/documents";
import { normalize } from "./search.ts";

export interface DocumentCriteria {
  query: string;
  service: string;
  type: string;
  status: string;
}

export function filterDocuments(documents: InstitutionalDocument[], criteria: DocumentCriteria) {
  const query = normalize(criteria.query.trim());
  return documents.filter(document =>
    normalize([document.title, document.type, ...document.services].join(" ")).includes(query)
    && (!criteria.service || document.services.includes(criteria.service))
    && (!criteria.type || document.type === criteria.type)
    && (!criteria.status || (criteria.status === "historico"
      ? document.sourceGrouping.kind === "historico"
      : document.sourceGrouping.kind !== "historico")),
  );
}
