import { useCurrentUser } from "@/hooks/useCurrentUser";

export type AdminOnlyAction =
  | "manage:users"
  | "manage:roles"
  | "manage:system"
  | "read:revenue"
  | "read:audit_logs";

/**
 * Returns role helpers for admin-portal pages.
 *
 * isSuperAdmin - role === 'super_admin'
 * isOps        - role === 'ops'
 * can(action)  - returns true only if the current user may perform a
 *                SuperAdmin-only action; Ops users always return false.
 */
export function useAdminRole() {
  const { data: user } = useCurrentUser();

  const role = user?.role;
  const isSuperAdmin = role === "super_admin";
  const isOps = role === "ops";

  const can = (action: AdminOnlyAction): boolean => isSuperAdmin;

  return { isSuperAdmin, isOps, can, role };
}