import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* تدرّج لوني هادئ */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-accent/40 via-background to-background"
      />

      <div className="container flex flex-col items-center py-24 text-center md:py-32">
        <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          عزل بيانات متعدد المستأجرين بمستوى البنوك
        </Badge>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          المطابقة المالية،{" "}
          <span className="text-primary">بهدوء وبشكل آلي</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          تستقبل منصة MatchFlow المعاملات من بنوكك ومزوّدي الدفع وأنظمة تخطيط
          الموارد، ثم تطابقها آليًا مع سجلاتك الداخلية وتُبرز كل فرق مالي في
          الوقت الفعلي.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/register">
              ابدأ التجربة المجانية
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">اكتشف كيف تعمل</Link>
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-success" />
            بدون بطاقة ائتمان
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-success" />
            تجربة مجانية لمدة 14 يومًا
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-success" />
            إلغاء في أي وقت
          </span>
        </div>
      </div>
    </section>
  );
}
