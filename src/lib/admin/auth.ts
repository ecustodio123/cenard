import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminAuthState =
  | { status: "checking"; message?: string }
  | { status: "signed-out"; message?: string }
  | { status: "authorized"; userId: string }
  | { status: "unauthorized"; message: string }
  | { status: "error"; message: string; exitOnly?: boolean };
export const initialAdminAuth: AdminAuthState = { status: "checking" };
const deniedMessage = "Tu cuenta no tiene permisos para acceder al panel administrativo";
export function loginErrorMessage(error: { status?: number; code?: string; name?: string }) {
  if (error.status === 429 || error.code === "over_request_rate_limit" || error.code === "over_email_send_rate_limit") return "Demasiados intentos. Espera unos minutos antes de volver a ingresar.";
  if (error.code === "invalid_credentials" || error.status === 400 || error.status === 401 || error.status === 422) return "No pudimos iniciar sesión. Revisa tu correo y contraseña.";
  return "No pudimos conectar con el servicio de acceso. Comprueba tu conexión y vuelve a intentarlo.";
}

// The SDK owns session storage and refresh. Only the verified user UUID is kept here.
// Generation checks invalidate stale permission requests on sign-out/session change.
export class AdminAuthController {
  private state: AdminAuthState = initialAdminAuth;
  private listeners = new Set<() => void>();
  private generation = 0;
  private active = false;
  private signingIn = false;
  private signingOut = false;
  private exitRequired = false;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private unsubscribe: (() => void) | undefined;
  private client: SupabaseClient | undefined;
  private getClient: () => SupabaseClient | Promise<SupabaseClient>;
  constructor(getClient: () => SupabaseClient | Promise<SupabaseClient>) { this.getClient = getClient; }
  getSnapshot = () => this.state;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private publish(state: AdminAuthState) { this.state = state; this.listeners.forEach(listener => listener()); }
  private invalidate() { this.generation++; clearTimeout(this.timer); }
  async start() {
    this.active = true;
    const ticket = ++this.generation;
    this.publish(initialAdminAuth);
    try {
      const client = await this.getClient();
      if (!this.active || ticket !== this.generation) return;
      this.client = client;
      const { data } = this.client.auth.onAuthStateChange((event) => {
        if (!this.active || this.signingOut) return;
        if (event === "SIGNED_OUT") {
          this.invalidate();
          this.publish({ status: "signed-out" });
        } else if (!this.signingIn && !this.exitRequired) {
          // Never await SDK/network operations inside the auth callback.
          this.scheduleVerification();
        }
      });
      this.unsubscribe = () => data.subscription.unsubscribe();
      this.scheduleVerification();
    } catch {
      if (!this.active || ticket !== this.generation) return;
      this.publish({ status: "error", message: "La conexión administrativa no está configurada correctamente. Revisa las variables públicas de Supabase." });
    }
  }
  stop() { this.active = false; this.invalidate(); this.unsubscribe?.(); }
  private scheduleVerification() {
    this.invalidate();
    this.publish(initialAdminAuth);
    this.timer = setTimeout(() => { void this.verify(); }, 0);
  }
  retry = () => {
    if (this.signingIn || this.signingOut) return;
    if (this.exitRequired) { void this.logout(); return; }
    if (!this.client) { void this.start(); return; }
    this.scheduleVerification();
  };
  private async verify() {
    const ticket = ++this.generation;
    const current = () => this.active && ticket === this.generation;
    const client = this.client;
    if (!client) return;
    try {
      // getSession is only used to detect an absent session; it never grants access.
      const session = await client.auth.getSession();
      if (!current()) return;
      if (session.error) throw session.error;
      if (!session.data.session) { this.publish({ status: "signed-out" }); return; }
      const identity = await client.auth.getUser();
      if (!current()) return;
      if (identity.error) {
        if (identity.error.status === 401 || identity.error.status === 403 || identity.error.code === "refresh_token_not_found") {
          await this.logout("La sesión ya no es válida. Vuelve a ingresar.");
          return;
        }
        throw identity.error;
      }
      if (!identity.data.user) { await this.logout("La sesión ya no es válida. Vuelve a ingresar."); return; }
      const userId = identity.data.user.id;
      const permission = await client.schema("public").from("nominas_administradores")
        .select("user_id").eq("user_id", userId).maybeSingle();
      if (!current()) return;
      if (permission.error) throw permission.error;
      if (!permission.data) {
        await this.logout(deniedMessage, true);
        return;
      }
      if (permission.data.user_id !== userId) throw new Error("Invalid authorization response");
      this.publish({ status: "authorized", userId });
    } catch {
      if (current()) this.publish({ status: "error", message: "No pudimos verificar la sesión y los permisos. Comprueba tu conexión y reintenta la verificación o sal de la sesión." });
    }
  }
  login = async (email: string, password: string) => {
    if (!this.client || this.signingIn || this.signingOut || this.state.status === "checking" || this.state.status === "authorized") return;
    this.invalidate();
    const ticket = this.generation;
    this.signingIn = true;
    this.publish({ status: "checking", message: "Iniciando sesión y verificando permisos…" });
    try {
      const { error } = await this.client.auth.signInWithPassword({ email: email.trim(), password });
      if (!this.active || ticket !== this.generation) return;
      if (error) this.publish({ status: "signed-out", message: loginErrorMessage(error) });
      else this.scheduleVerification();
    } catch {
      if (this.active && ticket === this.generation) this.publish({ status: "signed-out", message: loginErrorMessage({}) });
    } finally { this.signingIn = false; }
  };
  logout = async (message?: string, denied = false) => {
    if (this.signingOut) return;
    this.invalidate();
    const ticket = this.generation;
    this.signingOut = true;
    this.exitRequired = true;
    this.publish({ status: "checking", message: "Cerrando sesión…" });
    try {
      if (!this.client) throw new Error("Missing client");
      const { error } = await this.client.auth.signOut({ scope: "local" });
      if (error) throw error;
      this.exitRequired = false;
      if (this.active && ticket === this.generation) this.publish(denied ? { status: "unauthorized", message: deniedMessage } : { status: "signed-out", message });
    } catch {
      if (this.active && ticket === this.generation) this.publish({ status: "error", exitOnly: true, message: `${denied ? deniedMessage + ". " : ""}No pudimos cerrar la sesión. El acceso permanece bloqueado. Reintenta salir.` });
    } finally { this.signingOut = false; }
  };
}
