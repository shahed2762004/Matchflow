import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/lib/types/database.types";

/**
 * Browser-side Supabase client.
 *
 * Safe to use in Client Components. Uses the public anon key, so every query
 * is subject to Row Level Security — this client can never bypass tenant
 * isolation. Create a fresh instance per call rather than sharing a singleton
 * so it always reads the current cookie-based session.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
