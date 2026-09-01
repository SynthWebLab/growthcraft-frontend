import { useCurrentUser } from "@/hooks/useCurrentUser";
import { ROLES, type UserRole } from "@/lib/constants/roles.constant";

export type AdminOnlyAction =
  | "manage:users"
  | "manage:roles"
  | "manage:system"
  | "read:revenue"
  | "read:audit_logs";

/**
 * Returns role helpers for admin-portal pages.
 *
 * isSuperAdmin - role === ROLES.SUPER_ADMIN
 * isOps        - role === ROLES.OPS
 * can(action)  - returns true only if the current user may perform a
 *                SuperAdmin-only action; Ops users always return false.
 */
export function useAdminRole() {
  const { data: user } = useCurrentUser();

  const role = (user as any)?.role as UserRole | undefined;
  const isSuperAdmin = role === ROLES.SUPER_ADMIN;
  const isOps = role === ROLES.OPS;

  const can = (_action: AdminOnlyAction): boolean => isSuperAdmin;

  return { isSuperAdmin, isOps, can, role };
}