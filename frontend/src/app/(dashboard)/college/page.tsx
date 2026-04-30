import { LogoutButton } from "@/components/dashboard/LogoutButton";

export default async function CollegeDashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">College Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to your college panel</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
