"use client";

import { useState } from "react";
import { Star, Calendar, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard, ChartCard } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMentorDashboard } from "@/hooks/queries/useMentor";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${i < rating ? "text-warning fill-warning" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const DashboardSkeleton = () => (
  <div className="space-y-8 animate-pulse">
    <div className="space-y-2">
      <div className="h-8 w-64 bg-muted/40 rounded" />
      <div className="h-4 w-96 bg-muted/40 rounded" />
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-muted/40 rounded-xl" />
      ))}
    </div>

    <div className="grid lg:grid-cols-2 gap-6">
      <div className="h-80 bg-muted/40 rounded-xl" />
      <div className="h-80 bg-muted/40 rounded-xl" />
    </div>

    <div className="h-64 bg-muted/40 rounded-xl" />
  </div>
);

export default function MentorDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Weekly");
  const { data: dashboardResponse, isLoading, error } = useMentorDashboard(selectedPeriod.toLowerCase());

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <p className="text-red-500 font-medium">Failed to load dashboard data</p>
        <p className="text-sm text-muted-foreground">
          {(error as any)?.message || "Please check your connection to the server."}
        </p>
      </div>
    );
  }

  const summary = dashboardResponse?.data;
  const counts = summary?.counts || {
    sessionsDelivered: 0,
    totalEarnings: 0,
    avgRating: 0,
    todaySessionsCount: 0,
  };
  const todaySessions = summary?.todaySessions || [];
  const earningsTrend = summary?.earningsTrend || [];
  const recentReviews = summary?.recentReviews || [];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome back, Mentor! 🧑‍🏫"
        description="Your mentoring overview"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KpiCard label="Sessions Delivered" value={counts.sessionsDelivered} />
        <KpiCard label="Total Earnings" value={counts.totalEarnings} prefix="₹" />
        <KpiCard label="Avg Rating" value={counts.avgRating} suffix="/5" />
        <KpiCard label="Today's Sessions" value={counts.todaySessionsCount} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <DataCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold font-display flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" /> Today&apos;s Calendar
            </h3>
            <Badge variant="outline" className="text-xs">
              {todaySessions.length} sessions
            </Badge>
          </div>
          
          {todaySessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No sessions scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-0">
              {todaySessions.map((s, i) => (
                <div
                  key={s.id || i}
                  className="flex items-center gap-4 py-3 border-b border-border last:border-0"
                >
                  <div className="w-20 text-sm font-mono text-muted-foreground">{s.time}</div>
                  <div className="h-8 w-0.5 bg-magenta rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground">{s.student}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.course} · {s.duration}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-magenta hover:bg-magenta/90 text-white text-xs"
                    onClick={() => window.open(s.meetingLink || "https://meet.google.com", "_blank")}
                  >
                    Join
                  </Button>
                </div>
              ))}
            </div>
          )}
        </DataCard>

        <ChartCard
          title="Earnings Trend"
          periods={["Weekly", "Monthly", "Yearly"]}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        >
          {earningsTrend.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[220px] text-center">
              <p className="text-sm font-medium text-muted-foreground">No earnings data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={earningsTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  formatter={(v) => [`₹${Number(v).toLocaleString()}`, "Earnings"]}
                />
                <Bar dataKey="amount" fill="hsl(var(--lavender))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <DataCard>
        <h3 className="text-base font-semibold font-display flex items-center gap-2 mb-4">
          <Star className="h-5 w-5 text-warning" /> Recent Reviews
        </h3>
        
        {recentReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Star className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">No reviews received yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentReviews.map((r, i) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {r.student
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium text-sm text-foreground">{r.student}</span>
                    <StarRating rating={r.rating} />
                  </div>
                  <p className="text-sm text-muted-foreground">{r.text}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {r.date}
                </span>
              </div>
            ))}
          </div>
        )}
      </DataCard>
    </div>
  );
}
