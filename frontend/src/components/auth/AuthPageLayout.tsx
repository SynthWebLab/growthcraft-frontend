import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface AuthPageLayoutProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthPageLayout({ icon: Icon, title, subtitle, children }: AuthPageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-4">
            <Icon className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
        </div>

        {children}
      </div>
    </div>
  );
}
