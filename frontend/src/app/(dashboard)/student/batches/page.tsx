"use client";

import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import DataCard from "@/components/ui/data-card";
import { useStudentBatches } from "@/hooks/queries/useStudent";
import { Calendar, MapPin, User, Mail, Layers, Loader2 } from "lucide-react";

interface StudentBatchItem {
  id: string;
  code: string;
  batchType: string;
  mode: string;
  venue: string;
  startDate: string;
  endDate: string;
  status: string;
  title: string;
  description: string;
  mentorName: string;
  mentorEmail: string;
}

export default function StudentBatchesPage() {
  const { data: response, isLoading, error } = useStudentBatches();

  const batches: StudentBatchItem[] = response?.data?.batches ?? [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return <Badge variant="secondary">{status}</Badge>;
      case "Open":
      case "Filling":
        return <Badge variant="default" className="bg-green-600 text-white hover:bg-green-700">{status}</Badge>;
      case "Full":
        return <Badge variant="outline" className="border-amber-500 text-amber-600">{status}</Badge>;
      case "InProgress":
        return <Badge variant="default" className="bg-blue-600 text-white hover:bg-blue-700">In Progress</Badge>;
      case "Completed":
        return <Badge variant="secondary" className="bg-gray-200 text-gray-700">{status}</Badge>;
      default:
        return <Badge variant="destructive">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted/40 rounded" />
          <div className="h-4 w-80 bg-muted/40 rounded" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-48 bg-muted/40 rounded-xl" />
          <div className="h-48 bg-muted/40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <p className="text-red-500 font-medium">Failed to load cohorts directory</p>
        <p className="text-sm text-muted-foreground">
          {(error as any)?.message || "Please check your connection to the server."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="My Cohorts & Batches 📚"
        description="View your active offline classes, timetables, venues, and contact assigned mentors."
      />

      {batches.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-xl bg-card">
          <Layers className="h-12 w-12 text-muted-foreground/30 mb-3" />
          <h3 className="font-semibold text-lg text-foreground">No batches assigned yet</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            Once you are placed into an operational cohort batch by the college admin, details will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {batches.map((batch) => (
            <DataCard key={batch.id} className="border-border/60 hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <span className="font-mono text-xs font-bold text-magenta bg-magenta/10 px-2 py-0.5 rounded">
                      {batch.code}
                    </span>
                    <h3 className="font-bold text-base text-foreground mt-2 leading-snug">
                      {batch.title}
                    </h3>
                    <p className="text-xs text-muted-foreground uppercase mt-0.5 tracking-wide">
                      {batch.batchType === "TrainingProgram" ? "Training Program" : batch.batchType}
                    </p>
                  </div>
                  {getStatusBadge(batch.status)}
                </div>

                <div className="space-y-2.5 my-4 border-t border-b border-border/50 py-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <span>
                      Timeline: {new Date(batch.startDate).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })} -{" "}
                      {new Date(batch.endDate).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    <span>
                      Venue: {batch.mode} ({batch.venue})
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-semibold text-muted-foreground mb-2">Assigned Mentor</p>
                <div className="flex items-center justify-between p-3 rounded-lg bg-marble/60 border border-border/50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      {batch.mentorName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{batch.mentorName}</p>
                      {batch.mentorEmail && (
                        <p className="text-[10px] text-muted-foreground truncate">{batch.mentorEmail}</p>
                      )}
                    </div>
                  </div>
                  {batch.mentorEmail && (
                    <a
                      href={`mailto:${batch.mentorEmail}`}
                      className="h-8 w-8 rounded-full border border-border bg-white hover:text-magenta hover:border-magenta flex items-center justify-center text-muted-foreground transition-all shrink-0 ml-2"
                      title="Email Mentor"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      )}
    </div>
  );
}
