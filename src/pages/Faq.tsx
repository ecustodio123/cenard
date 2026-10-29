import { Link } from "react-router";
import { ResourceHeader } from "../components/ResourceUI";
import { ExternalLink } from "../components/UI";
import faq from "../data/faq.json";
import { documents } from "../data/documents";
import "./faq.css";

// Only presentation order changes; the original questions, answers, lists and
// document associations stay in the single existing source, src/data/faq.json.
const questions = [faq[1], faq[2], faq[4], faq[3], faq[0]];

export function FaqPage() {
  return <div className="faq-resource-page">
    <ResourceHeader label="Recursos institucionales" title="Preguntas frecuentes sobre arbitraje" description="Consulta información general sobre el arbitraje y el inicio de un proceso en CENARD." />
    <div className="container faq-resource-body">
      <section className="faq-resource-questions" aria-label="Preguntas y respuestas sobre arbitraje">
        <div className="faq-resource-list">
          {questions.map((question, index) => {
            const document = question.documentId ? documents.find(item => item.id === question.documentId) : undefined;
            return <details key={question.q} className="faq-resource-item">
              <summary>
                <span className="faq-resource-number">0{index + 1}</span>
                <span className="faq-resource-question">{question.q}</span>
                <span className="faq-resource-action"><span className="faq-resource-show">Ver respuesta</span><span className="faq-resource-hide">Ocultar respuesta</span></span>
              </summary>
              <div className="faq-resource-answer">
                <div className="faq-resource-reading">
                  {question.items?.length ? <ul>{question.items.map(item => <li key={item}>{item}</li>)}</ul> : <p>{question.a}</p>}
                  {document && <><ExternalLink href={document.urlPublic}>Consultar Reglamento Procesal y Apéndices (PDF)</ExternalLink><span className="faq-resource-document-hint" aria-hidden="true">Abre en otra pestaña.</span></>}
                </div>
              </div>
            </details>;
          })}
        </div>
        <p className="faq-resource-validation">Base editorial sujeta a revisión institucional y jurídica antes de publicar.</p>
      </section>
      <aside className="faq-resource-support" aria-labelledby="faq-resource-support-title">
        <h2 id="faq-resource-support-title">¿Necesitas orientación adicional?</h2>
        <p>Para consultas sobre tu caso, comunícate con Secretaría General a través de nuestros canales de atención.</p>
        <div><Link to="/web/contacto/">Consultar canales de atención</Link><Link to="/web/arbitraje/">Conocer el servicio de arbitraje</Link></div>
      </aside>
    </div>
  </div>;
}
