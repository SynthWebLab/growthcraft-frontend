import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { employerService } from "@/services/employer.service";
import type { Job, EmployerProfile } from "@/types/employer";

function extractApiError(error: any, fallback: string): string {
  const errorData = error?.response?.data?.error ?? error?.data?.error;
  const fieldErrors: Array<{ message: string }> =
    errorData?.details?.error?.errors || errorData?.details?.errors || [];
  if (fieldErrors.length) return fieldErrors.map((e) => e.message).join(", ");
  return errorData?.message || error?.message || fallback;
}

export const employerKeys = {
  all: ["employer"] as const,
  dashboard: () => [...employerKeys.all, "dashboard"] as const,
  jobs: () => [...employerKeys.all, "jobs"] as const,
  profile: () => [...employerKeys.all, "profile"] as const,
  talent: () => ["talent"] as const,
};

const STALE = 2 * 60 * 1000; // 2 minutes

export function useEmployerDashboard() {
  return useQuery({
    queryKey: employerKeys.dashboard(),
    queryFn: () => employerService.getDashboard().then((res) => res.data),
    staleTime: STALE,
    retry: 1,
  });
}

export function useTalentPool() {
  return useQuery({
    queryKey: employerKeys.talent(),
    queryFn: () => employerService.getTalentPool().then((res) => res.data),
    staleTime: STALE,
    retry: 1,
  });
}

export function useEmployerJobs() {
  return useQuery({
    queryKey: employerKeys.jobs(),
    queryFn: () => employerService.getJobs().then((res) => res.data),
    staleTime: STALE,
    retry: 1,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (jobData: Job) => employerService.createJob(jobData),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: employerKeys.jobs() });
      queryClient.invalidateQueries({ queryKey: employerKeys.dashboard() });
      toast.success(res.message || "Job posting created successfully");
    },
    onError: (err: any) => {
      toast.error(extractApiError(err, "Failed to create job posting"));
    },
  });
}

export function useUpdateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, jobData }: { id: string; jobData: Partial<Job> }) =>
      employerService.updateJob(id, jobData),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: employerKeys.jobs() });
      queryClient.invalidateQueries({ queryKey: employerKeys.dashboard() });
      toast.success(res.message || "Job posting updated successfully");
    },
    onError: (err: any) => {
      toast.error(extractApiError(err, "Failed to update job posting"));
    },
  });
}

export function useUpdateJobStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Job["status"] }) =>
      employerService.updateJobStatus(id, status),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: employerKeys.jobs() });
      queryClient.invalidateQueries({ queryKey: employerKeys.dashboard() });
      toast.success(res.message || "Job status updated successfully");
    },
    onError: (err: any) => {
      toast.error(extractApiError(err, "Failed to update job status"));
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => employerService.deleteJob(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: employerKeys.jobs() });
      queryClient.invalidateQueries({ queryKey: employerKeys.dashboard() });
      toast.success(res.message || "Job posting deleted successfully");
    },
    onError: (err: any) => {
      toast.error(extractApiError(err, "Failed to delete job posting"));
    },
  });
}

export function useEmployerProfile() {
  return useQuery({
    queryKey: employerKeys.profile(),
    queryFn: () => employerService.getProfile().then((res) => res.data),
    staleTime: STALE,
    retry: 1,
  });
}

export function useUpdateEmployerProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (profileData: Partial<EmployerProfile>) =>
      employerService.updateProfile(profileData),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: employerKeys.profile() });
      queryClient.invalidateQueries({ queryKey: employerKeys.dashboard() });
      toast.success(res.message || "Profile updated successfully");
    },
    onError: (err: any) => {
      toast.error(extractApiError(err, "Failed to update profile"));
    },
  });
}
