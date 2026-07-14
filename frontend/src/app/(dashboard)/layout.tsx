"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import PanelSidebar, { type NavSection } from "@/components/dashboard/PanelSidebar";
import PanelTopbar from "@/components/dashboard/PanelTopbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";
import { DASHBOARD_ROUTES } from "@/lib/constants/routes.constant";
import {
  LayoutDashboard, BookOpen, Award, User, HelpCircle, Settings,
  GraduationCap, Users, Calendar, BarChart3, Building2,
  Briefcase, Search, FileText, Megaphone, DollarSign, Wrench, Trophy, Target,
  Loader2, Layers
} from "lucide-react";

type Role = "Student" | "College" | "Ambassador" | "Mentor" | "HiringPartner";

const panelConfigs: Record<string, { role: Role; basePath: string; navSections: NavSection[] }> = {
  student: {
    role: "Student",
    basePath: "/student",
    navSections: [
      {
        label: "Main",
        items: [
          { icon: LayoutDashboard, label: "Dashboard", href: "dashboard" },
          { icon: Layers, label: "My Batches", href: "batches" },
          { icon: BookOpen, label: "My Courses", href: "courses" },
          { icon: GraduationCap, label: "Bootcamps", href: "bootcamps" },
          { icon: Wrench, label: "Workshops", href: "workshops" },
          { icon: Trophy, label: "Hackathons", href: "hackathons" },
          { icon: Target, label: "Training Programs", href: "training-programs" },
          { icon: Users, label: "Mentors", href: "mentors" },
          { icon: Award, label: "Certificates", href: "certificates" },
          { icon: Briefcase, label: "Jobs", href: "jobs" },
        ],
      },
      {
        label: "Account",
        items: [
          { icon: User, label: "Profile", href: "profile" },
          { icon: Settings, label: "Settings", href: "settings" },
          { icon: HelpCircle, label: "Support", href: "support" },
        ],
      },
    ],
  },
  college: {
    role: "College",
    basePath: "/college",
    navSections: [
      {
        label: "Main",
        items: [
          { icon: LayoutDashboard, label: "Dashboard", href: "dashboard" },
          { icon: GraduationCap, label: "Students", href: "students" },
          { icon: Wrench, label: "Workshops", href: "workshops" },
          { icon: Trophy, label: "Hackathons", href: "hackathons" },
          { icon: GraduationCap, label: "Bootcamps", href: "bootcamps" },
          { icon: BarChart3, label: "Reports", href: "reports" },
          { icon: Award, label: "Partnership", href: "partnership" },
        ],
      },
      {
        label: "Account",
        items: [
          { icon: Building2, label: "Profile", href: "profile" },
          { icon: Settings, label: "Settings", href: "settings" },
          { icon: HelpCircle, label: "Support", href: "support" },
        ],
      },
    ],
  },

  mentor: {
    role: "Mentor",
    basePath: "/mentor",
    navSections: [
      {
        label: "Main",
        items: [
          { icon: LayoutDashboard, label: "Dashboard", href: "dashboard" },
          { icon: Layers, label: "Batches", href: "batches" },
          { icon: Calendar, label: "Sessions", href: "sessions" },
          { icon: Calendar, label: "Availability", href: "availability" },
          { icon: Users, label: "Students", href: "students" },
          { icon: DollarSign, label: "Earnings", href: "earnings" },
        ],
      },
      {
        label: "Account",
        items: [
          { icon: User, label: "Profile", href: "profile" },
          { icon: Settings, label: "Settings", href: "settings" },
          { icon: HelpCircle, label: "Support", href: "support" },
        ],
      },
    ],
  },
  hiring: {
    role: "HiringPartner",
    basePath: "/employer",
    navSections: [
      {
        label: "Main",
        items: [
          { icon: LayoutDashboard, label: "Dashboard", href: "dashboard" },
          { icon: Search, label: "Talent Pool", href: "talent" },
          { icon: Briefcase, label: "Job Postings", href: "jobs" },
          { icon: FileText, label: "Applications", href: "applications" },
        ],
      },
      {
        label: "Account",
        items: [
          { icon: Building2, label: "Profile", href: "profile" },
          { icon: Settings, label: "Settings", href: "settings" },
          { icon: HelpCircle, label: "Support", href: "support" },
        ],
      },
    ],
  },
};

function getPanelKey(pathname: string): string {
  const segment = pathname.split("/")[1];
  if (segment === "employer") return "hiring";
  return segment || "student";
}

const PanelLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<string>("student");

  useEffect(() => {
    const mode = localStorage.getItem("student_view_mode");
    if (mode) {
      setViewMode(mode);
    }
  }, []);

  useEffect(() => {
    if (pathname.startsWith("/student/ambassador")) {
      localStorage.setItem("student_view_mode", "ambassador");
      setViewMode("ambassador");
    } else if (pathname.startsWith("/student/dashboard") || pathname === "/student") {
      localStorage.setItem("student_view_mode", "student");
      setViewMode("student");
    }
  }, [pathname]);

  const panelKey = getPanelKey(pathname);
  const config = panelConfigs[panelKey] || panelConfigs.student;

  const userRole = user?.role?.toLowerCase();
  const pathRole = panelKey === "hiring" ? "employer" : panelKey;

  const isRoleMismatch = !!(
    isAuthenticated &&
    userRole &&
    pathRole &&
    userRole !== pathRole
  );

  useEffect(() => {
    if (!isLoading && isRoleMismatch && userRole) {
      const targetDashboard = DASHBOARD_ROUTES[userRole as keyof typeof DASHBOARD_ROUTES] || `/${userRole}`;
      router.replace(targetDashboard);
    }
  }, [isLoading, isRoleMismatch, userRole, router]);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileOpen(true);
    } else {
      setCollapsed((c) => !c);
    }
  };

  // Show a loading screen if auth is checking, if they are not authenticated, or if there's a role conflict and we are redirecting
  const showLoader = isLoading || !isAuthenticated || isRoleMismatch;

  if (showLoader) {
    return (
      <div className="min-h-screen bg-marble flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative flex items-center justify-center">
            <div className="h-16 w-16 rounded-full border-4 border-lavender/30 border-t-magenta animate-spin" />
            <span className="absolute text-sm font-semibold text-magenta">GC</span>
          </div>
          <p className="text-sm font-afacad font-medium text-muted-foreground tracking-wide animate-pulse">
            {isRoleMismatch ? "Redirecting to your dashboard..." : "Loading your workspace..."}
          </p>
        </div>
      </div>
    );
  }

  let resolvedNavSections = config.navSections;
  let resolvedRole = config.role;

  if (panelKey === "student" && user?.isAmbassador && viewMode === "ambassador") {
    resolvedRole = "Ambassador";
    resolvedNavSections = [
      {
        label: "Ambassador Mode",
        items: [
          { icon: LayoutDashboard, label: "Dashboard", href: "ambassador" },
          { icon: Award, label: "Invite Students", href: "ambassador/invite" },
          { icon: Megaphone, label: "Referrals", href: "ambassador/referrals" },
          { icon: DollarSign, label: "Earnings", href: "ambassador/earnings" },
        ],
      },
      {
        label: "Account",
        items: [
          { icon: User, label: "Profile", href: "profile" },
          { icon: Settings, label: "Settings", href: "settings" },
          { icon: HelpCircle, label: "Support", href: "support" },
        ],
      },
    ];
  }

  return (
    <div className="min-h-screen flex">
      <PanelSidebar
        navSections={resolvedNavSections}
        role={resolvedRole as any}
        basePath={config.basePath}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className={cn(
        "flex-1 flex flex-col min-h-screen transition-all duration-300",
        !isMobile && (collapsed ? "ml-16" : "ml-64")
      )}>
        <PanelTopbar
          onMenuClick={handleMenuClick}
          basePath={config.basePath}
        />
        <main className="flex-1 bg-marble p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PanelLayout;
