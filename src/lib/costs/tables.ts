import type { CostConfig, RuleSource } from "./types.ts";
export const regulationUrl = "https://cenardarbitraje.com/web/wp-content/uploads/2026/05/REGLAMENTO-DE-COSTOS-2025-ACTUALIZADO.pdf";
const source = (article: string, printedPages: number[], detail: string): RuleSource => ({ article, printedPages, detail });
export const sources = {
  regular: source("Artículo 2", [1, 2], "Escalas del Centro y por cada árbitro; porcentaje sobre cuantía total."),
  request: source("Artículo 2", [1], "Solicitud y reconvención: S/ 1,000 cada una, IGV incluido."),
  emergency: source("Artículo 2", [3], "Modificación expresa publicada el 20/05/2026: S/ 20,000 + IGV por Centro y por árbitro de emergencia."),
  appointment: source("Artículo 2", [2], "Nombramiento en proceso no administrado por el Centro: S/ 2,000, IGV incluido."),
  recusation: source("Artículo 2", [2], "Recusación y remoción en proceso no administrado por el Centro: S/ 2,000, IGV incluido."),
  custody: source("Artículo 2", [2, 3], "Custodia: S/ 2,000 + IGV por cada dos meses."),
  secretary: source("Artículo 2", [3], "Secretaría arbitral ad hoc, proceso no administrado: cuadro de costos del Centro dividido entre 2."),
  copy: source("Artículo 2", [3], "Copia certificada: S/ 7 por hoja, IGV incluido."),
  jprd: source("Artículo 2", [3, 4], "Tabla neta de JPRD, tribunal completo o adjudicador único y Centro; 50% por parte."),
  indeterminate: source("Artículo 3", [4, 5], "Base, excepciones y cuantías preliminares requieren evaluación; no automatizadas."),
  refunds: source("Artículo 5", [5, 6], "Porcentajes de devolución por subetapa; prevalece normativa especial si existe."),
  assignment: source("Artículo 4", [5], "La asignación de costos corresponde a Secretaría General."),
};
export const draftConfig: CostConfig = { igvRate: "0.18", igvAssumption: true };
export const fixedCosts = { scaleBase: 760000n, maximumScale: 46000000n, request: 100000n, emergency: 2000000n, appointment: 200000n, recusation: 200000n, custody: 200000n, copy: 700n };
// Bounds are literal printed soles. The malformed upper bound is deliberately not repaired.
export const regularBands = [
  { min: 0n, max: 50000n, rate: 0n, denominator: 1n },
  { min: 50001n, max: 200000n, rate: 1n, denominator: 100n },
  { min: 200001n, max: 500000n, rate: 1n, denominator: 100n },
  { min: 500001n, max: 2000000n, rate: 8n, denominator: 1000n },
  { min: 2000001n, max: null, rate: 6n, denominator: 1000n, blocked: true, printedUpperBound: "10´000,00.00" },
  { min: 10000001n, max: 50000000n, rate: 4n, denominator: 1000n },
  { min: 50000001n, max: 150000000n, rate: 3n, denominator: 1000n },
  { min: 150000001n, max: null, fixed: fixedCosts.maximumScale, rate: 0n, denominator: 1n },
] as const;
export const jprdBands = [
  { min: 0n, max: 50000000n, tribunal: 1700000n, single: 800000n, centre: 520000n },
  { min: 50000001n, max: 70000000n, tribunal: 1980000n, single: 1000000n, centre: 620000n },
  { min: 70000001n, max: 100000000n, tribunal: 2280000n, single: 1200000n, centre: 720000n },
  { min: 100000001n, max: 150000000n, tribunal: 2580000n, single: 1400000n, centre: 820000n },
  { min: 150000001n, max: null, tribunal: 2880000n, single: 1600000n, centre: 920000n },
] as const;
export const refundStages = [
  { value: "demanda", label: "Demanda", percentage: "97.1%", numerator: 971n, pages: [5] },
  { value: "contestacion", label: "Contestación de demanda", percentage: "94.2%", numerator: 942n, pages: [5] },
  { value: "reconvencion", label: "Reconvención", percentage: "91.3%", numerator: 913n, pages: [5] },
  { value: "contestacion-reconvencion", label: "Contestación de reconvención", percentage: "88.4%", numerator: 884n, pages: [5] },
  { value: "conciliacion", label: "Conciliación", percentage: "79.7%", numerator: 797n, pages: [5] },
  { value: "puntos", label: "Puntos controvertidos", percentage: "67.1%", numerator: 671n, pages: [5] },
  { value: "medios", label: "Medios probatorios", percentage: "54.5%", numerator: 545n, pages: [5] },
  { value: "inspeccion", label: "Inspección/peritaje/constatación", percentage: "41.9%", numerator: 419n, pages: [5] },
  { value: "informes", label: "Informes orales", percentage: "26.4%", numerator: 264n, pages: [5] },
  { value: "laudo", label: "Laudo", percentage: "0%", numerator: 0n, pages: [6] },
] as const;
