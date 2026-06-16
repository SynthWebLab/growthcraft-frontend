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
    changePassword: "/auth/change-password",
  },
  users: {
    update: (id: string) => `/users/${id}`,
  },
  // Future endpoints can be added here
  courses: {
    list: "/courses",
    detail: (id: string) => `/courses/${id}`,
    detailBySlug: (slug: string) => `/courses/slug/${slug}`,
    enroll: (id: string) => `/courses/${id}/enroll`,
    requestCallback: (id: string) => `/courses/${id}/request-callback`,
    enrollmentStatus: (id: string) => `/courses/${id}/enrollment-status`,
    config: "/courses/config",
  },
  bootcamps: {
    list: "/bootcamps",
    detail: (id: string) => `/bootcamps/${id}`,
  },
  trainingPrograms: {
    list: "/training-programs",
    detail: (id: string) => `/training-programs/${id}`,
    basicBySlug: (slug: string) => `/training-programs/${slug}`,
    detailsBySlug: (slug: string) => `/training-programs/${slug}/details`,
    similarBySlug: (slug: string) => `/training-programs/${slug}/similar`,
    enroll: (id: string) => `/training-programs/${id}/enroll`,
    requestCallback: (id: string) => `/training-programs/${id}/request-callback`,
    domains: "/training-programs/filters/domains",
    enrollmentStatus: (id: string) => `/training-programs/${id}/enrollment-status`,
  },
  events: {
    list: "/events",
    detail: (id: string) => `/events/${id}`,
    detailBySlug: (slug: string) => `/events/slug/${slug}`,
    detailBySlugV2: (slug: string) => `/events/${slug}/details`,
    register: (id: string) => `/events/${id}/register`,
    requestCallback: (id: string) => `/events/${id}/request-callback`,
    registerByType: (type: string, id: string) => `/events/${type}/${id}/register`,
    requestCallbackByType: (type: string, id: string) => `/events/${type}/${id}/request-callback`,
    config: "/events/config",
  },
  workshops: {
    list: "/workshops",
  },
  hackathons: {
    list: "/hackathons",
  },
  students: {
    dashboard: "/students/dashboard",
    profile: "/students/profile",
    courses: "/students/courses",
    bootcamps: "/students/bootcamps",
    workshops: "/students/workshops",
    hackathons: "/students/hackathons",
    events: "/students/events",
    trainingPrograms: "/students/training-programs",
    certificates: "/students/certificates",
    support: "/students/support",
  },
  leads: {
    create: "/leads",
  },
  // Add more as needed
} as const;
