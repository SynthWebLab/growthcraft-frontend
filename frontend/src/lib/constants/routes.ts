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
  { label: "Student Login", path: "/login?role=student", role: "student" },
  { label: "College Login", path: "/login?role=college", role: "college" },
  { label: "Mentor Login", path: "/login?role=mentor", role: "mentor" },
  { label: "Employer Login", path: "/login?role=employer", role: "employer" },
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
  ambassador: "/ambassador",
  "hiring-partner": "/hiring-partner",
  admin: "/admin/dashboard",
} as const;
