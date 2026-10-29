import { normalize } from "./search.ts";

export interface HighlightPart { text: string; matched: boolean }

/** Map normalized characters back to original UTF-16 ranges, preserving accents,
 * combining marks and supplementary characters. No regex or HTML from the query. */
export function highlightParts(text: string, query: string): HighlightPart[] {
  const needle = normalize(query.trim());
  if (!needle) return [{ text, matched: false }];
  let normalized = "";
  let offset = 0;
  const ranges: { start: number; end: number }[] = [];
  for (const character of text) {
    const start = offset;
    offset += character.length;
    const folded = normalize(character);
    normalized += folded;
    if (!folded && ranges.length) ranges[ranges.length - 1].end = offset;
    for (let i = 0; i < folded.length; i++) ranges.push({ start, end: offset });
  }
  const parts: HighlightPart[] = [];
  let position = 0;
  let cursor = 0;
  for (let found = normalized.indexOf(needle); found !== -1; found = normalized.indexOf(needle, position)) {
    const start = ranges[found].start;
    const end = ranges[found + needle.length - 1].end;
    if (start > cursor) parts.push({ text: text.slice(cursor, start), matched: false });
    parts.push({ text: text.slice(start, end), matched: true });
    cursor = end;
    position = found + needle.length;
  }
  if (cursor < text.length || !parts.length) parts.push({ text: text.slice(cursor), matched: false });
  return parts;
}
