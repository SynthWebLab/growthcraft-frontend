import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { useCurrentUser } from "./useCurrentUser";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { notificationsKeys } from "./queries/useNotifications";
import { authService } from "@/services/auth.service";

// Map notification types to human readable messages for toasts
const getNotificationToastMessage = (notification: any): string => {
  const data = notification.data || {};
  switch (notification.type) {
    case "ambassador.activated":
      return `🎉 Great news! You have been activated as a Campus Ambassador!`;
    case "ambassador.deactivated":
      return `Your Campus Ambassador status has been updated.`;
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
  const { user, isAuthenticated } = useCurrentUser();
  const queryClient = useQueryClient();
  const router = useRouter();

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
              router.push(dashboardPath);
            }
          }
        }
      });

      // Invalidate queries to refresh notifications and active dashboards in real time
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["college"] });
      void queryClient.invalidateQueries({ queryKey: ["student"] });
      void queryClient.invalidateQueries({ queryKey: ["bootcamps"] });
      void queryClient.invalidateQueries({ queryKey: ["hackathons"] });
      void queryClient.invalidateQueries({ queryKey: ["workshops"] });
      void queryClient.invalidateQueries({ queryKey: ["events"] });
    };

    socket.on("notification", handleNotification);

    const handleEventUpdate = (data: any) => {
      void queryClient.invalidateQueries({ queryKey: ["bootcamps"] });
      void queryClient.invalidateQueries({ queryKey: ["hackathons"] });
      void queryClient.invalidateQueries({ queryKey: ["workshops"] });
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      void queryClient.invalidateQueries({ queryKey: ["admin"] });
    };

    socket.on("event.updated", handleEventUpdate);

    let isRefreshing = false;

    socket.on("connect_error", async (err) => {
      if (err.message.includes("Authentication error") && !isRefreshing) {
        isRefreshing = true;
        try {
          await authService.refreshToken();
          setTimeout(() => {
            if (!socket.connected) socket.connect();
          }, 500);
        } catch (error) {
          socket.disconnect();
        } finally {
          isRefreshing = false;
        }
      } else if (!err.message.includes("Authentication error")) {
        // Non-auth errors (e.g. xhr poll error) — stop retrying
        socket.disconnect();
      }
    });

    return () => {
      socket.off("notification", handleNotification);
      socket.off("event.updated", handleEventUpdate);
      socket.disconnect();
    };
  }, [user, isAuthenticated, queryClient]);
}
