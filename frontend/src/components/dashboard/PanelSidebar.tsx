"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { RoleBadge } from "@/components/ui/role-badge";
import { ChevronLeft, ChevronUp, LogOut, Settings, HelpCircle, User, type LucideIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { useLogout } from "@/hooks/queries/useAuthentication";

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface PanelSidebarProps {
  navSections: NavSection[];
  role: "Student" | "College" | "Ambassador" | "Mentor" | "HiringPartner";
  basePath: string;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const SidebarInner = ({
  navSections,
  role,
  basePath,
  collapsed,
  onToggle,
}: Omit<PanelSidebarProps, "mobileOpen" | "onMobileClose">) => {
  const pathname = usePathname();
  const { user: profile } = useAuth();
  const { mutate: signOut } = useLogout();

  return (
    <div className="flex h-full flex-col bg-graphite">
      {/* Logo */}
      <div className={cn("flex items-center p-6", collapsed && "justify-center px-3")}>
        <Link href="/" className="flex items-center gap-2">
          {collapsed ? (
            <span className="text-xl font-extrabold text-white font-display">G</span>
          ) : (
            <span className="text-xl font-extrabold text-white font-display">GrowthCraft</span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1 scrollbar-hide">
        {navSections.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="text-white/40 text-xs font-afacad tracking-wider uppercase px-4 mt-6 mb-2">
                {section.label}
              </p>
            )}
            {collapsed && <div className="mt-4" />}
            {section.items.map((item) => {
              const active = pathname === `${basePath}/${item.href}` || pathname === `${basePath}${item.href === "" ? "" : "/" + item.href}`;
              const fullHref = item.href ? `${basePath}/${item.href}` : basePath;
              return (
                <Link
                  key={item.href}
                  href={fullHref}
                  className={cn(
                    "flex items-center gap-3 rounded-lg py-3 px-4 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-3",
                    active
                      ? "bg-lavender/10 text-magenta border-l-[3px] border-magenta"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User card */}
      <div className="mt-auto p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex w-full items-center gap-3 rounded-lg bg-white/5 p-3 text-left transition-colors hover:bg-white/10",
              collapsed && "justify-center"
            )}>
              <div className="h-9 w-9 rounded-full bg-lavender/20 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                {(profile?.full_name?.[0] || "U").toUpperCase()}
              </div>
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{profile?.full_name || "User"}</p>
                    <RoleBadge role={role} className="mt-1 text-[10px] px-2 py-0.5" />
                  </div>
                  <ChevronUp className="h-4 w-4 text-white/50 shrink-0" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuItem asChild>
              <Link href={`${basePath}/profile`}><User className="mr-2 h-4 w-4" />Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${basePath}/settings`}><Settings className="mr-2 h-4 w-4" />Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${basePath}/support`}><HelpCircle className="mr-2 h-4 w-4" />Help</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()} className="text-danger">
              <LogOut className="mr-2 h-4 w-4" />Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Collapse toggle (desktop) */}
      <button
        onClick={onToggle}
        className="hidden md:flex items-center justify-center h-12 border-t border-white/10 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
      >
        <ChevronLeft className={cn("h-5 w-5 transition-transform", collapsed && "rotate-180")} />
      </button>
    </div>
  );
};

const PanelSidebar = (props: PanelSidebarProps) => {
  const { mobileOpen, onMobileClose, collapsed, ...rest } = props;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden md:block fixed left-0 top-0 h-screen z-30 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        <SidebarInner {...rest} collapsed={collapsed} onToggle={props.onToggle} />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="p-0 w-64 border-none">
          <SidebarInner {...rest} collapsed={false} onToggle={props.onToggle} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PanelSidebar;
