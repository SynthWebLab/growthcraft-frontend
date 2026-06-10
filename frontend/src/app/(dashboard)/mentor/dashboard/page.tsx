import { LogoutButton } from "@/components/dashboard/LogoutButton";

export default async function MentorDashboard() {
  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome to your mentor panel</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}
