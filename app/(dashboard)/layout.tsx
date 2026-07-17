import { redirect } from "next/navigation";
import Link from "next/link";
import { Layers } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Topbar } from "@/components/dashboard/topbar";
import type { UserRole } from "@/lib/types/database.types";

const roleLabels: Record<UserRole, string> = {
  tenant_admin: "مدير المؤسسة",
  manager: "مدير",
  employee: "موظف",
  viewer: "مُطّلِع",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already guards this, but never render the shell without a user.
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name,role,tenant_id")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) {
    // Authenticated but not a tenant user (e.g. a platform admin).
    redirect("/admin-portal/login");
  }

  const { data: tenant } = await supabase
    .from("tenants")
    .select("name")
    .eq("id", profile.tenant_id)
    .maybeSingle();

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-64 shrink-0 flex-col border-l border-border/60 bg-background md:flex">
        <Link
          href="/dashboard"
          className="flex h-16 items-center gap-2 border-b border-border/60 px-5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Layers className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            MatchFlow
          </span>
        </Link>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          fullName={profile.full_name}
          tenantName={tenant?.name ?? "مؤسستي"}
          roleLabel={roleLabels[profile.role]}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
