import { DIRECTORY_PAGE_SIZE } from "../arbitrator-directory.ts";
import { normalize } from "../search.ts";

export function adminDirectoryPage<T extends { name: string }>(records: readonly T[], query: string, requestedPage: number) {
  const term = normalize(query.trim());
  const filtered = records.filter(record => normalize(record.name).includes(term));
  const pageCount = Math.max(1, Math.ceil(filtered.length / DIRECTORY_PAGE_SIZE));
  const page = Math.min(pageCount, Math.max(1, Number.isSafeInteger(requestedPage) ? requestedPage : 1));
  const offset = (page - 1) * DIRECTORY_PAGE_SIZE;
  return { filtered, page, pageCount, items: filtered.slice(offset, offset + DIRECTORY_PAGE_SIZE),
    from: filtered.length ? offset + 1 : 0, to: Math.min(offset + DIRECTORY_PAGE_SIZE, filtered.length) };
}
