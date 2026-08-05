import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { workshopService } from "@/services/workshop.service";
import type { WorkshopActionData, WorkshopQueryParams } from "@/types/workshop";

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

export const workshopKeys = {
  all: ["workshops"] as const,
  details: () => [...workshopKeys.all, "detail"] as const,
  detail: (slug: string) => [...workshopKeys.details(), slug] as const,
  list: (params?: WorkshopQueryParams) =>
    [
      ...workshopKeys.all,
      params?.limit ?? null,
      params?.page ?? null,
      params?.status ?? null,
      params?.mode ?? null,
    ] as const,
};

export function useWorkshops(params?: WorkshopQueryParams) {
  return useQuery({
    queryKey: workshopKeys.list(params),
    queryFn: () => workshopService.getWorkshops(params),
    staleTime: 5 * 60 * 1000,
  });
}

export function useWorkshopDetails(slug: string, enabled: boolean = true) {
  return useQuery({
    queryKey: workshopKeys.detail(slug),
    queryFn: () => workshopService.getDetails(slug),
    enabled: !!slug && enabled,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useRegisterWorkshop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      workshopId,
      data,
    }: {
      workshopId: string;
      data: WorkshopActionData;
    }) => workshopService.register(workshopId, data),
    onSuccess: (data: any) => {
      const isConfirmed = data?.data?.enrollment?.status === "confirmed" || data?.data?.enrollment?.paymentStatus === "completed";
      if (isConfirmed) {
        toast.success(data.message || "Workshop registration successful!");
      }
      queryClient.invalidateQueries({ queryKey: workshopKeys.all });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to register for workshop."));
    },
  });
}

export function useRequestWorkshopCallback() {
  return useMutation({
    mutationFn: ({
      workshopId,
      data,
    }: {
      workshopId: string;
      data: WorkshopActionData;
    }) => workshopService.requestCallback(workshopId, data),
    onSuccess: (data) => {
      toast.success(data.message || "Callback request submitted!");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to submit callback request."));
    },
  });
}
