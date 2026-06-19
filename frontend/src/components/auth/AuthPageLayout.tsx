"use client";

import { ReactNode, useState } from "react";
import { LucideIcon, AlertCircle, LogOut, LayoutDashboard, Loader2 } from "lucide-react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface AuthPageLayoutProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  expectedRole?: "student" | "mentor" | "college" | "employer";
  children: ReactNode;
}

const dashboardRoutes = {
  student: "/student",
  mentor: "/mentor",
  college: "/college",
  employer: "/employer",
} as const;

export function AuthPageLayout({ icon: Icon, title, subtitle, expectedRole, children }: AuthPageLayoutProps) {
  const { data: user, isLoading } = useCurrentUser();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutAndRedirect = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      if (typeof window !== "undefined") {
        localStorage.removeItem("gc_user");
        
        // Clear any non-httpOnly cookies
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        
        queryClient.clear();
        toast.success("Logged out successfully");
        
        // Reload page to show the normal form
        window.location.reload();
      }
    } catch (err: any) {
      toast.error("Logout failed", {
        description: err.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const hasConflict = !!(user && expectedRole && user.role?.toLowerCase() !== expectedRole.toLowerCase());
  const userRoleDisplay = user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "";
  const expectedRoleDisplay = expectedRole ? expectedRole.charAt(0).toUpperCase() + expectedRole.slice(1) : "";
  const userDashboard = user ? (dashboardRoutes[user.role as keyof typeof dashboardRoutes] || "/") : "/";

  // If user is loading session, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary flex items-center justify-center px-4 py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background container (blurred and non-interactive if conflict exists) */}
      <div className={cn("w-full max-w-md transition-all duration-500 ease-in-out", hasConflict && "blur-[4px] pointer-events-none select-none opacity-80")}>
        {/* Logo / Brand */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary text-primary-foreground mb-4">
            <Icon className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
        </div>

        {children}
      </div>

      {/* Floating Pop-up Modal (Alert) overlay */}
      {hasConflict && (
        <div className="fixed inset-0 bg-background/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 animate-fade-in">
          <Card className="w-full max-w-md border-border/50 shadow-2xl p-6 bg-background/95 backdrop-blur-md animate-scale-in">
            {/* Alert Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 text-amber-600 mb-3 dark:bg-amber-900/30 dark:text-amber-500">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Account Conflict</h2>
              <p className="text-xs text-muted-foreground mt-1">Portal mismatch detected</p>
            </div>

            {/* Alert Content */}
            <p className="text-sm text-muted-foreground text-center mb-6 leading-relaxed">
              You are currently signed in as a <span className="font-semibold text-foreground">{userRoleDisplay}</span> (<span className="text-foreground">{user?.email}</span>). 
              To register or sign in as a <span className="font-semibold text-foreground">{expectedRoleDisplay}</span>, please log out of your current account.
            </p>

            {/* Alert Actions */}
            <div className="flex flex-col gap-3">
              <Link href={userDashboard} className="w-full">
                <Button className="w-full font-medium" variant="default">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Go to {userRoleDisplay} Dashboard
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full font-medium" 
                onClick={handleLogoutAndRedirect}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging out...
                  </>
                ) : (
                  <>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout & Continue
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
