"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 sm:p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
          <p className="mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl font-bold text-foreground truncate">{value}</p>
          {description && (
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground line-clamp-2">{description}</p>
          )}
          {trend && (
            <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-1">
              <span
                className={cn(
                  "text-xs sm:text-sm font-medium",
                  trend.isPositive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
              </span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-2 sm:p-3 shrink-0">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
        </div>
      </div>
    </div>
  );
};
