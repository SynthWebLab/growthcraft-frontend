import { cn } from "@/lib/utils";

type Variant = "active" | "pending" | "completed" | "cancelled" | "draft";

const styles: Record<Variant, string> = {
  active: "bg-magenta/10 text-magenta",
  pending: "bg-warning/10 text-warning",
  completed: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
  draft: "bg-muted text-muted-foreground",
};

interface StatusPillProps {
  variant: Variant;
  label?: string;
  className?: string;
}

export const StatusPill = ({ variant, label, className }: StatusPillProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
      styles[variant],
      className
    )}
  >
    {label || variant.charAt(0).toUpperCase() + variant.slice(1)}
  </span>
);

export default StatusPill;
