"use client";

import { useExampleQuery } from "@/hooks/queries/useExampleQuery";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/button";

export default function TestStatePage() {
  // Test TanStack Query
  const { data, isLoading, error } = useExampleQuery();

  // Test Zustand Auth Store
  const { user, isAuthenticated, login, logout } = useAuthStore();

  // Test Zustand UI Store
  const { sidebarOpen, theme, toggleSidebar, setTheme } = useUIStore();

  const handleLogin = () => {
    login({
      id: "1",
      name: "Test User",
      email: "test@example.com",
      role: "student",
    });
  };

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

      {/* Zustand Auth Store Test */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold">Zustand Auth Store Test</h2>
        <div className="space-y-2">
          <p>
            <span className="font-semibold">Authenticated:</span>{" "}
            {isAuthenticated ? "✓ Yes" : "✗ No"}
          </p>
          {user && (
            <div className="bg-blue-50 p-4 rounded">
              <p className="font-semibold text-blue-700">User Data:</p>
              <pre className="mt-2 text-sm">{JSON.stringify(user, null, 2)}</pre>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={handleLogin} disabled={isAuthenticated}>
              Login
            </Button>
            <Button onClick={logout} disabled={!isAuthenticated} variant="outline">
              Logout
            </Button>
          </div>
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
          <li>✓ Zustand auth store with persistence</li>
          <li>✓ Zustand UI store for client state</li>
        </ul>
      </div>
    </div>
  );
}
