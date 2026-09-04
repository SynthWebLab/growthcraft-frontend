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
  PublicMentorsResponse,
} from "@/types/mentor";

export const mentorService = {
  /** Get aggregated mentor dashboard details. */
  getDashboard: async (period?: string): Promise<MentorDashboardResponse> => {
    const url = period
      ? `${API_ENDPOINTS.mentor.dashboard}?period=${period}`
      : API_ENDPOINTS.mentor.dashboard;
    return apiClient.get<MentorDashboardResponse>(url);
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
  withdrawEarnings: async (data?: { amount?: number; paymentMethod?: string; paymentDetails?: string }): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>(API_ENDPOINTS.mentor.withdraw, data);
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

  /** Get assigned batches */
  getBatches: async (params?: { status?: string; page?: number; limit?: number }): Promise<any> => {
    const q = new URLSearchParams();
    if (params?.status) q.append("status", params.status);
    if (params?.page) q.append("page", params.page.toString());
    if (params?.limit) q.append("limit", params.limit.toString());
    const url = q.toString() ? `${API_ENDPOINTS.mentor.batches}?${q.toString()}` : API_ENDPOINTS.mentor.batches;
    return apiClient.get<any>(url);
  },

  /** Get single batch details (students, attendance, logs) */
  getBatchDetail: async (id: string): Promise<any> => {
    return apiClient.get<any>(API_ENDPOINTS.mentor.batchDetail(id));
  },

  /** Check in */
  checkIn: async (batchId: string): Promise<any> => {
    return apiClient.post<any>(API_ENDPOINTS.mentor.checkIn, { batchId });
  },

  /** Check out */
  checkOut: async (data: { batchId: string; notes?: string }): Promise<any> => {
    return apiClient.post<any>(API_ENDPOINTS.mentor.checkOut, data);
  },

  /** Get check-in status */
  getCheckInStatus: async (): Promise<any> => {
    return apiClient.get<any>(API_ENDPOINTS.mentor.checkInStatus);
  },

  /** Get check-ins history */
  getCheckInsHistory: async (params?: { batchId?: string; page?: number; limit?: number }): Promise<any> => {
    const q = new URLSearchParams();
    if (params?.batchId) q.append("batchId", params.batchId);
    if (params?.page) q.append("page", params.page.toString());
    if (params?.limit) q.append("limit", params.limit.toString());
    const url = q.toString() ? `${API_ENDPOINTS.mentor.checkInsHistory}?${q.toString()}` : API_ENDPOINTS.mentor.checkInsHistory;
    return apiClient.get<any>(url);
  },

  /** Mark student attendance */
  markAttendance: async (data: {
    batchId: string;
    date: string | Date;
    records: { studentUserId: string; status: 'Present' | 'Absent' | 'Late' | 'Excused'; remarks?: string }[];
  }): Promise<any> => {
    return apiClient.post<any>(API_ENDPOINTS.mentor.attendance, data);
  },

  /** Create student progress note */
  createProgressNote: async (data: {
    studentUserId: string;
    batchId: string;
    rubricScore: number;
    feedback: string;
    strengths?: string;
    areasForImprovement?: string;
  }): Promise<any> => {
    return apiClient.post<any>(API_ENDPOINTS.mentor.progressNotes, data);
  },

  /** Get public mentors catalogue (unauthenticated) */
  getPublicMentors: async (params?: {
    limit?: number;
    page?: number;
    search?: string;
    areaOfExpertise?: string;
    sortBy?: string;
  }): Promise<PublicMentorsResponse> => {
    const q = new URLSearchParams();
    if (params?.limit) q.append("limit", params.limit.toString());
    if (params?.page) q.append("page", params.page.toString());
    if (params?.search) q.append("search", params.search);
    if (params?.areaOfExpertise) q.append("areaOfExpertise", params.areaOfExpertise);
    if (params?.sortBy) q.append("sortBy", params.sortBy);
    const url = q.toString() ? `${API_ENDPOINTS.mentors.list}?${q.toString()}` : API_ENDPOINTS.mentors.list;
    return apiClient.get<PublicMentorsResponse>(url);
  },

  /** Upload mentor avatar photo */
  uploadAvatar: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<ApiResponse<{ url: string }>>(
      API_ENDPOINTS.mentor.uploadAvatar,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      } as any
    );
  },
};
