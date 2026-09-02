"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, RefreshCw, AlertCircle } from "lucide-react";
import { useVerifyEmail, useResendOTP } from "@/hooks/queries/useAuthentication";
import { useVerificationStore } from "@/stores/useVerificationStore";
import { useRouter } from "next/navigation";

interface VerifyEmailFormProps {
  email: string;
  callbackUrl?: string;
}

export function VerifyEmailForm({ email, callbackUrl }: VerifyEmailFormProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();

  const { expiresAt } = useVerificationStore();
  const verifyMutation = useVerifyEmail(callbackUrl);
  const resendMutation = useResendOTP();

  // Expiration checking effect
  useEffect(() => {
    if (!expiresAt) return;
    
    const checkExpiration = () => {
      if (Date.now() > expiresAt) {
        setIsExpired(true);
      } else {
        setIsExpired(false);
      }
    };

    checkExpiration();
    const interval = setInterval(checkExpiration, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    if (isExpired) return;
    
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
    if (isExpired) return;
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    if (isExpired) return;

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
    if (isExpired) return;
    verifyMutation.mutate({
      email,
      otp: otpValue,
    });
  };

  const handleResend = () => {
    resendMutation.mutate(email);
    setCountdown(60); // 60 second cooldown
    setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
    setIsExpired(false); // Optimistically un-expire
    inputRefs.current[0]?.focus();
  };

  const handleManualSubmit = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      handleSubmit(otpValue);
    }
  };

  const handleCancel = () => {
    useVerificationStore.getState().clearPendingVerification();
    router.push('/register/student'); // or just back to home
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground text-center">
        We've sent a 6-digit code to
        <br />
        <span className="font-medium text-foreground">{email}</span>
      </p>

      <div className="space-y-4">
        {isExpired ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md flex flex-col items-center justify-center space-y-2 text-center">
            <AlertCircle className="w-8 h-8" />
            <div>
              <p className="font-semibold">Verification code expired</p>
              <p className="text-sm">Please request a new code to continue.</p>
            </div>
          </div>
        ) : (
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
                  disabled={verifyMutation.isPending || isExpired}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>
        )}

        {verifyMutation.isError && !isExpired && (
          <p className="text-sm text-destructive text-center">
            {verifyMutation.error?.message || "Invalid or expired code. Please try again."}
          </p>
        )}

        <Button
          onClick={handleManualSubmit}
          className="w-full"
          disabled={otp.some((digit) => !digit) || verifyMutation.isPending || isExpired}
        >
          {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
          {!verifyMutation.isPending && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
          <div className="flex items-center justify-center gap-2">
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
            
            <span className="text-muted-foreground/30">|</span>
            
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
