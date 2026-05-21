/**
 * Course Service Layer
 * Handles all course-related API calls
 * Used by React Query hooks
 */

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { 
  CoursesResponse, 
  CourseFilters, 
  CourseConfigResponse,
  CourseDetailResponse,
  EnrollmentData,
  EnrollmentResponse,
  CallbackRequestData,
  CallbackResponse,
  EnrollmentStatusResponse
} from "@/types/course";

export const courseService = {
  /**
   * Get all courses with optional filters
   */
  getCourses: async (filters?: CourseFilters): Promise<CoursesResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append("category", filters.category);
    if (filters?.difficultyLevel) params.append("difficultyLevel", filters.difficultyLevel);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.search) params.append("search", filters.search);
    if (filters?.q) params.append("q", filters.q);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);
    if (filters?.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString());
    if (filters?.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString());
    if (filters?.minRating !== undefined) params.append("minRating", filters.minRating.toString());
    if (filters?.tags) params.append("tags", filters.tags);
    
    const queryString = params.toString();
    const url = queryString ? `${API_ENDPOINTS.courses.list}?${queryString}` : API_ENDPOINTS.courses.list;
    
    return apiClient.get<CoursesResponse>(url);
  },

  /**
   * Get course by ID or slug
   */
  getCourseById: async (id: string): Promise<CoursesResponse> => {
    return apiClient.get<CoursesResponse>(API_ENDPOINTS.courses.detail(id));
  },

  /**
   * Get course by slug
   */
  getCourseBySlug: async (slug: string): Promise<CourseDetailResponse> => {
    return apiClient.get<CourseDetailResponse>(API_ENDPOINTS.courses.detailBySlug(slug));
  },

  /**
   * Get course configuration (categories, difficulty levels, types)
   */
  getCourseConfig: async (): Promise<CourseConfigResponse> => {
    return apiClient.get<CourseConfigResponse>(API_ENDPOINTS.courses.config);
  },

  /**
   * Enroll in a course
   */
  enrollInCourse: async (courseId: string, data: EnrollmentData): Promise<EnrollmentResponse> => {
    return apiClient.post<EnrollmentResponse>(API_ENDPOINTS.courses.enroll(courseId), data);
  },

  /**
   * Request callback for a course
   */
  requestCallback: async (courseId: string, data: CallbackRequestData): Promise<CallbackResponse> => {
    return apiClient.post<CallbackResponse>(API_ENDPOINTS.courses.requestCallback(courseId), data);
  },

  /**
   * Check enrollment status for a course
   */
  getEnrollmentStatus: async (courseId: string): Promise<EnrollmentStatusResponse> => {
    return apiClient.get<EnrollmentStatusResponse>(API_ENDPOINTS.courses.enrollmentStatus(courseId));
  },
};
