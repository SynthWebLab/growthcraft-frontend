/**
 * React Query hooks for the college dashboard.
 * Wraps the GC-232 /colleges/* endpoints.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { collegeService, type CollegeStudentsQuery } from "@/services/college.service";
import type {
  ImportStudentsPayload,
  UpdateCollegeProfileData,
  CollegeNotificationPreferences,
  PartnershipTier,
} from "@/types/college";
import { extractApiError } from "@/lib/errors/error-handler";

export const collegeKeys = {
  all: ["college"] as const,
  dashboard: () => [...collegeKeys.all, "dashboard"] as const,
  cohort: () => [...collegeKeys.all, "cohort"] as const,
  students: (q?: CollegeStudentsQuery) => [...collegeKeys.all, "students", q ?? {}] as const,
  profile: () => [...collegeKeys.all, "profile"] as const,
  partnership: () => [...collegeKeys.all, "partnership"] as const,
  reports: () => [...collegeKeys.all, "reports"] as const,
  settings: () => [...collegeKeys.all, "settings"] as const,
  supportTickets: () => [...collegeKeys.all, "support"] as const,
  eventAccess: (eventId: string) => [...collegeKeys.all, "event-access", eventId] as const,
};

const STALE = 2 * 60 * 1000; // 2 minutes

export function useCollegeDashboard() {
  return useQuery({
    queryKey: collegeKeys.dashboard(),
    queryFn: () => collegeService.getDashboard(),
    staleTime: 0,
    refetchInterval: 5000, // Real-time 5-second automatic sync
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

export function useCollegeCohort() {
  return useQuery({
    queryKey: collegeKeys.cohort(),
    queryFn: () => collegeService.getCohort(),
    staleTime: 0,
    refetchInterval: 5000, // Real-time 5-second automatic sync
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

export function useCollegeStudents(query: CollegeStudentsQuery = {}) {
  return useQuery({
    queryKey: collegeKeys.students(query),
    queryFn: () => collegeService.getStudents(query),
    staleTime: 0,
    refetchInterval: 5000, // Real-time 5-second automatic sync
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

export function useCollegeProfile() {
  return useQuery({
    queryKey: collegeKeys.profile(),
    queryFn: () => collegeService.getProfile(),
    staleTime: STALE,
    retry: 1,
  });
}

export function useCollegePartnership() {
  return useQuery({
    queryKey: collegeKeys.partnership(),
    queryFn: () => collegeService.getPartnership(),
    staleTime: STALE,
    retry: 1,
  });
}

export function useCollegeReports() {
  return useQuery({
    queryKey: collegeKeys.reports(),
    queryFn: () => collegeService.getReports(),
    staleTime: 0,
    refetchInterval: 5000, // Real-time automatic background sync every 5 seconds
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

export function useCollegeSettings() {
  return useQuery({
    queryKey: collegeKeys.settings(),
    queryFn: () => collegeService.getSettings(),
    staleTime: STALE,
    retry: 1,
  });
}

export function useCollegeSupportTickets() {
  return useQuery({
    queryKey: collegeKeys.supportTickets(),
    queryFn: () => collegeService.getSupportTickets(),
    staleTime: STALE,
    retry: 1,
  });
}

export function useImportStudents() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ImportStudentsPayload) => collegeService.importStudents(payload),
    onSuccess: (response) => {
      if (response.success) {
        const d = response.data;
        toast.success("Students imported", {
          description: d
            ? `${d.created} created, ${d.linkedExisting} linked${
                d.skipped.length ? `, ${d.skipped.length} skipped` : ""
              }.`
            : response.message,
        });
        queryClient.invalidateQueries({ queryKey: collegeKeys.all });
      }
    },
    onError: (error: any) => {
      // Surface subscription/cohort-limit gates with their specific message.
      const code = error?.response?.data?.error?.code ?? error?.data?.error?.code;
      if (code === "SUBSCRIPTION_REQUIRED") {
        toast.error("Subscription required", {
          description: "Choose a partnership plan before importing students.",
        });
      } else if (code === "COHORT_LIMIT_EXCEEDED") {
        toast.error("Cohort limit reached", {
          description: extractApiError(error, "Upgrade your plan to add more students."),
        });
      } else {
        toast.error("Import failed", { description: extractApiError(error, "Please try again.") });
      }
    },
  });
}

export function useUpdateCollegeProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCollegeProfileData) => collegeService.updateProfile(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Profile updated", {
          description: response.message || "Your institution profile has been saved.",
        });
        queryClient.invalidateQueries({ queryKey: collegeKeys.profile() });
      }
    },
    onError: (error: any) => {
      toast.error("Update failed", { description: extractApiError(error, "Please try again.") });
    },
  });
}

export function useSubscribe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tier: PartnershipTier) => collegeService.subscribe(tier),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Subscription activated", { description: response.message });
        queryClient.invalidateQueries({ queryKey: collegeKeys.all });
      }
    },
    onError: (error: any) => {
      toast.error("Couldn't activate plan", { description: extractApiError(error, "Please try again.") });
    },
  });
}

export function useRequestUpgrade() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { requestedTier: PartnershipTier; note?: string }) =>
      collegeService.requestUpgrade(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Upgrade request sent", {
          description: response.message || "Your SPOC will reach out shortly.",
        });
        queryClient.invalidateQueries({ queryKey: collegeKeys.partnership() });
      }
    },
    onError: (error: any) => {
      toast.error("Request failed", { description: extractApiError(error, "Please try again.") });
    },
  });
}

export function useUpdateCollegeAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { institutionName?: string; phone?: string }) =>
      collegeService.updateAccount(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Account updated", {
          description: response.message || "Your account details have been saved.",
        });
        queryClient.invalidateQueries({ queryKey: collegeKeys.settings() });
        queryClient.invalidateQueries({ queryKey: collegeKeys.profile() });
      }
    },
    onError: (error: any) => {
      toast.error("Update failed", { description: extractApiError(error, "Please try again.") });
    },
  });
}

export function useUpdateCollegeNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (prefs: Partial<CollegeNotificationPreferences>) =>
      collegeService.updateNotifications(prefs),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Preferences saved");
        queryClient.invalidateQueries({ queryKey: collegeKeys.settings() });
      }
    },
    onError: (error: any) => {
      toast.error("Update failed", { description: extractApiError(error, "Please try again.") });
    },
  });
}

export function useSubmitCollegeSupport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { subject: string; message: string }) => collegeService.submitSupport(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Message sent", {
          description: response.message || "Our campus team will get back to you shortly.",
        });
        queryClient.invalidateQueries({ queryKey: collegeKeys.supportTickets() });
      }
    },
    onError: (error: any) => {
      toast.error("Couldn't send message", { description: extractApiError(error, "Please try again.") });
    },
  });
}

export function useEventAccessStudents(eventId: string) {
  return useQuery({
    queryKey: collegeKeys.eventAccess(eventId),
    queryFn: () => collegeService.getEventAccessStudents(eventId),
    enabled: !!eventId,
    staleTime: 0,
    refetchInterval: 5000, // Real-time 5-second automatic sync
    refetchOnWindowFocus: true,
  });
}

export function useUpdateEventAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: { studentIds: string[]; action: "grant" | "revoke" };
    }) => collegeService.updateEventAccess(eventId, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: collegeKeys.eventAccess(variables.eventId) });
        queryClient.invalidateQueries({ queryKey: collegeKeys.all });
        queryClient.invalidateQueries({ queryKey: ["bootcamps"] });
        queryClient.invalidateQueries({ queryKey: ["hackathons"] });
        queryClient.invalidateQueries({ queryKey: ["workshops"] });
        queryClient.invalidateQueries({ queryKey: ["events"] });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to update access", { description: extractApiError(error, "Please try again.") });
    },
  });
}

export function useCollegeAttendance(params?: {
  batchId?: string;
  studentId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: [...collegeKeys.all, "attendance", params],
    queryFn: () => collegeService.getAttendance(params),
    staleTime: 0,
    refetchInterval: 5000, // Real-time automatic background sync every 5 seconds
    refetchOnWindowFocus: true,
  });
}

export function useCollegeAttendanceSummary() {
  return useQuery({
    queryKey: [...collegeKeys.all, "attendance", "summary"],
    queryFn: () => collegeService.getAttendanceSummary(),
    staleTime: 0,
    refetchInterval: 5000, // Real-time automatic background sync every 5 seconds
    refetchOnWindowFocus: true,
  });
}

export function useCollegeAmbassadors() {
  return useQuery({
    queryKey: [...collegeKeys.all, "ambassadors"],
    queryFn: () => collegeService.getAmbassadors(),
  });
}

export function useActivateCollegeAmbassadors() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentUserIds: string[]) => collegeService.activateAmbassadors(studentUserIds),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Ambassador activated", { description: response.message || "Student promoted to Campus Ambassador." });
        queryClient.invalidateQueries({ queryKey: collegeKeys.all });
      } else {
        toast.error("Failed to activate", { description: response.message || "Please try again." });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to activate", { description: extractApiError(error, "Please try again.") });
    },
  });
}

export function useDeactivateCollegeAmbassador() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (studentUserId: string) => collegeService.deactivateAmbassador(studentUserId),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Ambassador deactivated", { description: response.message || "Student ambassador status removed." });
        queryClient.invalidateQueries({ queryKey: collegeKeys.all });
      } else {
        toast.error("Failed to deactivate", { description: response.message || "Please try again." });
      }
    },
    onError: (error: any) => {
      toast.error("Failed to deactivate", { description: extractApiError(error, "Please try again.") });
    },
  });
}

export function useBuyCollegeEvent() {
  return useMutation({
    mutationFn: ({ eventId, batchId, amount }: { eventId: string; batchId?: string; amount?: number }) =>
      collegeService.buyEvent(eventId, { batchId, amount }),
    onError: (error: any) => {
      toast.error("Failed to initiate order", { description: extractApiError(error, "Order creation failed.") });
    },
  });
}

export function useVerifyCollegeEventPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature?: string }) =>
      collegeService.verifyEventPayment(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Payment Successful!", { description: "Event access unlocked for college cohort." });
        queryClient.invalidateQueries({ queryKey: collegeKeys.all });
      } else {
        toast.error("Payment Verification Failed", { description: response.message });
      }
    },
    onError: (error: any) => {
      toast.error("Verification Error", { description: extractApiError(error, "Failed to verify Razorpay payment.") });
    },
  });
}
