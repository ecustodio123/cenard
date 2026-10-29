import type { SupabaseClient } from "@supabase/supabase-js";
import { adaptPublicAdjudicators } from "../public-adjudicators.ts";

export const publicAdjudicatorColumns = "id,apellidos_nombres,profesion_publicada,especialidad_publicada";
const batchSize = 500;
// Public reads only. No groups, qualifications, inferred periods or joins with arbitrators.
export async function fetchVisibleAdjudicators(signal?: AbortSignal, suppliedClient?: SupabaseClient) {
  const client = suppliedClient ?? (await import("../supabase.ts")).getPublicSupabaseClient();
  const rows: unknown[] = [];
  for (let start = 0; ; start += batchSize) {
    const request = client.schema("public").from("nomina_adjudicadores")
      .select(publicAdjudicatorColumns)
      .eq("visible", true)
      .order("apellidos_nombres", { ascending: true })
      .order("id", { ascending: true })
      .range(start, start + batchSize - 1);
    if (signal) request.abortSignal(signal);
    const { data, error } = await request;
    if (error || !Array.isArray(data)) throw new Error("No pudimos cargar la nómina de adjudicadores. Comprueba tu conexión y vuelve a intentarlo.");
    rows.push(...data);
    if (data.length < batchSize) return adaptPublicAdjudicators(rows);
  }
}
