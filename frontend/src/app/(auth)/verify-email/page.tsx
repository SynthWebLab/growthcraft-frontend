"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Mail } from "lucide-react";
import { VerifyEmailForm } from "@/components/auth/VerifyEmailForm";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const callbackUrl = searchParams.get("callbackUrl") || undefined;

  if (!email) {
    return (
      <AuthPageLayout
        icon={Mail}
        title="Email Verification"
        subtitle="Please provide your email address"
      >
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            No email address provided. Please register first.
          </p>
          <a
            href="/register/student"
            className="text-primary hover:underline"
          >
            Go to Registration
          </a>
        </div>
      </AuthPageLayout>
    );
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

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
