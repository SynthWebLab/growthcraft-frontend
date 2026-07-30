/**
 * React Query hooks for the student dashboard.
 * Wraps the GC-230 /students/* endpoints.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentService } from "@/services/student.service";
import { authService } from "@/services/auth.service";
import { authKeys } from "./useAuthentication";
import type { UpdateStudentProfileData, BookMentorSessionData } from "@/types/student";

function extractApiError(error: any, fallback: string): string {
  const errorData = error?.response?.data?.error;
  const fieldErrors: Array<{ message: string }> =
    errorData?.details?.error?.errors || errorData?.details?.errors || [];
  if (fieldErrors.length) return fieldErrors.map((e) => e.message).join(", ");
  return errorData?.message || error?.message || fallback;
}

export const studentKeys = {
  all: ["student"] as const,
  dashboard: () => [...studentKeys.all, "dashboard"] as const,
  profile: () => [...studentKeys.all, "profile"] as const,
  courses: () => [...studentKeys.all, "courses"] as const,
  bootcamps: () => [...studentKeys.all, "bootcamps"] as const,
  workshops: () => [...studentKeys.all, "workshops"] as const,
  hackathons: () => [...studentKeys.all, "hackathons"] as const,
  trainingPrograms: () => [...studentKeys.all, "training-programs"] as const,
  certificates: () => [...studentKeys.all, "certificates"] as const,
  supportTickets: () => [...studentKeys.all, "support"] as const,
  mentors: (expertise?: string) => [...studentKeys.all, "mentors", expertise ?? null] as const,
  mentorSessions: () => [...studentKeys.all, "mentor-sessions"] as const,
};

const STALE = 2 * 60 * 1000; // 2 minutes

export function useStudentDashboard() {
  return useQuery({
    queryKey: studentKeys.dashboard(),
    queryFn: () => studentService.getDashboard(),
    staleTime: STALE,
    retry: 1,
  });
}

export function useStudentProfile() {
  return useQuery({
    queryKey: studentKeys.profile(),
    queryFn: () => studentService.getProfile(),
    staleTime: STALE,
    retry: 1,
  });
}

export function useStudentCourses() {
  return useQuery({
    queryKey: studentKeys.courses(),
    queryFn: () => studentService.getCourses(),
    staleTime: STALE,
    retry: 1,
  });
}

export function useStudentBootcamps() {
  return useQuery({
    queryKey: studentKeys.bootcamps(),
    queryFn: () => studentService.getBootcamps(),
    staleTime: STALE,
    retry: 1,
  });
}

export function useStudentWorkshops() {
  return useQuery({
    queryKey: studentKeys.workshops(),
    queryFn: () => studentService.getWorkshops(),
    staleTime: STALE,
    retry: 1,
  });
}

export function useStudentHackathons() {
  return useQuery({
    queryKey: studentKeys.hackathons(),
    queryFn: () => studentService.getHackathons(),
    staleTime: STALE,
    retry: 1,
  });
}

export function useStudentTrainingPrograms() {
  return useQuery({
    queryKey: studentKeys.trainingPrograms(),
    queryFn: () => studentService.getTrainingPrograms(),
    staleTime: STALE,
    retry: 1,
  });
}

export function useStudentCertificates() {
  return useQuery({
    queryKey: studentKeys.certificates(),
    queryFn: () => studentService.getCertificates(),
    staleTime: STALE,
    retry: 1,
  });
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateStudentProfileData) => studentService.updateProfile(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Profile updated", {
          description: response.message || "Your profile has been saved.",
        });
        queryClient.invalidateQueries({ queryKey: studentKeys.profile() });
        queryClient.invalidateQueries({ queryKey: studentKeys.dashboard() });
      } else {
        toast.error("Update failed", {
          description: response.message || "Please try again.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Update failed", { description: extractApiError(error, "An unexpected error occurred.") });
    },
  });
}

/** Submit a support ticket. */
export function useSubmitSupport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { subject: string; message: string }) => studentService.submitSupport(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Message sent", {
          description: response.message || "Our team will get back to you soon.",
        });
        queryClient.invalidateQueries({ queryKey: studentKeys.supportTickets() });
      }
    },
    onError: (error: any) => {
      toast.error("Couldn't send message", { description: extractApiError(error, "Please try again.") });
    },
  });
}

/** List the student's support tickets. */
export function useStudentSupportTickets() {
  return useQuery({
    queryKey: studentKeys.supportTickets(),
    queryFn: () => studentService.getSupportTickets(),
    staleTime: STALE,
    retry: 1,
  });
}

/** List available mentors (optionally filtered by area of expertise). */
export function useStudentMentors(expertise?: string) {
  return useQuery({
    queryKey: studentKeys.mentors(expertise),
    queryFn: () => studentService.getMentors(expertise),
    staleTime: STALE,
    retry: 1,
  });
}

/** List the student's mentor sessions. */
export function useStudentMentorSessions() {
  return useQuery({
    queryKey: studentKeys.mentorSessions(),
    queryFn: () => studentService.getMentorSessions(),
    staleTime: STALE,
    retry: 1,
  });
}

/** Book a mentor session. */
export function useBookMentorSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BookMentorSessionData) => studentService.bookMentorSession(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Session booked", {
          description: response.message || "Your mentor session has been scheduled.",
        });
        queryClient.invalidateQueries({ queryKey: studentKeys.mentorSessions() });
      }
    },
    onError: (error: any) => {
      toast.error("Booking failed", { description: extractApiError(error, "Please try again.") });
    },
  });
}

/** Change the authenticated user's password. */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string; confirmPassword?: string }) =>
      authService.changePassword(data.currentPassword, data.newPassword, data.confirmPassword),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Password updated", {
          description: response.message || "Your password has been changed.",
        });
      }
    },
    onError: (error: any) => {
      toast.error("Couldn't change password", { description: extractApiError(error, "Please try again.") });
    },
  });
}

/** Update the authenticated user's account (name, phone). */
export function useUpdateAccount(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { fullName?: string; phone?: string }) => {
      if (!userId) {
        return Promise.reject(new Error("Not authenticated"));
      }
      return authService.updateAccount(userId, data);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Account updated", {
          description: response.message || "Your account details have been saved.",
        });
        queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      }
    },
    onError: (error: any) => {
      toast.error("Update failed", { description: extractApiError(error, "Please try again.") });
    },
  });
}

/** Fetch the student's enrolled cohort batches. */
export function useStudentBatches() {
  return useQuery({
    queryKey: ["student", "batches"],
    queryFn: () => studentService.getBatches(),
    staleTime: STALE,
    retry: 1,
  });
}

/** Fetch the student's progress and workspace details for a course. */
export function useStudentCourseWorkspace(slug: string) {
  return useQuery({
    queryKey: ["student", "courses", "workspace", slug],
    queryFn: () => studentService.getCourseWorkspace(slug),
    enabled: !!slug,
    staleTime: STALE,
    retry: 1,
  });
}

/** Fetch the student's hackathon workspace details (assigned mentors, attendance, submission). */
export function useStudentHackathonWorkspace(slug: string) {
  return useQuery({
    queryKey: ["student", "hackathons", "workspace", slug],
    queryFn: () => studentService.getHackathonWorkspace(slug),
    enabled: !!slug,
    staleTime: STALE,
    retry: 1,
  });
}

/** Submit or update hackathon project details. */
export function useSubmitHackathonProject(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { projectTitle: string; repoUrl: string; demoUrl?: string; techStack?: string; notes?: string }) =>
      studentService.submitHackathonProject(slug, data),
    onSuccess: (response) => {
      if (response.success || response.projectTitle || response.data) {
        toast.success("Project submission saved", {
          description: "Your submission has been updated for mentor evaluation.",
        });
        queryClient.invalidateQueries({ queryKey: ["student", "hackathons", "workspace", slug] });
      }
    },
    onError: (error: any) => {
      toast.error("Submission failed", { description: extractApiError(error, "Please check fields and try again.") });
    },
  });
}

/** Fetch the student's workshop workspace details (assigned mentors, attendance, assignment). */
export function useStudentWorkshopWorkspace(slug: string) {
  return useQuery({
    queryKey: ["student", "workshops", "workspace", slug],
    queryFn: () => studentService.getWorkshopWorkspace(slug),
    enabled: !!slug,
    staleTime: STALE,
    retry: 1,
  });
}

/** Submit or update workshop assignment details. */
export function useSubmitWorkshopAssignment(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { projectTitle: string; repoUrl: string; demoUrl?: string; techStack?: string; notes?: string }) =>
      studentService.submitWorkshopAssignment(slug, data),
    onSuccess: (response) => {
      if (response.success || response.projectTitle || response.data) {
        toast.success("Assignment submission saved", {
          description: "Your workshop exercise submission has been saved.",
        });
        queryClient.invalidateQueries({ queryKey: ["student", "workshops", "workspace", slug] });
      }
    },
    onError: (error: any) => {
      toast.error("Submission failed", { description: extractApiError(error, "Please check fields and try again.") });
    },
  });
}

