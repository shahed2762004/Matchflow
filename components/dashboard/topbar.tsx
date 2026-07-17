import { LogOut } from "lucide-react";

import { signOut } from "@/app/(dashboard)/actions";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

type TopbarProps = {
  fullName: string;
  tenantName: string;
  roleLabel: string;
};

export function Topbar({ fullName, tenantName, roleLabel }: TopbarProps) {
  const initial = fullName.trim().charAt(0) || "؟";

  return (
    <header className="flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-6 backdrop-blur">
      <div>
        <p className="text-sm font-semibold text-foreground">{tenantName}</p>
        <p className="text-xs text-muted-foreground">مساحة عمل المطابقة المالية</p>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            {initial}
          </span>
          <div className="hidden text-start sm:block">
            <p className="text-sm font-medium text-foreground">{fullName}</p>
            <p className="text-xs text-muted-foreground">{roleLabel}</p>
          </div>
        </div>

        <form action={signOut}>
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </Button>
        </form>
      </div>
    </header>
  );
}
