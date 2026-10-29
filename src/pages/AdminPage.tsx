import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { updatePageSeo } from "../lib/seo";
import { AdminDashboard } from "../components/admin/AdminDashboard";
import { AdminAuthController, initialAdminAuth } from "../lib/admin/auth";
import "./admin.css";

type LoginErrors = { email?: string; password?: string };

// Every administrative route shares this authentication and authorization gate.
export function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [auth] = useState(() => new AdminAuthController(async () => (await import("../lib/supabase")).getPublicSupabaseClient()));
  const access = useSyncExternalStore(auth.subscribe, auth.getSnapshot, () => initialAdminAuth);
  const showPanel = access.status === "authorized";
  useEffect(() => { void auth.start(); return () => auth.stop(); }, [auth]);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const hasOpenedPanel = useRef(false);

  useEffect(() => { updatePageSeo("/admin", false); }, []);
  useEffect(() => {
    if (showPanel) hasOpenedPanel.current = true;
    else if (hasOpenedPanel.current) emailInput.current?.focus();
  }, [showPanel]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: LoginErrors = {};
    if (!email.trim()) nextErrors.email = "Ingresa tu correo electrónico.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) nextErrors.email = "Ingresa un correo electrónico válido.";
    if (!password.length) nextErrors.password = "Ingresa una contraseña.";
    setErrors(nextErrors);
    if (nextErrors.email) { emailInput.current?.focus(); return; }
    if (nextErrors.password) { passwordInput.current?.focus(); return; }
    const request = auth.login(email.trim(), password);
    setEmail("");
    setPassword("");
    setShowPassword(false);
    void request;
  }
  function exit() {
    setEmail(""); setPassword(""); setShowPassword(false); setErrors({});
    void auth.logout();
  }

  if (showPanel) return <AdminDashboard key={access.userId} onExit={exit} />;
  if (access.status === "checking" || access.status === "error") return <main className="admin-shell">
    <section className="admin-card" aria-labelledby="admin-state-title" aria-busy={access.status === "checking"}>
      <img className="admin-logo" src="/images/logo.png" width="1600" height="624" alt="CNR CENARD Arbitraje" />
      <h1 id="admin-state-title">Administración CENARD</h1>
      <div role={access.status === "error" ? "alert" : "status"}>
        <p className="admin-introduction">{access.message ?? "Verificando sesión y permisos…"}</p>
      </div>
      {access.status === "error" && <div className="admin-auth-actions">
        {!access.exitOnly && <button className="button" type="button" onClick={auth.retry}>Reintentar verificación</button>}
        <button className="button button-secondary" type="button" onClick={exit}>Salir</button>
      </div>}
    </section>
  </main>;
  return <main className="admin-shell">
    <section className="admin-card" aria-labelledby="admin-login-title">
      <img className="admin-logo" src="/images/logo.png" width="1600" height="624" alt="CNR CENARD Arbitraje" />
        <h1 id="admin-login-title">Administración CENARD</h1>
        <p className="admin-introduction">Ingresa para administrar las nóminas</p>
        {access.message && <p className="admin-field-error" role="alert">{access.message}</p>}
        <form className="admin-login-form" noValidate onSubmit={submit}>
          <div className="admin-field">
            <label htmlFor="admin-email">Correo electrónico</label>
            <input id="admin-email" ref={emailInput} type="email" inputMode="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required
              value={email} onChange={event => { setEmail(event.target.value); setErrors(current => ({ ...current, email: undefined })); }}
              aria-invalid={!!errors.email || undefined} aria-describedby={errors.email ? "admin-email-error" : undefined} />
            {errors.email && <p className="admin-field-error" id="admin-email-error" role="alert">{errors.email}</p>}
          </div>
          <div className="admin-field">
            <label htmlFor="admin-password">Contraseña</label>
            <div className="admin-password-field">
              <input id="admin-password" ref={passwordInput} type={showPassword ? "text" : "password"} autoComplete="current-password" required
                value={password} onChange={event => { setPassword(event.target.value); setErrors(current => ({ ...current, password: undefined })); }}
                aria-invalid={!!errors.password || undefined} aria-describedby={errors.password ? "admin-password-error" : undefined} />
              <button className="admin-password-toggle" type="button" onClick={() => setShowPassword(current => !current)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"} aria-pressed={showPassword} aria-controls="admin-password">
                {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                <span>{showPassword ? "Ocultar" : "Mostrar"}</span>
              </button>
            </div>
            {errors.password && <p className="admin-field-error" id="admin-password-error" role="alert">{errors.password}</p>}
          </div>
          <button className="button admin-submit" type="submit" disabled={access.status !== "signed-out" && access.status !== "unauthorized"}>Ingresar</button>
        </form>

    </section>
  </main>;
}
