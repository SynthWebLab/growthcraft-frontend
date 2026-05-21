"use client";

import { usePendingAction } from "@/hooks/usePendingAction";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Handle pending actions after login (enrollment, callback)
  usePendingAction();
  
  return <>{children}</>;
}
