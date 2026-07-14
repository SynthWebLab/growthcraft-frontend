"use client";

import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface AccessDeniedProps {
  title?: string;
  description?: string;
}

/**
 * Shown to Ops users who navigate to a SuperAdmin-only page.
 */
export function AccessDenied({
  title = "Access Restricted",
  description = "This section is only available to Super Administrators. Your Operations role does not have permission to view this content.",
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative mb-6">
        <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
          <ShieldOff className="h-12 w-12 text-destructive" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
          ✕
        </span>
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground max-w-sm mb-8 text-sm leading-relaxed">
        {description}
      </p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
        <Button onClick={() => router.push("/admin")}>
          Back to Dashboard
        </Button>
      </div>

      <p className="mt-8 text-xs text-muted-foreground border border-border rounded-lg px-4 py-2 bg-muted/30">
        Role: <span className="font-semibold text-amber-600 dark:text-amber-400">Operations (Ops)</span>
        &nbsp;·&nbsp; Contact your Super Admin if you need access.
      </p>
    </div>
  );
}
