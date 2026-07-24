/**
 * Auth Service Layer
 * Handles all authentication-related API calls
 * Used by React Query hooks
 */

import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import type {
  RegisterData,
  ApiResponse,
} from "@/types/api";

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.auth.register, data);
  },

  /**
   * Login user
   */
  login: async (email: string, password: string): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.auth.login, { email, password });
  },

  /**
   * Verify email with OTP
   */
  verifyEmail: async (email: string, otp: string): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.auth.verifyEmail, { email, otp });
  },

  /**
   * Resend verification OTP
   */
  resendVerificationOTP: async (email: string): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.auth.resendVerification, { email });
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.auth.forgotPassword, { email });
  },

  /**
   * Reset password with OTP code
   */
  resetPassword: async (email: string, otp: string, newPassword: string): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.auth.resetPassword, { email, otp, newPassword });
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<ApiResponse> => {
    return apiClient.get<ApiResponse>(API_ENDPOINTS.auth.profile);
  },

  /**
   * Logout from current device
   */
  logout: async (): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.auth.logout);
  },

  /**
   * Logout from all devices
   */
  logoutAll: async (): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.auth.logoutAll);
  },

  /**
   * Refresh access token
   */
  refreshToken: async (): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.auth.refresh);
  },

  /**
   * Change password for the authenticated user
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string,
    confirmPassword?: string
  ): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse>(API_ENDPOINTS.auth.changePassword, {
      currentPassword,
      newPassword,
      ...(confirmPassword !== undefined ? { confirmPassword } : {}),
    });
  },

  /**
   * Update the authenticated user's account (name, phone, etc.)
   */
  updateAccount: async (
    userId: string,
    data: { fullName?: string; phone?: string }
  ): Promise<ApiResponse> => {
    return apiClient.patch<ApiResponse>(API_ENDPOINTS.users.update(userId), data);
  },
};
