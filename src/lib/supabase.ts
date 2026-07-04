import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for server-side operations (uses service role key).
 * NEVER import this in client-side code — the service role key bypasses RLS.
 *
 * Environment variables (set in Vercel → Project Settings → Environment Variables):
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 */
export function createServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase server environment variables");
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Supabase client for client-side read-only queries (uses anon key).
 * Safe for frontend — RLS policies restrict what the anon key can do.
 *
 * Environment variables:
 *   - NEXT_PUBLIC_SUPABASE_URL (must be public for client-side)
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY (must be public for client-side)
 *
 * NOTE: The user's env vars are named SUPABASE_URL and SUPABASE_ANON_KEY.
 * For client-side access, Next.js requires the NEXT_PUBLIC_ prefix.
 * We read from both names for flexibility.
 */
export function createBrowserClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
