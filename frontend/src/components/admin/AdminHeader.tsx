"use client";

import { useState, useEffect } from "react";
import { Bell, Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";
import {
  useNotificationUnreadCount,
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/queries/useNotifications";

interface AdminHeaderProps {
  user: {
    email: string;
    full_name?: string;
  } | null;
  onLogout: () => void;
  onMenuClick?: () => void;
}

export const AdminHeader = ({ user, onLogout, onMenuClick }: AdminHeaderProps) => {
  const [mounted, setMounted] = useState(false);

  // Notifications logic
  const { data: unreadData } = useNotificationUnreadCount(mounted && !!user);
  const { data: notificationsData } = useNotifications({ page: 1, limit: 5 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  useSocket(); // Run real-time listener

  const unreadCount = unreadData?.data?.count || 0;
  const recentNotifications = notificationsData?.data || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  const displayName: string = mounted && user ? (user?.full_name || (user as any)?.fullName || "") : "";
  const initials = displayName
    ? displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "A";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-2 sm:gap-4 border-b border-border bg-background px-3 sm:px-4 md:px-6">
      {onMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      <div className="flex flex-1 items-center gap-2 sm:gap-4 min-w-0">
        <div className="relative flex-1 min-w-0 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between p-3 border-b">
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="text-xs text-primary hover:underline"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notif: any) => (
                  <div
                    key={notif._id}
                    onClick={() => !notif.readAt && markRead.mutate(notif._id)}
                    className={cn(
                      "p-3 text-xs border-b border-border cursor-pointer hover:bg-muted/50 transition-colors space-y-1",
                      !notif.readAt && "bg-primary/[0.02] font-medium"
                    )}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-foreground">
                        {notif.type === "enrollment.created" && "Enrollment Confirmed"}
                        {notif.type === "batch.assigned" && "Batch Assigned"}
                        {notif.type === "mentor.checkin.verified" && "Session Verified"}
                        {notif.type === "referral.conversion" && "Referral Conversion"}
                        {notif.type !== "enrollment.created" && notif.type !== "batch.assigned" && notif.type !== "mentor.checkin.verified" && notif.type !== "referral.conversion" && "New Alert"}
                      </span>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2">
                      {notif.type === "enrollment.created" && `Enrolled in batch ${notif.data?.batchCode || ""}`}
                      {notif.type === "batch.assigned" && `Assigned to batch ${notif.data?.batchCode || ""}`}
                      {notif.type === "mentor.checkin.verified" && `Check-in verified: ${notif.data?.hoursWorked || 0} hrs worked`}
                      {notif.type === "referral.conversion" && `Referral converted! Commission: INR ${notif.data?.commissionAmount || 0}`}
                      {notif.type !== "enrollment.created" && notif.type !== "batch.assigned" && notif.type !== "mentor.checkin.verified" && notif.type !== "referral.conversion" && (notif.data?.message || "")}
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No notifications
                </div>
              )}
            </div>
            <div className="p-2 border-t text-center">
              <Link
                href="/admin/notifications"
                className="text-xs text-primary font-semibold hover:underline block w-full py-1"
              >
                View all notifications
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={displayName || "Admin"} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{displayName || "Admin"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout} className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
