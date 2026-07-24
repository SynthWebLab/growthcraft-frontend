"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, KeyRound, Lock, Eye, EyeOff, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { useForgotPassword, useResetPassword } from "@/hooks/queries/useAuthentication";

export function ForgotPasswordForm() {
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

  const forgotPasswordMutation = useForgotPassword();
  const resetPasswordMutation = useResetPassword();

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    return null;
  };

  const passwordStrength = (password: string): { strength: number; label: string; color: string } => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength: 33, label: "Weak", color: "bg-red-500" };
    if (strength <= 4) return { strength: 66, label: "Medium", color: "bg-yellow-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setValidationError("");

    forgotPasswordMutation.mutate(email, {
      onSuccess: (response) => {
        if (response.success) {
          setStep("reset");
        }
      },
    });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!otp || otp.trim().length !== 6) {
      setValidationError("Please enter a valid 6-digit verification code");
      return;
    }

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate({
      email,
      otp: otp.trim(),
      newPassword,
    });
  };

  const strength = newPassword ? passwordStrength(newPassword) : null;

  if (step === "email") {
    return (
      <form onSubmit={handleSendOtp} className="space-y-6">
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
              {forgotPasswordMutation.error?.message || "Failed to send verification code. Please try again."}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!email || forgotPasswordMutation.isPending}
          >
            {forgotPasswordMutation.isPending ? "Sending Verification Code..." : "Send Reset Code"}
            {!forgotPasswordMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <a href="/login/student" className="text-primary hover:underline font-medium">
              Back to Login
            </a>
          </p>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-6">
      <div className="space-y-4">
        {/* Email banner with Change Email option */}
        <div className="flex items-center justify-between bg-muted/60 p-3 rounded-lg border text-sm">
          <span className="text-muted-foreground truncate">
            Code sent to <span className="font-medium text-foreground">{email}</span>
          </span>
          <button
            type="button"
            onClick={() => {
              setStep("email");
              setOtp("");
              setValidationError("");
            }}
            className="text-primary hover:underline font-medium text-xs ml-2 shrink-0"
          >
            Change
          </button>
        </div>

        {/* 6-Digit OTP Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="otp">6-Digit Verification Code</Label>
            <button
              type="button"
              disabled={forgotPasswordMutation.isPending}
              onClick={() => {
                forgotPasswordMutation.mutate(email);
              }}
              className="text-xs text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              <RefreshCw className={`h-3 w-3 ${forgotPasswordMutation.isPending ? "animate-spin" : ""}`} />
              Resend Code
            </button>
          </div>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="otp"
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="pl-10 tracking-widest font-mono text-base"
              required
              disabled={resetPasswordMutation.isPending}
              autoFocus
            />
          </div>
        </div>

        {/* New Password Field */}
        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="newPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="pl-10 pr-10"
              required
              disabled={resetPasswordMutation.isPending}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && strength && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Password strength:</span>
                <span
                  className={`font-medium ${
                    strength.label === "Weak"
                      ? "text-red-500"
                      : strength.label === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {strength.label}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${strength.strength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="pl-10 pr-10"
              required
              disabled={resetPasswordMutation.isPending}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Requirements */}
        <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-md">
          <p className="font-medium">Password must contain:</p>
          <ul className="space-y-0.5 ml-4 list-disc">
            <li>At least 8 characters</li>
            <li>One uppercase & one lowercase letter</li>
            <li>At least one number</li>
          </ul>
        </div>

        {(validationError || resetPasswordMutation.isError) && (
          <p className="text-sm text-destructive font-medium">
            {validationError || resetPasswordMutation.error?.message || "Failed to reset password. Please verify code and try again."}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={
            !otp ||
            !newPassword ||
            !confirmPassword ||
            resetPasswordMutation.isPending
          }
        >
          {resetPasswordMutation.isPending ? "Updating Password..." : "Set New Password"}
          {!resetPasswordMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      <div className="text-center">
        <a href="/login/student" className="text-sm text-primary hover:underline">
          Back to Login
        </a>
      </div>
    </form>
  );
}
