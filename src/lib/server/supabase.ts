import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service role key. This module must never
// be imported from client code — the env vars are intentionally not VITE_-prefixed
// so Vite cannot inline them into the browser bundle.

let client: SupabaseClient | undefined;

export function getSupabaseAdmin(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceRoleKey) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
    }
    client = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
