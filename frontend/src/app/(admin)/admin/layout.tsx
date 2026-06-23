"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useLogout } from "@/hooks/queries/useAuthentication";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mutate: logout } = useLogout();
  const { data: user } = useCurrentUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-muted/40 flex">
      {/* Admin Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300",
          "ml-0 md:ml-64",
          collapsed && "md:ml-16"
        )}
      >
        {/* Admin Header */}
        <AdminHeader user={user} onLogout={handleLogout} onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 p-3 sm:p-4 md:p-8 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}


