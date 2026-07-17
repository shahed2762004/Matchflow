import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/format";

export type MonthlyPoint = {
  month: string;
  matched: number;
  discrepancies: number;
};

type Props = {
  data: MonthlyPoint[];
};

/**
 * Lightweight, dependency-free grouped bar chart comparing matched entries
 * against discrepancies per month. RTL-aware: bars flow right-to-left with the
 * page direction, so months read in natural Arabic order.
 */
export function ReconciliationChart({ data }: Props) {
  const max = Math.max(
    1,
    ...data.map((d) => Math.max(d.matched, d.discrepancies)),
  );

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-lg">اتجاه المطابقة الشهري</CardTitle>
        <CardDescription>
          المعاملات المطابقة مقابل الفروقات خلال الأشهر الستة الماضية
        </CardDescription>
        <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
            مطابقة
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-sm bg-warning" />
            فروقات
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex h-56 items-end justify-between gap-3">
          {data.map((point) => (
            <div
              key={point.month}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div className="flex h-full w-full items-end justify-center gap-1.5">
                <div
                  className="w-1/2 max-w-8 rounded-t-sm bg-primary transition-all"
                  style={{ height: `${(point.matched / max) * 100}%` }}
                  title={`مطابقة: ${formatNumber(point.matched)}`}
                />
                <div
                  className="w-1/2 max-w-8 rounded-t-sm bg-warning transition-all"
                  style={{ height: `${(point.discrepancies / max) * 100}%` }}
                  title={`فروقات: ${formatNumber(point.discrepancies)}`}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {point.month}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
