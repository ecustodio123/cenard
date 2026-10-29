import { Combobox } from "../Combobox";
import { Link } from "react-router";
import type { CostInputs, CostResult } from "../../lib/costs/types";
import { refundStages } from "../../lib/costs/tables";
import { CalculationResult } from "./CalculationResult";
import { pathFor, site } from "../../data/site";

export const designModes = [
  { id: "regular", label: "Arbitraje regular" },
  { id: "emergencia", label: "Arbitraje de emergencia" },
  { id: "indeterminada", label: "Cuantía indeterminada" },
  { id: "adicionales", label: "Servicios adicionales" },
  { id: "junta", label: "Junta de Prevención y Resolución de Disputas (JPRD)" },
  { id: "devolucion", label: "Devolución" },
] as const;
export type DesignMode = typeof designModes[number]["id"];
export type Currency = "PEN" | "USD";
export type DesignValues = CostInputs;
export function emptyDesignValues(): DesignValues {
  return { amount: "", reconvention: "", arbitrators: "", hasAmount: "", contractAmount: "", claims: "", service: "", paid: "", stage: "", periods: "", pages: "", adjudicators: "" };
}
export type DesignForms = Record<DesignMode, DesignValues>;
export function initialDesignForms(): DesignForms {
  return {
    regular: emptyDesignValues(), emergencia: emptyDesignValues(),
    indeterminada: emptyDesignValues(), adicionales: emptyDesignValues(),
    junta: emptyDesignValues(), devolucion: emptyDesignValues(),
  };
}
const services = [
  { value: "", label: "Selecciona un servicio" },
  { value: "appointment", label: "Nombramiento de árbitro" },
  { value: "recusation", label: "Recusación y remoción de árbitro" },
  { value: "custody", label: "Custodia de actuaciones" },
  { value: "secretary", label: "Secretaría arbitral ad hoc" },
  { value: "copy", label: "Copia certificada" },
];
const arbitratorOptions = [
  { value: "1", label: "Árbitro único" },
  { value: "3", label: "Tribunal de tres árbitros" },
];
const yesNo = [{ value: "si", label: "Sí" }, { value: "no", label: "No" }];
const stages = refundStages.map(stage => ({ value: stage.value, label: `${stage.label} · ${stage.percentage}` }));
const adjudicatorOptions = [{ value: "1", label: "Adjudicador único" }, { value: "3", label: "Tribunal de tres adjudicadores" }];
type FormErrors = Partial<Record<keyof DesignValues | "currency", string>>;

export function ModeSelector({ mode, onChange }: { mode: DesignMode; onChange: (mode: DesignMode) => void }) {
  return <fieldset className="cost-design-modes">
    <legend><h2>¿Qué deseas consultar?</h2></legend>
    <p id="cost-modes-note" className="cost-design-help">Las reglas definidas permiten estimaciones; los casos ambiguos requieren evaluación de Secretaría General.</p>
    <div className="cost-design-mode-grid">
      {designModes.map(option => <label className="cost-design-mode" key={option.id} data-selected={option.id === mode}>
        <input type="radio" name="cost-design-mode" value={option.id} checked={option.id === mode} onChange={() => onChange(option.id)} aria-describedby="cost-modes-note" />
        <span><strong>{option.label}</strong>{option.id === mode && <small>Seleccionada</small>}</span>
      </label>)}
    </div>
  </fieldset>;
}
export function CurrencySelector({ currency, onChange }: { currency: Currency; onChange: (currency: Currency) => void }) {
  return <Combobox id="cost-design-currency" label="Moneda" value={currency}
    options={[{ value: "PEN", label: "Soles (S/)" }, { value: "USD", label: "Dólares (US$)" }]}
    onValueChange={value => onChange(value as Currency)} />;
}
function Choices({ field, legend, value, options, onChange, error }: {
  field: keyof DesignValues; legend: string; value: string; error?: string;
  options: { value: string; label: string }[];
  onChange: (field: keyof DesignValues, value: string) => void;
}) {
  return <fieldset className="cost-design-choices" aria-invalid={!!error || undefined} aria-describedby={error ? `cost-error-${field}` : undefined}><legend>{legend}</legend><div>
    {options.map(option => <label key={option.value}>
      <input type="radio" name={`cost-${field}`} value={option.value} checked={value === option.value} onChange={() => onChange(field, option.value)} />
      <span>{option.label}</span>
    </label>)}
  </div>{error && <p id={`cost-error-${field}`} className="cost-design-error">{error}</p>}</fieldset>;
}
function AmountField({ field, label, value, hint, onChange, error }: {
  field: keyof DesignValues; label: string; value: string; hint?: string; error?: string;
  onChange: (field: keyof DesignValues, value: string) => void;
}) {
  const id = `cost-${field}`;
  return <div className="cost-design-field"><label htmlFor={id}>{label}</label>
    <div className="cost-design-amount"><span aria-hidden="true">S/</span>
      <input id={id} type="text" inputMode="decimal" value={value} onChange={event => onChange(field, event.target.value)}
        aria-invalid={!!error || undefined} aria-describedby={`${id}-help${error ? ` cost-error-${field}` : ""}`} />
    </div>
    <p id={`${id}-help`} className="cost-design-help">{hint || "Sin separadores de miles; utiliza punto o coma decimal, con hasta dos decimales. Ejemplo: 15000,50."}</p>
    {error && <p id={`cost-error-${field}`} className="cost-design-error">{error}</p>}
  </div>;
}
function CountField({ field, label, values, onChange, error }: { field: "periods" | "pages" | "claims"; label: string; values: DesignValues; onChange: (field: keyof DesignValues, value: string) => void; error?: string }) {
  return <div className="cost-design-field"><label htmlFor={`cost-${field}`}>{label}</label>
    <input id={`cost-${field}`} type="text" inputMode="numeric" value={values[field]} onChange={event => onChange(field, event.target.value)} aria-invalid={!!error || undefined} aria-describedby={error ? `cost-error-${field}` : undefined} />
    {error && <p id={`cost-error-${field}`} className="cost-design-error">{error}</p>}
  </div>;
}
export function ModalityForm({ mode, values, onChange, errors = {} }: {
  mode: DesignMode; values: DesignValues; onChange: (field: keyof DesignValues, value: string) => void; errors?: FormErrors;
}) {
  const arbitrators = <Choices field="arbitrators" legend="Número de árbitros" value={values.arbitrators} options={arbitratorOptions} onChange={onChange} error={errors.arbitrators} />;
  switch (mode) {
    case "regular": return <>
      <AmountField field="amount" label="Cuantía reclamada" value={values.amount} onChange={onChange} error={errors.amount} />
      <Choices field="reconvention" legend="¿Incluye reconvención?" value={values.reconvention} options={yesNo} onChange={onChange} error={errors.reconvention} />
      {arbitrators}
      {values.reconvention === "si" && <p className="cost-design-help">La reconvención requiere evaluación de su base. Se podrán mostrar conceptos conocidos, sin un total combinado definitivo.</p>}
    </>;
    case "emergencia": return <div className="cost-design-information"><p>Se utiliza la modificación expresa del cuadro de emergencia publicada el 20/05/2026. No se añade automáticamente la solicitud del arbitraje regular.</p></div>;
    case "indeterminada": return <>
      <div className="cost-design-information"><p>El artículo 3 requiere determinar la base y las excepciones aplicables. Solicita evaluación de Secretaría General.</p></div>
      <Choices field="hasAmount" legend="¿El contrato tiene cuantía?" value={values.hasAmount} options={yesNo} onChange={onChange} />
      {values.hasAmount === "si" && <>
        <AmountField field="contractAmount" label="Monto total del contrato" value={values.contractAmount} onChange={onChange} />
        <CountField field="claims" label="Número de pretensiones indeterminadas" values={values} onChange={onChange} />
      </>}
      {arbitrators}
      <p className="cost-design-help">Estos datos son de referencia: no se automatizan el 5%, los importes mal escritos ni las excepciones del artículo 3.</p>
    </>;
    case "adicionales": return <>
      <Combobox id="cost-design-service" label="Servicio adicional" value={values.service} options={services} onValueChange={value => onChange("service", value)} invalid={!!errors.service} describedBy={errors.service ? "cost-error-service" : undefined} />
      {errors.service && <p id="cost-error-service" className="cost-design-error">{errors.service}</p>}
      {values.service === "custody" && <CountField field="periods" label="Número de bimestres completos" values={values} onChange={onChange} error={errors.periods} />}
      {values.service === "copy" && <CountField field="pages" label="Número de hojas" values={values} onChange={onChange} error={errors.pages} />}
      {values.service === "secretary" && <AmountField field="amount" label="Cuantía reclamada" value={values.amount} onChange={onChange} error={errors.amount} />}
      {["appointment", "recusation", "secretary"].includes(values.service) && <p className="cost-design-help">Tarifa para procesos no administrados por el Centro.</p>}
    </>;
    case "junta": return <>
      <p className="cost-design-help">Junta de Prevención y Resolución de Disputas: referencia de importes netos publicados, sin confirmar periodicidad ni tratamiento tributario.</p>
      <AmountField field="contractAmount" label="Cuantía del contrato" value={values.contractAmount} onChange={onChange} error={errors.contractAmount} />
      <Choices field="adjudicators" legend="Composición de la Junta" value={values.adjudicators} options={adjudicatorOptions} onChange={onChange} error={errors.adjudicators} />
    </>;
    case "devolucion": return <>
      <AmountField field="paid" label="Base susceptible de devolución" value={values.paid} onChange={onChange} error={errors.paid} hint="Debe ser confirmada por Secretaría General; no necesariamente equivale a todos los pagos realizados. Ingresa el importe sin separadores de miles y con hasta dos decimales." />
      <Combobox id="cost-design-stage" label="Subetapa de devolución" value={values.stage} options={[{ value: "", label: "Selecciona una subetapa" }, ...stages]} onValueChange={value => onChange("stage", value)} invalid={!!errors.stage} describedBy={errors.stage ? "cost-error-stage" : undefined} />
      {errors.stage && <p id="cost-error-stage" className="cost-design-error">{errors.stage}</p>}
      <p className="cost-design-help">Simulación condicionada: la normativa especial puede sustituir el artículo 5. No acredita aprobación ni derecho a devolución.</p>
    </>;
  }
}
export function OrientationLinks({ dollars = false }: { dollars?: boolean }) {
  return <div className={dollars ? "cost-design-dollar-info" : "cost-design-orientation"}>
    {dollars && <p className="cost-design-dollar-title">Para consultas en dólares, comunícate con Secretaría General.</p>}
    <a href={`mailto:${site.emails[1]}`}>{dollars ? site.emails[1] : "Consultar a Secretaría General"}</a>
    <Link to={pathFor("contacto")}>Contactar a CENARD</Link>
    {dollars && <p className="cost-design-help">Los cálculos locales se limitan a soles. No se realiza conversión automática.</p>}
  </div>;
}
export function PendingCalculation() {
  return <div className="cost-design-pending"><h3>Resultado pendiente</h3>
    <p>Completa los datos y selecciona Calcular costos. Si modificas una entrada, deberás volver a calcular.</p>
  </div>;
}
function summaryFields(mode: DesignMode, values: DesignValues): [string, string][] {
  const chosen = (options: { value: string; label: string }[], value: string) => options.find(option => option.value && option.value === value)?.label || "";
  switch (mode) {
    case "regular": return [["Cuantía reclamada", values.amount], ["¿Incluye reconvención?", chosen(yesNo, values.reconvention)], ["Número de árbitros", chosen(arbitratorOptions, values.arbitrators)]];
    case "indeterminada": return [
      ["¿El contrato tiene cuantía?", chosen(yesNo, values.hasAmount)],
      ...(values.hasAmount === "si" ? [["Monto total del contrato", values.contractAmount], ["Pretensiones indeterminadas", values.claims]] as [string, string][] : []),
      ["Número de árbitros", chosen(arbitratorOptions, values.arbitrators)],
    ];
    case "adicionales": return [
      ["Servicio adicional", chosen(services, values.service)],
      ...(values.service === "custody" ? [["Bimestres", values.periods]] as [string, string][] : []),
      ...(values.service === "copy" ? [["Hojas", values.pages]] as [string, string][] : []),
      ...(values.service === "secretary" ? [["Cuantía reclamada", values.amount]] as [string, string][] : []),
    ];
    case "junta": return [["Cuantía del contrato", values.contractAmount], ["Composición de la Junta", chosen(adjudicatorOptions, values.adjudicators)]];
    case "devolucion": return [["Base susceptible de devolución", values.paid], ["Subetapa", chosen(stages, values.stage)]];
    case "emergencia": return [];
  }
}
export function ConsultationSummary({ mode, currency, values, result }: { mode: DesignMode; currency: Currency; values: DesignValues; result: CostResult | null }) {
  const fields = currency === "PEN" ? summaryFields(mode, values) : [];
  return <aside className="cost-design-summary" aria-labelledby="cost-summary-title">
    <p className="cost-design-kicker">Datos de referencia</p>
    <h2 id="cost-summary-title">Resumen de la consulta</h2>
    <p className="cost-design-help">Datos de referencia para una estimación condicionada. La asignación corresponde a Secretaría General.</p>
    <dl>
      <div><dt>Modalidad</dt><dd>{designModes.find(option => option.id === mode)?.label}</dd></div>
      <div><dt>Moneda</dt><dd>{currency === "PEN" ? "Soles (S/)" : "Dólares (US$)"}</dd></div>
      {fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value.trim() || <span className="cost-design-unfilled">Sin completar</span>}</dd></div>)}
    </dl>
    {currency === "USD" && <p className="cost-design-help">Datos numéricos no solicitados en esta vista para dólares. Consulta con Secretaría General.</p>}
    {currency === "PEN" && mode === "emergencia" && <p className="cost-design-help">La estimación de emergencia no requiere cuantía: utiliza los conceptos definidos en la modificación expresa publicada en el documento.</p>}
    {result ? <CalculationResult result={result} /> : <PendingCalculation />}
    <OrientationLinks />
  </aside>;
}
