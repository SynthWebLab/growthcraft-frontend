"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail } from "lucide-react";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { useVerificationStore } from "@/stores/useVerificationStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { DASHBOARD_ROUTES } from "@/lib/constants/routes.constant";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { email, callbackUrl } = useVerificationStore();
  const { isAuthenticated, user } = useCurrentUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Cross-tab login sync: Redirect to dashboard if authenticated
    if (isAuthenticated && user?.role) {
      const dashboardRoute = DASHBOARD_ROUTES[user.role as keyof typeof DASHBOARD_ROUTES] || '/';
      router.replace(dashboardRoute);
      return;
    }

    // Redirect to home if no pending verification (e.g. direct URL visit or refresh)
    if (!email) {
      router.replace("/");
    }
  }, [mounted, isAuthenticated, user, email, router]);

  // Don't render anything until mounted and we have an email (avoids flashes)
  if (!mounted || !email || isAuthenticated) {
    return null;
  }

  return (
    <AuthPageLayout
      icon={Mail}
      title="Verify Your Email"
      subtitle=""
    >
      <VerifyEmailForm email={email} callbackUrl={callbackUrl} />
    </AuthPageLayout>
  );
}
