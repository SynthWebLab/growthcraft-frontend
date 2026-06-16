/**
 * React Query hooks for authentication
 * Provides data fetching, caching, and mutations for auth operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { AUTH_ROUTES, DASHBOARD_ROUTES } from "@/lib/constants/routes.constant";
import type { RegisterData } from "@/types/api";

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
        
        // Redirect to email verification page with email and callbackUrl
        const verifyUrl = AUTH_ROUTES.verifyEmail(variables.email);
        const finalUrl = callbackUrl 
          ? `${verifyUrl}&callbackUrl=${encodeURIComponent(callbackUrl)}`
          : verifyUrl;
        router.push(finalUrl);
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
export function useLogin(expectedRole?: string, callbackUrl?: string) {
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      // Call backend directly - this will set httpOnly cookies in browser
      const response = await authService.login(email, password);
      return { response, email }; // Return email for use in onSuccess
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
          
          // Redirect to verify-email page with email immediately
          router.push(AUTH_ROUTES.verifyEmail(email));
          return;
        }

        toast.error("Login failed", {
          description: response.error?.message || "Please try again.",
        });
        return;
      }

      // Login successful - backend has set httpOnly cookies (access_token, refreshToken)
      const user = response.data?.user;
      
      if (user) {
        // Validate that user role matches the login form's expected role
        if (expectedRole && user.role?.toLowerCase() !== expectedRole.toLowerCase()) {
          toast.error("Access Denied", {
            description: `This login page is only for ${expectedRole} accounts.`,
          });
          // Immediately log out to clear cookies and session state
          await authService.logout();
          return;
        }

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
      // Check if error is due to unverified email
      if (error.message?.toLowerCase().includes("not verified") ||
          error.message?.toLowerCase().includes("verify your email")) {
        
        toast.error("Email not verified", {
          description: "Redirecting you to verify your email...",
        });
        
        // Redirect to verify-email page with email
        router.push(AUTH_ROUTES.verifyEmail(variables.email));
        return;
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
        toast.success("Email verified!", {
          description: callbackUrl 
            ? "Redirecting you to the course..."
            : "Taking you to your dashboard...",
        });
        
        // Redirect to callback URL or dashboard
        // Backend has already logged the user in during verification
        setTimeout(() => {
          if (callbackUrl && callbackUrl !== '/') {
            router.push(callbackUrl);
            router.refresh(); // Refresh to update auth state
          } else {
            // No callback URL - redirect to student dashboard
            router.push(DASHBOARD_ROUTES.student);
            router.refresh(); // Refresh to update auth state
          }
        }, 1500);
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
    onSuccess: (response) => {
      if (response.success) {
        toast.success("OTP sent!", {
          description: "Please check your email.",
        });
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
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      authService.resetPassword(token, newPassword),
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
