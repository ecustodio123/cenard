import { add, fraction, multiply, positiveCents, positiveInteger, roundHalfUp, taxRate } from "./decimal.ts";
import type { Fraction } from "./decimal.ts";
import { draftConfig, fixedCosts, jprdBands, refundStages, regularBands, sources } from "./tables.ts";
import type { CostConfig, CostInputs, CostLine, CostMode, CostResult, RuleSource } from "./types.ts";

class InputError extends Error {
  field: keyof CostInputs;
  constructor(field: keyof CostInputs, message: string) { super(message); this.field = field; }
}
class ReviewRequired extends Error {
  source: RuleSource;
  constructor(message: string, source: RuleSource) { super(message); this.source = source; }
}
function amount(input: CostInputs, field: keyof CostInputs): bigint {
  const value = positiveCents(input[field]);
  if (value === null) throw new InputError(field, "Ingresa un importe positivo, sin separadores de miles, con punto o coma decimal y hasta dos decimales. No se admite notación exponencial.");
  return value;
}
function quantity(input: CostInputs, field: keyof CostInputs): bigint {
  const value = positiveInteger(input[field]);
  if (value === null) throw new InputError(field, "Ingresa una cantidad entera positiva, sin separadores ni decimales.");
  return value;
}
function choice(input: CostInputs, field: keyof CostInputs, allowed: readonly string[]): string {
  if (!allowed.includes(input[field])) throw new InputError(field, "Selecciona una opción.");
  return input[field];
}
export function regularScale(cents: bigint): Fraction {
  if (cents <= 0n) throw new InputError("amount", "La cuantía debe ser positiva.");
  const band = regularBands.find(row => !("blocked" in row) && cents >= row.min * 100n && (row.max === null || cents <= row.max * 100n));
  if (!band) throw new ReviewRequired("La cuantía cae en un hueco entre límites o en el tramo cuyo límite superior impreso «10´000,00.00» requiere confirmación. No se corrige ni se redondea la cuantía para asignarle un tramo.", sources.regular);
  if ("fixed" in band) return fraction(band.fixed);
  return add(fraction(fixedCosts.scaleBase), multiply(fraction(cents), fraction(band.rate, band.denominator)));
}
function line(label: string, cents: bigint, tax: CostLine["tax"], source: RuleSource): CostLine {
  return { label, baseCents: cents.toString(), igvCents: null, amountCents: cents.toString(), tax, source };
}
const sumLines = (lines: CostLine[]) => lines.reduce((sum, item) => sum + BigInt(item.amountCents), 0n).toString();

export function calculateCosts(mode: CostMode, input: CostInputs, currency: string, config: CostConfig = draftConfig): CostResult {
  const lines: CostLine[] = [];
  const notes = [
    "Estimación o referencia condicionada; no constituye liquidación definitiva, obligación de pago ni cotización aprobada. La asignación corresponde a Secretaría General (artículo 4, página impresa 5). No se afirma vigencia actual ni se realiza un cálculo histórico.",
    "Criterio técnico provisional: redondeo decimal half-up a dos decimales por concepto. Se redondea la base antes de aplicar IGV y después el impuesto; cada árbitro se trata como un concepto separado y se suman los importes mostrados. Pendiente de aprobación institucional.",
  ];
  const references: RuleSource[] = [sources.assignment];
  const useSource = (source: RuleSource) => { if (!references.includes(source)) references.push(source); };
  const details = () => ({ lines, notes: [...new Set(notes)], sources: [...references] });
  const review = (reason: string): CostResult => ({ ...details(), status: "requiresReview", reason });
  const included = (label: string, cents: bigint, source: RuleSource) => { useSource(source); lines.push(line(label, cents, "included", source)); };
  const taxable = (label: string, exact: Fraction, source: RuleSource) => {
    useSource(source);
    const rate = taxRate(config.igvRate);
    if (!rate) throw new ReviewRequired("La tasa de IGV no está configurada de forma válida. Debe confirmarse antes de calcular los conceptos gravados.", source);
    notes.push(`IGV configurado: ${config.igvRate === "0.18" ? "18%" : `${config.igvRate} como fracción decimal`}. ${config.igvAssumption ? "Supuesto del borrador pendiente de confirmación antes de publicar; el PDF no fija este porcentaje." : "Tasa configurada externamente; no extraída del PDF."}`);
    const base = roundHalfUp(exact);
    const igv = roundHalfUp(multiply(fraction(base), rate));
    lines.push({ label, baseCents: base.toString(), igvCents: igv.toString(), amountCents: (base + igv).toString(), tax: "plusIgv", source });
  };
  const calculated = (label = "Suma estimada de los conceptos mostrados"): CostResult => ({ ...details(), status: "calculated", sum: { label, cents: sumLines(lines) } });
  try {
    if (currency === "USD") return review("Para consultas en dólares, comunícate con Secretaría General. No se realiza conversión automática.");
    if (currency !== "PEN") return { ...details(), status: "invalidInput", errors: { currency: "Selecciona soles o dólares." } };
    switch (mode) {
      case "regular": {
        const q = amount(input, "amount");
        const n = choice(input, "arbitrators", ["1", "3"]);
        const reconvention = choice(input, "reconvention", ["si", "no"]);
        included("Solicitud de arbitraje", fixedCosts.request, sources.request);
        if (reconvention === "si") included("Cargo publicado por reconvención", fixedCosts.request, sources.request);
        const f = regularScale(q);
        taxable(reconvention === "si" ? "Centro sobre cuantía ingresada (referencia parcial)" : "Honorarios del Centro", f, sources.regular);
        for (const arbitrator of n === "1" ? ["único"] : ["1", "2", "3"]) {
          taxable(`Honorarios del árbitro ${arbitrator}${reconvention === "si" ? " sobre cuantía ingresada (referencia parcial)" : ""}`, f, sources.regular);
        }
        if (reconvention === "si") return review("El PDF publica el cargo de reconvención, pero no define claramente cómo agregar su cuantía a la base. Los conceptos mostrados son parciales; no hay un total combinado definitivo y no se asume que únicamente se añaden S/ 1,000.");
        return calculated();
      }
      case "emergencia":
        taxable("Centro · modificación publicada el 20/05/2026", fraction(fixedCosts.emergency), sources.emergency);
        taxable("Árbitro de emergencia · modificación publicada el 20/05/2026", fraction(fixedCosts.emergency), sources.emergency);
        notes.push("Se aplica la modificación expresa del cuadro de emergencia: S/ 20,000 netos por concepto. No se añade la solicitud del arbitraje regular.");
        return calculated();
      case "adicionales": {
        const service = choice(input, "service", ["appointment", "recusation", "custody", "secretary", "copy"]);
        if (service === "appointment") included("Nombramiento de árbitro · proceso no administrado por el Centro", fixedCosts.appointment, sources.appointment);
        if (service === "recusation") included("Recusación y remoción · proceso no administrado por el Centro", fixedCosts.recusation, sources.recusation);
        if (service === "custody") {
          const periods = quantity(input, "periods");
          taxable(`Custodia de actuaciones · ${periods} bimestre(s)`, fraction(fixedCosts.custody * periods), sources.custody);
        }
        if (service === "copy") {
          const pages = quantity(input, "pages");
          included(`Copia certificada · ${pages} hoja(s)`, fixedCosts.copy * pages, sources.copy);
        }
        if (service === "secretary") {
          const f = regularScale(amount(input, "amount"));
          taxable("Secretaría arbitral ad hoc · proceso no administrado por el Centro", multiply(f, fraction(1n, 2n)), sources.secretary);
          useSource(sources.regular);
        }
        return calculated();
      }
      case "junta": {
        useSource(sources.jprd);
        const q = amount(input, "contractAmount");
        const composition = choice(input, "adjudicators", ["1", "3"]);
        if (q === 10000000000n) return review("En S/ 100,000,000 las filas del Centro se solapan en el PDF. Secretaría General debe confirmar el importe aplicable.");
        const band = jprdBands.find(row => q >= row.min * 100n && (row.max === null || q <= row.max * 100n));
        if (!band) return review("La cuantía cae en un hueco decimal entre límites publicados de JPRD. No se modifica ni redondea para asignarle un rango.");
        lines.push(line("Centro · neto publicado", band.centre, "netUnconfirmed", sources.jprd));
        lines.push(line(composition === "1" ? "Adjudicador único · neto publicado" : "Tribunal completo de tres adjudicadores · neto publicado", composition === "1" ? band.single : band.tribunal, "netUnconfirmed", sources.jprd));
        notes.push("Referencia neta sin añadir ni descontar impuestos: su tratamiento requiere confirmación. No se afirma periodicidad mensual ni costo total de ejecución. El importe del tribunal es por el tribunal completo y su distribución entre integrantes es igualitaria, sin liquidar asignaciones individuales.");
        const sum = sumLines(lines);
        return { ...details(), status: "referenceOnly", sum: { label: "Suma neta de referencia", cents: sum }, perPartyCents: (BigInt(sum) / 2n).toString() };
      }
      case "indeterminada":
        useSource(sources.indeterminate);
        return review("El artículo 3 requiere determinar la base y las excepciones aplicables. Solicita evaluación de Secretaría General.");
      case "devolucion": {
        useSource(sources.refunds);
        const base = amount(input, "paid");
        const stage = refundStages.find(option => option.value === input.stage);
        if (!stage) throw new InputError("stage", "Selecciona una subetapa de devolución.");
        const result = roundHalfUp(multiply(fraction(base), fraction(stage.numerator, 1000n)));
        const source = { ...sources.refunds, printedPages: stage.pages };
        useSource(source);
        lines.push(line(`Simulación: ${stage.label} · ${stage.percentage}`, result, "unchangedBase", source));
        notes.push("Base susceptible de devolución ingresada: debe ser confirmada por Secretaría General y no necesariamente equivale a todos los pagos. Se aplica el porcentaje de la subetapa sin añadir ni descontar IGV de nuevo. La normativa especial puede sustituir el artículo 5. Esta simulación no acredita derecho ni aprobación de devolución.");
        return { ...details(), status: "referenceOnly", sum: { label: "Simulación condicionada de devolución", cents: result.toString() } };
      }
      default: return review("La modalidad requiere evaluación de Secretaría General.");
    }
  } catch (error) {
    if (error instanceof InputError) return { ...details(), lines: [], status: "invalidInput", errors: { [error.field]: error.message } };
    if (error instanceof ReviewRequired) { useSource(error.source); return review(error.message); }
    throw error;
  }
}
