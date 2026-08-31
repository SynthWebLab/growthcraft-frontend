import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSocket } from "@/lib/socket";
import { useCurrentUser } from "./useCurrentUser";
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

// Module-level state for socket connection management
let activeConsumers = 0;
let listenersAttached = false;
let isRefreshing = false;
let latestUser: any = null;
let latestQueryClient: any = null;

const setupSocketListeners = (socket: any) => {
  if (listenersAttached) return;
  
  const handleNotification = (notification: any) => {
    const msg = getNotificationToastMessage(notification);

    toast.info(msg, {
      duration: 5000,
      action: {
        label: "View All",
        onClick: () => {
          if (typeof window !== "undefined" && latestUser) {
            const role = latestUser.role;
            const dashboardPath = `/${role}/notifications`;
            window.location.href = dashboardPath;
          }
        }
      }
    });

    if (latestQueryClient) {
      void latestQueryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
      void latestQueryClient.invalidateQueries({ queryKey: notificationsKeys.all });
      void latestQueryClient.invalidateQueries({ queryKey: ["college"] });
      void latestQueryClient.invalidateQueries({ queryKey: ["student"] });
      void latestQueryClient.invalidateQueries({ queryKey: ["bootcamps"] });
      void latestQueryClient.invalidateQueries({ queryKey: ["hackathons"] });
      void latestQueryClient.invalidateQueries({ queryKey: ["workshops"] });
      void latestQueryClient.invalidateQueries({ queryKey: ["events"] });
    }
  };

  const handleEventUpdate = (data: any) => {
    console.log("Real-time event update received:", data);
    if (latestQueryClient) {
      void latestQueryClient.invalidateQueries({ queryKey: ["bootcamps"] });
      void latestQueryClient.invalidateQueries({ queryKey: ["hackathons"] });
      void latestQueryClient.invalidateQueries({ queryKey: ["workshops"] });
      void latestQueryClient.invalidateQueries({ queryKey: ["events"] });
      void latestQueryClient.invalidateQueries({ queryKey: ["admin"] });
    }
  };

  const handleConnectError = async (err: any) => {
    console.debug("Socket connection error:", err.message);
    if (err.message.includes("Authentication error") && !isRefreshing) {
      isRefreshing = true;
      try {
        await authService.refreshToken();
        setTimeout(() => {
          if (!socket.connected && activeConsumers > 0) socket.connect();
        }, 500);
      } catch (error) {
        console.debug("Socket token refresh failed, disconnecting:", error);
        socket.disconnect();
      } finally {
        isRefreshing = false;
      }
    } else if (!err.message.includes("Authentication error")) {
      // Non-auth errors (e.g. xhr poll error) — stop retrying
      socket.disconnect();
    }
  };

  socket.on("notification", handleNotification);
  socket.on("event.updated", handleEventUpdate);
  socket.on("connect_error", handleConnectError);
  
  listenersAttached = true;
};

const cleanupSocketListeners = (socket: any) => {
  if (!listenersAttached) return;
  socket.off("notification");
  socket.off("event.updated");
  socket.off("connect_error");
  listenersAttached = false;
};

export function useSocket() {
  const { user, isAuthenticated } = useCurrentUser();
  const queryClient = useQueryClient();

  // Always keep latest refs updated for the global listeners
  latestUser = user;
  latestQueryClient = queryClient;

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const socket = getSocket();
    activeConsumers++;

    if (activeConsumers === 1) {
      if (!socket.connected) {
        socket.connect();
      }
      setupSocketListeners(socket);
    }

    return () => {
      activeConsumers--;
      
      // If we are the last consumer unmounting, tear down
      if (activeConsumers === 0) {
        cleanupSocketListeners(socket);
        socket.disconnect();
      }
    };
  }, [isAuthenticated]);
}
