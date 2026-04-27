"use client";

import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/lib/constants/routes.constant";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user;

  const signOut = async () => {
    await nextAuthSignOut({ redirect: false });
    router.push(AUTH_ROUTES.home);
    router.refresh();
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    signOut,
    session,
  };
}
