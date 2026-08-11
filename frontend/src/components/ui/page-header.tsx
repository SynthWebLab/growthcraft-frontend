import { cn } from "@/lib/utils";
import React from "react";

interface PageHeaderProps {
  breadcrumb?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  suppressHydrationWarning?: boolean;
}

export function PageHeader({
  breadcrumb,
  title,
  description,
  action,
  className,
  suppressHydrationWarning,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-6 md:mb-8 w-full min-w-0", className)}>
      {breadcrumb && (
        <div className="mb-3 text-sm font-afacad text-muted-foreground">
          {breadcrumb}
        </div>
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex-1">
          <h1
            suppressHydrationWarning={suppressHydrationWarning}
            className="text-2xl md:text-4xl font-extrabold font-display tracking-tight"
          >
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0 w-full md:w-auto">{action}</div>}
      </div>
    </div>
  );
}
