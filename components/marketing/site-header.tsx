import Link from "next/link";
import { Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "#features", label: "المميزات" },
  { href: "#integrations", label: "التكاملات" },
  { href: "#pricing", label: "الأسعار" },
  { href: "#faq", label: "الأسئلة الشائعة" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Layers className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            MatchFlow
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">تسجيل الدخول</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">ابدأ التجربة المجانية</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
