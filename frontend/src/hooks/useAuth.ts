import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { authKeys } from "./queries/useAuthentication";
import { getCachedUser } from "./useCurrentUser";

export function useAuth() {
  const query = useQuery({
    queryKey: authKeys.profile(),
    queryFn: async () => {
      try {
        const response = await authService.getProfile();
        const user = response.data?.user || null;
        if (user && typeof window !== "undefined") {
          localStorage.setItem("gc_user", JSON.stringify(user));
        }
        return user;
      } catch (error) {
        // User not authenticated
        if (typeof window !== "undefined") {
          localStorage.removeItem("gc_user");
        }
        return null;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false, // Don't retry if not authenticated
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
    user: clientUser,
    isAuthenticated: !!clientUser,
    isLoading: query.isLoading && !clientUser,
    error: query.error,
  };
}

