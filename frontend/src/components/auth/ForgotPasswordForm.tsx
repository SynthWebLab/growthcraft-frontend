"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { useForgotPassword } from "@/hooks/queries/useAuthentication";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    forgotPasswordMutation.mutate(email, {
      onSuccess: () => {
        setSubmitted(true);
      },
    });
  };

  if (submitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Check Your Email</h3>
          <p className="text-sm text-muted-foreground">
            If an account exists with <span className="font-medium text-foreground">{email}</span>,
            you will receive a password reset link shortly.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Didn't receive the email? Check your spam folder or try again.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false);
              setEmail("");
            }}
            className="w-full"
          >
            Try Another Email
          </Button>
        </div>

        <div className="pt-4 border-t">
          <a
            href="/login/student"
            className="text-sm text-primary hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
              required
              disabled={forgotPasswordMutation.isPending}
              autoFocus
            />
          </div>
        </div>

        {forgotPasswordMutation.isError && (
          <p className="text-sm text-destructive">
            {forgotPasswordMutation.error?.message || "Failed to send reset link. Please try again."}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={!email || forgotPasswordMutation.isPending}
        >
          {forgotPasswordMutation.isPending ? "Sending..." : "Send Reset Link"}
          {!forgotPasswordMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <a href="/login/student" className="text-primary hover:underline">
            Back to Login
          </a>
        </p>
      </div>
    </form>
  );
}
