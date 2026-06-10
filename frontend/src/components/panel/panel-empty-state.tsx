import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

interface PanelEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PanelEmptyState({
  className,
  ...props
}: PanelEmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white p-12",
        className
      )}
    >
      <EmptyState {...props} />
    </div>
  );
}

export default PanelEmptyState;
