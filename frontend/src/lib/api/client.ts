/**
 * API Client with automatic token refresh
 * Handles 401 errors and refreshes tokens automatically
 */

import { API_ENDPOINTS } from "./endpoints";
import { AUTH_ROUTES } from "@/lib/constants/routes.constant";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5001/api/v1";

interface FetchOptions extends RequestInit {
  skipRefresh?: boolean; // Skip refresh retry for specific requests
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Refresh the access token using the refresh token cookie
 */
async function refreshToken(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}${API_ENDPOINTS.auth.refresh}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Enhanced fetch with automatic token refresh
 * 
 * Features:
 * - Automatically includes credentials (cookies)
 * - Retries failed requests after refreshing token
 * - Handles token reuse detection
 * - Prevents multiple simultaneous refresh attempts
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipRefresh = false, ...fetchOptions } = options;

  const isFormData = fetchOptions.body instanceof FormData;

  // Ensure credentials are included for cookie-based auth
  const config: RequestInit = {
    ...fetchOptions,
    credentials: "include",
    headers: isFormData 
      ? { ...fetchOptions.headers }
      : {
          "Content-Type": "application/json",
          ...fetchOptions.headers,
        },
  };

  // Build full URL
  const url = endpoint.startsWith("http") ? endpoint : `${BACKEND_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    // Do not attempt token refresh for public auth endpoints (login, register, forgot-password, reset-password, verify-email, resend-verification) or the refresh endpoint itself
    const isAuthRequest = 
      endpoint.includes(API_ENDPOINTS.auth.login) ||
      endpoint.includes(API_ENDPOINTS.auth.register) ||
      endpoint.includes(API_ENDPOINTS.auth.refresh) ||
      endpoint.includes(API_ENDPOINTS.auth.logout) ||     // never auto-refresh on logout
      endpoint.includes(API_ENDPOINTS.auth.logoutAll) ||  // never auto-refresh on logout-all
      endpoint.includes(API_ENDPOINTS.auth.forgotPassword) ||
      endpoint.includes(API_ENDPOINTS.auth.resetPassword) ||
      endpoint.includes(API_ENDPOINTS.auth.verifyEmail) ||
      endpoint.includes(API_ENDPOINTS.auth.resendVerification);

    // If 401 and we haven't tried refreshing yet
    if (response.status === 401 && !skipRefresh && !isAuthRequest) {
      // Peek at the body to check for terminal error codes before attempting refresh.
      // We clone so the body stream can still be read later if needed.
      let errorCode: string | undefined;
      try {
        const cloned = response.clone();
        const body = await cloned.json();
        errorCode = body?.error?.code;
      } catch {
        // Ignore parse errors — proceed with normal refresh logic
      }

      // TOKEN_REVOKED: backend blacklisted this token on logout.
      // The session was explicitly terminated — redirect to the correct portal login.
      if (errorCode === "TOKEN_REVOKED") {
        if (typeof window !== "undefined") {
          localStorage.removeItem("gc_user");
          const path = window.location.pathname;
          const portalMatch = path.match(/^\/(student|college|mentor|employer|admin)/);
          const loginPath = portalMatch ? `/login/${portalMatch[1]}` : "/login/student";
          window.location.href = loginPath;
        }
        const revokedError: any = new Error("Your session has been revoked. Please login again.");
        revokedError.code = "SESSION_REVOKED";
        throw revokedError;
      }

      // NO_TOKEN: no token exists at all (unauthenticated request).
      // Skip the pointless refresh attempt but do NOT redirect here —
      // this code is also called from the login page (useCurrentUser) where
      // NO_TOKEN is completely normal and redirecting would cause an infinite reload.
      // The middleware and dashboard layouts handle unauthenticated routing.
      if (errorCode === "NO_TOKEN") {
        const noTokenError: any = new Error("Authentication required. Please login.");
        noTokenError.code = "NO_TOKEN";
        noTokenError.response = { status: 401, data: null };
        throw noTokenError;
      }


      // If already refreshing, wait for that to complete
      if (isRefreshing && refreshPromise) {
        const refreshSuccess = await refreshPromise;
        if (refreshSuccess) {
          return apiFetch(endpoint, { ...options, skipRefresh: true });
        } else {
          throw new Error("Token refresh failed");
        }
      }

      // Start refresh process
      isRefreshing = true;
      refreshPromise = refreshToken();

      const refreshSuccess = await refreshPromise;
      isRefreshing = false;
      refreshPromise = null;

      if (refreshSuccess) {
        // Retry original request with new token
        return apiFetch(endpoint, { ...options, skipRefresh: true });
      } else {
        // Refresh failed - just throw error, don't redirect
        // Let the calling code (components/hooks) decide what to do
        throw new Error("Authentication failed");
      }
    }


    // Parse response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      const text = await response.text();
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}: ${text || 'No response body'}`);
      }
      
      return {} as T;
    }

    // Check for errors
    if (!response.ok) {
      // Create an error object that mimics axios error structure
      // This allows error handlers to access error.response.data.error.code
      const error: any = new Error(data?.error?.message || data?.message || `Request failed with status ${response.status}`);
      error.response = {
        status: response.status,
        statusText: response.statusText,
        data: data,
      };
      throw error;
    }

    return data;
  } catch (error: any) {
    if (error.message === "Failed to fetch") {
      throw new Error(
        "Cannot connect to backend. Please ensure:\n" +
        "1. Backend is running (npm run dev in backend folder)\n" +
        "2. Backend is on http://localhost:5001\n" +
        "3. CORS is configured to allow http://localhost:3000"
      );
    }
    
    throw error;
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const apiClient = {
  get: <T = any>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "POST",
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
    }),

  put: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
    }),

  patch: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
    }),

  delete: <T = any>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
