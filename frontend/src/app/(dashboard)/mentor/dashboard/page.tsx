"use client";

import { useState, useEffect } from "react";
import { Star, Calendar, Loader2, Play, Square, Timer, CheckCircle, Users } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard, ChartCard } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  useMentorDashboard,
  useMentorBatches,
  useMentorCheckInStatus,
  useMentorCheckIn,
  useMentorCheckOut,
} from "@/hooks/queries/useMentor";
import Link from "next/link";
import { toast } from "sonner";
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
    <div className="h-32 bg-muted/40 rounded-xl" />
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-24 bg-muted/40 rounded-xl" />
      ))}
    </div>
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="h-80 bg-muted/40 rounded-xl" />
      <div className="h-80 bg-muted/40 rounded-xl" />
    </div>
  </div>
);

export default function MentorDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Weekly");
  const { data: dashboardResponse, isLoading: isDbLoading } = useMentorDashboard(selectedPeriod.toLowerCase());
  const { data: batchesResponse, isLoading: isBatchesLoading } = useMentorBatches();
  const { data: statusResponse, isLoading: isStatusLoading } = useMentorCheckInStatus();
  
  const checkInMutation = useMentorCheckIn();
  const checkOutMutation = useMentorCheckOut();

  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [checkOutNotes, setCheckOutNotes] = useState("");
  const [elapsedTime, setElapsedTime] = useState("00:00:00");

  const summary = dashboardResponse?.data;
  const counts = summary?.counts || {
    sessionsDelivered: 0,
    totalEarnings: 0,
    avgRating: 0,
    todaySessionsCount: 0,
  };
  const earningsTrend = summary?.earningsTrend || [];
  const activeCheckIn = statusResponse?.data?.status;
  const batches = batchesResponse?.data?.batches ?? [];
  const recentReviews = summary?.recentReviews || [];

  const activeCheckInBatchId = activeCheckIn?.batchId?._id || activeCheckIn?.batchId?.id;

  // Live Timer for Check-In duration
  useEffect(() => {
    if (!activeCheckIn?.checkedInAt) return;
    
    const interval = setInterval(() => {
      const start = new Date(activeCheckIn.checkedInAt).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, "0");
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0");
      const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, "0");
      
      setElapsedTime(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCheckIn]);

  const handleCheckIn = () => {
    if (!selectedBatchId) {
      toast.error("Please select a batch to check in to");
      return;
    }
    checkInMutation.mutate(selectedBatchId);
  };

  const handleCheckOut = () => {
    if (!activeCheckInBatchId) return;
    checkOutMutation.mutate(
      {
        batchId: activeCheckInBatchId,
        notes: checkOutNotes.trim() || undefined,
      },
      {
        onSuccess: () => {
          setCheckOutNotes("");
        },
      }
    );
  };

  if (isDbLoading || isBatchesLoading || isStatusLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Welcome back, Mentor! 🧑‍🏫"
        description="Your mentoring overview, session tracking, and offline class check-in dashboard."
      />

      {/* Check-In/Check-Out Interactive Banner */}
      <DataCard className="overflow-hidden border-magenta/20 bg-lavender/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${activeCheckIn ? "bg-magenta text-white animate-pulse" : "bg-marble text-muted-foreground"}`}>
              {activeCheckIn ? <Timer className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </div>
            <div>
              <h3 className="font-bold text-foreground text-base font-display">
                {activeCheckIn ? "Active Mentoring Session" : "Offline Class Check-In"}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {activeCheckIn
                  ? `Currently conducting session for Batch: ${activeCheckIn.batchId?.code || activeCheckIn.batchId?.batchName || "N/A"}`
                  : "Check in when you arrive at the campus batch session to track your mentoring hours."}
              </p>
              {activeCheckIn && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="font-mono bg-magenta/10 text-magenta border-none text-xs px-2 py-0.5">
                    Elapsed: {elapsedTime}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Started at: {new Date(activeCheckIn.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {activeCheckIn ? (
              <div className="flex flex-col gap-2">
                <Textarea
                  placeholder="Optional session notes / progress summary..."
                  value={checkOutNotes}
                  onChange={(e) => setCheckOutNotes(e.target.value)}
                  className="h-14 min-w-[200px] text-xs bg-white"
                />
                <Button
                  onClick={handleCheckOut}
                  disabled={checkOutMutation.isPending}
                  className="bg-magenta hover:bg-magenta/90 text-white gap-1.5 h-10 w-full"
                >
                  {checkOutMutation.isPending ? "Checking out..." : "Check Out"} <Square className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 items-stretch">
                <select
                  value={selectedBatchId}
                  onChange={(e) => setSelectedBatchId(e.target.value)}
                  className="h-10 rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-magenta min-w-[200px]"
                >
                  <option value="">-- Select Active Batch --</option>
                  {batches.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      {b.code} - {b.title || b.batchName || "Program"}
                    </option>
                  ))}
                </select>
                <Button
                  onClick={handleCheckIn}
                  disabled={checkInMutation.isPending || !selectedBatchId}
                  className="bg-magenta hover:bg-magenta/90 text-white gap-1.5 h-10"
                >
                  {checkInMutation.isPending ? "Checking in..." : "Check In"} <Play className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </DataCard>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <KpiCard label="Sessions Logged" value={counts.sessionsDelivered} />
        <KpiCard label="Total Earnings" value={counts.totalEarnings} prefix="₹" />
        <KpiCard label="Avg Rating" value={counts.avgRating} suffix="/5" />
        <KpiCard label="Assigned Batches" value={batches.length} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Batches List */}
        <DataCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold font-display flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Active Cohorts
            </h3>
            <Badge variant="outline" className="text-xs">
              {batches.length} assigned
            </Badge>
          </div>
          
          {batches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-8 w-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">No active batches assigned</p>
            </div>
          ) : (
            <div className="space-y-3">
              {batches.slice(0, 5).map((batch: any, i: number) => (
                <div
                  key={batch.id || i}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-semibold text-sm text-foreground">{batch.code} - {batch.title || batch.batchName || "Program"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {batch.studentCount || batch.studentsCount || 0} students
                    </p>
                  </div>
                  <Link href={`/mentor/sessions?batchId=${batch.id}`}>
                    <Button size="sm" variant="outline" className="text-xs hover:text-magenta hover:border-magenta">
                      Manage Cohort
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </DataCard>

        {/* Earnings chart */}
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
                <Bar dataKey="amount" fill="hsl(var(--magenta))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      <DataCard className="mt-6">
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
            {recentReviews.map((r: any, i: number) => (
              <div
                key={i}
                className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
              >
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {r.student
                    ?.split(" ")
                    ?.map((n: string) => n[0])
                    ?.join("")}
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
