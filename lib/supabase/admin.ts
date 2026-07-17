import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/types/database.types";

/**
 * Service-role Supabase client. BYPASSES Row Level Security.
 *
 * SERVER-ONLY. The `server-only` import above makes the build fail if this is
 * ever imported into client code. Use exclusively for trusted super-admin
 * operations, webhook ingestion, and background jobs — never in a request
 * handler that acts on behalf of a tenant user without an explicit
 * authorization check first.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
