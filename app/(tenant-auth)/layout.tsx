import Link from "next/link";
import { Layers } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export default function TenantAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-accent/30 via-background to-background px-4 py-12">
      <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
        <ThemeToggle />
      </div>
      <Link href="/" className="mb-8 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Layers className="h-5 w-5" />
        </span>
        <span className="text-xl font-semibold tracking-tight text-foreground">
          MatchFlow
        </span>
      </Link>
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
