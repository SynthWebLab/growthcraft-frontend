"use client";

import { KeyRound } from "lucide-react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";

export default function ForgotPasswordPage() {
  return (
    <AuthPageLayout
      icon={KeyRound}
      title="Forgot Password"
      subtitle="Enter your email to receive a password reset link"
    >
      <ForgotPasswordForm />
    </AuthPageLayout>
  );
}
