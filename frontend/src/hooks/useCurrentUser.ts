/**
 * Hook to get current authenticated user
 * Uses backend profile endpoint with httpOnly cookies
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authKeys } from "./queries/useAuthentication";

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.auth.profile);
        if (response.success && response.data?.user) {
          return response.data.user;
        }
        return null;
      } catch (error) {
        // User not authenticated (401) or other error
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401
  });
}
