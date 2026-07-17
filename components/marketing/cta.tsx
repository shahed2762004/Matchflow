import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Cta() {
  return (
    <section className="border-t border-border/60 py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            أقفِل حساباتك بثقة
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
            انضمّ إلى الفرق المالية التي تطابق ملايين المعاملات عبر البنوك
            والمحافظ وأنظمة ERP — دون فوضى نهاية الشهر.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                ابدأ تجربتك المجانية
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
