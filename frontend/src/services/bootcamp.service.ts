import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type { Bootcamp, BootcampListResponse, BootcampQueryParams } from "@/types/bootcamp";

/**
 * Bootcamp Service
 * Handles all bootcamp-related API calls
 */
export const bootcampService = {
  /**
   * Get list of bootcamps with optional filters
   */
  async getBootcamps(params?: BootcampQueryParams): Promise<BootcampListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.category) queryParams.append("category", params.category);
    if (params?.mode) queryParams.append("mode", params.mode);
    if (params?.status) queryParams.append("status", params.status);

    const url = `${API_ENDPOINTS.bootcamps.list}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return apiClient.get<BootcampListResponse>(url);
  },

  /**
   * Get bootcamp by slug
   */
  async getBootcampBySlug(slug: string): Promise<Bootcamp> {
    return apiClient.get<Bootcamp>(`${API_ENDPOINTS.bootcamps.list}/${slug}`);
  },
};
