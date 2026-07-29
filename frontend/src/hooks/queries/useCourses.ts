/**
 * React Query hooks for courses
 * Provides data fetching, caching, and mutations for course operations
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { courseService } from "@/services/course.service";
import type { CourseFilters } from "@/types/course";

// Query keys for cache management
export const courseKeys = {
  all: ["courses"] as const,
  lists: () => [...courseKeys.all, "list"] as const,
  list: (filters?: CourseFilters) => [...courseKeys.lists(), filters] as const,
  details: () => [...courseKeys.all, "detail"] as const,
  detail: (id: string) => [...courseKeys.details(), id] as const,
  config: () => [...courseKeys.all, "config"] as const,
};

/**
 * Hook to fetch all courses with optional filters
 */
export function useCourses(filters?: CourseFilters) {
  return useQuery({
    queryKey: courseKeys.list(filters),
    queryFn: () => courseService.getCourses(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
}

/**
 * Hook to fetch a single course by ID
 */
export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => courseService.getCourseById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to enroll in a course
 */
export function useEnrollCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: import("@/types/course").EnrollmentData }) => 
      courseService.enrollInCourse(courseId, data),
    onSuccess: (response) => {
      if (response.success) {
        // Only show success toast if enrollment is not pending payment
        if (response.data?.enrollment?.status !== "pending") {
          toast.success("Enrollment successful!", {
            description: response.message || "You have been enrolled in the course.",
          });
        }
        
        // Invalidate courses cache to refetch updated data
        queryClient.invalidateQueries({ queryKey: courseKeys.all });
      } else {
        toast.error("Enrollment failed", {
          description: response.message || "Please try again.",
        });
      }
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error?.message || error.message || "An unexpected error occurred.";
      const errorCode = error?.response?.data?.error?.code;
      
      if (errorCode === "CONFLICT_ERROR" || errorCode === "ALREADY_ENROLLED") {
        toast.info("Already enrolled", {
          description: "You're already enrolled in this course. Check your dashboard.",
          duration: 5000,
        });
      } else if (errorCode === "UNAUTHORIZED") {
        toast.error("Authentication required", {
          description: "Please login to enroll in this course.",
        });
      } else {
        toast.error("Enrollment failed", {
          description: errorMessage,
        });
      }
    },
  });
}

/**
 * Hook to request callback for a course
 * Can be used for different contexts: callback, register-interest, notify-next-batch
 */
export function useRequestCallback(context: "callback" | "register-interest" | "notify-next-batch" = "callback") {
  const queryClient = useQueryClient();

  // Customize messages based on context
  const messages = {
    callback: {
      success: "Callback requested!",
      successDescription: "We will contact you soon.",
      conflict: "You already have a pending callback request for this course.",
      error: "Request failed",
    },
    "register-interest": {
      success: "Interest registered!",
      successDescription: "Thank you! We'll notify you when this course launches.",
      conflict: "You've already registered interest for this course.",
      error: "Registration failed",
    },
    "notify-next-batch": {
      success: "Notification set!",
      successDescription: "We'll notify you when the next batch is announced.",
      conflict: "You're already subscribed to notifications for this course.",
      error: "Request failed",
    },
  };

  const msg = messages[context];

  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: string; data: import("@/types/course").CallbackRequestData }) => 
      courseService.requestCallback(courseId, data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(msg.success, {
          description: response.message || msg.successDescription,
        });
        
        // Invalidate courses cache
        queryClient.invalidateQueries({ queryKey: courseKeys.all });
      }
    },
    onError: (error: any) => {
      // Extract error details from the response
      const errorData = error?.response?.data?.error;
      const errorMessage = errorData?.message || error?.message || "An unexpected error occurred.";
      const errorCode = errorData?.code;
      
      // For CONFLICT errors (duplicate callback request), show the backend message as info
      if (errorCode === "CONFLICT_ERROR" || errorCode === "DUPLICATE_REQUEST") {
        toast.info(msg.conflict, {
          duration: 5000,
        });
      } else if (errorCode === "UNAUTHORIZED") {
        toast.error("Authentication required", {
          description: "Please login to continue.",
        });
      } else {
        // For other errors, show the error message
        toast.error(msg.error, {
          description: errorMessage,
        });
      }
    },
  });
}

/**
 * Hook to fetch course configuration (categories, difficulty levels, types)
 */
export function useCourseConfig() {
  return useQuery({
    queryKey: courseKeys.config(),
    queryFn: () => courseService.getCourseConfig(),
    staleTime: 60 * 60 * 1000, // 1 hour - config rarely changes
    retry: 2,
  });
}

/**
 * Hook to fetch a single course by slug
 */
export function useCourseBySlug(slug: string) {
  return useQuery({
    queryKey: courseKeys.detail(slug),
    queryFn: () => courseService.getCourseBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to check enrollment status for a course
 */
export function useEnrollmentStatus(courseId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: [...courseKeys.detail(courseId), "enrollment-status"],
    queryFn: () => courseService.getEnrollmentStatus(courseId),
    enabled: !!courseId && enabled,
    staleTime: 1 * 60 * 1000, // 1 minute - check frequently for status changes
    retry: (failureCount, error: any) => {
      // Don't retry if endpoint doesn't exist (404)
      if (error?.response?.status === 404) {
        return false;
      }
      return failureCount < 1;
    },
    // Return default values if endpoint doesn't exist
    placeholderData: {
      success: true,
      message: "",
      data: {
        isEnrolled: false,
        hasCallbackRequest: false,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    },
  });
}
