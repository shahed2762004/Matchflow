// TEMPORARY preview route — renders the tenant dashboard shell with mock data
// so it can be viewed/screenshotted without a live Supabase backend or auth.
// DELETE after visual verification.
import Link from "next/link";
import { Layers } from "lucide-react";

import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { Topbar } from "@/components/dashboard/topbar";
import DashboardPage from "@/app/(dashboard)/dashboard/page";

export const dynamic = "force-static";

export default function PreviewDashboard() {
  return (
    <div className="flex min-h-screen bg-secondary/30">
      <aside className="hidden w-64 shrink-0 flex-col border-l border-border/60 bg-background md:flex">
        <Link
          href="/preview/dashboard"
          className="flex h-16 items-center gap-2 border-b border-border/60 px-5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Layers className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">MatchFlow</span>
        </Link>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          fullName="أحمد خالد"
          tenantName="شركة الأفق المالية"
          roleLabel="مدير المؤسسة"
        />
        <main className="flex-1 overflow-y-auto p-6">
          <DashboardPage />
        </main>
      </div>
    </div>
  );
}
