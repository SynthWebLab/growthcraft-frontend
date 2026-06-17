"use client";

import { PageHeader } from "@/components/ui/page-header";
import { KpiCard, ChartCard, StatusPill } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const enrollmentTrend = [
  { month: "Oct", students: 32 },
  { month: "Nov", students: 41 },
  { month: "Dec", students: 38 },
  { month: "Jan", students: 55 },
  { month: "Feb", students: 62 },
  { month: "Mar", students: 58 },
];

const topPerformers = [
  { name: "Priya Devi", course: "Data Science", progress: 96 },
  { name: "Amit Kumar", course: "React Bootcamp", progress: 94 },
  { name: "Meera Singh", course: "Career Readiness", progress: 92 },
  { name: "Rahul Sharma", course: "Full Stack Dev", progress: 88 },
  { name: "Sneha Gupta", course: "UI/UX Design", progress: 85 },
];

const recentActivity = [
  { text: "Ravi Patel enrolled in Full Stack Dev", time: "2 hours ago" },
  { text: "Priya Devi completed Module 8 — Data Science", time: "5 hours ago" },
  { text: "Sneha Gupta submitted assignment — UI/UX Design", time: "1 day ago" },
  { text: "Amit Kumar earned React Bootcamp certificate", time: "2 days ago" },
  { text: "3 new students enrolled in Career Readiness", time: "3 days ago" },
];

const CollegeDashboard = () => (
  <div className="space-y-8">
    <PageHeader
      title="College Dashboard"
      description="Overview of your campus partnership with GrowthCraft"
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard label="Total Students Enrolled" value={245} delta={12} />
      <KpiCard label="Active Courses" value={6} delta={8} />
      <div className="rounded-xl border border-border bg-white p-6">
        <p className="text-sm text-muted-foreground mb-1">Partnership Tier</p>
        <StatusPill variant="active" label="Gold" className="text-sm px-3 py-1" />
      </div>
      <KpiCard label="Avg Student Rating" value={4.6} suffix="/5" delta={3} />
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <ChartCard title="Enrollment Trend">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={enrollmentTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
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
          {topPerformers.map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-muted-foreground w-5">
                  #{i + 1}
                </span>
                <div className="h-8 w-8 rounded-full bg-lavender/10 text-lavender flex items-center justify-center text-xs font-bold">
                  {s.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.course}</p>
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
        {recentActivity.map((a, i) => (
          <div
            key={i}
            className="flex items-start gap-3 py-2 border-b border-border last:border-0"
          >
            <div className="h-2 w-2 rounded-full bg-lavender mt-1.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm">{a.text}</p>
              <p className="text-xs text-muted-foreground">{a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </DataCard>
  </div>
);

export default CollegeDashboard;
