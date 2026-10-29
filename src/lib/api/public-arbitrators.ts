import type { SupabaseClient } from "@supabase/supabase-js";
import { adaptPublicArbitrators } from "../public-arbitrators.ts";

export const publicArbitratorColumns = "id,apellidos_nombres,profesion_publicada,grupos,especialidad_publicada,habilitaciones";
const batchSize = 500;
// Explicit columns, explicit visible filter, no joins or duplication by group.
export async function fetchVisibleArbitrators(signal?: AbortSignal, suppliedClient?: SupabaseClient) {
  const client = suppliedClient ?? (await import("../supabase.ts")).getPublicSupabaseClient();
  const rows: unknown[] = [];
  for (let start = 0; ; start += batchSize) {
    const request = client.schema("public").from("nomina_arbitros")
      .select(publicArbitratorColumns)
      .eq("visible", true)
      .order("apellidos_nombres", { ascending: true })
      .order("id", { ascending: true })
      .range(start, start + batchSize - 1);
    if (signal) request.abortSignal(signal);
    const { data, error } = await request;
    if (error || !Array.isArray(data)) throw new Error("No pudimos cargar la nómina de árbitros. Comprueba tu conexión y vuelve a intentarlo.");
    rows.push(...data);
    if (data.length < batchSize) return adaptPublicArbitrators(rows);
  }
}
