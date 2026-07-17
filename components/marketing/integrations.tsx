import { Landmark, Smartphone, CreditCard, Server, Database } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const integrations = [
  {
    icon: Landmark,
    name: "بنك فلسطين",
    description:
      "استقبِل كشوف الحساب البنكية وتدفّقات المعاملات مباشرةً، عبر واجهة API أو ملفات الكشوف القياسية.",
    status: "متاح",
  },
  {
    icon: Smartphone,
    name: "جوال بي",
    description:
      "استورِد تسويات المحفظة الإلكترونية وطابِقها مع الإيصالات المسجّلة لديك.",
    status: "متاح",
  },
  {
    icon: CreditCard,
    name: "باي بال",
    description:
      "زامِن معاملات ومدفوعات PayPal عبر الواجهة الرسمية مع معالجة تلقائية للعملات.",
    status: "متاح",
  },
  {
    icon: Server,
    name: "أنظمة تخطيط الموارد (ERP)",
    description:
      "اربط منصّتك المحاسبية أو نظام ERP عبر واجهته البرمجية لإبقاء القيود متطابقة.",
    status: "عبر واجهة API",
  },
  {
    icon: Database,
    name: "السجلات المالية الداخلية",
    description:
      "ارفع دفاترك الداخلية بصيغة CSV أو Excel — وهي الأساس الذي تُطابَق معه كل المصادر.",
    status: "CSV / Excel",
  },
];

export function Integrations() {
  return (
    <section
      id="integrations"
      className="border-t border-border/60 bg-secondary/40 py-24"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            تكامل متعدد المصادر
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            دفتر أستاذ واحد لكل مصدر مالي
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            تصل التدفّقات غير المتجانسة إلى دفتر أستاذ موحّد، فيتعامل محرّك
            المطابقة مع كل مصدر بالطريقة نفسها.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((item) => (
            <Card key={item.name} className="border-border/60 bg-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <Badge variant="secondary">{item.status}</Badge>
                </div>
                <CardTitle className="mt-4 text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
