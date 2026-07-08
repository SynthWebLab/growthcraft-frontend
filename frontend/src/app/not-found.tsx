import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-marble px-4 py-8 text-center">
      <div className="max-w-md space-y-4">
        <h1 className="text-6xl font-bold font-space-grotesk text-magenta">404</h1>
        <h2 className="text-2xl font-bold font-space-grotesk text-foreground">Page Not Found</h2>
        <p className="text-muted-foreground text-sm">
          The page you are looking for does not exist or has been moved to a new address.
        </p>
        <div className="pt-4">
          <Button asChild className="bg-magenta text-white hover:bg-magenta/90">
            <Link href="/">Go back to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
