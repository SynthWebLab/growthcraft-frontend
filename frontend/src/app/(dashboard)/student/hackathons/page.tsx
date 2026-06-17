"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { Video, ChevronDown, Calendar, Trophy } from "lucide-react";
import { useState } from "react";

const hackathons = [
  {
    id: "1",
    title: "AI Innovation Hackathon 2026",
    image: "🤖",
    mode: "Online",
    nextSession: "Apr 22, 9:00 AM",
    mentor: "David Lee",
    totalSessions: 3,
    completedSessions: 0,
    recordings: [],
    status: "upcoming",
  },
  {
    id: "2",
    title: "Web3 Building Challenge",
    image: "🔗",
    mode: "Hybrid",
    nextSession: "May 5, 10:00 AM",
    mentor: "Emma Watson",
    totalSessions: 5,
    completedSessions: 5,
    recordings: [
      "Day 1 — Kickoff & Team Formation",
      "Day 2 — Smart Contract Development",
      "Day 3 — Final Presentations",
    ],
    status: "completed",
    award: "2nd Place",
  },
];

export default function StudentHackathonsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Hackathons"
        description="Track your hackathon participation and recordings"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {hackathons.map((hack) => (
          <DataCard key={hack.id}>
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">{hack.image}</span>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">{hack.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{hack.mode}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {hack.completedSessions}/{hack.totalSessions} days
                  </span>
                  {hack.award && (
                    <Badge className="bg-success/10 text-success">
                      <Trophy className="h-3 w-3 mr-1" /> {hack.award}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-marble border border-border mb-4">
              <Calendar className="h-4 w-4 text-magenta" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {hack.status === "completed" ? "Completed" : `Next: ${hack.nextSession}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {hack.status === "completed" ? "All sessions done" : `with ${hack.mentor}`}
                </p>
              </div>
              {hack.status !== "completed" && (
                <Button
                  size="sm"
                  className="ml-auto bg-magenta text-white hover:bg-magenta/90"
                >
                  <Video className="h-3.5 w-3.5 mr-1.5" /> Join
                </Button>
              )}
            </div>

            {hack.recordings.length > 0 && (
              <>
                <button
                  onClick={() => setExpanded(expanded === hack.id ? null : hack.id)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expanded === hack.id ? "rotate-180" : ""
                    }`}
                  />
                  Recordings ({hack.recordings.length})
                </button>

                {expanded === hack.id && (
                  <div className="mt-3 space-y-2">
                    {hack.recordings.map((rec, i) => (
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
              </>
            )}
          </DataCard>
        ))}
      </div>
    </div>
  );
}
