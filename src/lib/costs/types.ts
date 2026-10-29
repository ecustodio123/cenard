export type CostMode = "regular" | "emergencia" | "indeterminada" | "adicionales" | "junta" | "devolucion";
export interface CostInputs {
  amount: string; reconvention: string; arbitrators: string; hasAmount: string;
  contractAmount: string; claims: string; service: string; paid: string;
  stage: string; periods: string; pages: string; adjudicators: string;
}
export interface RuleSource { article: string; printedPages: readonly number[]; detail: string }
export interface CostConfig { igvRate: string | null; igvAssumption: boolean }
// Monetary outputs are integer cents encoded as strings. Never use binary floating point.
export interface CostLine {
  label: string; baseCents: string; igvCents: string | null; amountCents: string;
  tax: "plusIgv" | "included" | "netUnconfirmed" | "unchangedBase";
  source: RuleSource;
}
interface ResultDetails { lines: CostLine[]; notes: string[]; sources: RuleSource[] }
export type CostResult =
  | (ResultDetails & { status: "calculated"; sum: { label: string; cents: string } })
  | (ResultDetails & { status: "referenceOnly"; sum: { label: string; cents: string }; perPartyCents?: string })
  | (ResultDetails & { status: "requiresReview"; reason: string })
  | (ResultDetails & { status: "invalidInput"; errors: Partial<Record<keyof CostInputs | "currency", string>> });
