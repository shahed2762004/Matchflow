"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { slugify, withRandomSuffix } from "@/lib/slug";
import {
  tenantLoginSchema,
  tenantRegisterSchema,
  forgotPasswordSchema,
} from "@/lib/validators/auth";

export type ActionResult = { error: string } | { success: string };

// ---------------------------------------------------------------------------
// TENANT LOGIN
// ---------------------------------------------------------------------------
export async function signInTenant(
  raw: unknown,
): Promise<ActionResult | never> {
  const parsed = tenantLoginSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "يرجى التحقق من البريد الإلكتروني وكلمة المرور." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة." };
  }

  // Enforce separation: this portal is for tenant users only. A platform admin
  // (no profiles row) must not gain a tenant session here.
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", data.user.id)
    .maybeSingle();

  if (!profile) {
    await supabase.auth.signOut();
    return { error: "هذا الحساب غير مُسجَّل كمستخدم مستأجر." };
  }

  redirect("/dashboard");
}

// ---------------------------------------------------------------------------
// TENANT REGISTRATION
// Creates auth user + tenant + tenant_admin profile atomically (service role),
// then establishes a session. Rolls back on any failure.
// ---------------------------------------------------------------------------
export async function signUpTenant(
  raw: unknown,
): Promise<ActionResult | never> {
  const parsed = tenantRegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "مدخلات غير صالحة." };
  }
  const { companyName, fullName, email, password } = parsed.data;

  const admin = createAdminClient();

  // 1. Resolve a unique slug for the tenant.
  let slug = slugify(companyName);
  const { data: existing } = await admin
    .from("tenants")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (existing || !slug) {
    slug = withRandomSuffix(slug);
  }

  // 2. Create the auth user (email pre-confirmed for immediate access).
  const { data: created, error: createErr } =
    await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

  if (createErr || !created.user) {
    if (createErr?.message?.toLowerCase().includes("already")) {
      return { error: "يوجد حساب مُسجَّل بهذا البريد الإلكتروني بالفعل." };
    }
    return { error: "تعذّر إنشاء حسابك. يرجى المحاولة مرة أخرى." };
  }
  const userId = created.user.id;

  // 3. Create the tenant.
  const { data: tenant, error: tenantErr } = await admin
    .from("tenants")
    .insert({ name: companyName, slug, status: "trial" })
    .select("id")
    .single();

  if (tenantErr || !tenant) {
    await admin.auth.admin.deleteUser(userId);
    return { error: "تعذّر إنشاء مؤسستك. يرجى المحاولة مرة أخرى." };
  }

  // 4. Create the owner profile as tenant_admin.
  const { error: profileErr } = await admin.from("profiles").insert({
    id: userId,
    tenant_id: tenant.id,
    full_name: fullName,
    email,
    role: "tenant_admin",
  });

  if (profileErr) {
    // Roll back tenant + user so a retry starts clean.
    await admin.from("tenants").delete().eq("id", tenant.id);
    await admin.auth.admin.deleteUser(userId);
    return { error: "تعذّر إكمال إعداد حسابك." };
  }

  // 5. Establish the session on the cookie-based client.
  const supabase = await createClient();
  const { error: signInErr } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInErr) {
    // Account exists and is valid; just send them to log in manually.
    redirect("/login");
  }

  redirect("/dashboard");
}

// ---------------------------------------------------------------------------
// PASSWORD RECOVERY
// Always returns a generic success message to avoid email enumeration.
// ---------------------------------------------------------------------------
export async function requestPasswordReset(
  raw: unknown,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "يرجى إدخال بريد إلكتروني صالح." };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/reset-password`,
  });

  return {
    success:
      "إذا كان هناك حساب مرتبط بهذا البريد الإلكتروني، فسيصلك رابط إعادة التعيين قريبًا.",
  };
}
