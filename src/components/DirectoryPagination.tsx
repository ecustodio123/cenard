import { directoryPageNumbers } from "../lib/arbitrator-directory";

export function DirectoryPagination({ page, pageCount, from, to, total, compact, onPageChange, hideSingle = false }: {
  page: number; pageCount: number; from: number; to: number; total: number;
  compact: boolean; onPageChange: (page: number) => void; hideSingle?: boolean;
}) {
  if (hideSingle && pageCount <= 1) return null;
  return <nav className="arb-pagination" aria-label="Páginas de la nómina"><p>Mostrando {from}–{to} de {total} registros</p><div><button disabled={page === 1} onClick={() => onPageChange(page - 1)}>Anterior</button><div className="arb-page-numbers">{directoryPageNumbers(page, pageCount, compact).map((number, index) => number === "…" ? <span key={`gap-${index}`} aria-hidden="true">…</span> : <button key={number} aria-label={`Página ${number}`} aria-current={number === page ? "page" : undefined} disabled={number === page} onClick={() => onPageChange(number)}>{number}</button>)}</div><button disabled={page === pageCount} onClick={() => onPageChange(page + 1)}>Siguiente</button></div></nav>;
}
