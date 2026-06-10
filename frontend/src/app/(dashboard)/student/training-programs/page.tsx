"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { Video, ChevronDown, Calendar } from "lucide-react";
import { useState } from "react";

const trainingPrograms = [
  {
    id: "1",
    title: "Professional Soft Skills Training",
    image: "💼",
    mode: "Online",
    nextSession: "Apr 25, 4:00 PM",
    mentor: "Jessica Brown",
    totalSessions: 8,
    completedSessions: 3,
    recordings: [
      "Session 1 — Communication Excellence",
      "Session 2 — Leadership Fundamentals",
      "Session 3 — Time Management",
    ],
  },
  {
    id: "2",
    title: "Industry Readiness Program",
    image: "🎯",
    mode: "Hybrid",
    nextSession: "Apr 28, 1:00 PM",
    mentor: "Robert Wilson",
    totalSessions: 12,
    completedSessions: 6,
    recordings: [
      "Session 1 — Interview Preparation",
      "Session 2 — Resume Building",
      "Session 3 — Portfolio Development",
      "Session 4 — Networking Skills",
      "Session 5 — Personal Branding",
      "Session 6 — Mock Interviews",
    ],
  },
];

export default function StudentTrainingProgramsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Training Programs"
        description="Track your professional development programs and recordings"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {trainingPrograms.map((tp) => (
          <DataCard key={tp.id}>
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">{tp.image}</span>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{tp.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{tp.mode}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {tp.completedSessions}/{tp.totalSessions} sessions
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-marble border border-border mb-4">
              <Calendar className="h-4 w-4 text-magenta" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Next: {tp.nextSession}
                </p>
                <p className="text-xs text-muted-foreground">
                  with {tp.mentor}
                </p>
              </div>
              <Button
                size="sm"
                className="ml-auto bg-magenta text-white hover:bg-magenta/90"
              >
                <Video className="h-3.5 w-3.5 mr-1.5" /> Join
              </Button>
            </div>

            <button
              onClick={() => setExpanded(expanded === tp.id ? null : tp.id)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expanded === tp.id ? "rotate-180" : ""
                }`}
              />
              Recordings ({tp.recordings.length})
            </button>

            {expanded === tp.id && (
              <div className="mt-3 space-y-2">
                {tp.recordings.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-white"
                  >
                    <Video className="h-4 w-4 text-lavender" />
                    <span className="text-sm text-foreground flex-1">
                      {rec}
                    </span>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Watch
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </DataCard>
        ))}
      </div>
    </div>
  );
}
