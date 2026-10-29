// Shared by the informational band and hash navigation. No automatic announcement.
export function revealInstitutionalNotice() {
  const section = document.getElementById("identidad-institucional");
  if (!section) return;
  const disclosure = section.querySelector<HTMLDetailsElement>("details");
  if (disclosure) disclosure.open = true;
  document.getElementById("identidad-institucional-titulo")?.focus({ preventScroll: true });
  section.scrollIntoView({ block: "start", behavior: "auto" });
}
