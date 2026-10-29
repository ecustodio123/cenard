import { useState } from "react";
import { ResourceHeader } from "../components/ResourceUI";
import {
  ConsultationSummary, CurrencySelector, designModes, emptyDesignValues,
  initialDesignForms, ModalityForm, ModeSelector, OrientationLinks,
} from "../components/calculator/CalculatorDesign";
import type { Currency, DesignMode, DesignValues } from "../components/calculator/CalculatorDesign";
import "./calculator-design.css";

const costsRegulation = "https://cenardarbitraje.com/web/wp-content/uploads/2026/05/REGLAMENTO-DE-COSTOS-2025-ACTUALIZADO.pdf";

// UI prototype only. Existing calculator logic is preserved separately and is not called here.
export function CalculatorPage() {
  const [mode, setMode] = useState<DesignMode>("regular");
  const [currency, setCurrency] = useState<Currency>("PEN");
  const [forms, setForms] = useState(initialDesignForms);
  const values = forms[mode];
  function updateField(field: keyof DesignValues, value: string) {
    setForms(current => ({ ...current, [mode]: { ...current[mode], [field]: value } }));
  }
  function clearCurrentForm() {
    setForms(current => ({ ...current, [mode]: emptyDesignValues() }));
  }
  return <div className="cost-design-page">
    <ResourceHeader label="Herramientas institucionales" title="Calculadora de costos" description="Selecciona una modalidad e ingresa los datos de referencia.">
      <div className="cost-design-header-note">
        <p>Versión de diseño. El cálculo de importes todavía no está habilitado.</p>
        <a href={costsRegulation} target="_blank" rel="noopener noreferrer">
          Consultar Reglamento de Costos · PDF<span className="sr-only"> (se abre en otra pestaña)</span>
        </a>
      </div>
    </ResourceHeader>
    <div className="container cost-design-content">
      <ModeSelector mode={mode} onChange={setMode} />
      <div className="cost-design-workspace">
        <form className="cost-design-form" noValidate onSubmit={event => event.preventDefault()} aria-labelledby="cost-form-title">
          <p className="cost-design-kicker">Datos de la consulta</p>
          <h2 id="cost-form-title">{designModes.find(option => option.id === mode)?.label}</h2>
          <CurrencySelector currency={currency} onChange={setCurrency} />
          <div className="cost-design-form-fields">
            {currency === "USD" ? <OrientationLinks dollars /> : <ModalityForm mode={mode} values={values} onChange={updateField} />}
          </div>
          <div className="cost-design-form-actions">
            <div>
              <button className="button cost-design-calculate" type="button" disabled aria-describedby="cost-calculate-help">Calcular costos</button>
              <p id="cost-calculate-help" className="cost-design-help">Disponible después de incorporar la lógica de cálculo.</p>
            </div>
            <button className="button button-secondary cost-design-clear" type="button" onClick={clearCurrentForm}>Limpiar datos</button>
          </div>
        </form>
        <ConsultationSummary mode={mode} currency={currency} values={values} />
      </div>
    </div>
  </div>;
}
