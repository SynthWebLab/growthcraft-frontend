import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { hackathonService } from "@/services/hackathon.service";
import type { HackathonActionData, HackathonQueryParams } from "@/types/hackathon";

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

export const hackathonKeys = {
  all: ["hackathons"] as const,
  details: () => [...hackathonKeys.all, "detail"] as const,
  detail: (slug: string) => [...hackathonKeys.details(), slug] as const,
  list: (params?: HackathonQueryParams) =>
    [
      ...hackathonKeys.all,
      params?.limit ?? null,
      params?.page ?? null,
      params?.status ?? null,
      params?.mode ?? null,
    ] as const,
};

export function useHackathons(params?: HackathonQueryParams) {
  return useQuery({
    queryKey: hackathonKeys.list(params),
    queryFn: () => hackathonService.getHackathons(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHackathonDetails(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: hackathonKeys.detail(slug),
    queryFn: () => hackathonService.getDetails(slug),
    enabled: !!slug && enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useRegisterHackathon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      hackathonId,
      data,
    }: {
      hackathonId: string;
      data: HackathonActionData;
    }) => hackathonService.register(hackathonId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Hackathon registration successful!");
      queryClient.invalidateQueries({ queryKey: hackathonKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to register for hackathon."));
    },
  });
}

export function useRequestHackathonCallback() {
  return useMutation({
    mutationFn: ({
      hackathonId,
      data,
    }: {
      hackathonId: string;
      data: HackathonActionData;
    }) => hackathonService.requestCallback(hackathonId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Callback request submitted!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to submit callback request."));
    },
  });
}
