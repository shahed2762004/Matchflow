import type { Metadata } from "next";
import { FileInput, CheckCircle2, AlertTriangle, Percent } from "lucide-react";

import { MetricCard } from "@/components/dashboard/metric-card";
import {
  ReconciliationChart,
  type MonthlyPoint,
} from "@/components/dashboard/reconciliation-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatNumber, formatCurrency, formatPercent } from "@/lib/format";

export const metadata: Metadata = {
  title: "لوحة المعلومات — MatchFlow",
};

/**
 * NOTE: The figures below are placeholder data. They will be replaced with live
 * aggregates from the reconciliation engine and the transactions table once
 * that milestone is built. Kept as constants so the shell renders meaningfully.
 */
const chartData: MonthlyPoint[] = [
  { month: "فبراير", matched: 820, discrepancies: 64 },
  { month: "مارس", matched: 910, discrepancies: 48 },
  { month: "أبريل", matched: 1040, discrepancies: 72 },
  { month: "مايو", matched: 1180, discrepancies: 39 },
  { month: "يونيو", matched: 1260, discrepancies: 51 },
  { month: "يوليو", matched: 1390, discrepancies: 28 },
];

const recentDiscrepancies = [
  {
    source: "بنك فلسطين",
    reference: "TXN-90421",
    amount: 1250,
    type: "مبلغ غير متطابق",
  },
  {
    source: "جوال بي",
    reference: "JP-33127",
    amount: 480,
    type: "قيد مفقود",
  },
  {
    source: "باي بال",
    reference: "PP-77812",
    amount: 2100,
    type: "معاملة مكرّرة",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          نظرة عامة
        </h1>
        <p className="text-sm text-muted-foreground">
          ملخّص أداء المطابقة المالية لمؤسستك
        </p>
      </div>

      {/* بطاقات المقاييس */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="إجمالي المدخلات"
          value={formatNumber(14382)}
          icon={FileInput}
          change="٨٫٤٪ عن الشهر الماضي"
          trend="up"
        />
        <MetricCard
          title="الحسابات المطابقة"
          value={formatNumber(13756)}
          icon={CheckCircle2}
          change="٥٫١٪ عن الشهر الماضي"
          trend="up"
        />
        <MetricCard
          title="الفروقات المالية"
          value={formatCurrency(38400)}
          icon={AlertTriangle}
          change="١٢٪ عن الشهر الماضي"
          trend="down"
          invertTrendColor
        />
        <MetricCard
          title="نسبة المطابقة"
          value={formatPercent(95.6)}
          icon={Percent}
          change="١٫٣٪ عن الشهر الماضي"
          trend="up"
        />
      </div>

      {/* المخطط + أحدث الفروقات */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReconciliationChart data={chartData} />
        </div>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">أحدث الفروقات</CardTitle>
            <CardDescription>بنود تتطلّب مراجعتك</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentDiscrepancies.map((item) => (
              <div
                key={item.reference}
                className="flex items-start justify-between border-b border-border/40 pb-3 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {item.source}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.reference}
                  </p>
                  <Badge variant="warning" className="mt-1">
                    {item.type}
                  </Badge>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(item.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
