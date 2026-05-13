import { cn } from "@/lib/utils";
import React from "react";

interface PageHeaderProps {
  breadcrumb?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  breadcrumb,
  title,
  description,
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("mb-8", className)}>
      {breadcrumb && (
        <div className="mb-3 text-sm font-afacad text-muted-foreground">
          {breadcrumb}
        </div>
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-base text-muted-foreground max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}
