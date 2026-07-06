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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-sans">Admin Console</h1>
        <p className="text-muted-foreground mt-1">
          Real-time operations, cohort performance, and billing metrics.
        </p>
      </div>

      {/* Stats Cards Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">User Registrations by Portal</h3>
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Students</p>
                <h4 className="text-xl font-bold mt-1">{usersByRole.student || 0}</h4>
              </div>
              <GraduationCap className="h-8 w-8 text-primary/30" />
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Mentors</p>
                <h4 className="text-xl font-bold mt-1">{usersByRole.mentor || 0}</h4>
              </div>
              <Users className="h-8 w-8 text-indigo-500/30" />
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Colleges</p>
                <h4 className="text-xl font-bold mt-1">{usersByRole.college || 0}</h4>
              </div>
              <Building2 className="h-8 w-8 text-emerald-500/30" />
            </CardContent>
          </Card>

          <Card className="bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Employers</p>
                <h4 className="text-xl font-bold mt-1">{usersByRole.employer || 0}</h4>
              </div>
              <Briefcase className="h-8 w-8 text-amber-500/30" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trends & Lists Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Cohorts table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Cohorts</CardTitle>
            <CardDescription>Active training batches ranked by total confirmed student enrollments.</CardDescription>
          </CardHeader>
          <CardContent>
            {topCourses.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">No cohort data recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/40 font-medium">
                    <tr>
                      <th className="px-4 py-2">Batch Code</th>
                      <th className="px-4 py-2">Program / Course Name</th>
                      <th className="px-4 py-2 text-right">Student Enrolled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {topCourses.map((c: any, index: number) => (
                      <tr key={index} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-xs font-mono">{c.batchCode}</td>
                        <td className="px-4 py-3 text-xs">{c.title}</td>
                        <td className="px-4 py-3 text-right text-xs font-bold text-primary">{c.enrollmentsCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audit log overview */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>Recent audit logs</CardDescription>
            </div>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
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

      {/* Monthly trends chart visualizer */}
      {monthlyTrends.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trends</CardTitle>
            <CardDescription>Monthly student admissions ledger (Last 6 Months).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-36 pt-4 border-b border-border">
              {monthlyTrends.map((trend: any, index: number) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-xs font-bold text-primary mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {trend.enrollments}
                  </div>
                  <div
                    className="w-full bg-primary/80 rounded-t group-hover:bg-primary transition-all duration-300 min-h-[4px]"
                    style={{
                      height: `${Math.max(4, Math.min(100, (trend.enrollments / Math.max(...monthlyTrends.map((t: any) => t.enrollments || 1))) * 100))}%`,
                    }}
                  />
                  <div className="text-[10px] text-muted-foreground font-semibold mt-1">
                    {trend.month}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
