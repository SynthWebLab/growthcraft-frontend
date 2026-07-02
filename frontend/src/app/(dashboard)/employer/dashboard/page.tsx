"use client";

import Link from "next/link";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { KpiCard, ChartCard, StatusPill } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { useEmployerDashboard } from "@/hooks/queries/useEmployer";

const EmployerDashboard = () => {
  const { data: dashboard, isLoading, isError } = useEmployerDashboard();

  const funnelData = dashboard?.funnelData || [
    { stage: "Applied", count: 0 },
    { stage: "Shortlisted", count: 0 },
    { stage: "Interview", count: 0 },
    { stage: "Hired", count: 0 },
  ];

  const recentApps = dashboard?.recentApplications || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display">Hiring Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {isLoading ? "Loading..." : `${dashboard?.companyName || "Employer"} — talent pipeline overview`}
        </p>
      </div>

      {isError && (
        <p className="text-sm text-destructive">Couldn&apos;t load dashboard. Please try again.</p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Active Job Postings" value={isLoading ? 0 : dashboard?.kpis.activeJobs ?? 0} />
        <KpiCard label="Applications Received" value={isLoading ? 0 : dashboard?.kpis.applicationsReceived ?? 0} />
        <KpiCard label="Candidates Shortlisted" value={isLoading ? 0 : dashboard?.kpis.candidatesShortlisted ?? 0} />
        <KpiCard label="Hires Made" value={isLoading ? 0 : dashboard?.kpis.hiresMade ?? 0} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <ChartCard title="Application Funnel" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="stage" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={90} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--magenta))" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <DataCard>
          <h3 className="text-base font-semibold font-display mb-4">Pipeline Snapshot</h3>
          <div className="space-y-4">
            {funnelData.map((stage, i) => {
              const prev = i === 0 ? stage.count : funnelData[i - 1].count;
              const conversion = i === 0 || prev === 0 ? 100 : Math.round((stage.count / prev) * 100);
              const appliedCount = funnelData[0].count || 1;
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-foreground">{stage.stage}</span>
                    <span className="text-muted-foreground">{stage.count}</span>
                  </div>
                  <div className="h-1.5 bg-marble rounded-full overflow-hidden">
                    <div
                      className="h-full bg-magenta transition-all"
                      style={{ width: `${(stage.count / appliedCount) * 100}%` }}
                    />
                  </div>
                  {i > 0 && (
                    <p className="text-[10px] text-muted-foreground mt-1">{conversion}% from previous</p>
                  )}
                </div>
              );
            })}
          </div>
        </DataCard>
      </div>

      <DataCard>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold font-display">Recent Applications</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/employer/applications">View all</Link>
          </Button>
        </div>
        <div className="overflow-x-auto">
          {recentApps.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">No recent applications found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="pb-2 font-medium">Candidate</th>
                  <th className="pb-2 font-medium">Role</th>
                  <th className="pb-2 font-medium">Applied</th>
                  <th className="pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="py-3 flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-magenta/10 text-magenta flex items-center justify-center text-[10px] font-bold">
                        {app.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium text-foreground">{app.name}</span>
                    </td>
                    <td className="py-3 text-muted-foreground">{app.role}</td>
                    <td className="py-3 text-muted-foreground">{app.date}</td>
                    <td className="py-3"><StatusPill variant={app.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </DataCard>
    </div>
  );
};

export default EmployerDashboard;
