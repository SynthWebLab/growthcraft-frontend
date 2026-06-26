/**
 * React Query hooks for the mentor dashboard.
 * Wraps the backend /mentor/* endpoints.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { mentorService } from "@/services/mentor.service";

function extractApiError(error: any, fallback: string): string {
  const errorData = error?.response?.data?.error;
  const fieldErrors: Array<{ message: string }> =
    errorData?.details?.error?.errors || errorData?.details?.errors || [];
  if (fieldErrors.length) return fieldErrors.map((e) => e.message).join(", ");
  return errorData?.message || error?.message || fallback;
}

export const mentorKeys = {
  all: ["mentor"] as const,
  dashboard: () => [...mentorKeys.all, "dashboard"] as const,
  sessions: (status?: string) => [...mentorKeys.all, "sessions", status ?? "all"] as const,
  availability: () => [...mentorKeys.all, "availability"] as const,
  students: () => [...mentorKeys.all, "students"] as const,
  earnings: () => [...mentorKeys.all, "earnings"] as const,
  profile: () => [...mentorKeys.all, "profile"] as const,
};

const STALE = 2 * 60 * 1000; // 2 minutes

/** Fetch aggregated mentor dashboard summary. */
export function useMentorDashboard(period: string = "monthly") {
  return useQuery({
    queryKey: [...mentorKeys.dashboard(), period],
    queryFn: () => mentorService.getDashboard(period),
    staleTime: STALE,
    retry: 1,
  });
}

/** Fetch sessions list filtered by status. */
export function useMentorSessions(status?: "upcoming" | "past" | "cancelled") {
  return useQuery({
    queryKey: mentorKeys.sessions(status),
    queryFn: () => mentorService.getSessions(status),
    staleTime: STALE,
    retry: 1,
  });
}

/** Mutation to update status of a session (scheduled -> completed/cancelled). */
export function useUpdateMentorSessionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { sessionId: string; status: "scheduled" | "completed" | "cancelled" }) =>
      mentorService.updateSessionStatus(data.sessionId, data.status),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Session status updated", {
          description: response.message || "The session status has been updated.",
        });
        queryClient.invalidateQueries({ queryKey: mentorKeys.sessions() });
        queryClient.invalidateQueries({ queryKey: mentorKeys.dashboard() });
      } else {
        toast.error("Update failed", {
          description: response.message || "Please try again.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Update failed", {
        description: extractApiError(error, "An unexpected error occurred."),
      });
    },
  });
}

/** Fetch mentor availability schedule and hourly rate. */
export function useMentorAvailability() {
  return useQuery({
    queryKey: mentorKeys.availability(),
    queryFn: () => mentorService.getAvailability(),
    staleTime: STALE,
    retry: 1,
  });
}

/** Mutation to save mentor availability. */
export function useUpdateMentorAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { availability: any[]; hourlyRate: number }) =>
      mentorService.updateAvailability(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Availability updated", {
          description: response.message || "Your schedule has been updated.",
        });
        queryClient.invalidateQueries({ queryKey: mentorKeys.availability() });
      } else {
        toast.error("Update failed", {
          description: response.message || "Please try again.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Update failed", {
        description: extractApiError(error, "An unexpected error occurred."),
      });
    },
  });
}

/** Fetch students mentored. */
export function useMentorStudents() {
  return useQuery({
    queryKey: mentorKeys.students(),
    queryFn: () => mentorService.getStudents(),
    staleTime: STALE,
    retry: 1,
  });
}

/** Fetch earnings overview. */
export function useMentorEarnings() {
  return useQuery({
    queryKey: mentorKeys.earnings(),
    queryFn: () => mentorService.getEarnings(),
    staleTime: STALE,
    retry: 1,
  });
}

/** Mutation to request payout withdrawal. */
export function useWithdrawMentorEarnings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => mentorService.withdrawEarnings(),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Withdrawal submitted", {
          description: response.message || "Your withdrawal request is being processed.",
        });
        queryClient.invalidateQueries({ queryKey: mentorKeys.earnings() });
      } else {
        toast.error("Withdrawal failed", {
          description: response.message || "Please try again.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Withdrawal failed", {
        description: extractApiError(error, "An unexpected error occurred."),
      });
    },
  });
}

/** Fetch profile details. */
export function useMentorProfile() {
  return useQuery({
    queryKey: mentorKeys.profile(),
    queryFn: () => mentorService.getProfile(),
    staleTime: STALE,
    retry: 1,
  });
}

/** Mutation to update profile details. */
export function useUpdateMentorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => mentorService.updateProfile(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Profile updated", {
          description: response.message || "Your profile has been saved.",
        });
        queryClient.invalidateQueries({ queryKey: mentorKeys.profile() });
        queryClient.invalidateQueries({ queryKey: mentorKeys.dashboard() });
      } else {
        toast.error("Update failed", {
          description: response.message || "Please try again.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Update failed", {
        description: extractApiError(error, "An unexpected error occurred."),
      });
    },
  });
}

/** Fetch mentor support tickets. */
export function useMentorSupportTickets() {
  return useQuery({
    queryKey: ["mentor", "support"],
    queryFn: () => mentorService.getSupportTickets(),
    staleTime: STALE,
  });
}

/** Mutation to submit mentor support query ticket. */
export function useSubmitMentorSupport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { subject: string; message: string }) => mentorService.submitSupportTicket(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Query submitted", {
          description: response.message || "Our mentor support team will get back to you shortly.",
        });
        queryClient.invalidateQueries({ queryKey: ["mentor", "support"] });
      } else {
        toast.error("Submission failed", {
          description: response.message || "Please try again.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Submission failed", {
        description: extractApiError(error, "An unexpected error occurred."),
      });
    },
  });
}

/** Mutation to update mentor settings account (fullName, phone). */
export function useUpdateMentorAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { fullName?: string; phone?: string }) => mentorService.updateAccountSettings(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Settings updated", {
          description: response.message || "Your account settings have been saved.",
        });
        queryClient.invalidateQueries({ queryKey: mentorKeys.profile() });
        queryClient.invalidateQueries({ queryKey: mentorKeys.dashboard() });
      } else {
        toast.error("Update failed", {
          description: response.message || "Please try again.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Update failed", {
        description: extractApiError(error, "An unexpected error occurred."),
      });
    },
  });
}

/** Mutation to change mentor password. */
export function useChangeMentorPassword() {
  return useMutation({
    mutationFn: (data: { currentPassword?: string; newPassword?: string; confirmPassword?: string }) => mentorService.changePassword(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Password updated", {
          description: response.message || "Your password has been changed.",
        });
      } else {
        toast.error("Couldn't change password", {
          description: response.message || "Please try again.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Couldn't change password", {
        description: extractApiError(error, "An unexpected error occurred."),
      });
    },
  });
}
