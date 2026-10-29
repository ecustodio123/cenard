import { pathFor, site } from "./site";

export type IntegrityService = "arbitraje" | "jprd";
type IntegrityCategory = {
  id: string;
  title: string;
} & (
  | { available: false }
  | { available: true; description: string; href: string; action: string; externalNote: string }
);
interface IntegrityServiceConfig {
  label: string;
  description: string;
  selectionDescription: string;
  categories: IntegrityCategory[];
}
export const integrityServices: Record<IntegrityService, IntegrityServiceConfig> = {
  arbitraje: {
    label: "Arbitraje",
    description: "Consulta los laudos arbitrales y la disponibilidad de Sanciones / Decisiones del Centro para Arbitraje.",
    selectionDescription: "Laudos arbitrales y Sanciones / Decisiones del Centro.",
    categories: [
      { id: "laudos", title: "Laudos arbitrales", available: true, description: "Accede a la carpeta pública de laudos arbitrales de CENARD.", href: site.laudos, action: "Consultar laudos", externalNote: "Carpeta pública en Google Drive · Se abre en otra pestaña." },
      { id: "sanciones", title: "Sanciones / Decisiones del Centro", available: false },
    ],
  },
  jprd: {
    label: "JPRD",
    description: "Consulta la disponibilidad de Sanciones / Decisiones del Centro y Decisiones de JPRD.",
    selectionDescription: "Sanciones / Decisiones del Centro y Decisiones de JPRD.",
    // Availability and any future destination belong to this service independently.
    categories: [
      { id: "sanciones", title: "Sanciones / Decisiones del Centro", available: false },
      { id: "decisiones", title: "Decisiones de JPRD", available: false },
    ],
  },
};
export const integrityServiceOrder: IntegrityService[] = ["arbitraje", "jprd"];
export const integrityPath = (service: IntegrityService) => pathFor(`atalaya-de-integridad/${service}`);
