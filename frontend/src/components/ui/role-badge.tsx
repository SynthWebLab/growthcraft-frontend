import { cn } from "@/lib/utils";

type Role = "Student" | "College" | "Mentor" | "Employer";

const roleStyles: Record<Role, string> = {
  Student: "bg-secondary text-white",
  College: "bg-primary text-white",
  Mentor: "bg-accent text-white",
  Employer: "bg-graphite text-white",
};

const roleLabels: Record<Role, string> = {
  Student: "Student",
  College: "College",
  Mentor: "Mentor",
  Employer: "Employer",
};

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export const RoleBadge = ({ role, className }: RoleBadgeProps) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
      roleStyles[role],
      className
    )}
  >
    {roleLabels[role]}
  </span>
);
