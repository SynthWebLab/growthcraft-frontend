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

  // Ensure credentials are included for cookie-based auth
  const config: RequestInit = {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  };

  // Build full URL
  const url = endpoint.startsWith("http") ? endpoint : `${BACKEND_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    // If 401 and we haven't tried refreshing yet
    if (response.status === 401 && !skipRefresh) {
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
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
