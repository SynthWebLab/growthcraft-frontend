"use client";
import { useState } from "react";

import { PageHeader } from "@/components/ui/page-header";
import { KpiCard, ChartCard, StatusPill } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import { useCollegeDashboard } from "@/hooks/queries/useCollege";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CollegeDashboard = () => {
  const { data, isLoading, isError } = useCollegeDashboard();
  const dashboard = data?.data;
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Weekly");

  return (
    <div className="space-y-8">
      <PageHeader
        title="College Dashboard"
        description="Overview of your campus partnership with GrowthCraft"
      />

      {isError && (
        <p className="text-sm text-destructive">Couldn&apos;t load dashboard. Please try again.</p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total Students Enrolled"
          value={isLoading ? 0 : dashboard?.kpis.totalStudentsEnrolled ?? 0}
        />
        <KpiCard label="Active Courses/Events" value={isLoading ? 0 : dashboard?.kpis.activeCourses ?? 0} />
        <div className="rounded-xl border border-border bg-white p-6">
          <p className="text-sm text-muted-foreground mb-1">Partnership Tier</p>
          <StatusPill
            variant="active"
            label={dashboard?.kpis.partnershipTier ?? "—"}
            className="text-sm px-3 py-1"
          />
        </div>
        <KpiCard
          label="Cohort Remaining"
          value={dashboard?.kpis.cohortRemaining ?? 0}
          suffix={dashboard?.kpis.cohortLimit ? `/${dashboard.kpis.cohortLimit}` : ""}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ChartCard
          title="Enrollment Trend"
          periods={["Weekly", "Monthly", "Yearly"]}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        >
          <ResponsiveContainer width="100%" height={240}>
            <LineChart
              data={
                dashboard?.enrollmentTrend?.[
                  selectedPeriod.toLowerCase() as "weekly" | "monthly" | "yearly"
                ] ?? []
              }
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="students"
                stroke="hsl(var(--lavender))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--lavender))", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <DataCard>
          <h3 className="text-base font-semibold font-display mb-4">Top Performers</h3>
          <div className="space-y-3">
            {(dashboard?.topPerformers ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">No student activity yet.</p>
            )}
            {(dashboard?.topPerformers ?? []).map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5">#{i + 1}</span>
                  <div className="h-8 w-8 rounded-full bg-lavender/10 text-lavender flex items-center justify-center text-xs font-bold">
                    {s.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.course || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-muted rounded-full h-1.5">
                    <div
                      className="bg-magenta rounded-full h-1.5"
                      style={{ width: `${s.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-magenta w-8 text-right">
                    {s.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DataCard>
      </div>

      <DataCard>
        <h3 className="text-base font-semibold font-display mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {(dashboard?.recentActivity ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          )}
          {(dashboard?.recentActivity ?? []).map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-3 py-2 border-b border-border last:border-0"
            >
              <div className="h-2 w-2 rounded-full bg-lavender mt-1.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(a.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DataCard>
    </div>
  );
};

export default CollegeDashboard;
