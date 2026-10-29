import type { SupabaseClient } from "@supabase/supabase-js";
import { adaptPublicArbitrators } from "../public-arbitrators.ts";
import type { PublicArbitrator } from "../public-arbitrators.ts";
import { publicArbitratorColumns } from "../api/public-arbitrators.ts";
import { arbitratorProfessions, groupOptions, qualificationOptions } from "./rosters.ts";
import type { RosterDraft, RosterErrors } from "./rosters.ts";

export interface AdminArbitrator extends PublicArbitrator { visible: boolean }
export const adminArbitratorColumns = `${publicArbitratorColumns},visible`;
export class AdminArbitratorError extends Error {
  accessLost: boolean;
  constructor(message: string, accessLost = false) { super(message); this.accessLost = accessLost; }
}
export function validateArbitratorDraft(draft: RosterDraft) {
  const errors: RosterErrors = {};
  const name = draft.name.trim(), profession = draft.profession.trim(), specialty = draft.specialty.trim();
  if (["—", "Sin información publicada"].includes(specialty)) errors.specialty = "Deja la especialidad vacía si no hay información publicada.";
  if (!name) errors.name = "Ingresa los apellidos y nombres.";
  if (profession && !(arbitratorProfessions as readonly string[]).includes(profession)) errors.profession = "Selecciona una profesión válida o Sin información publicada.";
  if (!draft.groups.length || draft.groups.some(value => !(groupOptions as readonly string[]).includes(value))) errors.groups = "Selecciona al menos un grupo válido.";
  if (draft.qualifications.some(value => !(qualificationOptions as readonly string[]).includes(value))) errors.qualifications = "Selecciona habilitaciones válidas.";
  return { errors, payload: {
    apellidos_nombres: name, profesion_publicada: profession || null,
    especialidad_publicada: specialty || null,
    grupos: groupOptions.filter(value => draft.groups.includes(value)),
    habilitaciones: qualificationOptions.filter(value => draft.qualifications.includes(value)),
  } };
}
export function adaptAdminArbitrators(data: unknown): AdminArbitrator[] {
  if (!Array.isArray(data) || data.some(row => !row || typeof row.visible !== "boolean")) throw new AdminArbitratorError("La respuesta de la nómina no tiene un formato válido. Vuelve a cargarla.");
  return adaptPublicArbitrators(data).map((row, index) => ({ ...row, visible: data[index].visible }));
}
export function arbitratorDraft(record: AdminArbitrator): RosterDraft {
  return { name: record.name, profession: record.profession ?? "", specialty: record.specialty ?? "", groups: [...record.groups], qualifications: [...record.qualifications] };
}
export function sortAdminArbitrators(records: readonly AdminArbitrator[]) {
  return [...records].sort((a,b) => a.name.localeCompare(b.name, "es") || a.id.localeCompare(b.id));
}
function checkError(error: { code?: string; status?: number; name?: string } | null, status?: number) {
  if (!error) return;
  if (error.name === "AuthSessionMissingError" || error.code === "session_not_found" || error.code === "refresh_token_not_found" || status === 401 || status === 403 || error.code === "42501" || error.code === "PGRST301" || error.code === "PGRST303") throw new AdminArbitratorError("La sesión o los permisos administrativos deben verificarse nuevamente.", true);
  throw new AdminArbitratorError("No pudimos completar la consulta. Comprueba tu conexión y vuelve a intentarlo. Si estabas guardando, recarga el listado antes de repetir para comprobar si el cambio se aplicó.");
}
// This API is only used behind the real admin gate. RLS remains authoritative.
export function createAdminArbitratorsApi(client: SupabaseClient, userId: string) {
  async function authorize(signal: AbortSignal) {
    signal.throwIfAborted();
    const { data, error } = await client.auth.getUser();
    signal.throwIfAborted();
    if (error) { checkError(error, error.status); throw new AdminArbitratorError("No pudimos verificar la sesión."); }
    if (!data.user || data.user.id !== userId) throw new AdminArbitratorError("La sesión ha cambiado. Verifica nuevamente el acceso.", true);
    const permission = await client.schema("public").from("nominas_administradores").select("user_id").eq("user_id", userId).abortSignal(signal).maybeSingle();
    checkError(permission.error, permission.status);
    signal.throwIfAborted();
    if (!permission.data || permission.data.user_id !== userId) throw new AdminArbitratorError("Tu cuenta ya no tiene autorización administrativa.", true);
  }
  function table() { return client.schema("public").from("nomina_arbitros"); }
  async function confirmed(data: unknown, signal: AbortSignal, id?: string) {
    if (!data) { await authorize(signal); throw new AdminArbitratorError("No se confirmó ningún registro. Puede que ya no exista o que tus permisos hayan cambiado. Recarga la nómina antes de reintentar."); }
    const record = adaptAdminArbitrators([data])[0];
    if (id && record.id !== id) throw new AdminArbitratorError("No pudimos confirmar el registro solicitado. Recarga la nómina.");
    return record;
  }
  function payload(draft: RosterDraft) {
    const validated = validateArbitratorDraft(draft);
    if (Object.keys(validated.errors).length) throw new AdminArbitratorError("Revisa los campos del formulario.");
    return validated.payload;
  }
  function validId(id: string) {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw new AdminArbitratorError("El identificador del registro no es válido.");
  }
  return {
    async list(signal: AbortSignal) {
      await authorize(signal);
      const rows: unknown[] = [];
      for (let start = 0; ; start += 500) {
        const result = await table().select(adminArbitratorColumns).order("apellidos_nombres", { ascending: true }).order("id", { ascending: true }).range(start, start + 499).abortSignal(signal);
        checkError(result.error, result.status);
        signal.throwIfAborted();
        if (!Array.isArray(result.data)) throw new AdminArbitratorError("No pudimos interpretar la nómina. Reintenta la carga.");
        rows.push(...result.data);
        if (result.data.length < 500) return sortAdminArbitrators(adaptAdminArbitrators(rows));
      }
    },
    async save(draft: RosterDraft, id: string | null, signal: AbortSignal) {
      const values = payload(draft);
      if (id) validId(id);
      await authorize(signal);
      signal.throwIfAborted();
      const request = id ? table().update(values).eq("id", id) : table().insert({ ...values, visible: true });
      const result = await request.select(adminArbitratorColumns).abortSignal(signal).maybeSingle();
      checkError(result.error, result.status);
      signal.throwIfAborted();
      return confirmed(result.data, signal, id ?? undefined);
    },
    async visibility(id: string, visible: boolean, signal: AbortSignal) {
      validId(id); await authorize(signal);
      signal.throwIfAborted();
      const result = await table().update({ visible }).eq("id", id).select(adminArbitratorColumns).abortSignal(signal).maybeSingle();
      checkError(result.error, result.status); signal.throwIfAborted();
      return confirmed(result.data, signal, id);
    },
    async remove(id: string, signal: AbortSignal) {
      validId(id); await authorize(signal);
      signal.throwIfAborted();
      const result = await table().delete().eq("id", id).select("id").abortSignal(signal).maybeSingle();
      checkError(result.error, result.status); signal.throwIfAborted();
      if (!result.data || result.data.id !== id) { await authorize(signal); throw new AdminArbitratorError("No se confirmó la eliminación. El registro puede no existir o tus permisos pueden haber cambiado. Recarga la nómina."); }
      return id;
    },
  };
}
