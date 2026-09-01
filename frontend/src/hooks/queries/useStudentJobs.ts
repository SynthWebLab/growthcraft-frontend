import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentService } from "@/services/student.service";

function extractApiError(error: any, fallback: string): string {
  const errorData = error?.response?.data?.error ?? error?.data?.error;
  const fieldErrors: Array<{ message: string }> =
    errorData?.details?.error?.errors || errorData?.details?.errors || [];
  if (fieldErrors.length) return fieldErrors.map((e) => e.message).join(", ");
  return errorData?.message || error?.message || fallback;
}

export const studentJobsKeys = {
  all: ["student-jobs"] as const,
  jobs: () => [...studentJobsKeys.all, "list"] as const,
  applications: () => [...studentJobsKeys.all, "applications"] as const,
};

const STALE = 2 * 60 * 1000; // 2 minutes

export function useStudentJobs() {
  return useQuery({
    queryKey: studentJobsKeys.jobs(),
    queryFn: () => studentService.getJobs().then((res) => res.data),
    staleTime: 0,
    refetchInterval: 5000, // Real-time 5-second automatic background sync
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

export function useStudentApplications() {
  return useQuery({
    queryKey: studentJobsKeys.applications(),
    queryFn: () => studentService.getApplications().then((res) => res.data),
    staleTime: 0,
    refetchInterval: 5000, // Real-time 5-second automatic background sync
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

export function useApplyJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      resumeUrl,
      coverLetter,
    }: {
      jobId: string;
      resumeUrl: string;
      coverLetter?: string;
    }) => studentService.applyJob(jobId, { resumeUrl, coverLetter }),
    onSuccess: (_, variables) => {
      toast.success("Application submitted successfully!");
      // Invalidate list of jobs & list of applications so student UI updates instantly
      queryClient.invalidateQueries({ queryKey: studentJobsKeys.jobs() });
      queryClient.invalidateQueries({ queryKey: studentJobsKeys.applications() });
    },
    onError: (error: any) => {
      const message = extractApiError(error, "Failed to submit job application.");
      toast.error(message);
    },
  });
}

export function useUploadResume() {
  return useMutation({
    mutationFn: (file: File) => studentService.uploadResume(file).then((res) => res.data),
    onSuccess: () => {
      toast.success("Resume uploaded successfully!");
    },
    onError: (error: any) => {
      const message = extractApiError(error, "Failed to upload resume file.");
      toast.error(message);
    },
  });
}

