"use client";

/**
 * API Client with automatic token refresh
 * Handles 401 errors and refreshes tokens automatically using Axios interceptors
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_ENDPOINTS } from "./endpoints";
import { ApiError } from "@/lib/errors/ApiError";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5002/api/v1";

interface FetchOptions extends RequestInit {
  skipRefresh?: boolean; // Skip refresh retry for specific requests
}

// Create Axios Instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true, // CRITICAL: Send cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

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

    return response.ok;
  } catch (error) {
    return false;
  }
}

// Response interceptor for automatic token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      console.warn("[Axios Interceptor] No original request configuration found.");
      return Promise.reject(error);
    }

    const endpoint = originalRequest.url || "";
    console.log(`[Axios Interceptor] Intercepted error for request: ${originalRequest.method?.toUpperCase()} ${endpoint}`, {
      status: error.response?.status,
      _retry: originalRequest._retry,
    });

    // Do not attempt token refresh for public auth endpoints or the refresh/logout endpoints
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

    // If error is not 401, or is an auth request, or already retried
    if (error.response?.status !== 401 || originalRequest._retry || isAuthRequest) {
      console.log(
        `[Axios Interceptor] Skipping refresh token call for ${endpoint}. Reason: ` +
        (error.response?.status !== 401 ? `Status is not 401 (status: ${error.response?.status})` : "") +
        (originalRequest._retry ? "Already retried once (_retry is true) " : "") +
        (isAuthRequest ? "Endpoint is an auth request " : "")
      );
      return Promise.reject(error);
    }

    // Extract error code from response body
    const responseData = error.response.data as any;
    const errorCode = responseData?.error?.code || responseData?.code;
    console.log(`[Axios Interceptor] Extracted error code: "${errorCode}" for ${endpoint}`);

    // TOKEN_REVOKED: backend blacklisted this token on logout.
    // The session was explicitly terminated — redirect to the correct portal login.
    if (errorCode === "TOKEN_REVOKED") {
      console.log("[Axios Interceptor] Session revoked (TOKEN_REVOKED). Redirecting user to login page...");
      if (typeof window !== "undefined") {
        localStorage.removeItem("gc_user");
        const path = window.location.pathname;
        const portalMatch = path.match(/^\/(student|college|mentor|employer|admin)/);
        const loginPath = portalMatch ? `/login/${portalMatch[1]}` : "/login/student";
        console.log(`[Axios Interceptor] Redirecting window.location.href to: ${loginPath}`);
        window.location.href = loginPath;
      }
      const revokedError: any = new Error("Your session has been revoked. Please login again.");
      revokedError.code = "SESSION_REVOKED";
      return Promise.reject(revokedError);
    }

    // NO_TOKEN: no token exists at all (unauthenticated request).
    // Skip refresh attempt to avoid infinite reload loop
    if (errorCode === "NO_TOKEN") {
      console.log("[Axios Interceptor] No token exists (NO_TOKEN). Skipping refresh call to prevent infinite loop. Rejecting request.");
      const noTokenError: any = new Error("Authentication required. Please login.");
      noTokenError.code = "NO_TOKEN";
      noTokenError.response = error.response;
      return Promise.reject(noTokenError);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      console.log(`[Axios Interceptor] Token refresh is already in progress. Queuing request for ${endpoint}`);
      originalRequest._retry = true; // Prevent queued request from endlessly triggering refresh
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          console.log(`[Axios Interceptor] Retrying queued request for ${endpoint}`);
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          console.error(`[Axios Interceptor] Queued request failed for ${endpoint}:`, err);
          return Promise.reject(err);
        });
    }

    console.log(`[Axios Interceptor] Initiating refresh token flow for request: ${endpoint}`);
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshSuccess = await refreshToken();
      console.log(`[Axios Interceptor] Refresh token request completed. Success: ${refreshSuccess}`);
      
      if (refreshSuccess) {
        console.log(`[Axios Interceptor] Refresh succeeded. Retrying original request: ${endpoint}`);
        processQueue();
        return axiosInstance(originalRequest);
      } else {
        console.warn("[Axios Interceptor] Refresh failed. Rejecting request.");
        const authError = new Error("Authentication failed");
        processQueue(authError);
        return Promise.reject(authError);
      }
    } catch (refreshError: any) {
      console.error("[Axios Interceptor] Error during token refresh:", refreshError);
      processQueue(refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

/**
 * Enhanced fetch with automatic token refresh (Axios under the hood)
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { skipRefresh = false, ...fetchOptions } = options;

  // Convert headers
  const headers: Record<string, string> = {};
  if (fetchOptions.headers) {
    if (fetchOptions.headers instanceof Headers) {
      fetchOptions.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(fetchOptions.headers)) {
      fetchOptions.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, fetchOptions.headers);
    }
  }

  const config: any = {
    method: fetchOptions.method || "GET",
    url: endpoint,
    headers,
    data: fetchOptions.body,
    signal: fetchOptions.signal,
    withCredentials: true,
  };

  if (skipRefresh) {
    config._retry = true;
  }

  try {
    const response = await axiosInstance(config);
    return response.data;
  } catch (error: any) {
    // If it's a parsed session revocation or no token error, rethrow it directly
    if (error.code === "SESSION_REVOKED" || error.code === "NO_TOKEN") {
      throw error;
    }

    if (error.isAxiosError && error.response) {
      const data = error.response.data;
      const apiError = new ApiError(
        data?.error?.message || data?.message || `Request failed with status ${error.response.status}`,
        {
          statusCode: error.response.status,
          code: data?.error?.code || data?.code || "API_ERROR",
          details: data?.error?.details || data?.details,
          originalError: error,
          response: {
            status: error.response.status,
            statusText: error.response.statusText,
            data: data,
          },
        }
      );
      throw apiError;
    }

    if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
      throw new ApiError(
        "Cannot connect to backend. Please ensure:\n" +
        "1. Backend is running (npm run dev in backend folder)\n" +
        "2. Backend is on http://localhost:5002\n" +
        "3. CORS is configured to allow http://localhost:3000",
        {
          statusCode: 0,
          code: "ERR_NETWORK",
          originalError: error,
        }
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
      body: data,
    }),

  put: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data,
    }),

  patch: <T = any>(endpoint: string, data?: any, options?: FetchOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data,
    }),

  delete: <T = any>(endpoint: string, options?: FetchOptions) =>
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
