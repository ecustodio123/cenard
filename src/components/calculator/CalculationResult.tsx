import type { CostResult } from "../../lib/costs/types";
import { formatCents } from "../../lib/costs/decimal";

const statusLabels = {
  calculated: "Estimación calculada",
  referenceOnly: "Referencia condicionada",
  requiresReview: "Requiere evaluación",
  invalidInput: "Revisa los datos ingresados",
};
export function CalculationResult({ result }: { result: CostResult }) {
  return <section className="cost-design-pending cost-engine-result" aria-labelledby="cost-result-title">
    <h3 id="cost-result-title">{statusLabels[result.status]}</h3>
    {result.status === "requiresReview" && <p className="cost-engine-review">{result.reason}</p>}
    {result.status === "invalidInput" && <ul className="cost-engine-errors">{Object.entries(result.errors).map(([field, message]) => <li key={field}>{message}</li>)}</ul>}
    {result.lines.length > 0 && <div className="cost-engine-lines">
      {result.lines.map((line, index) => <div className="cost-engine-line" key={`${line.label}-${index}`}>
        <h4>{line.label}</h4>
        {line.tax === "plusIgv" ? <dl>
          <div><dt>Base sin IGV</dt><dd>{formatCents(line.baseCents)}</dd></div>
          <div><dt>IGV configurado</dt><dd>{formatCents(line.igvCents!)}</dd></div>
          <div><dt>Importe del concepto</dt><dd>{formatCents(line.amountCents)}</dd></div>
        </dl> : <>
          <p className="cost-engine-amount">{formatCents(line.amountCents)}</p>
          <p className="cost-design-help">{line.tax === "included" ? "IGV incluido; no se grava nuevamente ni se deduce una base tributaria." : line.tax === "netUnconfirmed" ? "Neto publicado; tratamiento de impuestos pendiente de confirmación." : "Sin añadir ni descontar IGV nuevamente de la base introducida."}</p>
        </>}
        <p className="cost-engine-source">{line.source.article} · página{line.source.printedPages.length > 1 ? "s" : ""} impresa{line.source.printedPages.length > 1 ? "s" : ""} {line.source.printedPages.join(", ")}</p>
      </div>)}
    </div>}
    {(result.status === "calculated" || result.status === "referenceOnly") && <div className="cost-engine-sum">
      <p>{result.sum.label}</p><strong>{formatCents(result.sum.cents)}</strong>
      {result.status === "referenceOnly" && result.perPartyCents && <p>Distribución de referencia: 50% por cada parte, {formatCents(result.perPartyCents)} por parte.</p>}
    </div>}
    <div className="cost-engine-notes">{result.notes.map(note => <p key={note}>{note}</p>)}</div>
    <details className="cost-engine-sources"><summary>Consultar referencias del cálculo</summary>
      {result.sources.map(source => <p key={`${source.article}-${source.printedPages.join(",")}-${source.detail}`}><strong>{source.article} · pp. impresas {source.printedPages.join(", ")}.</strong> {source.detail}</p>)}
    </details>
  </section>;
}
