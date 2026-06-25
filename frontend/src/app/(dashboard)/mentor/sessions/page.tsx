"use client";

import { useState } from "react";
import { Video, List, CalendarDays, Clock, CheckCircle, XCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import DataCard from "@/components/ui/data-card";
import { StatusPill } from "@/components/panel";
import { useMentorSessions, useUpdateMentorSessionStatus } from "@/hooks/queries/useMentor";
import type { MentorSession } from "@/types/mentor";

const statusMap: Record<MentorSession["status"], "active" | "completed" | "cancelled"> = {
  upcoming: "active",
  completed: "completed",
  cancelled: "cancelled",
};

const SessionsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <div className="h-8 w-48 bg-muted/40 rounded" />
      <div className="h-4 w-80 bg-muted/40 rounded" />
    </div>
    <div className="h-10 w-full max-w-md bg-muted/40 rounded" />
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-20 bg-muted/40 rounded-lg" />
      ))}
    </div>
  </div>
);

const MentorSessions = () => {
  const [view, setView] = useState<"list" | "calendar">("list");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { data: sessionsResponse, isLoading, error } = useMentorSessions();
  const { mutate: updateSessionStatus } = useUpdateMentorSessionStatus();

  const sessions = sessionsResponse?.data?.sessions || [];

  const handleUpdateStatus = (sessionId: string, newStatus: "completed" | "cancelled") => {
    updateSessionStatus({ sessionId, status: newStatus });
  };

  const renderSessions = (filteredSessions: MentorSession[]) => (
    <div className="space-y-3 mt-4">
      {filteredSessions.length === 0 && (
        <p className="text-center text-muted-foreground py-12 text-sm">
          No sessions found.
        </p>
      )}
      {filteredSessions.map((s) => (
        <div
          key={s.id}
          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border border-border bg-white hover:bg-marble/50 transition-colors"
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
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
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
            <div className="text-left sm:text-right text-xs text-muted-foreground">
              <p className="font-medium text-foreground">{s.date}</p>
              <p className="flex items-center gap-1 sm:justify-end">
                <Clock className="h-3 w-3" /> {s.time} · {s.duration}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <StatusPill variant={statusMap[s.status]} />
              
              {s.status === "upcoming" && (
                <div className="flex items-center gap-1.5 ml-2">
                  {s.meetingLink && (
                    <Button
                      size="sm"
                      className="bg-magenta hover:bg-magenta/90 text-white text-xs"
                      onClick={() => window.open(s.meetingLink, "_blank")}
                    >
                      <Video className="h-3.5 w-3.5 mr-1" /> Join
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-success/30 text-success hover:bg-success/10 hover:text-success text-xs px-2"
                    title="Mark as Completed"
                    onClick={() => handleUpdateStatus(s.id, "completed")}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive text-xs px-2"
                    title="Cancel Session"
                    onClick={() => handleUpdateStatus(s.id, "cancelled")}
                  >
                    <XCircle className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (isLoading) {
    return <SessionsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <p className="text-red-500 font-medium">Failed to load sessions data</p>
        <p className="text-sm text-muted-foreground">
          {(error as any)?.message || "Please check your connection to the server."}
        </p>
      </div>
    );
  }

  const upcomingSessions = sessions.filter((s) => s.status === "upcoming");
  const pastSessions = sessions.filter((s) => s.status === "completed");
  const cancelledSessions = sessions.filter((s) => s.status === "cancelled");

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
            Upcoming ({upcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastSessions.length})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelledSessions.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {renderSessions(upcomingSessions)}
        </TabsContent>
        <TabsContent value="past">
          {renderSessions(pastSessions)}
        </TabsContent>
        <TabsContent value="cancelled">
          {renderSessions(cancelledSessions)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorSessions;
