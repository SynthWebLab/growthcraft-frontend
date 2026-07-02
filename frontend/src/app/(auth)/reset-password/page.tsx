"use client";

import { useSearchParams } from "next/navigation";
export const dynamic = "force-dynamic";
import { Suspense } from "react";

import { Lock } from "lucide-react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <AuthPageLayout
        icon={Lock}
        title="Invalid Reset Link"
        subtitle="The password reset link is invalid or has expired"
      >
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Please request a new password reset link.
          </p>
          <a
            href="/forgot-password"
            className="text-primary hover:underline inline-block"
          >
            Request New Link
          </a>
        </div>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout
      icon={Lock}
      title="Reset Password"
      subtitle="Enter your new password"
    >
      <ResetPasswordForm token={token} />
    </AuthPageLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
