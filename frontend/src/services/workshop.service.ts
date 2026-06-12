import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  WorkshopActionData,
  WorkshopActionResponse,
  WorkshopDetailResponse,
  WorkshopListResponse,
  WorkshopQueryParams,
} from "@/types/workshop";

export const workshopService = {
  getWorkshops: async (params?: WorkshopQueryParams): Promise<WorkshopListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.mode) queryParams.append("mode", params.mode);

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.workshops.list}?${queryString}`
      : API_ENDPOINTS.workshops.list;

    return apiClient.get<WorkshopListResponse>(endpoint);
  },

  getDetails: async (slug: string): Promise<WorkshopDetailResponse> => {
    return apiClient.get<WorkshopDetailResponse>(
      API_ENDPOINTS.events.detailBySlugV2(slug)
    );
  },

  register: async (
    workshopId: string,
    data: WorkshopActionData
  ): Promise<WorkshopActionResponse> => {
    return apiClient.post<WorkshopActionResponse>(
      API_ENDPOINTS.events.registerByType("Workshop", workshopId),
      data
    );
  },

  requestCallback: async (
    workshopId: string,
    data: WorkshopActionData
  ): Promise<WorkshopActionResponse> => {
    return apiClient.post<WorkshopActionResponse>(
      API_ENDPOINTS.events.requestCallbackByType("Workshop", workshopId),
      data
    );
  },
};
