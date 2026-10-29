import { Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { PageIntro } from "./components/UI";
import { pages } from "./data/site";
import { HomePage } from "./pages/HomePage";
import { ArbitrationPage } from "./pages/Arbitration";
import { JprdPage } from "./pages/Jprd";
import { DocumentsPage } from "./pages/Documents";
import { NotFoundPage } from "./pages/NotFoundPage";
import { CalculatorPage } from "./pages/CalculatorPage";
import {
  CertificationsPage,
  ProfessionalsPage,
} from "./pages/Resources";
import {
  AboutPage,
  ContactPage,
  FaqPage,
  IntegrityPage,
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
  "listado-de-arbitros": <ProfessionalsPage key="arbitro" kind="arbitro" />,
  "nomina-de-adjudicadores": (
    <ProfessionalsPage key="adjudicador" kind="adjudicador" />
  ),
  calculadora: <CalculatorPage />,
  "servicio-de-arbitraje": <FaqPage />,
  "atalaya-de-integridad": <IntegrityPage />,
  contacto: <ContactPage />,
};
export default function App() {
  return (
    <Routes>
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
                  {p.slug !== "arbitraje" && p.slug !== "jprd" && p.slug !== "documentos" && <PageIntro
                    title={p.title}
                    description={p.description}
                    section={p.section}
                  />}
                  {components[p.slug]}
                </>
              }
            />
          ))}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
