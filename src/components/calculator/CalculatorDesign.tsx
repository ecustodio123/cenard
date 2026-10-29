import { Combobox } from "../Combobox";
import { Link } from "react-router";
import { pathFor, site } from "../../data/site";

export const designModes = [
  { id: "regular", label: "Arbitraje regular" },
  { id: "emergencia", label: "Arbitraje de emergencia" },
  { id: "indeterminada", label: "Cuantía indeterminada" },
  { id: "adicionales", label: "Servicios adicionales" },
  { id: "junta", label: "Junta de prevención" },
  { id: "devolucion", label: "Devolución" },
] as const;
export type DesignMode = typeof designModes[number]["id"];
export type Currency = "PEN" | "USD";
export interface DesignValues {
  amount: string;
  reconvention: string;
  arbitrators: string;
  hasAmount: string;
  contractAmount: string;
  claims: string;
  service: string;
  paid: string;
  stage: string;
}
export function emptyDesignValues(): DesignValues {
  return { amount: "", reconvention: "", arbitrators: "", hasAmount: "", contractAmount: "", claims: "", service: "", paid: "", stage: "" };
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
const stages = [
  { value: "demanda", label: "Antes de presentar demanda" },
  { value: "alegatos", label: "Antes de presentar alegatos" },
];

export function ModeSelector({ mode, onChange }: { mode: DesignMode; onChange: (mode: DesignMode) => void }) {
  return <fieldset className="cost-design-modes">
    <legend><h2>¿Qué deseas consultar?</h2></legend>
    <p id="cost-modes-note" className="cost-design-help">Categorías provisionales pendientes de contraste con el Reglamento de Costos.</p>
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
function Choices({ field, legend, value, options, onChange }: {
  field: keyof DesignValues; legend: string; value: string;
  options: { value: string; label: string }[];
  onChange: (field: keyof DesignValues, value: string) => void;
}) {
  return <fieldset className="cost-design-choices"><legend>{legend}</legend><div>
    {options.map(option => <label key={option.value}>
      <input type="radio" name={`cost-${field}`} value={option.value} checked={value === option.value} onChange={() => onChange(field, option.value)} />
      <span>{option.label}</span>
    </label>)}
  </div></fieldset>;
}
function AmountField({ field, label, value, optional, onChange }: {
  field: keyof DesignValues; label: string; value: string; optional?: boolean;
  onChange: (field: keyof DesignValues, value: string) => void;
}) {
  const id = `cost-${field}`;
  return <div className="cost-design-field"><label htmlFor={id}>{label}</label>
    <div className="cost-design-amount"><span aria-hidden="true">S/</span>
      <input id={id} type="text" inputMode="decimal" value={value} onChange={event => onChange(field, event.target.value)} aria-describedby={optional ? `${id}-help` : undefined} />
    </div>
    {optional && <p id={`${id}-help`} className="cost-design-help">Opcional en esta vista de diseño</p>}
  </div>;
}
export function ModalityForm({ mode, values, onChange }: {
  mode: DesignMode; values: DesignValues; onChange: (field: keyof DesignValues, value: string) => void;
}) {
  const arbitrators = <Choices field="arbitrators" legend="Número de árbitros" value={values.arbitrators} options={arbitratorOptions} onChange={onChange} />;
  switch (mode) {
    case "regular": return <>
      <AmountField field="amount" label="Cuantía reclamada" value={values.amount} onChange={onChange} />
      <Choices field="reconvention" legend="¿Incluye reconvención?" value={values.reconvention} options={yesNo} onChange={onChange} />
      {arbitrators}
    </>;
    case "emergencia": return <div className="cost-design-information"><p>Los conceptos y condiciones de esta modalidad se incorporarán después de revisar el Reglamento de Costos.</p></div>;
    case "indeterminada": return <>
      <Choices field="hasAmount" legend="¿El contrato tiene cuantía?" value={values.hasAmount} options={yesNo} onChange={onChange} />
      {values.hasAmount === "si" && <>
        <AmountField field="contractAmount" label="Monto total del contrato" value={values.contractAmount} onChange={onChange} />
        <div className="cost-design-field"><label htmlFor="cost-claims">Número de pretensiones indeterminadas</label>
          <input id="cost-claims" type="text" inputMode="numeric" value={values.claims} onChange={event => onChange("claims", event.target.value)} />
        </div>
      </>}
      {arbitrators}
      <p className="cost-design-help">Estas condiciones reproducen provisionalmente la interfaz antigua, sin confirmar todavía su correspondencia normativa.</p>
    </>;
    case "adicionales": return <>
      <Combobox id="cost-design-service" label="Servicio adicional" value={values.service} options={services} onValueChange={value => onChange("service", value)} />
      <div className="cost-design-information"><p>Los datos requeridos para este servicio se definirán al revisar el Reglamento de Costos.</p></div>
    </>;
    case "junta": return <AmountField field="contractAmount" label="Cuantía del contrato" value={values.contractAmount} onChange={onChange} optional />;
    case "devolucion": return <>
      <AmountField field="paid" label="Monto total pagado" value={values.paid} onChange={onChange} />
      <Choices field="stage" legend="Etapa de desistimiento" value={values.stage} options={stages} onChange={onChange} />
    </>;
  }
}
export function OrientationLinks({ dollars = false }: { dollars?: boolean }) {
  return <div className={dollars ? "cost-design-dollar-info" : "cost-design-orientation"}>
    {dollars && <p className="cost-design-dollar-title">Para consultas en dólares, comunícate con Secretaría General.</p>}
    <a href={`mailto:${site.emails[1]}`}>{dollars ? site.emails[1] : "Consultar a Secretaría General"}</a>
    <Link to={pathFor("contacto")}>Contactar a CENARD</Link>
    {dollars && <p className="cost-design-help">Comportamiento provisional basado en la interfaz anterior y pendiente de validación normativa.</p>}
  </div>;
}
export function PendingCalculation() {
  return <div className="cost-design-pending"><h3>Resultado pendiente</h3>
    <p>Los importes se mostrarán cuando se incorpore y valide la lógica del Reglamento de Costos.</p>
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
    case "adicionales": return [["Servicio adicional", chosen(services, values.service)]];
    case "junta": return [["Cuantía del contrato", values.contractAmount]];
    case "devolucion": return [["Monto total pagado", values.paid], ["Etapa de desistimiento", chosen(stages, values.stage)]];
    case "emergencia": return [];
  }
}
export function ConsultationSummary({ mode, currency, values }: { mode: DesignMode; currency: Currency; values: DesignValues }) {
  const fields = currency === "PEN" ? summaryFields(mode, values) : [];
  return <aside className="cost-design-summary" aria-labelledby="cost-summary-title">
    <p className="cost-design-kicker">Datos de referencia</p>
    <h2 id="cost-summary-title">Resumen de la consulta</h2>
    <p className="cost-design-help">Los datos se muestran tal como los ingresas, sin cálculos ni validación normativa.</p>
    <dl>
      <div><dt>Modalidad</dt><dd>{designModes.find(option => option.id === mode)?.label}</dd></div>
      <div><dt>Moneda</dt><dd>{currency === "PEN" ? "Soles (S/)" : "Dólares (US$)"}</dd></div>
      {fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value.trim() || <span className="cost-design-unfilled">Sin completar</span>}</dd></div>)}
    </dl>
    {currency === "USD" && <p className="cost-design-help">Datos numéricos no solicitados en esta vista para dólares. Consulta con Secretaría General.</p>}
    {currency === "PEN" && mode === "emergencia" && <p className="cost-design-help">Sin campos de entrada definidos para esta modalidad en la vista de diseño.</p>}
    <PendingCalculation />
    <OrientationLinks />
  </aside>;
}
