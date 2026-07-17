import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Trend = "up" | "down" | "neutral";

type MetricCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  /** Localized change label, e.g. "٣٫٢٪ عن الشهر الماضي". */
  change?: string;
  trend?: Trend;
  /** When true, an "up" trend is bad (e.g. discrepancies rising). */
  invertTrendColor?: boolean;
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  change,
  trend = "neutral",
  invertTrendColor = false,
}: MetricCardProps) {
  const isPositive = invertTrendColor ? trend === "down" : trend === "up";
  const TrendIcon = trend === "down" ? ArrowDownRight : ArrowUpRight;

  return (
    <Card className="border-border/60">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold tracking-tight text-foreground">
              {value}
            </p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Icon className="h-5 w-5" />
          </span>
        </div>

        {change && (
          <div className="mt-4 flex items-center gap-1 text-xs">
            {trend !== "neutral" && (
              <TrendIcon
                className={cn(
                  "h-3.5 w-3.5",
                  isPositive ? "text-success" : "text-destructive",
                )}
              />
            )}
            <span
              className={cn(
                "font-medium",
                trend === "neutral"
                  ? "text-muted-foreground"
                  : isPositive
                    ? "text-success"
                    : "text-destructive",
              )}
            >
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
