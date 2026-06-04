import { cn } from "@/lib/utils";
import React from "react";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "white" | "marble" | "graphite";
}

const variantClasses: Record<string, string> = {
  white: "bg-background text-foreground",
  marble: "bg-marble text-foreground",
  graphite: "bg-graphite text-white",
};

const Section = ({ 
  variant = "white", 
  className, 
  children, 
  ...props 
}: SectionProps) => (
  <section 
    className={cn("py-24 md:py-32", variantClasses[variant], className)} 
    {...props}
  >
    <div className="container">{children}</div>
  </section>
);

export { Section };
export default Section;
