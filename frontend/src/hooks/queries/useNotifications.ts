import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { toast } from "sonner";

export const notificationsKeys = {
  all: ["notifications"] as const,
  list: (page?: number) => [...notificationsKeys.all, "list", { page }] as const,
  unread: () => [...notificationsKeys.all, "unread"] as const,
};

export function useNotifications(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: notificationsKeys.list(params?.page),
    queryFn: () => notificationService.getNotifications(params),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useNotificationUnreadCount(enabled = true) {
  return useQuery({
    queryKey: notificationsKeys.unread(),
    queryFn: () => notificationService.getUnreadCount(),
    enabled,
    refetchInterval: 30000, // Fallback polling if socket fails
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || err.message || "Failed to mark notification as read");
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      toast.success("All notifications marked as read");
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
      void queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error?.message || err.message || "Failed to mark all as read");
    },
  });
}
