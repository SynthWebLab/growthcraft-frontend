/**
 * Event React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEvents,
  getEventBySlug,
  getEventConfig,
  registerForEvent,
  requestEventCallback,
} from "@/services/event.service";
import type { EventFilters } from "@/types/event";
import { toast } from "sonner";

/**
 * Fetch events list
 */
export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: () => getEvents(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch a single event by slug
 */
export function useEventBySlug(slug: string) {
  return useQuery({
    queryKey: ["event", slug],
    queryFn: () => getEventBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch event config
 */
export function useEventConfig() {
  return useQuery({
    queryKey: ["event-config"],
    queryFn: getEventConfig,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Register for an event
 */
export function useRegisterForEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: { fullName: string; email: string; phone: string };
    }) => registerForEvent(eventId, data),
    onSuccess: (data: any, variables) => {
      const isConfirmed = data?.data?.enrollment?.status === "confirmed" || data?.data?.enrollment?.paymentStatus === "completed";
      if (isConfirmed) {
        toast.success(data.message || "Successfully registered for event!");
      }
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["event", variables.eventId] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to register. Please try again.";
      toast.error(errorMessage);
    },
  });
}

/**
 * Request callback for event
 */
export function useRequestEventCallback() {
  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: { fullName: string; email: string; phone: string };
    }) => requestEventCallback(eventId, data),
    onSuccess: (data) => {
      toast.success(
        data.message || "Callback request submitted! We'll contact you soon."
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit request. Please try again.";
      toast.error(errorMessage);
    },
  });
}
