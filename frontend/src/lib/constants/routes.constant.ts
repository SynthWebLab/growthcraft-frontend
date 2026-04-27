/**
 * Route Constants
 * Used for navigation menus and route generation
 */

// Navigation routes
export const NAV_ROUTES = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
  { name: "Bootcamps", path: "/bootcamps" },
  { name: "About", path: "/about" },
  { name: "Partnerships", path: "/partnerships" },
] as const;

// Login routes by role
export const LOGIN_ROUTES = [
  { label: "Student Login", path: "/login/student", role: "student" },
  { label: "College Login", path: "/login/college", role: "college" },
  { label: "Mentor Login", path: "/login/mentor", role: "mentor" },
  { label: "Employer Login", path: "/login/employer", role: "employer" },
] as const;

// Registration routes by role
export const REGISTER_ROUTES = [
  { label: "Student Signup", path: "/register/student", role: "student" },
  { label: "College Signup", path: "/register/college", role: "college" },
  { label: "Mentor Application", path: "/register/mentor", role: "mentor" },
  { label: "Employer Signup", path: "/register/employer", role: "employer" },
] as const;

// Dashboard routes by role
export const DASHBOARD_ROUTES = {
  student: "/student",
  mentor: "/mentor",
  college: "/college",
  employer: "/hiring-partner",
} as const;

// Common auth routes (for programmatic navigation)
export const AUTH_ROUTES = {
  verifyEmail: (email: string) => `/verify-email?email=${encodeURIComponent(email)}`,
  forgotPassword: "/forgot-password",
  resetPassword: (token: string) => `/reset-password?token=${encodeURIComponent(token)}`,
  login: {
    student: "/login/student",
    mentor: "/login/mentor",
    college: "/college",
    employer: "/login/employer",
  },
  home: "/",
} as const;
