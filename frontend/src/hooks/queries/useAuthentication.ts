/**
 * React Query hooks for authentication
 * Provides data fetching, caching, and mutations for auth operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { AUTH_ROUTES, DASHBOARD_ROUTES } from "@/lib/constants/routes.constant";
import { broadcastAuthChange } from "@/lib/auth/authSync";
import type { RegisterData } from "@/types/api";
import { useVerificationStore } from "@/stores/useVerificationStore";

// Query keys for cache management
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  session: () => [...authKeys.all, "session"] as const,
};

/**
 * Hook to register a new user
 */
export function useRegister(callbackUrl?: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success("Account created!", {
          description: "Please check your email to verify your account.",
        });
        
        // Save to in-memory store instead of URL params for security and atomicity
        const setPending = useVerificationStore.getState().setPendingVerification;
        setPending(variables.email, callbackUrl);

        // Redirect to email verification page WITHOUT email in URL
        const verifyUrl = '/verify-email';
        router.push(verifyUrl);
      } else {
        toast.error("Registration failed", {
          description: response.error?.message || "Please try again.",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Registration failed", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
}

/**
 * Hook to login user
 * Uses direct backend authentication with httpOnly cookies
 */
export function useLogin(expectedRole?: string, callbackUrl?: string, setFormError?: (message: string) => void) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password, role }: { email: string; password: string; role?: string }) => {
      // ── Guard: block login if already authenticated ──────────────────────────
      // This is the last line of defence in case the AuthPageLayout conflict modal
      // is somehow bypassed (e.g. via DevTools or a race condition).
      const cachedUser: any =
        queryClient.getQueryData(authKeys.profile()) ??
        (typeof window !== "undefined"
          ? (() => {
              try {
                const s = localStorage.getItem("gc_user");
                return s ? JSON.parse(s) : null;
              } catch {
                return null;
              }
            })()
          : null);

      if (cachedUser) {
        // If the cached user's role doesn't match the expected portal role, hard-block.
        if (expectedRole && cachedUser.role?.toLowerCase() !== expectedRole.toLowerCase()) {
          throw new Error(
            `ALREADY_LOGGED_IN:${cachedUser.role}:${cachedUser.fullName ?? ""}`
          );
        }
      }
      // ─────────────────────────────────────────────────────────────────────────

      // Call backend directly with explicit role if available - this will set httpOnly cookies in browser
      const targetRole = role || expectedRole;
      const response = await authService.login(email, password, targetRole);
      return { response, email, role: targetRole }; // Return email and role for use in onSuccess
    },
    onSuccess: async ({ response, email }) => {
      if (!response.success) {
        // Check if error is due to unverified email
        if (response.error?.code === "EMAIL_NOT_VERIFIED" || 
            response.error?.message?.toLowerCase().includes("not verified") ||
            response.error?.message?.toLowerCase().includes("verify your email")) {
          
          toast.error("Email not verified", {
            description: "Redirecting you to verify your email...",
          });
          
          
          // Set in-memory pending state
          const setPending = useVerificationStore.getState().setPendingVerification;
          setPending(email);

          // Redirect to verify-email page WITHOUT email in URL
          router.push('/verify-email');
          return;
        }

        toast.error("Login failed", {
          description: response.error?.message || "Please try again.",
        });
        return;
      }

      // Handle multiple role accounts requiring role selection
      if (response.data?.requiresRoleSelection) {
        const availableRoles = (response.data.availableRoles || []) as string[];
        const roleLinks = availableRoles
          .map((r: string) => {
            const formatted = r.charAt(0).toUpperCase() + r.slice(1);
            return `${formatted} portal: /login/${r.toLowerCase()}`;
          })
          .join(" or ");
        const errorMessage = `Multiple accounts found for this email. Please sign in via the ${roleLinks}`;
        if (setFormError) {
          setFormError(errorMessage);
        } else {
          toast.info("Role Selection Required", {
            description: errorMessage,
          });
        }
        return;
      }

      // Login successful - backend has set httpOnly cookies (access_token, refreshToken)
      const user = response.data?.user;
      
      if (user) {
        if (typeof window !== "undefined") {
          localStorage.setItem("gc_user", JSON.stringify(user));
        }
        queryClient.setQueryData(authKeys.profile(), user);
        // Validate that user role matches the login form's expected role
        if (expectedRole && user.role?.toLowerCase() !== expectedRole.toLowerCase()) {
          // Immediately log out to clear cookies and session state
          await authService.logout();
          // Clear stale user data from cache and localStorage
          queryClient.setQueryData(authKeys.profile(), null);
          if (typeof window !== "undefined") {
            localStorage.removeItem("gc_user");
          }

          const actualRole = user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : "another role";
          const correctPortalPath = `/login/${user.role?.toLowerCase()}`;
          const errorMessage = `This email is registered as a ${actualRole} account. Please sign in at the ${actualRole} portal: ${correctPortalPath}`;

          if (setFormError) {
            // Show inline form error for better UX — no popup, error appears in the form
            setFormError(errorMessage);
          } else {
            toast.error("Wrong Portal", {
              description: `This email is registered as a ${actualRole} account. Please use the ${actualRole} login portal.`,
            });
          }
          return;
        }

        // Broadcast login to all other open tabs
        broadcastAuthChange("LOGIN", user);

        toast.success("Welcome back!", {
          description: "You've been logged in successfully.",
        });
        
        // Check for callback URL first
        if (callbackUrl && callbackUrl !== '/') {
          router.push(callbackUrl);
          router.refresh(); // Refresh to update middleware auth state
        } else {
          // Role-based redirect to dashboard
          const dashboardRoute = DASHBOARD_ROUTES[user.role as keyof typeof DASHBOARD_ROUTES];
          if (dashboardRoute) {
            router.push(dashboardRoute);
            router.refresh(); // Refresh to update middleware auth state
          } else {
            router.push('/');
          }
        }
      }
    },
    onError: (error: Error, variables) => {
      // Handle the already-logged-in guard
      if (error.message?.startsWith("ALREADY_LOGGED_IN:")) {
        const [, role, name] = error.message.split(":");
        const roleDisplay = role ? role.charAt(0).toUpperCase() + role.slice(1) : "another account";
        toast.error("Already signed in", {
          description: `You are signed in as ${name?.trim() || "a user"} (${roleDisplay}). Please logout first to switch accounts.`,
        });
        return;
      }

      // Check if error is due to unverified email
      if (error.message?.toLowerCase().includes("not verified") ||
          error.message?.toLowerCase().includes("verify your email")) {
        
        toast.error("Email not verified", {
          description: "Redirecting you to verify your email...",
        });
        
        // Set in-memory pending state
        const setPending = useVerificationStore.getState().setPendingVerification;
        setPending(variables.email);

        // Redirect to verify-email page WITHOUT email in URL
        router.push('/verify-email');
        return;
      }
      
      // Check if error is a wrong portal error (format: "...portal: /login/<role>")
      if (error.message?.includes("portal: /login/")) {
        if (setFormError) {
          setFormError(error.message);
          return;
        }
      }

      toast.error("Login failed", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
}

/**
 * Hook to verify email with OTP
 */
export function useVerifyEmail(callbackUrl?: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authService.verifyEmail(email, otp),
    onSuccess: (response) => {
      if (response.success) {
        const user = response.data?.user;
        const role = (user?.role?.toLowerCase() || "student") as keyof typeof AUTH_ROUTES.login;
        const targetLoginRoute = AUTH_ROUTES.login[role] || AUTH_ROUTES.login.student;
        const finalRedirect = callbackUrl && callbackUrl !== '/'
          ? `${targetLoginRoute}?callbackUrl=${encodeURIComponent(callbackUrl)}`
          : targetLoginRoute;

        toast.success("Email verified successfully!", {
          description: "Please sign in with your credentials to continue.",
        });

        // Clear the pending verification state since we succeeded
        useVerificationStore.getState().clearPendingVerification();

        setTimeout(() => {
          router.push(finalRedirect);
        }, 1200);
      } else {
        toast.error("Verification failed", {
          description: response.error?.message || "Invalid or expired OTP.",
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Verification failed", {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to resend verification OTP
 */
export function useResendOTP() {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerificationOTP(email),
    onSuccess: (response, email) => {
      if (response.success) {
        toast.success("OTP sent!", {
          description: "Please check your email.",
        });
        // Reset the countdown in the store since a new OTP was sent
        useVerificationStore.getState().setPendingVerification(email);
      } else {
        toast.error("Failed to send OTP", {
          description: response.error?.message,
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to send OTP", {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to request password reset
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Reset link sent!", {
          description: "Please check your email.",
        });
      } else {
        toast.error("Failed to send reset link", {
          description: response.error?.message,
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Failed to send reset link", {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to reset password
 */
export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, otp, newPassword }: { email: string; otp: string; newPassword: string }) =>
      authService.resetPassword(email, otp, newPassword),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Password reset successful!", {
          description: "You can now login with your new password.",
        });
        router.push(AUTH_ROUTES.login.student);
      } else {
        toast.error("Password reset failed", {
          description: response.error?.message,
        });
      }
    },
    onError: (error: Error) => {
      toast.error("Password reset failed", {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to get user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => authService.getProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to logout user
 */
export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call backend logout to clear httpOnly cookies
      await authService.logout();
      return { success: true };
    },
    onSuccess: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("gc_user");
      }
      // Broadcast logout to all other open tabs
      broadcastAuthChange("LOGOUT");
      // Clear all React Query cache
      queryClient.clear();
      
      // Clear any non-httpOnly cookies (just in case)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      toast.success("Logged out successfully");
      
      // Small delay to ensure cookies are cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use replace instead of href to prevent back button from going to dashboard
      // This replaces the current history entry instead of adding a new one
      window.location.replace('/');
    },
    onError: (error: Error) => {
      toast.error("Logout failed", {
        description: error.message,
      });
    },
  });
}

/**
 * Hook to logout from all devices
 */
export function useLogoutAll() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call backend logout-all to invalidate all refresh tokens
      await authService.logoutAll();
      return { success: true };
    },
    onSuccess: async () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("gc_user");
      }
      // Broadcast logout to all other open tabs
      broadcastAuthChange("LOGOUT");
      // Clear all React Query cache
      queryClient.clear();
      
      // Clear any non-httpOnly cookies (just in case)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      toast.success("Logged out from all devices");
      
      // Small delay to ensure cookies are cleared
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use replace instead of href to prevent back button from going to dashboard
      window.location.replace('/');
    },
    onError: (error: Error) => {
      toast.error("Logout failed", {
        description: error.message,
      });
    },
  });
}
