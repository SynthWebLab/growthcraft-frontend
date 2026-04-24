"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useResetPassword } from "@/hooks/queries/useAuthentication";

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Validate password
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setValidationError(passwordError);
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    resetPasswordMutation.mutate({
      token,
      newPassword,
    });
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

  const strength = newPassword ? passwordStrength(newPassword) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
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
              autoFocus
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
                <span className={`font-medium ${
                  strength.label === "Weak" ? "text-red-500" :
                  strength.label === "Medium" ? "text-yellow-500" :
                  "text-green-500"
                }`}>
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

        {/* Password Requirements */}
        <div className="text-xs text-muted-foreground space-y-1 bg-muted/50 p-3 rounded-md">
          <p className="font-medium">Password must contain:</p>
          <ul className="space-y-0.5 ml-4 list-disc">
            <li>At least 8 characters</li>
            <li>One uppercase letter</li>
            <li>One lowercase letter</li>
            <li>One number</li>
          </ul>
        </div>

        {(validationError || resetPasswordMutation.isError) && (
          <p className="text-sm text-destructive">
            {validationError || resetPasswordMutation.error?.message || "Failed to reset password. Please try again."}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={
            !newPassword ||
            !confirmPassword ||
            resetPasswordMutation.isPending
          }
        >
          {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
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
