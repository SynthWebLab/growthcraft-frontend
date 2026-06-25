"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { PageHeader } from "@/components/ui/page-header";
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
import { Users, Star, Video } from "lucide-react";
import {
  useStudentMentors,
  useStudentMentorSessions,
  useBookMentorSession,
} from "@/hooks/queries/useStudent";
import { resolveRef, formatDate } from "@/lib/student-dashboard.utils";
import type { Mentor } from "@/types/student";

const DEFAULT_SLOTS = ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"];

function mentorName(mentor: Mentor): string {
  return mentor.userId?.fullName || "Mentor";
}

function mentorInitials(mentor: Mentor): string {
  const name = mentorName(mentor);
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function slotsFor(mentor: Mentor | undefined, selectedDate: Date | undefined): string[] {
  if (!mentor) return [];
  if (!selectedDate) return [];

  // 1. Try date-specific slots first
  const dateKey = selectedDate.getFullYear() + "-" + 
    (selectedDate.getMonth() + 1).toString().padStart(2, "0") + "-" + 
    selectedDate.getDate().toString().padStart(2, "0"); // YYYY-MM-DD local format
  
  const dateAvail = mentor.availability?.find((a) => {
    if (!a.date) return false;
    const d = new Date(a.date);
    const ymd = d.getFullYear() + "-" + 
      (d.getMonth() + 1).toString().padStart(2, "0") + "-" + 
      d.getDate().toString().padStart(2, "0");
    return ymd === dateKey;
  });

  if (dateAvail) {
    return dateAvail.slots.map((s) => s.startTime).filter(Boolean);
  }

  // 2. Fall back to recurring day-of-week slots
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = daysOfWeek[selectedDate.getDay()];

  const dayAvail = mentor.availability?.find(
    (a) => a.day && a.day.toLowerCase() === dayName.toLowerCase()
  );

  if (!dayAvail) return [];

  const slots = dayAvail.slots.map((s) => s.startTime).filter(Boolean);
  return slots;
}

export default function StudentMentorsPage() {
  const { data: mentorsData, isLoading: mentorsLoading } = useStudentMentors();
  const { data: sessionsData, isLoading: sessionsLoading } = useStudentMentorSessions();
  const bookSession = useBookMentorSession();

  const mentors = useMemo(
    // Only mentors with a valid user can be booked.
    () => (mentorsData?.data?.mentors ?? []).filter((m) => m.userId?._id),
    [mentorsData]
  );
  const sessions = sessionsData?.data?.sessions ?? [];
  const upcoming = sessions.filter((s) => s.status === "scheduled");

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [bookOpen, setBookOpen] = useState(false);
  const [mentorUserId, setMentorUserId] = useState("");
  const [topic, setTopic] = useState("");
  const [slot, setSlot] = useState("");

  const sessionDates = upcoming.map((s) => new Date(s.scheduledDate));
  const selectedMentor = mentors.find((m) => m.userId?._id === mentorUserId);

  const openBooking = (preselectMentorId?: string) => {
    setMentorUserId(preselectMentorId ?? "");
    setTopic("");
    setSlot("");
    setBookOpen(true);
  };

  const confirmBooking = () => {
    if (!mentorUserId || !slot || !topic || !selectedDate) return;
    bookSession.mutate(
      {
        mentorUserId,
        topic,
        timeSlot: slot,
        scheduledDate: selectedDate.toISOString(),
      },
      {
        onSuccess: (res) => {
          if (res.success) setBookOpen(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mentor Sessions"
        description="Book and manage your mentorship sessions"
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Calendar + book */}
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
            onClick={() => openBooking()}
            disabled={mentorsLoading || mentors.length === 0}
          >
            Book New Session
          </Button>
          {!mentorsLoading && mentors.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              No mentors are available to book right now.
            </p>
          )}
        </DataCard>

        {/* Upcoming sessions */}
        <DataCard>
          <h3 className="font-bold text-foreground mb-4">Upcoming Sessions</h3>
          {sessionsLoading ? (
            <div className="space-y-3">
              {[0, 1].map((i) => (
                <div key={i} className="h-16 rounded-lg border border-border bg-white animate-pulse" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No upcoming sessions. Book one to get started!
            </p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((session) => {
                const mentor = resolveRef(session.mentorUserId);
                const name = mentor?.fullName || "Mentor";
                return (
                  <div
                    key={session._id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-white"
                  >
                    <div className="h-10 w-10 rounded-full bg-lavender/20 flex items-center justify-center text-sm font-bold text-lavender shrink-0">
                      {name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {session.topic}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {name} · {formatDate(session.scheduledDate)} at {session.timeSlot}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Badge
                        variant={session.sessionType === "1:1" ? "default" : "secondary"}
                        className={session.sessionType === "1:1" ? "bg-magenta text-white" : ""}
                      >
                        {session.sessionType}
                      </Badge>
                      <Button
                        size="sm"
                        className="bg-magenta hover:bg-magenta/90 text-white text-xs gap-1"
                        onClick={() => window.open(session.meetingLink || "https://meet.google.com", "_blank")}
                      >
                        <Video className="h-3.5 w-3.5" /> Join
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DataCard>
      </div>

      {/* Available mentors */}
      <DataCard>
        <h3 className="font-bold text-foreground mb-4">Available Mentors</h3>
        {mentorsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 rounded-lg border border-border bg-white animate-pulse" />
            ))}
          </div>
        ) : mentors.length === 0 ? (
          <div className="flex flex-col items-center text-center py-8 text-muted-foreground">
            <Users className="h-10 w-10 mb-3" />
            <p className="text-sm">No mentors available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor) => (
              <div key={mentor._id} className="rounded-lg border border-border bg-white p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-lavender/20 flex items-center justify-center text-sm font-bold text-lavender shrink-0">
                    {mentorInitials(mentor)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {mentorName(mentor)}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {mentor.areaOfExpertise}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                  {mentor.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      {mentor.rating.toFixed(1)}
                    </span>
                  )}
                  <span>{mentor.experienceYears}+ yrs</span>
                  {mentor.currentOrganization && (
                    <span className="truncate">· {mentor.currentOrganization}</span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => openBooking(mentor.userId?._id)}
                >
                  Book Session
                </Button>
              </div>
            ))}
          </div>
        )}
      </DataCard>

      {/* Booking modal */}
      <Dialog open={bookOpen} onOpenChange={setBookOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book a Mentor Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="mb-2 block">Select Mentor</Label>
              <Select value={mentorUserId} onValueChange={setMentorUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.map((m) => (
                    <SelectItem key={m._id} value={m.userId!._id}>
                      {mentorName(m)} — {m.areaOfExpertise}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block">Topic</Label>
              <Input
                placeholder="What would you like to discuss?"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <Label className="mb-2 block">
                Date: {selectedDate ? formatDate(selectedDate.toISOString()) : "Pick a date on the calendar"}
              </Label>
            </div>

            {mentorUserId && (
              <div>
                <Label className="mb-2 block">Select Time Slot</Label>
                <Select value={slot} onValueChange={setSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {slotsFor(selectedMentor, selectedDate).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              className="w-full bg-magenta text-white hover:bg-magenta/90"
              disabled={!mentorUserId || !slot || !topic || !selectedDate || bookSession.isPending}
              onClick={confirmBooking}
            >
              {bookSession.isPending ? "Booking..." : "Confirm Booking"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
