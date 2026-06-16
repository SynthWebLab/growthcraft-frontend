/**
 * Shared helpers for the student dashboard pages.
 */

import type { EnrollmentStatus } from "@/types/student";

/** Format an ISO date string as e.g. "Mar 15, 2026". Returns "" for falsy input. */
export function formatDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Backend refs (courseId / eventId / programId) are either a populated object
 * or a raw ObjectId string. Return the object, or null when not populated.
 */
export function resolveRef<T extends { _id: string }>(
  ref: T | string | null | undefined
): T | null {
  if (!ref || typeof ref === "string") return null;
  return ref;
}

/** Human label + badge classes for an enrollment status. */
export function statusBadge(status: EnrollmentStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case "confirmed":
      return { label: "Confirmed", className: "bg-success/10 text-success" };
    case "pending":
      return { label: "Pending", className: "bg-magenta/10 text-magenta" };
    case "cancelled":
      return { label: "Cancelled", className: "bg-muted text-muted-foreground" };
    default:
      return { label: status, className: "bg-muted text-muted-foreground" };
  }
}
