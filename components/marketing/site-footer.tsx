import Link from "next/link";
import { Layers } from "lucide-react";

const footerNav = {
  المنتج: [
    { href: "#features", label: "المميزات" },
    { href: "#integrations", label: "التكاملات" },
    { href: "#pricing", label: "الأسعار" },
    { href: "#faq", label: "الأسئلة الشائعة" },
  ],
  الشركة: [
    { href: "#", label: "من نحن" },
    { href: "#", label: "تواصل معنا" },
    { href: "#", label: "الوظائف" },
  ],
  "قانوني": [
    { href: "#", label: "الخصوصية" },
    { href: "#", label: "الشروط" },
    { href: "#", label: "الأمان" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Layers className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight">
                MatchFlow
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              مطابقة مالية متعددة المستأجرين للفرق التي تُطابق عبر مصادر متعددة.
            </p>
          </div>

          {Object.entries(footerNav).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-foreground">
                {heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MatchFlow. جميع الحقوق محفوظة.
          </p>
          <p className="text-sm text-muted-foreground">إدارة المطابقة المالية</p>
        </div>
      </div>
    </footer>
  );
}
