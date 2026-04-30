import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { TestTokenRefresh } from "@/components/dashboard/TestTokenRefresh";

export default async function StudentDashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to your student panel</p>
        </div>
        <LogoutButton />
      </div>
      
      <div className="max-w-2xl">
        <TestTokenRefresh />
      </div>
    </div>
  );
}
