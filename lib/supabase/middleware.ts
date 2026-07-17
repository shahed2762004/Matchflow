import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

import type { Database } from "@/lib/types/database.types";

/**
 * Refreshes the Supabase auth session on every request and enforces the
 * STRICT separation between the tenant workspace and the super-admin portal.
 *
 * Routing rules:
 *   - /admin-portal/*  -> requires an authenticated user that exists in
 *                         `platform_admins`. Tenant users are bounced out.
 *   - /(tenant) routes -> require an authenticated user with a `profiles` row.
 *                         Platform admins are redirected to their own portal.
 *   - public routes    -> always allowed.
 *
 * IMPORTANT: always operate on and return the SAME `supabaseResponse` object so
 * refreshed auth cookies survive. Creating a new response drops them and logs
 * the user out intermittently.
 */

const PUBLIC_PATHS = ["/", "/pricing", "/features"];
const TENANT_AUTH_PATHS = ["/login", "/register", "/forgot-password"];
const ADMIN_LOGIN_PATH = "/admin-portal/login";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[],
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Do not run code between createServerClient and getUser() — it revalidates
  // the token and refreshes cookies onto supabaseResponse.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    TENANT_AUTH_PATHS.includes(pathname) ||
    pathname === ADMIN_LOGIN_PATH;

  const isAdminArea =
    pathname.startsWith("/admin-portal") && pathname !== ADMIN_LOGIN_PATH;

  // ---- Super-admin portal guard -------------------------------------------
  if (isAdminArea) {
    if (!user) {
      return redirectTo(request, ADMIN_LOGIN_PATH);
    }
    const { data: admin } = await supabase
      .from("platform_admins")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!admin) {
      // Authenticated but NOT a platform admin: deny access to the portal.
      return redirectTo(request, ADMIN_LOGIN_PATH);
    }
    return supabaseResponse;
  }

  // ---- Tenant workspace guard ---------------------------------------------
  if (!isPublic) {
    if (!user) {
      return redirectTo(request, "/login");
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile) {
      // A platform admin (or an orphaned account) landing on tenant routes.
      return redirectTo(request, ADMIN_LOGIN_PATH);
    }
  }

  return supabaseResponse;
}

function redirectTo(request: NextRequest, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.redirect(url);
}
