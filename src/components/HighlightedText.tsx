import { highlightParts } from "../lib/highlight";
import "./resource-ui.css";

export function HighlightedText({ text, query }: { text: string; query: string }) {
  return highlightParts(text, query).map((part, index) => part.matched
    ? <mark className="resource-match" key={index}>{part.text}</mark>
    : part.text);
}
