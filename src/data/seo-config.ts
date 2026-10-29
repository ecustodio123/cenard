export const officialOrigin = "https://cenardarbitraje.com";

export function productionIndexable(env: Record<string, string | undefined>) {
  // Cloudflare branch previews must remain excluded, even with production variables.
  if (env.CF_PAGES_BRANCH && env.CF_PAGES_BRANCH !== (env.PRODUCTION_BRANCH || "main")) return false;
  if (env.SITE_INDEXABLE !== undefined && !["true", "false"].includes(env.SITE_INDEXABLE)) {
    throw new Error("SITE_INDEXABLE must be true or false");
  }
  return env.SITE_INDEXABLE !== "false";
}

// Existing WordPress URLs, verified against the public site's navigation.
export const legacyRedirects = [
  ["/web/organigrama/", "/web/organizacion-institucional/#estructura-institucional"],
  ["/web/secretaria-general/", "/web/organizacion-institucional/#direccion-secretaria"],
  ["/web/alto-consejo/", "/web/organizacion-institucional/#alto-consejo"],
  ["/web/servicio-de-arbitraje/", "/web/preguntas-frecuentes/"],
];
