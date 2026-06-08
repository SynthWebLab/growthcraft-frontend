/**
 * Training Program React Query Hooks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTrainingPrograms,
  getTrainingProgramBySlug,
  getTrainingProgramConfig,
  enrollInTrainingProgram,
  requestTrainingProgramCallback,
} from "@/services/training-program.service";
import type { TrainingProgramFilters } from "@/types/training-program";
import { toast } from "sonner";

/**
 * Fetch training programs list
 */
export function useTrainingPrograms(filters?: TrainingProgramFilters) {
  return useQuery({
    queryKey: ["training-programs", filters],
    queryFn: () => getTrainingPrograms(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch a single training program by slug
 */
export function useTrainingProgramBySlug(slug: string) {
  return useQuery({
    queryKey: ["training-program", slug],
    queryFn: () => getTrainingProgramBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Fetch training program config
 */
export function useTrainingProgramConfig() {
  return useQuery({
    queryKey: ["training-program-config"],
    queryFn: getTrainingProgramConfig,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

/**
 * Enroll in training program
 */
export function useEnrollInTrainingProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      programId,
      data,
    }: {
      programId: string;
      data: { fullName: string; email: string; phone: string; cohortId?: string };
    }) => enrollInTrainingProgram(programId, data),
    onSuccess: (data, variables) => {
      toast.success(data.message || "Successfully enrolled in training program!");
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["training-program", variables.programId] });
      queryClient.invalidateQueries({ queryKey: ["training-programs"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to enroll. Please try again.";
      toast.error(errorMessage);
    },
  });
}

/**
 * Request callback for training program
 */
export function useRequestTrainingProgramCallback() {
  return useMutation({
    mutationFn: ({
      programId,
      data,
    }: {
      programId: string;
      data: { fullName: string; email: string; phone: string };
    }) => requestTrainingProgramCallback(programId, data),
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
