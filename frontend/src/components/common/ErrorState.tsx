import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: Error & { digest?: string };
  reset?: () => void;
  onReturn?: () => void;
  returnLabel?: string;
}

export const ErrorState = ({
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this page. Our team has been notified.",
  error,
  reset,
  onReturn,
  returnLabel = "Go Back",
}: ErrorStateProps) => {
  useEffect(() => {
    // We log the error here. In production, this could be sent to a monitoring service.
    if (error) {
      console.error("Error boundary caught:", error);
    }
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 sm:p-8 text-center animate-fade-in">
      <div className="max-w-lg w-full bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 space-y-6">
        <div className="mx-auto w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-space-grotesk text-slate-900 dark:text-white">
            {title}
          </h1>
          <p className="text-muted-foreground text-sm">
            {message}
          </p>
        </div>

        {isDevelopment && error?.message && (
          <div className="bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 text-xs p-4 rounded-lg border border-red-200 dark:border-red-500/20 font-mono text-left max-h-[150px] overflow-y-auto w-full break-words">
            <span className="font-semibold block mb-1">Error Details (Development Only):</span>
            {error.message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          {reset && (
            <Button 
              onClick={() => reset()} 
              className="bg-magenta text-white hover:bg-magenta/90"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          {onReturn && (
            <Button 
              onClick={onReturn} 
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              {returnLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
