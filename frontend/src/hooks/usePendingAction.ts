/**
 * Hook to handle pending actions after login/registration
 * Used for enrollment and callback requests that require authentication
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "./useCurrentUser";
import { useEnrollCourse, useRequestCallback } from "./queries/useCourses";
import { toast } from "sonner";

export function usePendingAction() {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();
  const enrollMutation = useEnrollCourse();
  const callbackMutation = useRequestCallback();

  useEffect(() => {
    // Only run on client side and when user is loaded
    if (typeof window === "undefined" || isLoading) return;

    // Check if user is authenticated
    const isAuthenticated = user && user.isEmailVerified;
    if (!isAuthenticated) return;

    // Check for pending action
    const pendingActionStr = sessionStorage.getItem("pendingAction");
    const redirectPath = sessionStorage.getItem("redirectAfterLogin");

    if (pendingActionStr) {
      try {
        const pendingAction = JSON.parse(pendingActionStr);

        // Clear the pending action immediately to prevent re-execution
        sessionStorage.removeItem("pendingAction");
        sessionStorage.removeItem("redirectAfterLogin");

        // Execute the pending action
        if (pendingAction.type === "enroll") {
          enrollMutation.mutate(
            {
              courseId: pendingAction.courseId,
              data: pendingAction.data,
            },
            {
              onSuccess: () => {
                // Redirect back to the course page after successful enrollment
                if (redirectPath) {
                  router.push(redirectPath);
                }
              },
            }
          );
        } else if (pendingAction.type === "callback") {
          callbackMutation.mutate(
            {
              courseId: pendingAction.courseId,
              data: pendingAction.data,
            },
            {
              onSuccess: () => {
                // Redirect back to the course page after successful callback request
                if (redirectPath) {
                  router.push(redirectPath);
                }
              },
            }
          );
        }
      } catch (error) {
        sessionStorage.removeItem("pendingAction");
        sessionStorage.removeItem("redirectAfterLogin");
      }
    }
  }, [user, isLoading, enrollMutation, callbackMutation, router]);
}
