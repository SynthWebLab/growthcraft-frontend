/**
 * Admin Service Layer
 * Handles all administrative API calls (endpoints under /admin/*).
 */

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { Batch, BatchesResponse } from "@/types/batch";
import * as AdminTypes from "@/types/admin";
import type { Course, CoursesResponse } from "@/types/course";

export const adminService = {
  // --- Mentor Payouts & Availability ---
  getMentors: async (params?: { search?: string; page?: number; limit?: number }): Promise<ApiResponse<any>> => {
    const q = new URLSearchParams();
    if (params?.search) q.append("search", params.search);
    if (params?.page) q.append("page", params.page.toString());
    if (params?.limit) q.append("limit", params.limit.toString());
    const url = q.toString() ? `${API_ENDPOINTS.admin.mentors}?${q.toString()}` : API_ENDPOINTS.admin.mentors;
    return apiClient.get<ApiResponse<any>>(url);
  },

  getBatches: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    batchType?: string;
    courseId?: string;
    trainingProgramId?: string;
    bootcampId?: string;
    mentorId?: string;
  }): Promise<BatchesResponse> => {
    const q = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          q.append(key, val.toString());
        }
      });
    }
    const url = q.toString() ? `${API_ENDPOINTS.admin.batches}?${q.toString()}` : API_ENDPOINTS.admin.batches;
    return apiClient.get<BatchesResponse>(url);
  },

  assignMentorToBatch: async (batchId: string, mentorId: string): Promise<ApiResponse<{ batch: Batch }>> => {
    return apiClient.patch<ApiResponse<{ batch: Batch }>>(`${API_ENDPOINTS.admin.batchDetail(batchId)}/mentor`, { mentorId });
  },

  createBatch: async (data: AdminTypes.CreateBatchRequest): Promise<ApiResponse<{ batch: Batch }>> => {
    return apiClient.post<ApiResponse<{ batch: Batch }>>(API_ENDPOINTS.admin.batches, data);
  },

  updateBatch: async (id: string, data: AdminTypes.UpdateBatchRequest): Promise<ApiResponse<{ batch: Batch }>> => {
    return apiClient.patch<ApiResponse<{ batch: Batch }>>(API_ENDPOINTS.admin.batchDetail(id), data);
  },

  getAvailableMentors: async (params: { date: string; batchType?: string; specialization?: string }): Promise<ApiResponse<any>> => {
    const q = new URLSearchParams();
    q.append("date", params.date);
    if (params.batchType) q.append("batchType", params.batchType);
    if (params.specialization) q.append("specialization", params.specialization);
    return apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.admin.availableMentors}?${q.toString()}`);
  },

  getMentorDetails: async (mentorId: string): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.admin.mentorDetail(mentorId));
  },

  getMentorCheckIns: async (
    mentorId: string,
    params?: { batchId?: string; startDate?: string; endDate?: string; verified?: string; page?: number; limit?: number }
  ): Promise<ApiResponse<any>> => {
    const q = new URLSearchParams();
    if (params?.batchId) q.append("batchId", params.batchId);
    if (params?.startDate) q.append("startDate", params.startDate);
    if (params?.endDate) q.append("endDate", params.endDate);
    if (params?.verified) q.append("verified", params.verified);
    if (params?.page) q.append("page", params.page.toString());
    if (params?.limit) q.append("limit", params.limit.toString());
    const url = q.toString() ? `${API_ENDPOINTS.admin.mentorCheckIns(mentorId)}?${q.toString()}` : API_ENDPOINTS.admin.mentorCheckIns(mentorId);
    return apiClient.get<ApiResponse<any>>(url);
  },

  verifyCheckIn: async (mentorId: string, checkInId: string): Promise<ApiResponse<any>> => {
    return apiClient.patch<ApiResponse<any>>(API_ENDPOINTS.admin.verifyCheckIn(mentorId, checkInId), {});
  },

  getMentorPayouts: async (mentorId: string): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.admin.mentorPayouts(mentorId));
  },

  recordPayout: async (mentorId: string, data: AdminTypes.RecordPayoutRequest): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>(API_ENDPOINTS.admin.recordPayout(mentorId), data);
  },

  approvePayout: async (payoutId: string, data?: AdminTypes.ApprovePayoutRequest): Promise<ApiResponse<any>> => {
    return apiClient.patch<ApiResponse<any>>(`/admin/mentor-payouts/${payoutId}/approve`, data || {});
  },

  confirmPayout: async (payoutId: string, data: AdminTypes.ConfirmPayoutRequest): Promise<ApiResponse<any>> => {
    return apiClient.patch<ApiResponse<any>>(`/admin/mentor-payouts/${payoutId}/confirm`, data);
  },

  getGlobalPayouts: async (month?: string): Promise<ApiResponse<any>> => {
    const url = month ? `${API_ENDPOINTS.admin.globalPayouts}?month=${month}` : API_ENDPOINTS.admin.globalPayouts;
    return apiClient.get<ApiResponse<any>>(url);
  },

  getMentorAvailability: async (mentorId: string): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.admin.mentorAvailability(mentorId));
  },

  // --- Student Attendance ---
  markAttendance: async (data: AdminTypes.MarkAttendanceRequest): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>(API_ENDPOINTS.admin.attendance, data);
  },

  getAttendance: async (params?: {
    batchId?: string;
    studentId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> => {
    const q = new URLSearchParams();
    if (params?.batchId) q.append("batchId", params.batchId);
    if (params?.studentId) q.append("studentId", params.studentId);
    if (params?.startDate) q.append("startDate", params.startDate);
    if (params?.endDate) q.append("endDate", params.endDate);
    if (params?.status) q.append("status", params.status);
    if (params?.page) q.append("page", params.page.toString());
    if (params?.limit) q.append("limit", params.limit.toString());
    const url = q.toString() ? `${API_ENDPOINTS.admin.attendance}?${q.toString()}` : API_ENDPOINTS.admin.attendance;
    return apiClient.get<ApiResponse<any>>(url);
  },

  getAttendanceSummary: async (batchId: string): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.admin.attendanceSummary(batchId));
  },

  // --- Revenue & Analytics ---
  getRevenue: async (params?: { month?: string; batchType?: string }): Promise<ApiResponse<any>> => {
    const q = new URLSearchParams();
    if (params?.month) q.append("month", params.month);
    if (params?.batchType) q.append("batchType", params.batchType);
    const url = q.toString() ? `${API_ENDPOINTS.admin.revenue}?${q.toString()}` : API_ENDPOINTS.admin.revenue;
    return apiClient.get<ApiResponse<any>>(url);
  },

  getAnalytics: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.admin.analytics);
  },

  getAuditLogs: async (params?: {
    performedBy?: string;
    action?: string;
    target?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> => {
    const q = new URLSearchParams();
    if (params?.performedBy) q.append("performedBy", params.performedBy);
    if (params?.action) q.append("action", params.action);
    if (params?.target) q.append("target", params.target);
    if (params?.startDate) q.append("startDate", params.startDate);
    if (params?.endDate) q.append("endDate", params.endDate);
    if (params?.page) q.append("page", params.page.toString());
    if (params?.limit) q.append("limit", params.limit.toString());
    const url = q.toString() ? `${API_ENDPOINTS.admin.auditLogs}?${q.toString()}` : API_ENDPOINTS.admin.auditLogs;
    return apiClient.get<ApiResponse<any>>(url);
  },

  // --- Users ---
  getUsers: async (params?: {
    role?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any>> => {
    const q = new URLSearchParams();
    if (params?.role) q.append("role", params.role);
    if (params?.search) q.append("search", params.search);
    if (params?.page) q.append("page", params.page.toString());
    if (params?.limit) q.append("limit", params.limit.toString());
    const url = q.toString()
      ? `${API_ENDPOINTS.admin.users}?${q.toString()}`
      : API_ENDPOINTS.admin.users;
    return apiClient.get<ApiResponse<any>>(url);
  },

  getUserById: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.admin.userDetail(id));
  },

  updateUserStatus: async (id: string, data: AdminTypes.UpdateUserStatusRequest): Promise<ApiResponse<any>> => {
    return apiClient.patch<ApiResponse<any>>(`${API_ENDPOINTS.admin.users}/${id}/status`, data);
  },

  // --- Colleges ---
  getColleges: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.admin.colleges);
  },

  updateCollege: async (id: string, data: Record<string, any>): Promise<ApiResponse<any>> => {
    return apiClient.put<ApiResponse<any>>(API_ENDPOINTS.admin.collegeDetail(id), data);
  },

  deleteCollege: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<ApiResponse<any>>(API_ENDPOINTS.admin.collegeDetail(id));
  },

  // --- Employers ---
  getEmployers: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.admin.employers);
  },

  updateEmployer: async (id: string, data: Record<string, any>): Promise<ApiResponse<any>> => {
    return apiClient.put<ApiResponse<any>>(API_ENDPOINTS.admin.employerDetail(id), data);
  },

  deleteEmployer: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<ApiResponse<any>>(API_ENDPOINTS.admin.employerDetail(id));
  },

  // --- Course Admin CRUD ---
  getCourses: async (): Promise<CoursesResponse> => {
    return apiClient.get<CoursesResponse>(API_ENDPOINTS.admin.courses);
  },

  createCourse: async (data: AdminTypes.CreateCourseRequest): Promise<ApiResponse<{ course: Course }>> => {
    return apiClient.post<ApiResponse<{ course: Course }>>(API_ENDPOINTS.admin.courses, data);
  },

  updateCourse: async (id: string, data: AdminTypes.UpdateCourseRequest): Promise<ApiResponse<{ course: Course }>> => {
    return apiClient.put<ApiResponse<{ course: Course }>>(API_ENDPOINTS.admin.courseDetail(id), data);
  },

  deleteCourse: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<ApiResponse<any>>(API_ENDPOINTS.admin.courseDetail(id));
  },

  publishCourse: async (id: string): Promise<ApiResponse<{ course: Course }>> => {
    return apiClient.patch<ApiResponse<{ course: Course }>>(API_ENDPOINTS.admin.coursePublish(id), {});
  },

  // --- Training Program Admin CRUD ---
  getAdminTrainingPrograms: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<any>> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.admin.trainingPrograms}${qs ? `?${qs}` : ""}`);
  },

  createTrainingProgram: async (data: AdminTypes.CreateTrainingProgramRequest): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>(API_ENDPOINTS.admin.trainingPrograms, data);
  },

  updateTrainingProgram: async (id: string, data: AdminTypes.UpdateTrainingProgramRequest): Promise<ApiResponse<any>> => {
    return apiClient.put<ApiResponse<any>>(API_ENDPOINTS.admin.trainingProgramDetail(id), data);
  },

  publishTrainingProgram: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.patch<ApiResponse<any>>(API_ENDPOINTS.admin.trainingProgramPublish(id), {});
  },

  deleteTrainingProgram: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<ApiResponse<any>>(API_ENDPOINTS.admin.trainingProgramDetail(id));
  },

  // --- Event Admin CRUD ---
  getAdminEvents: async (params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<any>> => {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", String(params.page));
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.search) query.set("search", params.search);
    const qs = query.toString();
    return apiClient.get<ApiResponse<any>>(`${API_ENDPOINTS.admin.events}${qs ? `?${qs}` : ""}`);
  },

  createEvent: async (data: AdminTypes.CreateEventRequest): Promise<ApiResponse<any>> => {
    return apiClient.post<ApiResponse<any>>(API_ENDPOINTS.admin.events, data);
  },

  updateEvent: async (id: string, data: AdminTypes.UpdateEventRequest): Promise<ApiResponse<any>> => {
    return apiClient.put<ApiResponse<any>>(API_ENDPOINTS.admin.eventDetail(id), data);
  },

  publishEvent: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.patch<ApiResponse<any>>(API_ENDPOINTS.admin.eventPublish(id), {});
  },

  toggleEventStatus: async (id: string, status?: string): Promise<ApiResponse<any>> => {
    return apiClient.patch<ApiResponse<any>>(`${API_ENDPOINTS.admin.events}/${id}/status`, { status });
  },

  deleteEvent: async (id: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<ApiResponse<any>>(API_ENDPOINTS.admin.eventDetail(id));
  },

  // --- File Upload ---
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post<{ url: string }>(API_ENDPOINTS.admin.upload, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // --- Enquiries & Lead Callbacks ---
  getEnquiries: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.admin.enquiries);
  },

  updateEnquiry: async (id: string, data: AdminTypes.UpdateEnquiryRequest): Promise<ApiResponse<any>> => {
    return apiClient.patch<ApiResponse<any>>(API_ENDPOINTS.admin.enquiryDetail(id), data);
  },

  deleteEnquiry: async (id: string, enquiryType: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<ApiResponse<any>>(`${API_ENDPOINTS.admin.enquiryDetail(id)}?enquiry_type=${encodeURIComponent(enquiryType)}`);
  },

  // --- Registrations ---
  getRegistrations: async (): Promise<ApiResponse<any>> => {
    return apiClient.get<ApiResponse<any>>(API_ENDPOINTS.admin.registrations);
  },

  updateRegistration: async (
    id: string,
    data: AdminTypes.UpdateRegistrationRequest
  ): Promise<ApiResponse<any>> => {
    return apiClient.patch<ApiResponse<any>>(API_ENDPOINTS.admin.registrationDetail(id), data);
  },

  deleteRegistration: async (id: string, itemType: string): Promise<ApiResponse<any>> => {
    return apiClient.delete<ApiResponse<any>>(
      `${API_ENDPOINTS.admin.registrationDetail(id)}?item_type=${encodeURIComponent(itemType)}`
    );
  },
};
