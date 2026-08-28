"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Menu, Search, Bell, LogOut, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLogout } from "@/hooks/queries/useAuthentication";
import { cn } from "@/lib/utils";
import { useSocket } from "@/hooks/useSocket";
import {
  useNotificationUnreadCount,
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/queries/useNotifications";

import DynamicSearchBar from "@/components/dashboard/DynamicSearchBar";

interface PanelTopbarProps {
  onMenuClick: () => void;
  basePath: string;
  breadcrumb?: string;
}

const PanelTopbar = ({ onMenuClick, basePath, breadcrumb }: PanelTopbarProps) => {
  const { user: profile } = useCurrentUser();
  const { mutate: signOut } = useLogout();
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<string>("student");

  // Notifications integration
  const { data: unreadData } = useNotificationUnreadCount(!!profile);
  const { data: notificationsData } = useNotifications({ page: 1, limit: 5 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  useSocket(); // Run real-time listener

  const unreadCount = unreadData?.data?.count || 0;
  const recentNotifications = notificationsData?.data || [];

  useEffect(() => {
    const mode = localStorage.getItem("student_view_mode");
    if (mode) {
      setViewMode(mode);
    }
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 md:gap-4 border-b border-border bg-white px-3 md:px-8 w-full min-w-0">
      {/* Left */}
      <button
        onClick={onMenuClick}
        className="text-muted-foreground hover:text-magenta transition-colors shrink-0"
      >
        <Menu className="h-5 w-5" />
      </button>
      {breadcrumb && (
        <span className="hidden md:block text-sm font-afacad text-muted-foreground shrink-0">{breadcrumb}</span>
      )}

      {/* Center — search */}
      <div className="flex-1 flex justify-center min-w-0">
        <DynamicSearchBar basePath={basePath} roleOverride={profile?.role} />
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 md:gap-2 shrink-0">
        {profile?.role === "student" && profile?.isAmbassador && (
          <button
            onClick={() => {
              if (viewMode === "ambassador") {
                localStorage.setItem("student_view_mode", "student");
                setViewMode("student");
                router.push("/student/dashboard");
              } else {
                localStorage.setItem("student_view_mode", "ambassador");
                setViewMode("ambassador");
                router.push("/student/ambassador");
              }
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-full border border-magenta text-magenta hover:bg-magenta/5 transition-colors shrink-0 mr-2"
          >
            {viewMode === "ambassador" ? "Student View" : "Ambassador View"}
          </button>
        )}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none rounded-full hover:bg-muted/50">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-magenta text-[10px] font-bold text-white shadow-sm animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96 p-0 shadow-xl border-border">
            <div className="flex items-center justify-between p-3.5 border-b border-border bg-muted/20">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-semibold bg-magenta/10 text-magenta px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllRead.mutate()}
                  disabled={markAllRead.isPending}
                  className="text-xs text-magenta hover:underline font-medium transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[360px] overflow-y-auto divide-y divide-border">
              {recentNotifications.length > 0 ? (
                recentNotifications.map((notif: any) => {
                  const isUnread = !notif.readAt;
                  return (
                    <div
                      key={notif._id}
                      onClick={() => isUnread && markRead.mutate(notif._id)}
                      className={cn(
                        "p-3.5 text-xs cursor-pointer hover:bg-muted/40 transition-all space-y-1.5 relative",
                        isUnread ? "bg-magenta/[0.03]" : "opacity-80"
                      )}
                    >
                      {isUnread && (
                        <span className="absolute left-1.5 top-4 w-1.5 h-1.5 rounded-full bg-magenta" />
                      )}
                      <div className="flex justify-between items-start gap-2 pl-1.5">
                        <span className="font-semibold text-foreground text-xs">
                          {notif.type === "enrollment.created" && "🎓 Enrollment Confirmed"}
                          {notif.type === "batch.assigned" && "📚 Batch Assigned"}
                          {notif.type === "mentor.checkin.verified" && "✅ Session Verified"}
                          {notif.type === "referral.conversion" && "🎉 Referral Conversion"}
                          {notif.type !== "enrollment.created" &&
                            notif.type !== "batch.assigned" &&
                            notif.type !== "mentor.checkin.verified" &&
                            notif.type !== "referral.conversion" &&
                            "🔔 Notification"}
                        </span>
                        <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 pl-1.5 leading-relaxed">
                        {notif.type === "enrollment.created" && `Successfully enrolled in batch ${notif.data?.batchCode || ""}`}
                        {notif.type === "batch.assigned" && `Assigned to batch ${notif.data?.batchCode || ""}`}
                        {notif.type === "mentor.checkin.verified" && `Check-in verified: ${notif.data?.hoursWorked || 0} hrs worked`}
                        {notif.type === "referral.conversion" && `Referral converted! Commission: INR ${notif.data?.commissionAmount || 0}`}
                        {notif.type !== "enrollment.created" &&
                          notif.type !== "batch.assigned" &&
                          notif.type !== "mentor.checkin.verified" &&
                          notif.type !== "referral.conversion" &&
                          (notif.data?.message || "You have a new update.")}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center space-y-2">
                  <Bell className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                  <p className="text-sm font-medium text-muted-foreground">No notifications yet</p>
                  <p className="text-xs text-muted-foreground/70">You will receive updates here as activity occurs.</p>
                </div>
              )}
            </div>
            <div className="p-2.5 border-t border-border bg-muted/10 text-center">
              <Link
                href={`${basePath}/notifications`}
                className="text-xs text-magenta font-semibold hover:underline block w-full py-1"
              >
                View all notifications →
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              suppressHydrationWarning
              className="h-8 w-8 rounded-full bg-lavender/20 flex items-center justify-center text-sm font-semibold text-foreground"
            >
              {(profile?.fullName?.[0] || "U").toUpperCase()}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`${basePath}/profile`}><User className="mr-2 h-4 w-4" />Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${basePath}/settings`}><Settings className="mr-2 h-4 w-4" />Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()} className="text-danger">
              <LogOut className="mr-2 h-4 w-4" />Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default PanelTopbar;
