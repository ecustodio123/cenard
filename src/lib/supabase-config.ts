export interface PublicSupabaseConfig { url: string; key: string }
export function publicSupabaseConfig(env: { VITE_SUPABASE_URL?: string; VITE_SUPABASE_PUBLISHABLE_KEY?: string }): PublicSupabaseConfig {
  const url = env.VITE_SUPABASE_URL?.trim();
  const key = env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key) throw new Error("La nómina aún no tiene configurada su conexión de lectura. Inténtalo más tarde.");
  // Only the browser publishable key is accepted; never accept secret/service-role keys.
  if (!key.startsWith("sb_publishable_")) throw new Error("La conexión de la nómina requiere una clave pública válida. Inténtalo más tarde.");
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password || parsed.search || parsed.hash) throw new Error();
  } catch { throw new Error("La conexión de la nómina no está configurada correctamente. Inténtalo más tarde."); }
  return { url, key };
}
