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
        return null;
      } catch (error) {
        // User not authenticated (401) or other error
        if (typeof window !== "undefined") {
          localStorage.removeItem("gc_user");
        }
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry on 401
  });

  const [clientUser, setClientUser] = useState<any>(null);

  useEffect(() => {
    const cached = getCachedUser();
    if (query.data) {
      setClientUser(query.data);
    } else if (cached) {
      setClientUser(cached);
    } else {
      setClientUser(null);
    }
  }, [query.data]);

  return {
    ...query,
    data: clientUser,
  };
}

