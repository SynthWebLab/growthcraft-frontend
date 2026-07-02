import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { authKeys } from "./queries/useAuthentication";

// Helper to get cached user from localStorage safely in Next.js (client-side only)
export const getCachedUser = () => {
  if (typeof window === "undefined") return undefined;
  try {
    const data = localStorage.getItem("gc_user");
    return data ? JSON.parse(data) : undefined;
  } catch {
    return undefined;
  }
};

export function useCurrentUser() {
  // Initialise from localStorage so first render has data (avoids flicker)
  const [clientUser, setClientUser] = useState<any>(() => getCachedUser() ?? null);

  const query = useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.auth.profile);
        if (response.success && response.data?.user) {
          if (typeof window !== "undefined") {
            localStorage.setItem("gc_user", JSON.stringify(response.data.user));
          }
          return response.data.user;
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
    // This prevents stale localStorage from showing an old role after logout.
    if (!query.isLoading) {
      setClientUser(query.data ?? null);
    }
  }, [query.data, query.isLoading]);

  return {
    ...query,
    data: clientUser,
  };
}

