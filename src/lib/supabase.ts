import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { publicSupabaseConfig } from "./supabase-config.ts";

let client: SupabaseClient | undefined;
// Shared browser client: the SDK manages administrative sessions; public queries keep explicit visibility filters.
export function getPublicSupabaseClient(): SupabaseClient {
  if (!client) {
    const { url, key } = publicSupabaseConfig({ VITE_SUPABASE_URL: import.meta.env?.VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY });
    client = createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
      db: { schema: "public" },
    });
  }
  return client;
}
