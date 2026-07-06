/**
 * Event Service
 * Handles API calls for events (Workshops, Bootcamps, Hackathons)
 */

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  EventsResponse,
  EventFilters,
  EventDetailResponse,
  EventConfigResponse,
} from "@/types/event";

/**
 * Fetch list of events with optional filters
 */
export async function getEvents(filters?: EventFilters): Promise<EventsResponse> {
  // Build query string from filters
  let endpoint: string = API_ENDPOINTS.events.list;
  if (filters) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    const queryString = queryParams.toString();
    if (queryString) {
      endpoint = `${endpoint}?${queryString}`;
    }
  }

  const response = await apiClient.get<any>(endpoint);
  
  // Format items from backend to match frontend Event type
  const items = (response?.items || response?.data || []).map((e: any) => ({
    ...e,
    _id: e._id || e.id,
    id: e.id || e._id,
    type: e.type || "Workshop",
  }));

  const pagination = response?.pagination || response?.meta?.pagination || {
    page: filters?.page || 1,
    limit: filters?.limit || 10,
    total: items.length,
    totalPages: 1,
  };

  return {
    success: true,
    message: "Events retrieved successfully",
    data: items,
    meta: {
      timestamp: new Date().toISOString(),
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: pagination.total || items.length,
        totalPages: pagination.totalPages || 1,
      },
    },
  };
}

/**
 * Fetch a single event by slug
 */
export async function getEventBySlug(slug: string): Promise<EventDetailResponse> {
  return await apiClient.get<EventDetailResponse>(
    API_ENDPOINTS.events.detailBySlug(slug)
  );
}

/**
 * Fetch event configuration (types, categories, levels, modes)
 */
export async function getEventConfig(): Promise<EventConfigResponse> {
  return await apiClient.get<EventConfigResponse>(
    API_ENDPOINTS.events.config
  );
}

/**
 * Register for an event
 */
export async function registerForEvent(
  eventId: string,
  data: {
    fullName: string;
    email: string;
    phone: string;
  }
): Promise<any> {
  return await apiClient.post(
    API_ENDPOINTS.events.register(eventId),
    data
  );
}

/**
 * Request callback for an event
 */
export async function requestEventCallback(
  eventId: string,
  data: {
    fullName: string;
    email: string;
    phone: string;
  }
): Promise<any> {
  return await apiClient.post(
    API_ENDPOINTS.events.requestCallback(eventId),
    data
  );
}
