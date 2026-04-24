/**
 * API Endpoints
 * Centralized definition of all API routes
 */

export const API_ENDPOINTS = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    verifyEmail: "/auth/verify-email",
    resendVerification: "/auth/resend-verification",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    profile: "/auth/profile",
    logout: "/auth/logout",
    logoutAll: "/auth/logout-all",
    refresh: "/auth/refresh",
  },
  // Future endpoints can be added here
  courses: {
    list: "/courses",
    detail: (id: string) => `/courses/${id}`,
    enroll: (id: string) => `/courses/${id}/enroll`,
  },
  bootcamps: {
    list: "/bootcamps",
    detail: (id: string) => `/bootcamps/${id}`,
  },
  // Add more as needed
} as const;
