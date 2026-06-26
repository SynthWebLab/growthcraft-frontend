/**
 * Mentor Service Layer
 * Handles all mentor-dashboard API calls (endpoints under /mentor/*).
 * Used by React Query hooks.
 */

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  MentorDashboardResponse,
  MentorSessionsResponse,
  MentorSessionResponse,
  MentorAvailabilityResponse,
  MentorStudentsResponse,
  MentorEarningsResponse,
  MentorProfileResponse,
} from "@/types/mentor";

export const mentorService = {
  /** Get aggregated mentor dashboard details. */
  getDashboard: async (): Promise<MentorDashboardResponse> => {
    return apiClient.get<MentorDashboardResponse>(API_ENDPOINTS.mentor.dashboard);
  },

  /** Get list of sessions filtered by status. */
  getSessions: async (
    status?: "upcoming" | "past" | "cancelled"
  ): Promise<MentorSessionsResponse> => {
    const url = status
      ? `${API_ENDPOINTS.mentor.sessions}?status=${status}`
      : API_ENDPOINTS.mentor.sessions;
    return apiClient.get<MentorSessionsResponse>(url);
  },

  /** Update status of a specific session. */
  updateSessionStatus: async (
    sessionId: string,
    status: "scheduled" | "completed" | "cancelled"
  ): Promise<MentorSessionResponse> => {
    return apiClient.patch<MentorSessionResponse>(
      API_ENDPOINTS.mentor.updateSessionStatus(sessionId),
      { status }
    );
  },

  /** Get mentor availability schedule and hourly rate. */
  getAvailability: async (): Promise<MentorAvailabilityResponse> => {
    return apiClient.get<MentorAvailabilityResponse>(API_ENDPOINTS.mentor.availability);
  },

  /** Update availability schedule and hourly rate. */
  updateAvailability: async (data: {
    availability: any[];
    hourlyRate: number;
  }): Promise<MentorAvailabilityResponse> => {
    return apiClient.put<MentorAvailabilityResponse>(API_ENDPOINTS.mentor.availability, data);
  },

  /** Get unique list of students mentored. */
  getStudents: async (): Promise<MentorStudentsResponse> => {
    return apiClient.get<MentorStudentsResponse>(API_ENDPOINTS.mentor.students);
  },

  /** Get earnings data, trends, and payout history. */
  getEarnings: async (): Promise<MentorEarningsResponse> => {
    return apiClient.get<MentorEarningsResponse>(API_ENDPOINTS.mentor.earnings);
  },

  /** Submit a withdrawal request. */
  withdrawEarnings: async (): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>(API_ENDPOINTS.mentor.withdraw);
  },

  /** Get mentor profile details. */
  getProfile: async (): Promise<MentorProfileResponse> => {
    return apiClient.get<MentorProfileResponse>(API_ENDPOINTS.mentor.profile);
  },

  /** Update mentor profile details. */
  updateProfile: async (data: any): Promise<MentorProfileResponse> => {
    return apiClient.put<MentorProfileResponse>(API_ENDPOINTS.mentor.profile, data);
  },

  /** Submit support query ticket. */
  submitSupportTicket: async (data: { subject: string; message: string }): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>(API_ENDPOINTS.mentor.support, data);
  },

  /** Get support query tickets submitted by the mentor. */
  getSupportTickets: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.mentor.support);
  },

  /** Update mentor account settings (fullName, phone). */
  updateAccountSettings: async (data: { fullName?: string; phone?: string }): Promise<ApiResponse<any>> => {
    return apiClient.put<ApiResponse<any>>(API_ENDPOINTS.mentor.settingsAccount, data);
  },

  /** Change mentor password. */
  changePassword: async (data: { currentPassword?: string; newPassword?: string; confirmPassword?: string }): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>(API_ENDPOINTS.mentor.settingsPassword, data);
  },
};
