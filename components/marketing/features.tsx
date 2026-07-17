import {
  GitCompareArrows,
  ShieldCheck,
  Bell,
  FileSpreadsheet,
  LineChart,
  Workflow,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: GitCompareArrows,
    title: "محرّك مطابقة آلي",
    description:
      "محرّك مستقل عن المصدر يطابق المعاملات الخارجية مع دفتر الأستاذ الداخلي، ويمنح كل تطابق درجة ثقة.",
  },
  {
    icon: Bell,
    title: "تنبيهات الفروقات في الوقت الفعلي",
    description:
      "تظهر المبالغ غير المتطابقة والقيود المفقودة والمعاملات المكرّرة فور حدوثها — دون مفاجآت في نهاية الشهر.",
  },
  {
    icon: ShieldCheck,
    title: "عزل صارم للمستأجرين",
    description:
      "أمان مستوى الصفوف (RLS) مُطبَّق في قاعدة البيانات. بياناتك غير مرئية إطلاقًا لأي مستأجر آخر على المنصة.",
  },
  {
    icon: FileSpreadsheet,
    title: "استيعاب مرن للبيانات",
    description:
      "اربط واجهات API مباشرة أو ارفع ملفات CSV وExcel. تصل كل سجلاتك إلى دفتر أستاذ موحّد قابل للاستعلام.",
  },
  {
    icon: LineChart,
    title: "لوحات معلومات المطابقة",
    description:
      "تابِع نِسب المطابقة واتجاهات الفروقات والبنود المُعلَّقة عبر جميع الحسابات من نظرة عامة واحدة هادئة.",
  },
  {
    icon: Workflow,
    title: "سجل تدقيق كامل",
    description:
      "يُسجَّل كل تطابق وتعديل يدوي في سجل غير قابل للتعديل مُصمَّم للامتثال المالي.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-t border-border/60 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            كل ما تحتاجه لإقفال الحسابات بثقة
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            مُصمَّمة خصّيصًا للفرق المالية التي تُطابق عبر مصادر متعددة ولا يمكنها
            تحمّل قيد واحد مفقود.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="border-border/60 transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <feature.icon className="h-5 w-5" />
                </span>
                <CardTitle className="mt-4 text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
