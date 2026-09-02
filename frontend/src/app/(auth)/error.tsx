"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/common/ErrorState";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Auth route error caught:", error);
  }, [error]);

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center">
      <ErrorState
        title="We couldn't complete that request"
        message="There was an issue processing your authentication request. Please try again or return to the login page."
        error={error}
        reset={reset}
        onReturn={() => router.push("/login")}
        returnLabel="Return to Login"
      />
    </div>
  );
}
