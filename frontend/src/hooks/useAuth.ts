/**
 * Custom auth hook using httpOnly cookies
 * Replaces NextAuth for simpler authentication
 */

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { authKeys } from "./queries/useAuthentication";

export function useAuth() {
  const { data, isLoading, error } = useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      try {
        const response = await authService.getProfile();
        return response.data?.user || null;
      } catch (error) {
        // User not authenticated
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if not authenticated
  });

  return {
    user: data,
    isAuthenticated: !!data,
    isLoading,
    error,
  };
}
