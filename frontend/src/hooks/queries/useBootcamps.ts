import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bootcampService } from "@/services/bootcamp.service";
import type { BootcampActionData, BootcampQueryParams } from "@/types/bootcamp";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error) return error.message;

  if (typeof error === "object" && error !== null && "response" in error) {
    const response = (error as {
      response?: {
        data?: {
          message?: string;
          error?: {
            message?: string;
          };
        };
      };
    }).response;

    return response?.data?.message || response?.data?.error?.message || fallback;
  }

  return fallback;
};

/**
 * Query key factory for bootcamps
 */
export const bootcampKeys = {
  all: ["bootcamps"] as const,
  lists: () => [...bootcampKeys.all, "list"] as const,
  list: (params?: BootcampQueryParams) =>
    [
      ...bootcampKeys.lists(),
      params?.limit ?? null,
      params?.page ?? null,
      params?.category ?? null,
      params?.mode ?? null,
      params?.status ?? null,
    ] as const,
  details: () => [...bootcampKeys.all, "detail"] as const,
  detail: (slug: string) => [...bootcampKeys.details(), slug] as const,
};

/**
 * Hook to fetch bootcamps list
 */
export function useBootcamps(params?: BootcampQueryParams, enabled: boolean = true) {
  return useQuery({
    queryKey: bootcampKeys.list(params),
    queryFn: () => bootcampService.getBootcamps(params),
    enabled: enabled, // Only fetch when enabled is true
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: "always",
  });
}

/**
 * Hook to fetch a single bootcamp by slug
 */
export function useBootcampBySlug(slug: string) {
  return useQuery({
    queryKey: bootcampKeys.detail(slug),
    queryFn: () => bootcampService.getBootcampBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useRegisterBootcamp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      bootcampId,
      data,
    }: {
      bootcampId: string;
      data: BootcampActionData;
    }) => bootcampService.register(bootcampId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Bootcamp registration successful!");
      queryClient.invalidateQueries({ queryKey: bootcampKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to register for bootcamp."));
    },
  });
}

export function useRequestBootcampCallback() {
  return useMutation({
    mutationFn: ({
      bootcampId,
      data,
    }: {
      bootcampId: string;
      data: BootcampActionData;
    }) => bootcampService.requestCallback(bootcampId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Callback request submitted!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to submit callback request."));
    },
  });
}
