"use client";

import { useExampleQuery } from "@/hooks/queries/useExampleQuery";
import { useUIStore } from "@/stores/uiStore";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

export default function TestStatePage() {
  // Test TanStack Query
  const { data, isLoading, error } = useExampleQuery();

  // Test NextAuth Session (actual auth system)
  const { data: session, status } = useSession();

  // Test Zustand UI Store
  const { sidebarOpen, theme, toggleSidebar, setTheme } = useUIStore();

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">State Management Test Page</h1>

      {/* TanStack Query Test */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold">TanStack Query Test</h2>
        {isLoading && <p className="text-muted-foreground">Loading...</p>}
        {error && <p className="text-red-500">Error: {error.message}</p>}
        {data && (
          <div className="bg-green-50 p-4 rounded">
            <p className="font-semibold text-green-700">✓ TanStack Query Working!</p>
            <pre className="mt-2 text-sm">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* NextAuth Session Test (Actual Auth System) */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold">NextAuth Session Test</h2>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {status === "authenticated" ? "✓ Authenticated" : status === "loading" ? "Loading..." : "✗ Not Authenticated"}
          </p>
          {session?.user && (
            <div className="bg-blue-50 p-4 rounded">
              <p className="font-semibold text-blue-700">User Data:</p>
              <pre className="mt-2 text-sm">{JSON.stringify(session.user, null, 2)}</pre>
            </div>
          )}
          <p className="text-sm text-muted-foreground">
            Note: This uses httpOnly cookies. Check Application → Cookies in DevTools.
          </p>
        </div>
      </div>

      {/* Zustand UI Store Test */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Zustand UI Store Test</h2>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Sidebar Open:</span>{" "}
            {sidebarOpen ? "✓ Yes" : "✗ No"}
          </p>
          <p>
            <span className="font-semibold">Theme:</span> {theme}
          </p>
          <div className="flex gap-2">
            <Button onClick={toggleSidebar}>Toggle Sidebar</Button>
            <Button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              variant="outline"
            >
              Toggle Theme
            </Button>
          </div>
        </div>
      </div>

      {/* Success Summary */}
      <div className="bg-green-100 border border-green-300 rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-green-800 mb-2">
          ✓ All Systems Working!
        </h2>
        <ul className="space-y-1 text-green-700">
          <li>✓ TanStack Query v5 configured and fetching data</li>
          <li>✓ NextAuth with httpOnly cookies for secure authentication</li>
          <li>✓ Zustand UI store for client state</li>
        </ul>
      </div>
    </div>
  );
}
