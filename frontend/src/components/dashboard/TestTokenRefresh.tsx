"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { toast } from "sonner";

export function TestTokenRefresh() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  const testApiCall = async () => {
    setLoading(true);
    setResult("");
    setDetails("");
    
    try {
      console.log("🔵 Making API call to /auth/profile...");
      
      // This will call your backend profile endpoint
      // If access_token is expired, it will auto-refresh
      const response = await apiClient.get(API_ENDPOINTS.auth.profile);
      
      setResult("✅ API call successful! Token refresh worked if needed.");
      setDetails(JSON.stringify(response, null, 2));
      toast.success("API call successful!");
      console.log("✅ Profile data:", response);
    } catch (error: any) {
      console.error("❌ API call failed:", error);
      setResult(`❌ API call failed: ${error.message}`);
      setDetails(error.stack || "No additional details");
      toast.error("API call failed", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const checkCookies = () => {
    // Note: We can't read httpOnly cookies from JavaScript
    // But we can check if they exist by making an API call
    toast.info("Cookies are httpOnly", {
      description: "Check DevTools > Application > Cookies to see them",
    });
  };

  return (
    <>
    {/* <div className="border rounded-lg p-4 space-y-4">
      <div>
        <h3 className="font-semibold mb-2">Test Token Refresh</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Wait 1 minute after login, then click this button to test automatic token refresh.
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button 
          onClick={testApiCall} 
          disabled={loading}
          variant="outline"
        >
          {loading ? "Testing..." : "Test API Call"}
        </Button>
        
        <Button 
          onClick={checkCookies} 
          variant="ghost"
          size="sm"
        >
          Check Cookies
        </Button>
      </div>
      
      {result && (
        <div className="space-y-2">
          <div className="text-sm p-3 bg-muted rounded">
            {result}
          </div>
          {details && (
            <details className="text-xs">
              <summary className="cursor-pointer text-muted-foreground">
                Show details
              </summary>
              <pre className="mt-2 p-2 bg-muted rounded overflow-auto max-h-40">
                {details}
              </pre>
            </details>
          )}
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        <p className="font-medium mb-1">How it works:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Calls backend /auth/profile endpoint</li>
          <li>If access_token expired → auto-refresh</li>
          <li>Check cookies to see new tokens</li>
          <li>Open DevTools Console for detailed logs</li>
        </ul>
      </div>
    </div> */}
    </>
  );
}
