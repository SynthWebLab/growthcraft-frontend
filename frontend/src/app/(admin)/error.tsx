"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ErrorState } from "@/components/common/ErrorState";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Optionally log admin-specific errors differently
    console.error("Admin route error caught:", error);
  }, [error]);

  return (
    <div className="bg-muted/40 min-h-screen flex items-center justify-center">
      <ErrorState
        title="Something went wrong in the admin workspace"
        message="We encountered an issue while loading this page. You can try again or return to the admin dashboard."
        error={error}
        reset={reset}
        onReturn={() => router.push("/admin")}
        returnLabel="Admin Dashboard"
      />
    </div>
  );
}
