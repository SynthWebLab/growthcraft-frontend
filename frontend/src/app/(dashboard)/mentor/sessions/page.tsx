"use client";

import { useState } from "react";
import { Video, List, CalendarDays, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import DataCard from "@/components/ui/data-card";
import { StatusPill } from "@/components/panel";

type Session = {
  id: number;
  student: string;
  course: string;
  date: string;
  time: string;
  duration: string;
  status: "upcoming" | "completed" | "cancelled";
};

const allSessions: Session[] = [
  { id: 1, student: "Rahul S.", course: "React Masterclass", date: "Apr 16, 2026", time: "10:00 AM", duration: "45 min", status: "upcoming" },
  { id: 2, student: "Priya D.", course: "Full Stack Dev", date: "Apr 16, 2026", time: "12:30 PM", duration: "60 min", status: "upcoming" },
  { id: 3, student: "Amit K.", course: "React Masterclass", date: "Apr 17, 2026", time: "3:00 PM", duration: "45 min", status: "upcoming" },
  { id: 4, student: "Sneha G.", course: "Node.js Advanced", date: "Apr 18, 2026", time: "5:00 PM", duration: "30 min", status: "upcoming" },
  { id: 5, student: "Vivek R.", course: "React Masterclass", date: "Apr 10, 2026", time: "10:00 AM", duration: "45 min", status: "completed" },
  { id: 6, student: "Neha P.", course: "Full Stack Dev", date: "Apr 9, 2026", time: "2:00 PM", duration: "60 min", status: "completed" },
  { id: 7, student: "Karan M.", course: "Node.js Advanced", date: "Apr 8, 2026", time: "11:00 AM", duration: "30 min", status: "completed" },
  { id: 8, student: "Pooja L.", course: "React Masterclass", date: "Apr 7, 2026", time: "4:00 PM", duration: "45 min", status: "cancelled" },
];

const statusMap: Record<Session["status"], "active" | "completed" | "cancelled"> = {
  upcoming: "active",
  completed: "completed",
  cancelled: "cancelled",
};

const MentorSessions = () => {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const renderSessions = (sessions: Session[]) => (
    <div className="space-y-3 mt-4">
      {sessions.length === 0 && (
        <p className="text-center text-muted-foreground py-8 text-sm">
          No sessions found.
        </p>
      )}
      {sessions.map((s) => (
        <div
          key={s.id}
          className="flex items-center gap-4 p-4 rounded-lg border border-border bg-white hover:bg-marble/50 transition-colors"
        >
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
            {s.student
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-foreground">{s.student}</p>
            <p className="text-xs text-muted-foreground">{s.course}</p>
          </div>
          <div className="text-right text-xs text-muted-foreground hidden sm:block">
            <p className="font-medium text-foreground">{s.date}</p>
            <p className="flex items-center gap-1 justify-end">
              <Clock className="h-3 w-3" /> {s.time} · {s.duration}
            </p>
          </div>
          <StatusPill variant={statusMap[s.status]} />
          {s.status === "upcoming" && (
            <Button
              size="sm"
              className="bg-magenta hover:bg-magenta/90 text-white text-xs"
            >
              <Video className="h-3.5 w-3.5 mr-1" /> Join
            </Button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sessions"
        description="Manage your mentoring sessions"
        action={
          <div className="flex gap-2">
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4 mr-1" /> List
            </Button>
            <Button
              variant={view === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("calendar")}
            >
              <CalendarDays className="h-4 w-4 mr-1" /> Calendar
            </Button>
          </div>
        }
      />

      {view === "calendar" && (
        <DataCard className="flex justify-center">
          <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
        </DataCard>
      )}

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({allSessions.filter((s) => s.status === "upcoming").length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({allSessions.filter((s) => s.status === "completed").length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({allSessions.filter((s) => s.status === "cancelled").length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {renderSessions(allSessions.filter((s) => s.status === "upcoming"))}
        </TabsContent>
        <TabsContent value="past">
          {renderSessions(allSessions.filter((s) => s.status === "completed"))}
        </TabsContent>
        <TabsContent value="cancelled">
          {renderSessions(allSessions.filter((s) => s.status === "cancelled"))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorSessions;
