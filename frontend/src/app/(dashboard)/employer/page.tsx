import { LogoutButton } from "@/components/dashboard/LogoutButton";

export default async function EmployerDashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Employer Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to your employer panel</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
