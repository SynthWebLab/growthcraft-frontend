import { useQuery } from "@tanstack/react-query";
import { bootcampService } from "@/services/bootcamp.service";
import type { BootcampQueryParams } from "@/types/bootcamp";

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
export function useBootcamps(params?: BootcampQueryParams) {
  return useQuery({
    queryKey: bootcampKeys.list(params),
    queryFn: () => bootcampService.getBootcamps(params),
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
