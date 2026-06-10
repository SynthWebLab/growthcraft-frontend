"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { Video, ChevronDown, Calendar } from "lucide-react";
import { useState } from "react";

const workshops = [
  {
    id: "1",
    title: "Advanced React Patterns Workshop",
    image: "⚛️",
    mode: "Online",
    nextSession: "Apr 18, 3:00 PM",
    mentor: "Sarah Johnson",
    totalSessions: 4,
    completedSessions: 1,
    recordings: [
      "Session 1 — Compound Components",
      "Session 2 — Render Props Pattern",
    ],
  },
  {
    id: "2",
    title: "UI/UX Design Thinking Workshop",
    image: "🎨",
    mode: "Hybrid",
    nextSession: "Apr 20, 11:00 AM",
    mentor: "Michael Chen",
    totalSessions: 6,
    completedSessions: 2,
    recordings: [
      "Session 1 — User Research Basics",
      "Session 2 — Wireframing Techniques",
    ],
  },
];

export default function StudentWorkshopsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Workshops"
        description="Track your enrolled workshops and recordings"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {workshops.map((ws) => (
          <DataCard key={ws.id}>
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">{ws.image}</span>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{ws.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{ws.mode}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {ws.completedSessions}/{ws.totalSessions} sessions
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-marble border border-border mb-4">
              <Calendar className="h-4 w-4 text-magenta" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Next: {ws.nextSession}
                </p>
                <p className="text-xs text-muted-foreground">
                  with {ws.mentor}
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
              onClick={() => setExpanded(expanded === ws.id ? null : ws.id)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expanded === ws.id ? "rotate-180" : ""
                }`}
              />
              Recordings ({ws.recordings.length})
            </button>

            {expanded === ws.id && (
              <div className="mt-3 space-y-2">
                {ws.recordings.map((rec, i) => (
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
