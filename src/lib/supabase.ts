import { createClient } from "@supabase/supabase-js";

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const anonKey = (
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY as string | undefined)?.trim()
);

export const hasSupabase = !!(url && anonKey);
export const supabase = hasSupabase ? createClient(url!, anonKey!) : null;

if (import.meta.env.DEV && !hasSupabase) {
  console.warn(
    "[EcoSync] Supabase not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env then restart the dev server."
  );
}
