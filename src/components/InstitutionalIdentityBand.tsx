import { Link, useLocation } from "react-router";
import { revealInstitutionalNotice } from "../lib/institutional-notice";

export function InstitutionalIdentityBand() {
  const { pathname } = useLocation();
  const isHome = pathname === "/" || pathname === "/web" || pathname === "/web/";
  if (!isHome && !pathname.startsWith("/web/")) return null;
  return <section className="institutional-identity-band" aria-label="Identidad institucional de CENARD">
    <div className="container institutional-identity-band-inner">
      <p><strong>Identidad institucional:</strong> El Centro de Arbitraje de la Asociación para la Promoción Cultural de los Mecanismos Alternativos de Solución de Controversias opera bajo la denominación comercial CENARD.</p>
      <Link to="/web/#identidad-institucional" onClick={() => { if (isHome) revealInstitutionalNotice(); }}>
        Leer comunicado
      </Link>
    </div>
  </section>;
}
