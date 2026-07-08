import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-marble">
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-magenta border-t-transparent" />
        <p className="text-sm font-semibold font-afacad text-muted-foreground animate-pulse">
          Loading GrowthCraft...
        </p>
      </div>
    </div>
  );
}
