import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { authService } from "@/services/auth.service";
import { authKeys } from "./queries/useAuthentication";
import { getCachedUser } from "./useCurrentUser";
import { subscribeToAuthChanges } from "@/lib/auth/authSync";

export function useAuth() {
  const queryClient = useQueryClient();

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

  const [clientUser, setClientUser] = useState<any>(() => getCachedUser() ?? null);

  useEffect(() => {
    if (!query.isLoading) {
      setClientUser(query.data ?? null);
    }
  }, [query.data, query.isLoading]);

  // Cross-tab synchronization & tab focus/visibility listener
  useEffect(() => {
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
    user: clientUser,
    isAuthenticated: !!clientUser,
    isLoading: query.isLoading && !clientUser,
    error: query.error,
  };
}

