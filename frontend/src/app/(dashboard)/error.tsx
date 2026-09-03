"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/common/ErrorState";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("Dashboard route error caught:", error);
  }, [error]);

  return (
    <div className="bg-marble min-h-screen flex items-center justify-center">
      <ErrorState
        title="Something went wrong in your dashboard"
        message="An issue occurred while loading this section. You can try again or return to your dashboard home."
        error={error}
        reset={reset}
        onReturn={() => router.push("/")}
        returnLabel="Return to Dashboard"
      />
    </div>
  );
}
