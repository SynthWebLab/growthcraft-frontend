"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { Video, ChevronDown, Calendar } from "lucide-react";
import { useState } from "react";

const bootcamps = [
  {
    id: "1",
    title: "MERN Full Stack Bootcamp",
    image: "🌐",
    mode: "Online",
    nextSession: "Apr 14, 10:00 AM",
    mentor: "Rohit Sharma",
    totalSessions: 20,
    completedSessions: 8,
    recordings: [
      "Day 1 — Intro to Node.js",
      "Day 2 — Express Basics",
      "Day 3 — MongoDB Setup",
      "Day 4 — REST APIs",
    ],
  },
  {
    id: "2",
    title: "Data Science Intensive",
    image: "📊",
    mode: "Hybrid",
    nextSession: "Apr 16, 2:00 PM",
    mentor: "Priya Patel",
    totalSessions: 15,
    completedSessions: 3,
    recordings: ["Day 1 — Python Review", "Day 2 — NumPy & Pandas"],
  },
];

export default function StudentBootcampsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Bootcamps"
        description="Track your live bootcamp sessions and recordings"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {bootcamps.map((bc) => (
          <DataCard key={bc.id}>
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">{bc.image}</span>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{bc.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{bc.mode}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {bc.completedSessions}/{bc.totalSessions} sessions
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-marble border border-border mb-4">
              <Calendar className="h-4 w-4 text-magenta" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Next: {bc.nextSession}
                </p>
                <p className="text-xs text-muted-foreground">
                  with {bc.mentor}
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
              onClick={() => setExpanded(expanded === bc.id ? null : bc.id)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  expanded === bc.id ? "rotate-180" : ""
                }`}
              />
              Recordings ({bc.recordings.length})
            </button>

            {expanded === bc.id && (
              <div className="mt-3 space-y-2">
                {bc.recordings.map((rec, i) => (
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
