"use client";

import React from "react";
import {
  useAdminAnalytics,
  useAdminRevenue,
  useAdminAuditLogs,
} from "@/hooks/queries/useAdmin";
import { StatsCard } from "@/components/admin/StatsCard";
import {
  BookOpen,
  GraduationCap,
  Calendar,
  Users,
  TrendingUp,
  Building2,
  DollarSign,
  Briefcase,
  History,
  Award,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const enrollmentChartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function AdminDashboard() {
  // Real API Queries
  const { data: analyticsRes, isLoading: analyticsLoading } = useAdminAnalytics();
  const { data: revenueRes, isLoading: revenueLoading } = useAdminRevenue();
  const { data: auditRes, isLoading: auditLoading } = useAdminAuditLogs({ page: 1, limit: 5 });

  const analytics = analyticsRes?.data || {};
  const revenue = revenueRes?.data || {};
  const auditLogs = auditRes?.data || [];

  const usersByRole = analytics.usersByRole || {};
  const topCourses = analytics.topCourses || [];
  const monthlyTrends = analytics.monthlyTrends || [];

  const isLoading = analyticsLoading || revenueLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-sans">Admin Console</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Real-time operations, cohort performance, and billing metrics.
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`₹${(revenue.totalCollected || 0).toLocaleString()}`}
          icon={DollarSign}
        />
        <StatsCard
          title="Mentor Payout Costs"
          value={`₹${(revenue.totalMentorCosts || 0).toLocaleString()}`}
          icon={Users}
        />
        <StatsCard
          title="Gross Margin"
          value={`₹${(revenue.margin || 0).toLocaleString()}`}
          icon={TrendingUp}
          trend={{ value: revenue.marginPercent || 0, isPositive: (revenue.margin || 0) >= 0 }}
        />
        <StatsCard
          title="Total Enrollments"
          value={analytics.totalEnrollments || 0}
          icon={Award}
        />
      </div>

      {/* Role Counts */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2 md:mb-3">User Registrations by Portal</h3>
        <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Students</p>
                <h4 className="text-xl font-bold mt-1">{usersByRole.student || 0}</h4>
              </div>
              <GraduationCap className="h-8 w-8 text-primary/30 shrink-0" />
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Mentors</p>
                <h4 className="text-xl font-bold mt-1">{usersByRole.mentor || 0}</h4>
              </div>
              <Users className="h-8 w-8 text-indigo-500/30 shrink-0" />
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Colleges</p>
                <h4 className="text-xl font-bold mt-1">{usersByRole.college || 0}</h4>
              </div>
              <Building2 className="h-8 w-8 text-emerald-500/30 shrink-0" />
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Employers</p>
                <h4 className="text-xl font-bold mt-1">{usersByRole.employer || 0}</h4>
              </div>
              <Briefcase className="h-8 w-8 text-amber-500/30 shrink-0" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trends & Lists Section */}
      <div className="grid gap-4 md:gap-6 lg:grid-cols-3">
        {/* Top Cohorts table */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-lg sm:text-xl font-bold">Top Performing Cohorts</CardTitle>
            <CardDescription className="text-xs">Active training batches ranked by total confirmed student enrollments.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {topCourses.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No cohort data recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/40 font-medium">
                    <tr>
                      <th className="px-2 sm:px-4 py-2">Batch Code</th>
                      <th className="px-2 sm:px-4 py-2">Program / Course Name</th>
                      <th className="px-2 sm:px-4 py-2 text-right">Student Enrolled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {topCourses.map((c: any, index: number) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-2 sm:px-4 py-2.5 font-semibold text-xs font-mono">{c.batchCode}</td>
                        <td className="px-2 sm:px-4 py-2.5 text-xs">{c.title}</td>
                        <td className="px-2 sm:px-4 py-2.5 text-right text-xs font-bold text-primary">{c.enrollmentsCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit log overview */}
        <Card className="lg:col-span-1 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-2 sm:pb-3">
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold">System Activity</CardTitle>
              <CardDescription className="text-xs">Recent audit logs</CardDescription>
            </div>
            <History className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {auditLoading ? (
              <div className="text-center py-6">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto" />
              </div>
            ) : auditLogs.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No logs available.</p>
            ) : (
              <div className="space-y-4">
                {auditLogs.map((log: any) => (
                  <div key={log._id} className="text-xs pb-3 border-b border-border last:border-0">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-mono text-[9px] uppercase">
                        {log.action}
                      </Badge>
                      <span className="text-muted-foreground text-[10px]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-foreground text-[11px]">
                      By {log.performedBy?.fullName || "System"}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                      ID: {log.target}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly trends chart — shadcn BarChart */}
      {monthlyTrends.length > 0 && (
        <div className="grid gap-3 md:grid-cols-3">
          <Card className="md:col-span-2 overflow-hidden">
            <CardHeader className="px-4 pt-3 pb-1">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Enrollment Trends</CardTitle>
                  <CardDescription className="text-xs mt-0">
                    Last {monthlyTrends.length} month{monthlyTrends.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <TrendingUp className="h-3 w-3" />
                  {monthlyTrends.reduce((sum: number, t: any) => sum + (t.enrollments || 0), 0)}
                  <span className="font-normal text-muted-foreground">total</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-3">
              <ChartContainer config={enrollmentChartConfig} className="h-[120px] w-full">
                <BarChart accessibilityLayer data={monthlyTrends} margin={{ top: 2, right: 2, left: -24, bottom: 0 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={6}
                    axisLine={false}
                    tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value: string) => value.slice(0, 3)}
                  />
                  <YAxis
                    hide
                    domain={[0, (dataMax: number) => Math.max(dataMax + Math.ceil(dataMax * 0.2), 5)]}
                  />
                  <ChartTooltip
                    cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
                    content={<ChartTooltipContent hideLabel={false} />}
                  />
                  <Bar dataKey="enrollments" fill="var(--color-enrollments)" radius={[3, 3, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3 md:flex md:flex-col">
            <Card className="flex-1">
              <CardContent className="p-3 flex flex-col justify-center h-full gap-0.5">
                <p className="text-[11px] text-muted-foreground">Peak Month</p>
                <p className="text-lg font-bold text-foreground leading-tight">
                  {monthlyTrends.reduce((best: any, t: any) =>
                    (t.enrollments || 0) > (best.enrollments || 0) ? t : best, monthlyTrends[0]
                  ).month ?? "—"}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {Math.max(...monthlyTrends.map((t: any) => t.enrollments || 0))} enrollments
                </p>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-3 flex flex-col justify-center h-full gap-0.5">
                <p className="text-[11px] text-muted-foreground">Monthly Avg</p>
                <p className="text-lg font-bold text-foreground leading-tight">
                  {Math.round(
                    monthlyTrends.reduce((sum: number, t: any) => sum + (t.enrollments || 0), 0) /
                    Math.max(monthlyTrends.length, 1)
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground">per month</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
