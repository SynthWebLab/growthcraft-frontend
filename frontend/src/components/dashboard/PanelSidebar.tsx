"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

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
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const SidebarInner = ({
  navSections,
  basePath,
  collapsed,
}: Omit<PanelSidebarProps, "mobileOpen" | "onMobileClose" | "role">) => {
  const pathname = usePathname();

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
        <SidebarInner {...rest} collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="p-0 w-64 border-none">
          <SheetTitle className="sr-only">Sidebar Navigation Menu</SheetTitle>
          <SidebarInner {...rest} collapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PanelSidebar;
