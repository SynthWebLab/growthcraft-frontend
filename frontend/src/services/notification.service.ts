import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export const notificationService = {
  getNotifications: async (params?: { page?: number; limit?: number }): Promise<any> => {
    const q = new URLSearchParams();
    if (params?.page) q.append("page", params.page.toString());
    if (params?.limit) q.append("limit", params.limit.toString());
    const url = q.toString()
      ? `${API_ENDPOINTS.notifications.list}?${q.toString()}`
      : API_ENDPOINTS.notifications.list;
    return apiClient.get<any>(url);
  },

  getUnreadCount: async (): Promise<any> => {
    return apiClient.get<any>(API_ENDPOINTS.notifications.unreadCount);
  },

  markAsRead: async (id: string): Promise<any> => {
    return apiClient.patch<any>(API_ENDPOINTS.notifications.read(id), {});
  },

  markAllAsRead: async (): Promise<any> => {
    return apiClient.patch<any>(API_ENDPOINTS.notifications.readAll, {});
  },
};
