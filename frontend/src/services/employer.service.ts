/**
 * Employer Service Layer
 * Handles all employer-dashboard, talent, and jobs API calls.
 */

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiResponse } from "@/types/api";
import type { Job, Candidate, EmployerProfile, EmployerDashboardData } from "@/types/employer";

export const employerService = {
  getDashboard: async (): Promise<ApiResponse<EmployerDashboardData>> => {
    return apiClient.get<ApiResponse<EmployerDashboardData>>(API_ENDPOINTS.employers.dashboard);
  },

  getTalentPool: async (): Promise<ApiResponse<Candidate[]>> => {
    return apiClient.get<ApiResponse<Candidate[]>>(API_ENDPOINTS.talent.list);
  },

  getJobs: async (): Promise<ApiResponse<Job[]>> => {
    return apiClient.get<ApiResponse<Job[]>>(API_ENDPOINTS.employers.jobs);
  },

  createJob: async (jobData: Job): Promise<ApiResponse<Job>> => {
    return apiClient.post<ApiResponse<Job>>(API_ENDPOINTS.employers.jobs, jobData);
  },

  updateJob: async (id: string, jobData: Partial<Job>): Promise<ApiResponse<Job>> => {
    return apiClient.put<ApiResponse<Job>>(API_ENDPOINTS.employers.jobDetail(id), jobData);
  },

  updateJobStatus: async (id: string, status: Job["status"]): Promise<ApiResponse<Job>> => {
    return apiClient.patch<ApiResponse<Job>>(API_ENDPOINTS.employers.jobStatus(id), { status });
  },

  deleteJob: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(API_ENDPOINTS.employers.jobDetail(id));
  },

  getProfile: async (): Promise<ApiResponse<EmployerProfile>> => {
    return apiClient.get<ApiResponse<EmployerProfile>>(API_ENDPOINTS.employers.profile);
  },

  updateProfile: async (profileData: Partial<EmployerProfile>): Promise<ApiResponse<EmployerProfile>> => {
    return apiClient.patch<ApiResponse<EmployerProfile>>(API_ENDPOINTS.employers.profile, profileData);
  },
};
