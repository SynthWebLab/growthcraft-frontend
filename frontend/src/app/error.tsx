"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-marble px-4 py-8 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-4xl font-bold font-space-grotesk text-danger">Something went wrong!</h1>
        <p className="text-muted-foreground text-sm">
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>
        {error.message && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded border border-red-200 font-mono text-left max-h-[150px] overflow-y-auto">
            {error.message}
          </div>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={() => window.location.reload()} variant="outline">
            Reload Application
          </Button>
          <Button onClick={() => reset()} className="bg-magenta text-white hover:bg-magenta/90">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
