"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function VerificationSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push("/login/student");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Email Verified!</h2>
        <p className="text-muted-foreground">
          Your email has been successfully verified.
          <br />
          Redirecting to login...
        </p>
      </div>

      <Button onClick={() => router.push("/login/student")}>
        Go to Login
      </Button>
    </div>
  );
}
