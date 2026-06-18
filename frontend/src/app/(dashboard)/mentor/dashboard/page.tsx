"use client";

import { Star, Calendar } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { KpiCard, ChartCard } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const earningsData = [
  { month: "Nov", amount: 18000 },
  { month: "Dec", amount: 22000 },
  { month: "Jan", amount: 19500 },
  { month: "Feb", amount: 26000 },
  { month: "Mar", amount: 24000 },
  { month: "Apr", amount: 28500 },
];

const todaySessions = [
  { student: "Rahul S.", time: "10:00 AM", course: "React Masterclass", duration: "45 min" },
  { student: "Priya D.", time: "12:30 PM", course: "Full Stack Dev", duration: "60 min" },
  { student: "Amit K.", time: "3:00 PM", course: "React Masterclass", duration: "45 min" },
  { student: "Sneha G.", time: "5:00 PM", course: "Node.js Advanced", duration: "30 min" },
];

const recentReviews = [
  { student: "Rahul S.", rating: 5, text: "Amazing session! Very clear explanations.", date: "2 days ago" },
  { student: "Priya D.", rating: 5, text: "Helped me understand hooks deeply.", date: "3 days ago" },
  { student: "Amit K.", rating: 4, text: "Good pace, would love more examples.", date: "5 days ago" },
  { student: "Sneha G.", rating: 5, text: "Best mentor on the platform!", date: "1 week ago" },
  { student: "Vivek R.", rating: 4, text: "Very patient and knowledgeable.", date: "1 week ago" },
];

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

const MentorDashboard = () => (
  <div className="space-y-8">
    <PageHeader
      title="Welcome back, Mentor! 🧑‍🏫"
      description="Your mentoring overview"
    />

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <KpiCard label="Sessions Delivered" value={142} delta={12} />
      <KpiCard label="Total Earnings" value={138000} prefix="₹" delta={8} />
      <KpiCard label="Avg Rating" value={4.8} suffix="/5" delta={2} />
      <KpiCard label="Today's Sessions" value={4} />
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
        <div className="space-y-0">
          {todaySessions.map((s, i) => (
            <div
              key={i}
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
              >
                Join
              </Button>
            </div>
          ))}
        </div>
      </DataCard>

      <ChartCard title="Earnings Trend">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={earningsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              formatter={(v: number) => [`₹${v.toLocaleString()}`, "Earnings"]}
            />
            <Bar dataKey="amount" fill="hsl(var(--lavender))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>

    <DataCard>
      <h3 className="text-base font-semibold font-display flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-warning" /> Recent Reviews
      </h3>
      <div className="space-y-4">
        {recentReviews.map((r, i) => (
          <div
            key={i}
            className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
          >
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {r.student
                .split(" ")
                .map((n) => n[0])
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
    </DataCard>
  </div>
);

export default MentorDashboard;
