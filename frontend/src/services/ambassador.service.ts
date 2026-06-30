import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { ApiResponse } from "@/types/api";

export const ambassadorService = {
  activateAmbassador: async (): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>(API_ENDPOINTS.students.ambassadorActivate, {});
  },

  getDashboard: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.students.ambassadorDashboard);
  },

  getReferrals: async (query?: { status?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    if (query?.status) params.set("status", query.status);
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    const qs = params.toString();
    const url = qs ? `${API_ENDPOINTS.students.ambassadorReferrals}?${qs}` : API_ENDPOINTS.students.ambassadorReferrals;
    return apiClient.get<ApiResponse<any>>(url);
  },

  invite: async (data: { emails: string[]; programType?: string; programId?: string }): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>(API_ENDPOINTS.students.ambassadorInvite, data);
  },

  getEarnings: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.students.ambassadorEarnings);
  },
};
