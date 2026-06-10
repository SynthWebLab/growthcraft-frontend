import { cn } from "@/lib/utils";
import { StatCounter } from "@/components/ui/stat-counter";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  delta?: number;
  className?: string;
}

export const KpiCard = ({ label, value, prefix, suffix, delta, className }: KpiCardProps) => (
  <div className={cn("rounded-xl border border-border bg-white p-6", className)}>
    <StatCounter value={value} prefix={prefix} suffix={suffix} label={label} className="text-left" />
    {delta !== undefined && (
      <div className={cn(
        "mt-3 flex items-center gap-1 text-xs font-medium",
        delta >= 0 ? "text-success" : "text-danger"
      )}>
        {delta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(delta)}% vs last month
      </div>
    )}
  </div>
);

export default KpiCard;
