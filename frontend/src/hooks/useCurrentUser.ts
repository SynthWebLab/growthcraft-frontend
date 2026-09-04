import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authKeys } from "./queries/useAuthentication";
import { subscribeToAuthChanges } from "@/lib/auth/authSync";
import type { AuthUser } from "@/types/auth.types";

export function useCurrentUser() {
  const queryClient = useQueryClient();

  // Initialise as null; rely on query for true state
  const [clientUser, setClientUser] = useState<AuthUser | null>(null);

  const query = useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.auth.profile);
        if (response.success && response.data?.user) {
          const user = response.data.user as AuthUser;
          return user;
        }
        return null;
      } catch (error) {
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401
  });

  useEffect(() => {
    // Once the query has settled (not loading), always trust query.data over localStorage.
    if (!query.isLoading) {
      setClientUser(query.data ?? null);
    }
  }, [query.data, query.isLoading]);

  // Cross-tab synchronization & tab focus/visibility listener
  useEffect(() => {
    // 1. Subscribe to cross-tab auth state broadcast & storage events
    const unsubscribe = subscribeToAuthChanges((event) => {
      if (event.type === "LOGIN" && event.user) {
        setClientUser(event.user);
        queryClient.setQueryData(authKeys.profile(), event.user);
        void queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      } else if (event.type === "LOGOUT") {
        setClientUser(null);
        queryClient.setQueryData(authKeys.profile(), null);
      }
    });

    // Return unsubscribe cleanup function
    return () => {
      unsubscribe();
    };
  }, [clientUser, queryClient]);

  return {
    ...query,
    data: clientUser,
    user: clientUser,
    isAuthenticated: !!clientUser,
  };
}

