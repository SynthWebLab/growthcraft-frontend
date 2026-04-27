/**
 * React Query hooks for authentication
 * Provides data fetching, caching, and mutations for auth operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { signIn, signOut as nextAuthSignOut } from "next-auth/react";
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
export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success("Account created!", {
          description: "Please check your email to verify your account.",
        });
        
        // Redirect to email verification page with email
        router.push(AUTH_ROUTES.verifyEmail(variables.email));
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
 */
export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn("credentials", {
        email,
        password,
        redirect: false,
      }),
    onSuccess: async (result, variables) => {
      if (result?.error) {
        // Check if error is due to unverified email
        if (result.error.startsWith("EMAIL_NOT_VERIFIED:")) {
          const email = result.error.split(":")[1];
          toast.error("Email not verified", {
            description: "Please verify your email before logging in.",
            action: {
              label: "Verify Now",
              onClick: () => router.push(AUTH_ROUTES.verifyEmail(email)),
            },
          });
          // Redirect to verify email page after 2 seconds
          setTimeout(() => {
            router.push(AUTH_ROUTES.verifyEmail(email));
          }, 2000);
          return;
        }

        toast.error("Login failed", {
          description: result.error,
        });
        return;
      }

      if (result?.ok) {
        toast.success("Welcome back!", {
          description: "You've been logged in successfully.",
        });
        
        // Get session to determine role-based redirect
        const session = await fetch('/api/auth/session').then(res => res.json());
        
        if (session?.user?.role) {
          // Role-based redirect
          const dashboardRoute = DASHBOARD_ROUTES[session.user.role as keyof typeof DASHBOARD_ROUTES];
          if (dashboardRoute) {
            router.push(dashboardRoute);
          } else {
            // Fallback if role not found
            router.push('/');
          }
        } else {
          // Fallback if no role in session
          router.refresh();
        }
      }
    },
    onError: (error: Error) => {
      toast.error("Login failed", {
        description: error.message || "An unexpected error occurred.",
      });
    },
  });
}

/**
 * Hook to verify email with OTP
 */
export function useVerifyEmail() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      authService.verifyEmail(email, otp),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Email verified!", {
          description: "You can now login to your account.",
        });
        
        // Redirect to login page
        setTimeout(() => {
          router.push(AUTH_ROUTES.login.student + "?verified=true");
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
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      // Sign out from NextAuth
      await nextAuthSignOut({ redirect: false });
      
      // Clear all queries
      queryClient.clear();
      
      toast.success("Logged out successfully");
      router.push(AUTH_ROUTES.home);
      router.refresh();
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
    mutationFn: () => authService.logoutAll(),
    onSuccess: async () => {
      // Sign out from NextAuth
      await nextAuthSignOut({ redirect: false });
      
      // Clear all queries
      queryClient.clear();
      
      toast.success("Logged out from all devices");
      router.push(AUTH_ROUTES.home);
      router.refresh();
    },
    onError: (error: Error) => {
      toast.error("Logout failed", {
        description: error.message,
      });
    },
  });
}
