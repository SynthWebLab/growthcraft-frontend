"use client";

import React, { useState } from "react";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/hooks/queries/useNotifications";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, CheckCircle2, ChevronLeft, ChevronRight, Inbox, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const getNotificationDetails = (notification: any) => {
  const data = notification.data || {};
  switch (notification.type) {
    case "enrollment.created":
      return {
        title: "Enrollment Confirmed",
        description: `Your enrollment in cohort batch ${data.batchCode || ""} is confirmed.`,
        color: "bg-green-500/10 text-green-600 border-green-200",
      };
    case "batch.assigned":
      return {
        title: "Batch Assigned",
        description: `You have been assigned as the mentor for batch ${data.batchCode || ""}. Starts ${data.startDate ? new Date(data.startDate).toLocaleDateString() : ""}.`,
        color: "bg-blue-500/10 text-blue-600 border-blue-200",
      };
    case "mentor.checkin.verified":
      return {
        title: "Session Verified",
        description: `Admin verified your check-in session for ${data.hoursWorked || 0} hours. Payout of INR ${data.earned || 0} credited.`,
        color: "bg-purple-500/10 text-purple-600 border-purple-200",
      };
    case "referral.conversion":
      return {
        title: "Referral Conversion",
        description: `Congratulations! A referred student successfully enrolled. Commission of INR ${data.commissionAmount || 0} is credited to your pending payouts.`,
        color: "bg-amber-500/10 text-amber-600 border-amber-200",
      };
    default:
      return {
        title: "New Alert",
        description: data.message || `Notification details for type: ${notification.type}`,
        color: "bg-lavender/20 text-foreground border-border",
      };
  }
};

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data: notificationsData, isLoading, refetch } = useNotifications({ page, limit: 10 });
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = notificationsData?.data || [];
  const pagination = notificationsData?.pagination || { totalPages: 1, total: 0 };

  const handleMarkRead = (id: string) => {
    markRead.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-7 w-7 text-magenta" />
            Notifications Inbox
          </h1>
          <p className="text-muted-foreground">
            Manage your real-time alerts, system confirmations, and event updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isLoading}
            className="h-9 gap-1.5"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
          {notifications.some((n: any) => !n.readAt) && (
            <Button
              variant="default"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={markAllRead.isPending}
              className="h-9 gap-1.5 bg-magenta hover:bg-magenta/90 text-white"
            >
              <CheckCircle2 className="h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            Showing {notifications.length} of {pagination.total || 0} total logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-magenta border-t-transparent" />
              <span className="text-sm text-muted-foreground">Loading inbox...</span>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-border rounded-md border border-border">
              {notifications.map((notif: any) => {
                const details = getNotificationDetails(notif);
                const isUnread = !notif.readAt;

                return (
                  <div
                    key={notif._id}
                    className={cn(
                      "flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 transition-colors hover:bg-muted/30",
                      isUnread && "bg-magenta/[0.02]"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-0.5 rounded-full p-2 border", details.color)}>
                        <Bell className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn("font-medium text-sm", isUnread && "font-bold text-foreground")}>
                            {details.title}
                          </span>
                          {isUnread && (
                            <Badge variant="default" className="bg-magenta hover:bg-magenta text-[9px] px-1.5 py-0">
                              Unread
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground max-w-xl">
                          {details.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground/80">
                          {new Date(notif.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {isUnread && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkRead(notif._id)}
                        disabled={markRead.isPending}
                        className="self-start sm:self-center text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-lg border-border">
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-lg font-medium">Inbox is empty</CardTitle>
              <CardDescription className="max-w-xs mt-1">
                You have no notifications or alerts logged at this time.
              </CardDescription>
            </div>
          )}

          {/* Pagination controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-xs text-muted-foreground">
                Page {page} of {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
