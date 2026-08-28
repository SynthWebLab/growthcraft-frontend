/**
 * Centralized error handler and extractor utilities
 * Extracts user-safe messages, handles auth/network/validation errors consistently
 */

import { ApiError } from "./ApiError";

/**
 * Extracts a user-facing error message from any error object
 * Safely parses backend structured errors, Axios responses, or standard Error objects
 */
export function extractErrorMessage(error: unknown, fallback: string = "An unexpected error occurred."): string {
  if (!error) return fallback;

  if (typeof error === "string") return error;

  // Handle ApiError or ValidationError directly
  if (error instanceof ApiError && error.message) {
    if (error.details) {
      const details = error.details as Record<string, any>;
      const fieldErrors: Array<{ message?: string; msg?: string }> =
        details?.error?.errors || details?.errors || [];
      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        const messages = fieldErrors
          .map((e) => e.message || e.msg)
          .filter((msg): msg is string => Boolean(msg));
        if (messages.length > 0) {
          return messages.join(", ");
        }
      }
    }
    return error.message;
  }

  // Handle Axios-like response errors or generic backend error shapes
  const err = error as Record<string, any>;
  const errorData = err?.response?.data?.error || err?.response?.data;

  // Extract nested field errors (from express-validator / backend validation)
  const fieldErrors: Array<{ message?: string; msg?: string }> =
    errorData?.details?.error?.errors ||
    errorData?.details?.errors ||
    (Array.isArray(errorData?.errors) ? errorData.errors : []);

  if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
    const messages = fieldErrors
      .map((e) => e.message || e.msg)
      .filter((msg): msg is string => Boolean(msg));
    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  if (typeof errorData?.message === "string" && errorData.message.trim()) {
    return errorData.message;
  }

  if (typeof err?.message === "string" && err.message.trim()) {
    return err.message;
  }

  return fallback;
}

/**
 * Alias matching the signature used across React Query hooks
 */
export const extractApiError = extractErrorMessage;

/**
 * Checks if error is a 401 Unauthorized / token expiration error
 */
export function isUnauthorizedError(error: unknown): boolean {
  if (!error) return false;
  const err = error as Record<string, any>;
  const status = err?.statusCode || err?.response?.status;
  const code = err?.code || err?.response?.data?.error?.code || err?.response?.data?.code;
  return (
    status === 401 ||
    code === "UNAUTHORIZED" ||
    code === "INVALID_TOKEN" ||
    code === "TOKEN_EXPIRED" ||
    code === "NO_TOKEN" ||
    code === "SESSION_REVOKED"
  );
}

/**
 * Checks if error is a 403 Forbidden / insufficient permissions error
 */
export function isForbiddenError(error: unknown): boolean {
  if (!error) return false;
  const err = error as Record<string, any>;
  const status = err?.statusCode || err?.response?.status;
  const code = err?.code || err?.response?.data?.error?.code || err?.response?.data?.code;
  return status === 403 || code === "FORBIDDEN";
}

/**
 * Checks if error is a network connection error
 */
export function isNetworkError(error: unknown): boolean {
  if (!error) return false;
  const err = error as Record<string, any>;
  return (
    err?.code === "ERR_NETWORK" ||
    err?.message === "Network Error" ||
    (typeof err?.message === "string" && err.message.includes("Cannot connect to backend"))
  );
}
