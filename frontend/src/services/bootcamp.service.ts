import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  Bootcamp,
  BootcampActionData,
  BootcampActionResponse,
  BootcampListResponse,
  BootcampQueryParams,
} from "@/types/bootcamp";

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
    const response = await apiClient.get<any>(url);

    const items = response?.items || response?.data || [];
    const pagination = response?.pagination || response?.meta?.pagination || {
      page: params?.page || 1,
      limit: params?.limit || 10,
      total: items.length,
      totalPages: 1,
    };

    return {
      items,
      nextCursor: response?.nextCursor || null,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: pagination.total || items.length,
        totalPages: pagination.totalPages || 1,
      },
    };
  },

  /**
   * Get bootcamp by slug
   */
  async getBootcampBySlug(slug: string): Promise<Bootcamp> {
    return apiClient.get<Bootcamp>(`${API_ENDPOINTS.bootcamps.list}/${slug}`);
  },

  async register(
    bootcampId: string,
    data: BootcampActionData
  ): Promise<BootcampActionResponse> {
    return apiClient.post<BootcampActionResponse>(
      API_ENDPOINTS.events.registerByType("Bootcamp", bootcampId),
      data
    );
  },

  async requestCallback(
    bootcampId: string,
    data: BootcampActionData
  ): Promise<BootcampActionResponse> {
    return apiClient.post<BootcampActionResponse>(
      API_ENDPOINTS.events.requestCallbackByType("Bootcamp", bootcampId),
      data
    );
  },
};
