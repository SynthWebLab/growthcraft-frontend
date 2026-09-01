/**
 * Role Constants and Types
 * Authoritative source of truth for user roles across the frontend
 * Matches backend UserRole definitions and role hierarchy
 */

export const ROLES = {
  STUDENT: "student",
  COLLEGE: "college",
  MENTOR: "mentor",
  EMPLOYER: "employer",
  OPS: "ops",
  SUPER_ADMIN: "super_admin",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const USER_ROLES: readonly UserRole[] = Object.values(ROLES);

/**
 * Public portal roles (user-facing login/registration portals)
 */
export const PORTAL_ROLES = [
  ROLES.STUDENT,
  ROLES.COLLEGE,
  ROLES.MENTOR,
  ROLES.EMPLOYER,
] as const;

export type PortalRole = (typeof PORTAL_ROLES)[number];

/**
 * Administrative roles with access to /admin portal
 */
export const ADMIN_ROLES = [
  ROLES.OPS,
  ROLES.SUPER_ADMIN,
] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

/**
 * User-friendly labels for each role
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  [ROLES.STUDENT]: "Student",
  [ROLES.COLLEGE]: "College Partner",
  [ROLES.MENTOR]: "Mentor",
  [ROLES.EMPLOYER]: "Employer",
  [ROLES.OPS]: "Operations",
  [ROLES.SUPER_ADMIN]: "Super Admin",
};

/**
 * Role check helpers
 */
export function isPortalRole(role: string | null | undefined): role is PortalRole {
  return typeof role === "string" && (PORTAL_ROLES as readonly string[]).includes(role);
}

export function isAdminRole(role: string | null | undefined): role is AdminRole {
  return typeof role === "string" && (ADMIN_ROLES as readonly string[]).includes(role);
}

export function isValidRole(role: string | null | undefined): role is UserRole {
  return typeof role === "string" && (USER_ROLES as readonly string[]).includes(role);
}
