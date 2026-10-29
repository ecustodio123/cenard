import { useEffect, useRef, useState } from "react";
import { AdminArbitrators } from "./AdminArbitrators";
import { AdminAdjudicators } from "./AdminAdjudicators";
import type { RosterKind } from "../../lib/admin/rosters";

const sectionLabels: Record<RosterKind, string> = { arbitrators: "Nómina de árbitros", adjudicators: "Nómina de adjudicadores" };

export function AdminDashboard({ onExit, userId, onAccessLost }: { onExit: () => void; userId: string; onAccessLost: () => void }) {
  const [section, setSection] = useState<RosterKind>("arbitrators");
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  return <main className="admin-shell admin-shell-dashboard">
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div><img className="admin-logo" src="/images/logo.png" width="1600" height="624" alt="CNR CENARD Arbitraje" /><h1 ref={heading} tabIndex={-1}>Administración CENARD</h1></div>
        <button className="button button-secondary" type="button" onClick={onExit}>Salir</button>
      </header>
      <nav id="admin-roster-nav" className="admin-roster-nav" aria-label="Nóminas administrativas">
        {(["arbitrators", "adjudicators"] as const).map(kind => <button key={kind} type="button" aria-pressed={section === kind} aria-controls={`admin-section-${kind}`} onClick={() => setSection(kind)}>{sectionLabels[kind]}</button>)}
      </nav>
      {(["arbitrators", "adjudicators"] as const).map(kind => <section key={kind} id={`admin-section-${kind}`} className="admin-roster-panel" hidden={section !== kind} aria-labelledby={`admin-${kind}-title`}>
        {kind === "arbitrators" ? <AdminArbitrators userId={userId} onAccessLost={onAccessLost} /> : <AdminAdjudicators userId={userId} onAccessLost={onAccessLost} />}
      </section>)}
    </div>
  </main>;
}
