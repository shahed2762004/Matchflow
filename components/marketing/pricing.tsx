import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "المبتدئ",
    price: "$49",
    cadence: "/شهريًا",
    description: "للفرق الصغيرة التي تطابق عددًا محدودًا من الحسابات.",
    featured: false,
    features: [
      "حتى 3 مصادر بيانات",
      "5,000 معاملة شهريًا",
      "رفع ملفات CSV وExcel",
      "عضوان في الفريق",
      "دعم عبر البريد الإلكتروني",
    ],
    cta: "ابدأ التجربة المجانية",
  },
  {
    name: "النمو",
    price: "$149",
    cadence: "/شهريًا",
    description: "للفرق المالية التي تتوسّع عبر مزوّدين متعددين.",
    featured: true,
    features: [
      "حتى 10 مصادر بيانات",
      "50,000 معاملة شهريًا",
      "جميع تكاملات API",
      "10 أعضاء في الفريق",
      "تنبيهات الفروقات في الوقت الفعلي",
      "دعم ذو أولوية",
    ],
    cta: "ابدأ التجربة المجانية",
  },
  {
    name: "المؤسسات",
    price: "مخصّص",
    cadence: "",
    description: "للمؤسسات ذات احتياجات الامتثال المتقدّمة.",
    featured: false,
    features: [
      "مصادر بيانات غير محدودة",
      "معاملات غير محدودة",
      "تكاملات ERP مخصّصة",
      "أعضاء فريق غير محدودين",
      "مدير نجاح مُخصَّص",
      "اتفاقية مستوى خدمة ودعم التدقيق",
    ],
    cta: "تواصل مع المبيعات",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="border-t border-border/60 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            أسعار بسيطة وشفّافة
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            ابدأ مجانًا لمدة 14 يومًا. لا تدفع إلا عندما تكون جاهزًا.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl items-start gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "flex h-full flex-col border-border/60",
                tier.featured &&
                  "border-primary shadow-lg ring-1 ring-primary/20",
              )}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  {tier.featured && <Badge>الأكثر رواجًا</Badge>}
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight text-foreground">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tier.cadence}
                  </span>
                </div>
                <CardDescription className="mt-2">
                  {tier.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.featured ? "default" : "outline"}
                  asChild
                >
                  <Link
                    href={tier.name === "المؤسسات" ? "#contact" : "/register"}
                  >
                    {tier.cta}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
