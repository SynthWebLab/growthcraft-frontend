"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useVerifyEmail, useResendOTP } from "@/hooks/queries/useAuthentication";

interface VerifyEmailFormProps {
  email: string;
}

export function VerifyEmailForm({ email }: VerifyEmailFormProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(0);

  const verifyMutation = useVerifyEmail();
  const resendMutation = useResendOTP();

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are entered
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input or submit if complete
    const lastFilledIndex = pastedData.length - 1;
    if (lastFilledIndex < 5) {
      inputRefs.current[lastFilledIndex + 1]?.focus();
    } else {
      handleSubmit(pastedData);
    }
  };

  const handleSubmit = (otpValue: string) => {
    verifyMutation.mutate({
      email,
      otp: otpValue,
    });
  };

  const handleResend = () => {
    resendMutation.mutate(email);
    setCountdown(60); // 60 second cooldown
    setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
    inputRefs.current[0]?.focus();
  };

  const handleManualSubmit = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      handleSubmit(otpValue);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        We've sent a 6-digit code to
        <br />
        <span className="font-medium text-foreground">{email}</span>
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-center block">Enter Verification Code</Label>
          <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold"
                disabled={verifyMutation.isPending}
                autoFocus={index === 0}
              />
            ))}
          </div>
        </div>

        {verifyMutation.isError && (
          <p className="text-sm text-destructive text-center">
            {verifyMutation.error?.message || "Invalid or expired code. Please try again."}
          </p>
        )}

        <Button
          onClick={handleManualSubmit}
          className="w-full"
          disabled={otp.some((digit) => !digit) || verifyMutation.isPending}
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
          {!verifyMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
          <Button
            type="button"
            variant="ghost"
            onClick={handleResend}
            disabled={countdown > 0 || resendMutation.isPending}
            className="text-primary"
          >
            {resendMutation.isPending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : countdown > 0 ? (
              `Resend in ${countdown}s`
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Code
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
