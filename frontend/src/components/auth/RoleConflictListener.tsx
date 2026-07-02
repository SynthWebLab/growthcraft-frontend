"use client";

import { useEffect, useState } from "react";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, LogOut, LayoutDashboard, Loader2 } from "lucide-react";
import Link from "next/link";

const dashboardRoutes = {
  student: "/student",
  mentor: "/mentor",
  college: "/college",
  employer: "/employer",
} as const;

const loginRoutes: Record<string, string> = {
  student: "/login/student",
  mentor: "/login/mentor",
  college: "/login/college",
  employer: "/login/employer",
};

export function RoleConflictListener() {
  const { data: user } = useCurrentUser();
  const queryClient = useQueryClient();
  
  const [isOpen, setIsOpen] = useState(false);
  const [expectedRole, setExpectedRole] = useState<"student" | "mentor" | "college" | "employer" | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsOpen(false);
      return;
    }

    const handleGlobalClick = (e: MouseEvent) => {
      // Find if clicked element (or its parents) is an anchor link to an auth page
      let target = e.target as HTMLElement | null;
      while (target && target.tagName !== "A") {
        target = target.parentElement;
      }

      if (target && target.tagName === "A") {
        const href = target.getAttribute("href");
        if (href) {
          // Check if href is a login or registration path with a role suffix
          let targetRole: string | null = null;
          
          if (href.includes("/login/") || href.includes("/register/")) {
            if (href.includes("/student")) targetRole = "student";
            else if (href.includes("/mentor")) targetRole = "mentor";
            else if (href.includes("/college")) targetRole = "college";
            else if (href.includes("/employer")) targetRole = "employer";
          }

          if (targetRole && user.role && targetRole !== user.role.toLowerCase()) {
            // Role conflict found, block navigation and show popup
            e.preventDefault();
            e.stopPropagation();
            setExpectedRole(targetRole as any);
            setIsOpen(true);
          }
        }
      }
    };

    // Capture phase listener to intercept before next-router link handlers
    document.addEventListener("click", handleGlobalClick, true);
    return () => document.removeEventListener("click", handleGlobalClick, true);
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
    } catch {
      // Even if API call fails, clear local state
    }

    // Always clear local state regardless of API success/failure
    if (typeof window !== "undefined") {
      localStorage.removeItem("gc_user");

      // Clear any non-httpOnly cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Clear ALL React Query cache to remove stale user data
      queryClient.clear();

      toast.success("Logged out successfully");
      setIsOpen(false);

      // Redirect to the target portal's login page for immediate access
      const targetLoginPath = expectedRole ? loginRoutes[expectedRole] : "/";
      window.location.href = targetLoginPath;
    }
    setIsLoggingOut(false);
  };

  if (!isOpen || !expectedRole || !user || !user.role) return null;

  const userRoleDisplay = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  const expectedRoleDisplay = expectedRole.charAt(0).toUpperCase() + expectedRole.slice(1);
  const userDashboard = dashboardRoutes[user.role as keyof typeof dashboardRoutes] || "/";

  return (
    <div className="fixed inset-0 bg-background/40 backdrop-blur-[2px] flex items-center justify-center z-[9999] p-4 animate-fade-in">
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
          You are signed in as a <span className="font-semibold text-foreground">{userRoleDisplay}</span> (<span className="text-foreground">{user.email}</span>).
          Click <span className="font-semibold text-foreground">Logout &amp; Switch</span> to log out and open the <span className="font-semibold text-foreground">{expectedRoleDisplay} Login</span> page, or go back to your dashboard.
        </p>

        {/* Alert Actions */}
        <div className="flex flex-col gap-3">
          <Link href={userDashboard} onClick={() => setIsOpen(false)} className="w-full">
            <Button className="w-full font-medium" variant="default">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Go to {userRoleDisplay} Dashboard
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="w-full font-medium" 
            onClick={handleLogout}
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
                Logout &amp; Switch to {expectedRoleDisplay} Login
              </>
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full font-medium mt-1 text-xs text-muted-foreground hover:text-foreground" 
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
