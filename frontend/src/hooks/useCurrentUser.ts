import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authKeys } from "./queries/useAuthentication";
import { subscribeToAuthChanges } from "@/lib/auth/authSync";
import type { AuthUser } from "@/types/auth.types";

// Helper to get cached user from localStorage safely in Next.js (client-side only)
export const getCachedUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem("gc_user");
    return data ? (JSON.parse(data) as AuthUser) : null;
  } catch {
    return null;
  }
};

export function useCurrentUser() {
  const queryClient = useQueryClient();

  // Initialise from localStorage so first render has data (avoids flicker)
  const [clientUser, setClientUser] = useState<AuthUser | null>(() => getCachedUser());

  const query = useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.auth.profile);
        if (response.success && response.data?.user) {
          const user = response.data.user as AuthUser;
          if (typeof window !== "undefined") {
            localStorage.setItem("gc_user", JSON.stringify(user));
          }
          return user;
        }
        // No valid session — clear stale localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("gc_user");
        }
        return null;
      } catch (error) {
        // User not authenticated (401) or other error — clear stale localStorage
        if (typeof window !== "undefined") {
          localStorage.removeItem("gc_user");
        }
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

    // 2. Re-validate on tab focus or visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const cached = getCachedUser();
        if (cached && (!clientUser || cached.id !== clientUser.id)) {
          setClientUser(cached);
          void queryClient.invalidateQueries({ queryKey: authKeys.profile() });
        } else if (!cached && clientUser) {
          setClientUser(null);
          queryClient.setQueryData(authKeys.profile(), null);
        }
      }
    };

    window.addEventListener("focus", handleVisibilityChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      unsubscribe();
      window.removeEventListener("focus", handleVisibilityChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [clientUser, queryClient]);

  return {
    ...query,
    data: clientUser,
    user: clientUser,
    isAuthenticated: !!clientUser,
  };
}

