/**
 * Route Constants
 * Used for navigation menus and route generation
 */

import { ROLES, type UserRole, type PortalRole } from "./roles.constant";

// Navigation routes
export const NAV_ROUTES = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "Training Programs", path: "/training-programs" },
  { name: "Events", path: "/events" },
  { name: "Students", path: "/for-students" },
  { name: "Colleges", path: "/for-colleges" },
  { name: "Mentors", path: "/for-mentors" },
  { name: "Employers", path: "/for-employers" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
] as const;

// Login routes by role
export const LOGIN_ROUTES: readonly { label: string; path: string; role: PortalRole }[] = [
  { label: "Student Login", path: "/login/student", role: ROLES.STUDENT },
  { label: "College Login", path: "/login/college", role: ROLES.COLLEGE },
  { label: "Mentor Login", path: "/login/mentor", role: ROLES.MENTOR },
  { label: "Employer Login", path: "/login/employer", role: ROLES.EMPLOYER },
] as const;

// Registration routes by role
export const REGISTER_ROUTES: readonly { label: string; path: string; role: PortalRole }[] = [
  { label: "Student Signup", path: "/register/student", role: ROLES.STUDENT },
  { label: "College Signup", path: "/register/college", role: ROLES.COLLEGE },
  { label: "Mentor Application", path: "/register/mentor", role: ROLES.MENTOR },
  { label: "Employer Signup", path: "/register/employer", role: ROLES.EMPLOYER },
] as const;

// Dashboard routes by role
export const DASHBOARD_ROUTES: Record<UserRole, string> = {
  [ROLES.STUDENT]: "/student",
  [ROLES.MENTOR]: "/mentor",
  [ROLES.COLLEGE]: "/college",
  [ROLES.EMPLOYER]: "/employer",
  [ROLES.OPS]: "/admin",
  [ROLES.SUPER_ADMIN]: "/admin",
} as const;

// Common auth routes (for programmatic navigation)
export const AUTH_ROUTES = {
  verifyEmail: (email: string) => `/verify-email?email=${encodeURIComponent(email)}`,
  forgotPassword: "/forgot-password",
  resetPassword: (token: string) => `/reset-password?token=${encodeURIComponent(token)}`,
  login: {
    student: "/login/student",
    mentor: "/login/mentor",
    college: "/login/college",
    employer: "/login/employer",
  },
  home: "/",
} as const;
