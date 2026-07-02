/**
 * Student Service Layer
 * Handles all student-dashboard API calls (GC-230 /students/* endpoints).
 * Used by React Query hooks.
 */

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  StudentDashboardResponse,
  StudentProfileResponse,
  StudentCoursesResponse,
  StudentBootcampsResponse,
  StudentWorkshopsResponse,
  StudentHackathonsResponse,
  StudentTrainingProgramsResponse,
  StudentCertificatesResponse,
  UpdateStudentProfileData,
  SupportTicketResponse,
  SupportTicketsResponse,
  MentorsResponse,
  MentorSessionResponse,
  MentorSessionsResponse,
  BookMentorSessionData,
} from "@/types/student";

export const studentService = {
  /** Aggregated dashboard summary (counts + recent items + certificates). */
  getDashboard: async (): Promise<StudentDashboardResponse> => {
    return apiClient.get<StudentDashboardResponse>(API_ENDPOINTS.students.dashboard);
  },

  /** The authenticated student's profile (data.profile may be null if not yet created). */
  getProfile: async (): Promise<StudentProfileResponse> => {
    return apiClient.get<StudentProfileResponse>(API_ENDPOINTS.students.profile);
  },

  /** Create or update (upsert) the student's profile. */
  updateProfile: async (data: UpdateStudentProfileData): Promise<StudentProfileResponse> => {
    return apiClient.put<StudentProfileResponse>(API_ENDPOINTS.students.profile, data);
  },

  getCourses: async (): Promise<StudentCoursesResponse> => {
    return apiClient.get<StudentCoursesResponse>(API_ENDPOINTS.students.courses);
  },

  getBootcamps: async (): Promise<StudentBootcampsResponse> => {
    return apiClient.get<StudentBootcampsResponse>(API_ENDPOINTS.students.bootcamps);
  },

  getWorkshops: async (): Promise<StudentWorkshopsResponse> => {
    return apiClient.get<StudentWorkshopsResponse>(API_ENDPOINTS.students.workshops);
  },

  getHackathons: async (): Promise<StudentHackathonsResponse> => {
    return apiClient.get<StudentHackathonsResponse>(API_ENDPOINTS.students.hackathons);
  },

  getTrainingPrograms: async (): Promise<StudentTrainingProgramsResponse> => {
    return apiClient.get<StudentTrainingProgramsResponse>(
      API_ENDPOINTS.students.trainingPrograms
    );
  },

  getCertificates: async (): Promise<StudentCertificatesResponse> => {
    return apiClient.get<StudentCertificatesResponse>(API_ENDPOINTS.students.certificates);
  },

  submitSupport: async (data: {
    subject: string;
    message: string;
  }): Promise<SupportTicketResponse> => {
    return apiClient.post<SupportTicketResponse>(API_ENDPOINTS.students.support, data);
  },

  getSupportTickets: async (): Promise<SupportTicketsResponse> => {
    return apiClient.get<SupportTicketsResponse>(API_ENDPOINTS.students.support);
  },

  getMentors: async (expertise?: string): Promise<MentorsResponse> => {
    const url = expertise
      ? `${API_ENDPOINTS.students.mentors}?expertise=${encodeURIComponent(expertise)}`
      : API_ENDPOINTS.students.mentors;
    return apiClient.get<MentorsResponse>(url);
  },

  getMentorSessions: async (): Promise<MentorSessionsResponse> => {
    return apiClient.get<MentorSessionsResponse>(API_ENDPOINTS.students.mentorSessions);
  },

  bookMentorSession: async (data: BookMentorSessionData): Promise<MentorSessionResponse> => {
    return apiClient.post<MentorSessionResponse>(API_ENDPOINTS.students.mentorSessions, data);
  },

  getJobs: async (): Promise<any> => {
    return apiClient.get<any>(API_ENDPOINTS.students.jobs);
  },

  applyJob: async (
    jobId: string,
    data: { resumeUrl: string; coverLetter?: string }
  ): Promise<any> => {
    return apiClient.post<any>(API_ENDPOINTS.students.applyJob(jobId), data);
  },

  getApplications: async (): Promise<any> => {
    return apiClient.get<any>(API_ENDPOINTS.students.applications);
  },

  uploadResume: async (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append("resume", file);
    return apiClient.post<any>(API_ENDPOINTS.students.uploadResume, formData);
  },
};

