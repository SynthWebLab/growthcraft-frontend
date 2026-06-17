"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import PageHeader from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Video } from "lucide-react";

const upcomingSessions = [
  {
    id: 1,
    date: new Date(2026, 3, 14),
    time: "10:00 AM",
    mentor: "Rohit Sharma",
    topic: "React Performance",
    duration: "45 min",
    type: "1:1" as const,
  },
  {
    id: 2,
    date: new Date(2026, 3, 16),
    time: "2:00 PM",
    mentor: "Priya Patel",
    topic: "Data Pipelines",
    duration: "60 min",
    type: "Group" as const,
  },
  {
    id: 3,
    date: new Date(2026, 3, 20),
    time: "11:00 AM",
    mentor: "Amit Kumar",
    topic: "System Design Review",
    duration: "45 min",
    type: "1:1" as const,
  },
];

const mentors = [
  {
    id: 1,
    name: "Rohit Sharma",
    expertise: "Full Stack / React",
    avatar: "RS",
    slots: ["10:00 AM", "2:00 PM", "4:00 PM"],
  },
  {
    id: 2,
    name: "Priya Patel",
    expertise: "Data Science / ML",
    avatar: "PP",
    slots: ["9:00 AM", "1:00 PM", "3:00 PM"],
  },
  {
    id: 3,
    name: "Amit Kumar",
    expertise: "System Design",
    avatar: "AK",
    slots: ["11:00 AM", "3:00 PM"],
  },
];

export default function StudentMentorsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [bookOpen, setBookOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const sessionDates = upcomingSessions.map((s) => s.date);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mentor Sessions"
        description="Book and manage your mentorship sessions"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Calendar */}
        <DataCard>
          <h3 className="font-bold text-foreground mb-4">Session Calendar</h3>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md pointer-events-auto"
            modifiers={{ booked: sessionDates }}
            modifiersClassNames={{
              booked: "bg-magenta/10 text-magenta font-bold",
            }}
          />
          <Button
            className="w-full mt-4 bg-magenta text-white hover:bg-magenta/90"
            onClick={() => setBookOpen(true)}
          >
            Book New Session
          </Button>
        </DataCard>

        {/* Upcoming Sessions */}
        <DataCard>
          <h3 className="font-bold text-foreground mb-4">Upcoming Sessions</h3>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-4 p-4 rounded-lg border border-border bg-white"
              >
                <div className="h-10 w-10 rounded-full bg-lavender/20 flex items-center justify-center text-sm font-bold text-lavender shrink-0">
                  {session.mentor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-foreground">
                    {session.topic}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {session.mentor} ·{" "}
                    {session.date.toLocaleDateString("en-IN", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    at {session.time}
                  </p>
                </div>
                <Badge
                  variant={session.type === "1:1" ? "default" : "secondary"}
                  className={
                    session.type === "1:1" ? "bg-magenta text-white" : ""
                  }
                >
                  {session.type}
                </Badge>
                <Button size="sm" variant="outline">
                  <Video className="h-3.5 w-3.5 mr-1" /> Join
                </Button>
              </div>
            ))}
          </div>
        </DataCard>
      </div>

      {/* Book Session Modal */}
      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book a Mentor Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Select Mentor
              </label>
              <Select value={selectedMentor} onValueChange={setSelectedMentor}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((m) => (
                    <SelectItem key={m.id} value={m.name}>
                      {m.name} — {m.expertise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedMentor && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Select Time Slot
                </label>
                <Select value={selectedSlot} onValueChange={setSelectedSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {mentors
                      .find((m) => m.name === selectedMentor)
                      ?.slots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              className="w-full bg-magenta text-white hover:bg-magenta/90"
              disabled={!selectedMentor || !selectedSlot}
            >
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
