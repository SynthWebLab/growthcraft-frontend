import { cn } from "@/lib/utils";
import React from "react";

interface EventSectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "white" | "marble" | "graphite";
}

const variantClasses: Record<string, string> = {
  white: "bg-background text-foreground",
  marble: "bg-marble text-foreground",
  graphite: "bg-graphite text-white",
};

const EventSection = ({ 
  variant = "white", 
  className, 
  children, 
  ...props 
}: EventSectionProps) => (
  <section 
    className={cn("py-6 md:py-8", variantClasses[variant], className)} 
    {...props}
  >
    <div className="container">{children}</div>
  </section>
);

export { EventSection };
export default EventSection;
