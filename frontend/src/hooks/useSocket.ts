import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { notificationsKeys } from "./queries/useNotifications";
import { authService } from "@/services/auth.service";

// Map notification types to human readable messages for toasts
const getNotificationToastMessage = (notification: any): string => {
  const data = notification.data || {};
  switch (notification.type) {
    case "enrollment.created":
      return `Successfully enrolled in batch ${data.batchCode || ""}`;
    case "batch.assigned":
      return `You have been assigned to new batch: ${data.batchCode || ""}`;
    case "mentor.checkin.verified":
      return `Your check-in session for ${data.hoursWorked || 0} hours has been verified!`;
    case "referral.conversion":
      return `Great news! A student conversion occurred. Commission earned: INR ${data.commissionAmount || 0}`;
    default:
      return data.message || `New notification: ${notification.type}`;
  }
};

export function useSocket() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    const socket = getSocket();

    if (!socket.connected) {
      socket.connect();
    }

    const handleNotification = (notification: any) => {
      const msg = getNotificationToastMessage(notification);
      
      toast.info(msg, {
        duration: 5000,
        action: {
          label: "View All",
          onClick: () => {
            // Redirect or trigger action
            if (typeof window !== "undefined") {
              const role = user.role;
              const dashboardPath = `/${role}/notifications`;
              window.location.href = dashboardPath;
            }
          }
        }
      });

      // Invalidate queries to refresh notifications
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    };

    socket.on("notification", handleNotification);

    let isRefreshing = false;

    socket.on("connect_error", async (err) => {
      console.warn("Socket connection error:", err.message);
      if (err.message.includes("Authentication error") && !isRefreshing) {
        isRefreshing = true;
        try {
          // Try to refresh token if socket failed due to missing/expired token
          await authService.refreshToken();
          // Reconnect after a short delay to ensure cookies are updated
          setTimeout(() => {
            if (!socket.connected) socket.connect();
          }, 500);
        } catch (error) {
          console.error("Socket token refresh failed:", error);
        } finally {
          isRefreshing = false;
        }
      }
    });

    return () => {
      socket.off("notification", handleNotification);
      socket.disconnect();
    };
  }, [user, isAuthenticated, queryClient]);
}
