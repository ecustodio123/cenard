import { z } from "zod";

export const modes = [
  { id: "regular", name: "Arbitraje regular", short: "Arbitraje regular" },
  { id: "emergencia", name: "Arbitraje de emergencia", short: "Emergencia" },
  {
    id: "indeterminada",
    name: "Cuantía indeterminada",
    short: "Cuantía indeterminada",
  },
  {
    id: "adicionales",
    name: "Servicios adicionales",
    short: "Servicios adicionales",
  },
  { id: "junta", name: "Junta de prevención", short: "Junta de prevención" },
  { id: "devolucion", name: "Devolución", short: "Devolución" },
] as const;
export type Mode = (typeof modes)[number]["id"];
export type EstimateValues = Record<string, string>;

// Single decimal separator; grouping separators and scientific notation are rejected.
export const amountSchema = z
  .string()
  .trim()
  .regex(
    /^\d+(?:[.,]\d{1,2})?$/,
    "Usa un importe sin separadores de miles y con hasta dos decimales.",
  )
  .transform((v) => Number(v.replace(",", ".")))
  .pipe(
    z
      .number()
      .positive("El importe debe ser mayor que cero.")
      .max(
        Number.MAX_SAFE_INTEGER / 100,
        "El importe supera el máximo admitido.",
      ),
  );
const countSchema = z
  .string()
  .regex(/^\d+$/, "Ingresa un número entero.")
  .transform(Number)
  .pipe(
    z
      .number()
      .int()
      .min(1, "Ingresa al menos 1.")
      .max(1_000_000, "La cantidad supera el máximo admitido."),
  );

export function validateEstimate(
  mode: Mode,
  values: EstimateValues,
): Record<string, string> {
  const fields: Record<string, z.ZodType> = {
    currency: z.enum(["PEN", "USD"]),
  };
  if (mode === "regular") {
    fields.amount = amountSchema;
    fields.arbitrators = z.enum(["1", "3"]);
    fields.reconvention = z.enum(["no", "si"]);
  }
  if (mode === "indeterminada") {
    fields.claims = countSchema;
    fields.arbitrators = z.enum(["1", "3"]);
    fields.hasAmount = z.enum(["si", "no"]);
    if (values.hasAmount === "si") fields.contractAmount = amountSchema;
  }
  if (mode === "adicionales") {
    fields.service = z.enum(
      ["appointment", "recusation", "custody", "secretary", "copy"],
      { error: "Selecciona un servicio." },
    );
    if (values.service === "custody") fields.periods = countSchema;
    if (values.service === "copy") fields.pages = countSchema;
    if (values.service === "secretary") fields.amount = amountSchema;
  }
  if (mode === "junta" && values.contractAmount?.trim())
    fields.contractAmount = amountSchema;
  if (mode === "devolucion") {
    fields.paid = amountSchema;
    fields.stage = z.enum(["demanda", "alegatos"]);
  }
  const result = z.object(fields).safeParse(values);
  if (result.success) return {};
  return Object.fromEntries(
    result.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
  );
}

// No tariff engine is implemented until CENARD approves rules and reference cases.
export function getTariffAvailability() {
  return {
    status: "pending-validation",
    canCalculate: false,
    reason:
      "Reglas, tramos, impuestos y redondeos pendientes de aprobación institucional.",
  } as const;
}
