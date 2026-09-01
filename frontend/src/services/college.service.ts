/**
 * College Service Layer
 * Handles all college-dashboard API calls (GC-232 /colleges/* endpoints).
 * Used by React Query hooks.
 */

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  CollegeDashboardResponse,
  CohortResponse,
  CollegeStudentsResponse,
  ImportStudentsPayload,
  ImportStudentsResponse,
  CollegeProfileResponse,
  CollegePartnershipResponse,
  CollegeReportsResponse,
  CollegeSettingsResponse,
  CollegeSupportTicketResponse,
  CollegeSupportTicketsResponse,
  UpdateCollegeProfileData,
  CollegeNotificationPreferences,
  PartnershipTier,
  CohortStatus,
} from "@/types/college";
import type { ApiResponse } from "@/types/api";

export interface CollegeStudentsQuery {
  status?: "active" | "completed" | "pending";
  search?: string;
  page?: number;
  limit?: number;
}

export const collegeService = {
  getDashboard: async (): Promise<CollegeDashboardResponse> => {
    return apiClient.get<CollegeDashboardResponse>(API_ENDPOINTS.colleges.dashboard);
  },

  getCohort: async (): Promise<CohortResponse> => {
    return apiClient.get<CohortResponse>(API_ENDPOINTS.colleges.cohort);
  },

  getStudents: async (query: CollegeStudentsQuery = {}): Promise<CollegeStudentsResponse> => {
    const params = new URLSearchParams();
    if (query.status) params.set("status", query.status);
    if (query.search) params.set("search", query.search);
    if (query.page) params.set("page", String(query.page));
    if (query.limit) params.set("limit", String(query.limit));
    const qs = params.toString();
    const url = qs ? `${API_ENDPOINTS.colleges.students}?${qs}` : API_ENDPOINTS.colleges.students;
    return apiClient.get<CollegeStudentsResponse>(url);
  },

  importStudents: async (payload: ImportStudentsPayload): Promise<ImportStudentsResponse> => {
    return apiClient.post<ImportStudentsResponse>(API_ENDPOINTS.colleges.studentsImport, payload);
  },

  getProfile: async (): Promise<CollegeProfileResponse> => {
    return apiClient.get<CollegeProfileResponse>(API_ENDPOINTS.colleges.profile);
  },

  updateProfile: async (data: UpdateCollegeProfileData): Promise<CollegeProfileResponse> => {
    return apiClient.put<CollegeProfileResponse>(API_ENDPOINTS.colleges.profile, data);
  },

  getPartnership: async (): Promise<CollegePartnershipResponse> => {
    return apiClient.get<CollegePartnershipResponse>(API_ENDPOINTS.colleges.partnership);
  },

  subscribe: async (tier: PartnershipTier): Promise<ApiResponse<CohortStatus>> => {
    return apiClient.post<ApiResponse<CohortStatus>>(API_ENDPOINTS.colleges.subscription, { tier });
  },

  requestUpgrade: async (data: {
    requestedTier: PartnershipTier;
    note?: string;
  }): Promise<ApiResponse<unknown>> => {
    return apiClient.post<ApiResponse<unknown>>(API_ENDPOINTS.colleges.upgradeRequest, data);
  },

  getReports: async (): Promise<CollegeReportsResponse> => {
    return apiClient.get<CollegeReportsResponse>(API_ENDPOINTS.colleges.reports);
  },

  getSettings: async (): Promise<CollegeSettingsResponse> => {
    return apiClient.get<CollegeSettingsResponse>(API_ENDPOINTS.colleges.settings);
  },

  updateAccount: async (data: {
    institutionName?: string;
    phone?: string;
  }): Promise<ApiResponse<{ institutionName: string; phone: string }>> => {
    return apiClient.put(API_ENDPOINTS.colleges.settingsAccount, data);
  },

  updateNotifications: async (
    prefs: Partial<CollegeNotificationPreferences>
  ): Promise<ApiResponse<{ notificationPreferences: CollegeNotificationPreferences }>> => {
    return apiClient.put(API_ENDPOINTS.colleges.settingsNotifications, prefs);
  },

  submitSupport: async (data: {
    subject: string;
    message: string;
  }): Promise<CollegeSupportTicketResponse> => {
    return apiClient.post<CollegeSupportTicketResponse>(API_ENDPOINTS.colleges.support, data);
  },

  getSupportTickets: async (): Promise<CollegeSupportTicketsResponse> => {
    return apiClient.get<CollegeSupportTicketsResponse>(API_ENDPOINTS.colleges.support);
  },

  getEventAccessStudents: async (
    eventId: string
  ): Promise<ApiResponse<{ userId: string; name: string; email: string; phone: string; hasAccess: boolean }[]>> => {
    return apiClient.get(API_ENDPOINTS.colleges.eventStudents(eventId));
  },

  updateEventAccess: async (
    eventId: string,
    data: { studentIds: string[]; action: "grant" | "revoke" }
  ): Promise<ApiResponse<{ success: boolean; modifiedCount: number }>> => {
    return apiClient.post(API_ENDPOINTS.colleges.eventAccess(eventId), data);
  },

  getAttendance: async (query?: {
    batchId?: string;
    studentId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> => {
    const params = new URLSearchParams();
    if (query?.batchId) params.set("batchId", query.batchId);
    if (query?.studentId) params.set("studentId", query.studentId);
    if (query?.startDate) params.set("startDate", query.startDate);
    if (query?.endDate) params.set("endDate", query.endDate);
    if (query?.page) params.set("page", String(query.page));
    if (query?.limit) params.set("limit", String(query.limit));
    const qs = params.toString();
    const url = qs ? `${API_ENDPOINTS.colleges.attendance}?${qs}` : API_ENDPOINTS.colleges.attendance;
    return apiClient.get<ApiResponse<any>>(url);
  },

  getAttendanceSummary: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.colleges.attendanceSummary);
  },

  activateAmbassadors: async (studentUserIds: string[]): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>(API_ENDPOINTS.colleges.ambassadors, { studentUserIds });
  },

  getAmbassadors: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.colleges.ambassadors);
  },

  deactivateAmbassador: async (studentUserId: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<ApiResponse<any>>(API_ENDPOINTS.colleges.deleteAmbassador(studentUserId));
  },

  buyEvent: async (
    eventId: string,
    payload?: { batchId?: string; amount?: number }
  ): Promise<ApiResponse<{ orderId: string; amount: number; currency: string; keyId: string }>> => {
    return apiClient.post(API_ENDPOINTS.colleges.buyEvent(eventId), payload || {});
  },

  verifyEventPayment: async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature?: string;
  }): Promise<ApiResponse<any>> => {
    return apiClient.post(API_ENDPOINTS.colleges.verifyEventPayment, data);
  },
};
