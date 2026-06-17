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
  className?: string;
}

export const ChartCard = ({
  title,
  children,
  periods = ["7 days", "30 days", "90 days"],
  className,
}: ChartCardProps) => (
  <div className={cn("rounded-xl border border-border bg-white p-6", className)}>
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-base font-semibold font-display">{title}</h3>
      <Select defaultValue={periods[0]}>
        <SelectTrigger className="w-28 h-8 text-xs">
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
