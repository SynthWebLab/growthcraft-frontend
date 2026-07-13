"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import logoMain from "@/assets/logo-main.png";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Rocket,
  Calendar,
  Users,
  Building2,
  Briefcase,
  MessageSquare,
  ClipboardList,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Trophy,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Courses", path: "/admin/courses", icon: BookOpen },
  { name: "Training Programs", path: "/admin/training-programs", icon: GraduationCap },
  {
    name: "Events",
    path: "/admin/events",
    icon: Calendar,
    subItems: [
      { name: "Bootcamps", path: "/admin/events?type=Bootcamp", icon: Rocket },
      { name: "Workshops", path: "/admin/events?type=Workshop", icon: Calendar },
      { name: "Hackathons", path: "/admin/events?type=Hackathon", icon: Trophy },
    ],
  },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Mentors", path: "/admin/mentors", icon: Users },
  { name: "Batches", path: "/admin/batches", icon: Layers },
  { name: "Attendance", path: "/admin/attendance", icon: ClipboardList },
  { name: "Colleges", path: "/admin/colleges", icon: Building2 },
  { name: "Employers", path: "/admin/employers", icon: Briefcase },
  { name: "Enquiries", path: "/admin/enquiries", icon: MessageSquare },
  { name: "Registrations", path: "/admin/registrations", icon: ClipboardList },
  { name: "Content Pages", path: "/admin/content", icon: FileText },
  { name: "Audit Logs", path: "/admin/audit-logs", icon: FileText, superAdminOnly: true },
  { name: "Settings", path: "/admin/settings", icon: Settings, superAdminOnly: true },
];

interface SidebarInnerProps {
  onLogout: () => void;
  collapsed: boolean;
  toggleCollapse?: () => void;
  isMobile?: boolean;
  onNavigate?: () => void;
}

const SidebarNavigation = ({
  collapsed,
  onNavigate,
  userRole,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  userRole?: string;
}) => {
  const isSuperAdmin = userRole === "super_admin";
  const visibleItems = menuItems.filter(
    (item) => !(item as any).superAdminOnly || isSuperAdmin
  );
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const [eventsOpen, setEventsOpen] = useState(true);

  return (
    <ul className="space-y-1 px-2">
      {visibleItems.map((item) => {
        const hasSubItems = !!item.subItems;
        const isActive = pathname === item.path || (hasSubItems && item.subItems.some(sub => pathname === sub.path.split('?')[0]));

        return (
          <li key={item.name} className="space-y-1">
            {hasSubItems ? (
              <div>
                <button
                  type="button"
                  onClick={() => setEventsOpen(!eventsOpen)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground",
                    isActive && "bg-muted/50 text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.name}</span>}
                  </div>
                  {!collapsed && (
                    <span className="text-[10px] text-muted-foreground transition-transform duration-200">
                      {eventsOpen ? "▼" : "▶"}
                    </span>
                  )}
                </button>
                {eventsOpen && !collapsed && (
                  <ul className="pl-6 mt-1 space-y-1">
                    {item.subItems.map((sub) => {
                      const subType = new URLSearchParams(sub.path.split('?')[1] || "").get("type");
                      const isSubActive = pathname === sub.path.split('?')[0] && typeParam === subType;

                      return (
                        <li key={sub.name}>
                          <Link
                            href={sub.path}
                            onClick={onNavigate}
                            className={cn(
                              "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                              isSubActive
                                ? "bg-primary text-primary-foreground font-semibold"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <sub.icon className="h-4 w-4 flex-shrink-0" />
                            <span>{sub.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                href={item.path}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
};

const SidebarInner = ({
  onLogout,
  collapsed,
  toggleCollapse,
  isMobile = false,
  onNavigate,
}: SidebarInnerProps) => {
  const { data: user } = useCurrentUser();
  const userRole = (user as any)?.role as string | undefined;
  const isSuperAdmin = userRole === "super_admin";

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2" onClick={onNavigate}>
            <img src={logoMain.src} alt="GrowthCraft" className="h-8 w-auto" />
          </Link>
        )}
        {!isMobile && toggleCollapse && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="ml-auto"
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <Suspense fallback={
          <div className="px-4 py-2 text-xs text-muted-foreground animate-pulse">
            Loading navigation...
          </div>
        }>
          <SidebarNavigation collapsed={collapsed} onNavigate={onNavigate} userRole={userRole} />
        </Suspense>
      </nav>

      {/* Role badge */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-border">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full",
              isSuperAdmin
                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {isSuperAdmin ? "Super Admin" : "Operations"}
          </span>
        </div>
      )}
    </div>
  );
};

interface AdminSidebarProps {
  onLogout: () => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const AdminSidebar = ({
  onLogout,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: AdminSidebarProps) => {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:block fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarInner
          onLogout={onLogout}
          collapsed={collapsed}
          toggleCollapse={() => setCollapsed(!collapsed)}
        />
      </aside>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 border-none">
          <SheetTitle className="sr-only">Admin Navigation Menu</SheetTitle>
          <SidebarInner
            onLogout={onLogout}
            collapsed={false}
            isMobile={true}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
};
