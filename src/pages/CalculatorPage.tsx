import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Calculator,
  CheckCircle2,
  LockKeyhole,
  RotateCcw,
} from "lucide-react";
import { Link } from "react-router";
import { Combobox } from "../components/Combobox";
import { Eyebrow } from "../components/UI";
import {
  getTariffAvailability,
  modes,
  validateEstimate,
  type EstimateValues,
  type Mode,
} from "../lib/calculator";
import { pathFor, site } from "../data/site";

export function CalculatorPage() {
  const [mode, setMode] = useState<Mode>("regular");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reviewed, setReviewed] = useState<EstimateValues | null>(null);
  const defaults = {
    currency: "PEN",
    arbitrators: "1",
    reconvention: "no",
    hasAmount: "si",
    claims: "1",
    periods: "1",
    pages: "1",
    stage: "demanda",
  };
  const { register, handleSubmit, control, reset } = useForm<EstimateValues>({
    defaultValues: defaults,
    shouldUnregister: true,
  });
  const [currency, hasAmount, service] = useWatch({
    control,
    name: ["currency", "hasAmount", "service"],
  });
  const availability = getTariffAvailability();
  const chooseMode = (next: Mode) => {
    setMode(next);
    setErrors({});
    setReviewed(null);
    reset(defaults);
  };
  function submit(values: EstimateValues) {
    const next = validateEstimate(mode, values);
    setErrors(next);
    setReviewed(Object.keys(next).length ? null : values);
  }
  function moneyInput(name: string, label: string, optional = false) {
    return (
      <div className="form-field">
        <label htmlFor={name}>
          {label}
          {optional && <span> (opcional)</span>}
        </label>
        <div className={`money-field ${errors[name] ? "field-invalid" : ""}`}>
          <span>{currency === "USD" ? "US$" : "S/"}</span>
          <input
            id={name}
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            {...register(name)}
            aria-invalid={!!errors[name]}
            aria-describedby={`${name}-hint${errors[name] ? ` ${name}-error` : ""}`}
          />
        </div>
        <small id={`${name}-hint`}>
          Sin separadores de miles. Ejemplo: 15000,50 o 15000.50.
        </small>
        {errors[name] && (
          <p role="alert" className="field-error" id={`${name}-error`}>
            {errors[name]}
          </p>
        )}
      </div>
    );
  }
  function countInput(name: string, label: string) {
    return (
      <div className="form-field">
        <label htmlFor={name}>{label}</label>
        <input
          id={name}
          type="number"
          min="1"
          step="1"
          {...register(name)}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
        {errors[name] && (
          <p role="alert" className="field-error" id={`${name}-error`}>
            {errors[name]}
          </p>
        )}
      </div>
    );
  }
  function arbitrators() {
    return (
      <fieldset className="choice-field">
        <legend>Composición arbitral</legend>
        <label>
          <input type="radio" value="1" {...register("arbitrators")} />
          Árbitro único
        </label>
        <label>
          <input type="radio" value="3" {...register("arbitrators")} />
          Tribunal de 3 árbitros
        </label>
      </fieldset>
    );
  }
  return (
    <div className="container page-content">
      <div className="calculator-top">
        <Eyebrow>Elige una modalidad</Eyebrow>
        <Controller name="currency" control={control} render={({ field }) => <Combobox className="currency-select" label="Moneda" value={field.value ?? "PEN"} name={field.name} form="calculator-form" onValueChange={value => { field.onChange(value); setReviewed(null); }} onBlur={field.onBlur} triggerRef={field.ref} options={[{ value: "PEN", label: "PEN · Soles" }, { value: "USD", label: "USD · Dólares" }]} />} />
      </div>
      <div
        className="mode-selector"
        role="group"
        aria-label="Modalidad de cálculo"
      >
        {modes.map((m, i) => (
          <button
            aria-pressed={mode === m.id}
            key={m.id}
            onClick={() => chooseMode(m.id)}
          >
            <span>0{i + 1}</span>
            {m.short}
          </button>
        ))}
      </div>
      <div className="calculator-layout">
        <form
          id="calculator-form"
          noValidate
          onSubmit={handleSubmit(submit)}
          onChange={() => setReviewed(null)}
        >
          <div className="form-heading">
            <span className="eyebrow">DATOS DE LA CONSULTA</span>
            <h2>{modes.find((m) => m.id === mode)?.name}</h2>
          </div>
          {mode === "regular" && (
            <>
              {moneyInput("amount", "Cuantía reclamada")}
              <fieldset className="choice-field">
                <legend>¿Incluye reconvención?</legend>
                <label>
                  <input
                    type="radio"
                    value="no"
                    {...register("reconvention")}
                  />
                  No
                </label>
                <label>
                  <input
                    type="radio"
                    value="si"
                    {...register("reconvention")}
                  />
                  Sí
                </label>
              </fieldset>
              {arbitrators()}
            </>
          )}
          {mode === "emergencia" && (
            <div className="modality-explanation">
              <Calculator size={35} strokeWidth={1.2} aria-hidden="true" />
              <h3>Un procedimiento con condiciones específicas.</h3>
              <p>
                La fuente describe el arbitraje de emergencia con un costo fijo
                asumido por la parte solicitante. Su importe y aplicación deben
                validarse con el reglamento aprobado.
              </p>
            </div>
          )}
          {mode === "indeterminada" && (
            <>
              <fieldset className="choice-field">
                <legend>¿El contrato tiene cuantía?</legend>
                <label>
                  <input type="radio" value="si" {...register("hasAmount")} />
                  Sí
                </label>
                <label>
                  <input type="radio" value="no" {...register("hasAmount")} />
                  No
                </label>
              </fieldset>
              {hasAmount === "si" &&
                moneyInput("contractAmount", "Monto total del contrato")}
              {countInput("claims", "Número de pretensiones indeterminadas")}
              {arbitrators()}
            </>
          )}
          {mode === "adicionales" && (
            <>
              <div className="form-field">
                <Controller name="service" control={control} render={({ field }) => <Combobox id="additional-service" label="Servicio adicional" value={field.value ?? ""} name={field.name} onValueChange={field.onChange} onBlur={field.onBlur} triggerRef={field.ref} invalid={!!errors.service} describedBy={errors.service ? "service-error" : undefined} options={[
                  { value: "", label: "Selecciona un servicio" },
                  { value: "appointment", label: "Nombramiento de árbitro" },
                  { value: "recusation", label: "Recusación y remoción de árbitro" },
                  { value: "custody", label: "Custodia de actuaciones" },
                  { value: "secretary", label: "Secretaría arbitral ad hoc" },
                  { value: "copy", label: "Copia certificada" },
                ]} />} />
                {errors.service && (
                  <p id="service-error" role="alert" className="field-error">
                    {errors.service}
                  </p>
                )}
              </div>
              {service === "custody" &&
                countInput("periods", "Número de bimestres")}
              {service === "secretary" &&
                moneyInput("amount", "Cuantía reclamada")}
              {service === "copy" && countInput("pages", "Número de hojas")}
            </>
          )}
          {mode === "junta" && (
            <>
              {moneyInput("contractAmount", "Cuantía del contrato", true)}
              <p className="caption">
                La fuente utiliza una cuantía opcional para identificar el rango
                de costos de la junta. Los rangos e importes están pendientes de
                validación.
              </p>
            </>
          )}
          {mode === "devolucion" && (
            <>
              {moneyInput("paid", "Monto total pagado")}
              <fieldset className="choice-field vertical">
                <legend>Etapa de desistimiento</legend>
                <label>
                  <input type="radio" value="demanda" {...register("stage")} />
                  Antes de presentar demanda
                </label>
                <label>
                  <input type="radio" value="alegatos" {...register("stage")} />
                  Antes de presentar alegatos
                </label>
              </fieldset>
            </>
          )}
          <div className="form-actions">
            <button className="button" type="submit">
              Revisar datos
            </button>
            <button
              className="reset-button"
              type="button"
              onClick={() => {
                reset(defaults);
                setErrors({});
                setReviewed(null);
              }}
            >
              <RotateCcw size={16} aria-hidden="true" />
              Limpiar
            </button>
          </div>
        </form>
        <aside className="estimate-summary" aria-live="polite">
          <div className="summary-icon">
            {reviewed ? (
              <CheckCircle2 size={28} strokeWidth={1.2} aria-hidden="true" />
            ) : (
              <Calculator size={28} strokeWidth={1.2} aria-hidden="true" />
            )}
          </div>
          <Eyebrow>Resumen de consulta</Eyebrow>
          <h2>{reviewed ? "Datos revisados." : "Primero, los datos."}</h2>
          <p>
            {reviewed
              ? "El formulario tiene un formato válido. Esta revisión no confirma tarifas ni la procedencia jurídica de la consulta."
              : "Selecciona una modalidad y completa el formulario para revisar la información de tu consulta."}
          </p>
          <dl>
            <div>
              <dt>Modalidad</dt>
              <dd>{modes.find((m) => m.id === mode)?.name}</dd>
            </div>
            <div>
              <dt>Moneda</dt>
              <dd>{currency === "USD" ? "USD · Dólares" : "PEN · Soles"}</dd>
            </div>
            <div>
              <dt>Resultado monetario</dt>
              <dd className="pending-result">
                <LockKeyhole size={14} aria-hidden="true" />
                Pendiente de validación
              </dd>
            </div>
          </dl>
          {reviewed && (
            <div className="review-success">
              <CheckCircle2 size={17} aria-hidden="true" />
              Formato de datos verificado
            </div>
          )}
          <div className="summary-note">
            <p>
              {availability.reason} La liquidación definitiva corresponde a
              Secretaría General.
            </p>
          </div>
          <a className="text-link" href={`mailto:${site.emails[1]}`}>
            Consultar a Secretaría
          </a>
          <Link
            className="summary-regulation"
            to={pathFor("documentos") + "?q=costos"}
          >
            Ver reglamentos de costos
          </Link>
        </aside>
      </div>
    </div>
  );
}
