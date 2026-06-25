"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import DataCard from "@/components/ui/data-card";
import { CalendarDays, Trash2, Clock } from "lucide-react";
import { useMentorAvailability, useUpdateMentorAvailability } from "@/hooks/queries/useMentor";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM – 8 PM

const formatHourLabel = (h: number) => {
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
};

const getDateKey = (d: Date | undefined) => {
  if (!d) return "";
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const AvailabilitySkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <div className="h-8 w-48 bg-muted/40 rounded" />
      <div className="h-4 w-80 bg-muted/40 rounded" />
    </div>
    <div className="grid gap-6 md:grid-cols-[1.1fr_1.2fr]">
      <div className="space-y-4">
        <div className="h-80 bg-muted/40 rounded-xl" />
        <div className="h-48 bg-muted/40 rounded-xl" />
      </div>
      <div className="space-y-4">
        <div className="h-80 bg-muted/40 rounded-xl" />
        <div className="h-32 bg-muted/40 rounded-xl" />
      </div>
    </div>
  </div>
);

const MentorAvailability = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dateSlots, setDateSlots] = useState<Record<string, string[]>>({});
  const [rate, setRate] = useState("1500");

  const { data: availabilityResponse, isLoading, error } = useMentorAvailability();
  const { mutate: updateAvailability, isPending: isSaving } = useUpdateMentorAvailability();

  useEffect(() => {
    if (availabilityResponse?.data) {
      const avail = availabilityResponse.data.availability || [];
      const loadedSlots: Record<string, string[]> = {};

      avail.forEach((slotData: any) => {
        if (slotData.date) {
          const d = new Date(slotData.date);
          if (!isNaN(d.getTime())) {
            const dateKey = getDateKey(d);
            const slotTimes = Array.isArray(slotData.slots)
              ? slotData.slots.map((s: any) => s.startTime)
              : [];
            loadedSlots[dateKey] = slotTimes;
          }
        } else if (slotData.day) {
          // Loaded legacy day-of-week slots
          const dateKey = slotData.day;
          const slotTimes = Array.isArray(slotData.slots)
            ? slotData.slots.map((s: any) => s.startTime)
            : [];
          loadedSlots[dateKey] = slotTimes;
        }
      });

      setDateSlots(loadedSlots);
      setRate(availabilityResponse.data.hourlyRate?.toString() || "1500");
    }
  }, [availabilityResponse]);

  const handleToggleSlot = (time: string) => {
    if (!selectedDate) return;
    const dateKey = getDateKey(selectedDate);
    setDateSlots((prev) => {
      const current = prev[dateKey] || [];
      const updated = current.includes(time)
        ? current.filter((t) => t !== time)
        : [...current, time].sort();
      return { ...prev, [dateKey]: updated };
    });
  };

  const handleDeleteDateSchedule = (dateKey: string) => {
    setDateSlots((prev) => {
      const copy = { ...prev };
      delete copy[dateKey];
      return copy;
    });
  };

  const handleSave = () => {
    const hourlyRate = parseFloat(rate);
    if (isNaN(hourlyRate) || hourlyRate < 0) {
      toast.error("Hourly rate must be a non-negative number");
      return;
    }

    const availability = Object.entries(dateSlots)
      .filter(([_, slots]) => slots.length > 0)
      .map(([dateKey, slots]) => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        if (days.includes(dateKey)) {
          // Send legacy day-based format
          return {
            day: dateKey,
            slots: slots.map((time) => {
              const hour = parseInt(time.split(":")[0], 10);
              const startStr = `${hour.toString().padStart(2, "0")}:00`;
              const endStr = `${(hour + 1).toString().padStart(2, "0")}:00`;
              return { startTime: startStr, endTime: endStr };
            }),
          };
        } else {
          // Send date-based format
          const [y, m, d] = dateKey.split("-").map(Number);
          const localDate = new Date(y, m - 1, d, 0, 0, 0, 0);
          return {
            date: localDate.toISOString(),
            slots: slots.map((time) => {
              const hour = parseInt(time.split(":")[0], 10);
              const startStr = `${hour.toString().padStart(2, "0")}:00`;
              const endStr = `${(hour + 1).toString().padStart(2, "0")}:00`;
              return { startTime: startStr, endTime: endStr };
            }),
          };
        }
      });

    updateAvailability({ availability, hourlyRate });
  };

  if (isLoading) {
    return <AvailabilitySkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <p className="text-red-500 font-medium">Failed to load availability schedule</p>
        <p className="text-sm text-muted-foreground">
          {(error as any)?.message || "Please check your connection to the server."}
        </p>
      </div>
    );
  }

  const selectedDateKey = getDateKey(selectedDate);
  const selectedDateSlots = dateSlots[selectedDateKey] || [];

  const activeDates = Object.entries(dateSlots)
    .filter(([_, slots]) => slots.length > 0)
    .map(([dateKey]) => {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      if (days.includes(dateKey)) return null;
      const [y, m, d] = dateKey.split("-").map(Number);
      return new Date(y, m - 1, d);
    })
    .filter(Boolean) as Date[];

  const activeDateStrings = Object.keys(dateSlots)
    .filter((dateKey) => dateSlots[dateKey]?.length > 0)
    .sort();

  const formatDateLabel = (dateKey: string) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    if (days.includes(dateKey)) {
      return dateKey;
    }
    const [y, m, d] = dateKey.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    if (isNaN(dateObj.getTime())) return "Invalid Date";
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Availability"
        description="Select a date from the calendar to configure your available hourly slots."
      />

      <div className="grid gap-6 md:grid-cols-[1.1fr_1.2fr]">
        <div className="space-y-6">
          <DataCard>
            <h3 className="font-bold text-foreground mb-4">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md pointer-events-auto"
              modifiers={{ hasSlots: activeDates }}
              modifiersClassNames={{
                hasSlots: "bg-magenta/20 text-magenta font-bold",
              }}
            />
          </DataCard>

          <DataCard>
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" /> Active Schedule
            </h3>
            {activeDateStrings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No active schedule configured.</p>
            ) : (
              <div className="space-y-3">
                {activeDateStrings.map((dateStr) => (
                  <div
                    key={dateStr}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-marble/30"
                  >
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {formatDateLabel(dateStr)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {dateSlots[dateStr].length} slots: {dateSlots[dateStr].map(t => t.split(":")[0] + (parseInt(t.split(":")[0]) >= 12 ? " PM" : " AM")).join(", ")}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive h-8 w-8 p-0"
                      onClick={() => handleDeleteDateSchedule(dateStr)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </DataCard>
        </div>

        <div className="space-y-6">
          <DataCard>
            <h3 className="font-bold text-foreground mb-1">Configure Slots For</h3>
            <p className="text-sm font-semibold text-primary mb-4">
              {selectedDate ? formatDateLabel(selectedDateKey) : "Select a date"}
            </p>
            
            <div className="grid grid-cols-3 gap-2.5">
              {HOURS.map((hour) => {
                const timeLabel = formatHourLabel(hour);
                const timeValue = `${hour.toString().padStart(2, "0")}:00`;
                const active = selectedDateSlots.includes(timeValue);
                return (
                  <Button
                    key={hour}
                    variant="outline"
                    className={cn(
                      "h-12 flex flex-col items-center justify-center gap-0.5 rounded-lg border text-xs font-medium transition-colors",
                      active
                        ? "bg-magenta/15 border-magenta/40 text-magenta hover:bg-magenta/20"
                        : "bg-marble border-border text-foreground hover:bg-muted"
                    )}
                    onClick={() => handleToggleSlot(timeValue)}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    <span>{timeLabel}</span>
                  </Button>
                );
              })}
            </div>
            
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-magenta/15 border border-magenta/40" /> Active Slot
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded bg-marble border border-border" /> Empty Slot
              </div>
            </div>
          </DataCard>

          <DataCard>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="rate" className="text-sm font-medium">
                  Hourly Rate (₹ per hour)
                </Label>
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="mt-1.5"
                  placeholder="e.g. 1500"
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-magenta hover:bg-magenta/90 text-white"
              >
                {isSaving ? "Saving..." : "Save All Changes"}
              </Button>
            </div>
          </DataCard>
        </div>
      </div>
    </div>
  );
};

export default MentorAvailability;
