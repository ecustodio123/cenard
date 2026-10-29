import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { PageIntro } from "./components/UI";
import { pages, previewPages } from "./data/site";
import { HomePage } from "./pages/HomePage";
import { AdminPage } from "./pages/AdminPage";
import { ArbitrationPage } from "./pages/Arbitration";
import { JprdPage } from "./pages/Jprd";
import { FaqPage } from "./pages/Faq";
import { DocumentsPage } from "./pages/Documents";
import { ArbitratorsPage } from "./pages/Arbitrators";
import { AdjudicatorsPage } from "./pages/Adjudicators";
import { NotFoundPage } from "./pages/NotFoundPage";
import { CalculatorPage } from "./pages/CalculatorPage";
import { IntegrityPage } from "./pages/Integrity";
import {
  CertificationsPage,
} from "./pages/Resources";
import {
  AboutPage,
  ContactPage,
  InstitutionalOrganizationPage,
} from "./pages/Institution";
import type { ReactNode } from "react";
const components: Record<string, ReactNode> = {
  conocenos: <AboutPage />,
  "organizacion-institucional": <InstitutionalOrganizationPage />,
  certificaciones: <CertificationsPage />,
  arbitraje: <ArbitrationPage />,
  jprd: <JprdPage />,
  documentos: <DocumentsPage />,
  "listado-de-arbitros": <ArbitratorsPage />,
  "nomina-de-adjudicadores": <AdjudicatorsPage />,
  calculadora: <CalculatorPage />,
  "preguntas-frecuentes": <FaqPage />,
  "atalaya-de-integridad": <IntegrityPage />,
  "atalaya-de-integridad/arbitraje": <IntegrityPage service="arbitraje" />,
  "atalaya-de-integridad/jprd": <IntegrityPage service="jprd" />,
  contacto: <ContactPage />,
};
export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminPage />} />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="web/" element={<HomePage />} />
        {pages
          .filter((p) => p.slug)
          .map((p) => (
            <Route
              key={p.slug}
              path={`web/${p.slug}/`}
              element={
                <>
                  {p.slug !== "arbitraje" && p.slug !== "jprd" && p.slug !== "documentos" && p.slug !== "listado-de-arbitros" && p.slug !== "nomina-de-adjudicadores" && p.slug !== "preguntas-frecuentes" && !p.slug.startsWith("atalaya-de-integridad") && p.slug !== "contacto" && p.slug !== "calculadora" && <PageIntro
                    title={p.title}
                    description={p.description}
                    section={p.section}
                  />}
                  {components[p.slug]}
                </>
              }
            />
          ))}
        {previewPages.map(page => <Route key={page.slug} path={`web/${page.slug}/`} element={components[page.slug]} />)}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
