import { cn } from "@/lib/utils";
import React from "react";

interface DataCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark";
}

export const DataCard = ({
  variant = "default",
  className,
  children,
  ...props
}: DataCardProps) => (
  <div
    className={cn(
      "rounded-xl border p-4 md:p-6 transition-all duration-300 hover:-translate-y-1 min-w-0 overflow-hidden",
      variant === "default"
        ? "bg-card border-border text-card-foreground shadow-card hover:shadow-hover"
        : "bg-graphite border-transparent text-white shadow-card",
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export default DataCard;
