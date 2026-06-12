import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  HackathonActionData,
  HackathonActionResponse,
  HackathonDetailResponse,
  HackathonListResponse,
  HackathonQueryParams,
} from "@/types/hackathon";

export const hackathonService = {
  getHackathons: async (params?: HackathonQueryParams): Promise<HackathonListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.mode) queryParams.append("mode", params.mode);

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.hackathons.list}?${queryString}`
      : API_ENDPOINTS.hackathons.list;

    return apiClient.get<HackathonListResponse>(endpoint);
  },

  getDetails: async (slug: string): Promise<HackathonDetailResponse> => {
    return apiClient.get<HackathonDetailResponse>(
      API_ENDPOINTS.events.detailBySlugV2(slug)
    );
  },

  register: async (
    hackathonId: string,
    data: HackathonActionData
  ): Promise<HackathonActionResponse> => {
    return apiClient.post<HackathonActionResponse>(
      API_ENDPOINTS.events.registerByType("Hackathon", hackathonId),
      data
    );
  },

  requestCallback: async (
    hackathonId: string,
    data: HackathonActionData
  ): Promise<HackathonActionResponse> => {
    return apiClient.post<HackathonActionResponse>(
      API_ENDPOINTS.events.requestCallbackByType("Hackathon", hackathonId),
      data
    );
  },
};
