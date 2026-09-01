import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  periods?: string[];
  selectedPeriod?: string;
  onPeriodChange?: (period: string) => void;
  className?: string;
}

export const ChartCard = ({
  title,
  children,
  periods = ["7 days", "30 days", "90 days"],
  selectedPeriod,
  onPeriodChange,
  className,
}: ChartCardProps) => (
  <div className={cn("rounded-xl border border-border bg-white p-4 md:p-6 min-w-0 overflow-hidden", className)}>
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 md:mb-6">
      <h3 className="text-base font-semibold font-display truncate">{title}</h3>
      <Select value={selectedPeriod} defaultValue={periods[0]} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-28 h-8 text-xs shrink-0 self-start sm:self-auto">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periods.map((p) => (
            <SelectItem key={p} value={p}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    {children}
  </div>
);

export default ChartCard;
