import { useRef, useState } from "react";
import { ResourceHeader } from "../components/ResourceUI";
import {
  ConsultationSummary, CurrencySelector, designModes, emptyDesignValues,
  initialDesignForms, ModalityForm, ModeSelector, OrientationLinks,
} from "../components/calculator/CalculatorDesign";
import type { Currency, DesignMode, DesignValues } from "../components/calculator/CalculatorDesign";
import "./calculator-design.css";

import { calculateCosts } from "../lib/costs/engine";
import { regulationUrl as costsRegulation } from "../lib/costs/tables";
import type { CostResult } from "../lib/costs/types";

// Local draft engine. No amounts are sent or persisted. Existing legacy logic is not used.
export function CalculatorPage() {
  const [mode, setMode] = useState<DesignMode>("regular");
  const [currency, setCurrency] = useState<Currency>("PEN");
  const [forms, setForms] = useState(initialDesignForms);
  const [result, setResult] = useState<CostResult | null>(null);
  const [changed, setChanged] = useState(false);
  const resultRegion = useRef<HTMLDivElement>(null);
  const values = forms[mode];
  const errors = result?.status === "invalidInput" ? result.errors : {};
  function invalidate() { setResult(null); setChanged(true); }
  function calculate() {
    setResult(calculateCosts(mode, values, currency));
    setChanged(false);
    requestAnimationFrame(() => {
      resultRegion.current?.focus({ preventScroll: true });
      resultRegion.current?.scrollIntoView({ block: "start", behavior: "auto" });
    });
  }
  function updateField(field: keyof DesignValues, value: string) {
    setForms(current => ({ ...current, [mode]: { ...current[mode], [field]: value } }));
    invalidate();
  }
  function clearCurrentForm() {
    setForms(current => ({ ...current, [mode]: emptyDesignValues() }));
    setResult(null);
    setChanged(false);
  }
  return <div className="cost-design-page">
    <ResourceHeader label="Herramientas institucionales" title="Calculadora de costos" description="Selecciona una modalidad e ingresa los datos de referencia.">
      <div className="cost-design-header-note">
        <p>Borrador de estimación local. Reglas, supuestos y resultados sujetos a confirmación institucional antes de publicar como herramienta funcional.</p>
        <a href={costsRegulation} target="_blank" rel="noopener noreferrer">
          Consultar Reglamento de Costos · PDF<span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
      </div>
    </ResourceHeader>
    <div className="container cost-design-content">
      <ModeSelector mode={mode} onChange={next => { setMode(next); invalidate(); }} />
      <div className="cost-design-workspace">
        <form className="cost-design-form" noValidate onSubmit={event => { event.preventDefault(); if (currency === "PEN") calculate(); }} aria-labelledby="cost-form-title">
          <p className="cost-design-kicker">Datos de la consulta</p>
          <h2 id="cost-form-title">{designModes.find(option => option.id === mode)?.label}</h2>
          <CurrencySelector currency={currency} onChange={next => { setCurrency(next); invalidate(); }} />
          <div className="cost-design-form-fields">
            {currency === "USD" ? <OrientationLinks dollars /> : <ModalityForm mode={mode} values={values} onChange={updateField} errors={errors} />}
          </div>
          <div className="cost-design-form-actions">
            <div>
              <button className="button cost-design-calculate" type="submit" disabled={currency === "USD"} aria-describedby="cost-calculate-help">Calcular costos</button>
              <p id="cost-calculate-help" className="cost-design-help">{currency === "USD" ? "Para dólares, consulta con Secretaría General." : mode === "indeterminada" ? "Esta modalidad requiere evaluación y no genera importes." : "Estimación condicionada; no constituye liquidación ni obligación de pago."}</p>
            </div>
            <button className="button button-secondary cost-design-clear" type="button" onClick={clearCurrentForm}>Limpiar datos</button>
          </div>
        </form>
        <div className="cost-engine-result-region" ref={resultRegion} tabIndex={-1} aria-label="Resumen y resultado de la consulta">
          <p className="sr-only" role="status">{result ? result.status === "invalidInput" ? "Revisa los datos ingresados." : result.status === "requiresReview" ? "Esta consulta requiere evaluación." : "Resultado disponible en el resumen." : changed ? "Datos modificados. El resultado anterior ya no es válido; vuelve a calcular." : "Sin cálculo realizado."}</p>
          <ConsultationSummary mode={mode} currency={currency} values={values} result={result} />
          {changed && <p className="cost-design-help cost-engine-changed">Datos modificados. Vuelve a calcular para obtener una nueva referencia.</p>}
        </div>
      </div>
    </div>
  </div>;
}
