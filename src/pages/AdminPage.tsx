import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { updatePageSeo } from "../lib/seo";
import { AdminDashboard } from "../components/admin/AdminDashboard";
import "./admin.css";

type LoginErrors = { email?: string; password?: string };

// Demonstration only: no identity verification, protected data or persistent session.
export function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [showPanel, setShowPanel] = useState(false);
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
    else if (!emailInput.current?.validity.valid) nextErrors.email = "Ingresa un correo electrónico válido.";
    if (!password.length) nextErrors.password = "Ingresa una contraseña.";
    setErrors(nextErrors);
    if (nextErrors.email) { emailInput.current?.focus(); return; }
    if (nextErrors.password) { passwordInput.current?.focus(); return; }
    // Discard both fields immediately; the panel only keeps an in-memory boolean.
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setShowPanel(true);
  }
  function exit() {
    setShowPanel(false);
    setEmail("");
    setPassword("");
    setShowPassword(false);
    setErrors({});
  }

  if (showPanel) return <AdminDashboard onExit={exit} />;
  return <main className="admin-shell">
    <section className="admin-card" aria-labelledby="admin-login-title">
      <img className="admin-logo" src="/images/logo.png" width="1600" height="624" alt="CNR CENARD Arbitraje" />
        <h1 id="admin-login-title">Administración CENARD</h1>
        <p className="admin-introduction">Ingresa para administrar las nóminas</p>
        <form className="admin-login-form" noValidate autoComplete="off" onSubmit={submit}>
          <div className="admin-field">
            <label htmlFor="admin-email">Correo electrónico</label>
            <input id="admin-email" ref={emailInput} type="email" inputMode="email" autoComplete="off" autoCapitalize="none" spellCheck={false} required
              value={email} onChange={event => { setEmail(event.target.value); setErrors(current => ({ ...current, email: undefined })); }}
              aria-invalid={!!errors.email || undefined} aria-describedby={errors.email ? "admin-email-error" : undefined} />
            {errors.email && <p className="admin-field-error" id="admin-email-error" role="alert">{errors.email}</p>}
          </div>
          <div className="admin-field">
            <label htmlFor="admin-password">Contraseña</label>
            <div className="admin-password-field">
              <input id="admin-password" ref={passwordInput} type={showPassword ? "text" : "password"} autoComplete="off" required
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
          <button className="button admin-submit" type="submit">Ingresar</button>
        </form>
      <div className="admin-demo-note">
        <p>Modo demostración: acceso simulado</p>
        <p>Esta demostración no verifica credenciales ni protege información.</p>
      </div>
    </section>
  </main>;
}
