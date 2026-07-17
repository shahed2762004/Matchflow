import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import type { Database } from "@/lib/types/database.types";

/**
 * Server-side Supabase client for Server Components, Server Actions, and
 * Route Handlers. Reads/writes the session from Next.js cookies and enforces
 * RLS via the anon key.
 *
 * Note: in a pure Server Component (read-only request), cookie writes are
 * no-ops — Next.js disallows setting cookies there. The try/catch swallows
 * that case; session refresh happens in middleware instead.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — safe to ignore, middleware
            // is responsible for refreshing the session cookie.
          }
        },
      },
    },
  );
}
