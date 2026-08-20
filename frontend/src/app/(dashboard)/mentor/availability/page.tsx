"use client";

import { Fragment, useCallback, useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataCard from "@/components/ui/data-card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import { useMentorAvailability, useUpdateMentorAvailability } from "@/hooks/queries/useMentor";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM – 8 PM

const DAY_MAP_SHORT_TO_FULL: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

const DAY_MAP_FULL_TO_SHORT: Record<string, string> = {
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
  Sunday: "Sun",
};

const AvailabilitySkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <div className="h-8 w-48 bg-muted/40 rounded" />
      <div className="h-4 w-80 bg-muted/40 rounded" />
    </div>
    <div className="h-[500px] bg-muted/40 rounded-xl" />
    <div className="h-32 bg-muted/40 rounded-xl" />
  </div>
);

const MentorAvailability = () => {
  const [slots, setSlots] = useState<Record<string, boolean>>({});
  const [rate, setRate] = useState("1500");
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(false);

  const { data: availabilityResponse, isLoading, error } = useMentorAvailability();
  const { mutate: updateAvailability, isPending: isSaving } = useUpdateMentorAvailability();

  useEffect(() => {
    if (availabilityResponse?.data) {
      const avail = availabilityResponse.data.availability || [];
      const loadedSlots: Record<string, boolean> = {};

      avail.forEach((dayData: any) => {
        const shortDay = DAY_MAP_FULL_TO_SHORT[dayData.day];
        if (shortDay && Array.isArray(dayData.slots)) {
          dayData.slots.forEach((slot: any) => {
            const hour = parseInt(slot.startTime.split(":")[0], 10);
            if (!isNaN(hour)) {
              loadedSlots[`${shortDay}-${hour}`] = true;
            }
          });
        }
      });

      setSlots(loadedSlots);
      setRate(availabilityResponse.data.hourlyRate?.toString() || "1500");
    }
  }, [availabilityResponse]);

  const key = (day: string, hour: number) => `${day}-${hour}`;

  const handleMouseDown = (day: string, hour: number) => {
    const k = key(day, hour);
    const newVal = !slots[k];
    setDragValue(newVal);
    setIsDragging(true);
    setSlots((prev) => ({ ...prev, [k]: newVal }));
  };

  const handleMouseEnter = (day: string, hour: number) => {
    if (!isDragging) return;
    const k = key(day, hour);
    setSlots((prev) => ({ ...prev, [k]: dragValue }));
  };

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  const handleSave = () => {
    const availabilityMap: Record<string, { startTime: string; endTime: string }[]> = {};

    Object.values(DAY_MAP_SHORT_TO_FULL).forEach((fullDay) => {
      availabilityMap[fullDay] = [];
    });

    Object.keys(slots).forEach((k) => {
      if (slots[k]) {
        const [shortDay, hourStr] = k.split("-");
        const hour = parseInt(hourStr, 10);
        const fullDay = DAY_MAP_SHORT_TO_FULL[shortDay];
        if (fullDay && !isNaN(hour)) {
          const startStr = `${hour.toString().padStart(2, "0")}:00`;
          const endStr = `${(hour + 1).toString().padStart(2, "0")}:00`;
          availabilityMap[fullDay].push({
            startTime: startStr,
            endTime: endStr,
          });
        }
      }
    });

    const availability = Object.entries(availabilityMap)
      .map(([day, slots]) => ({ day, slots }))
      .filter((item) => item.slots.length > 0);

    const hourlyRate = parseFloat(rate);
    if (isNaN(hourlyRate) || hourlyRate < 0) {
      toast.error("Invalid session rate");
      return;
    }

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

  return (
    <div className="space-y-6 relative overflow-hidden" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <PageHeader
        title="Availability"
        description="Click or drag to set your available time slots"
      />

      <div className="filter blur-[0.8px] opacity-75 select-none pointer-events-none space-y-6">
        <DataCard className="overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-8 gap-1">
              {/* Header */}
              <div className="h-8" />
              {DAYS.map((d) => (
                <div
                  key={d}
                  className="h-8 flex items-center justify-center text-xs font-semibold text-foreground"
                >
                  {d}
                </div>
              ))}

              {/* Grid rows */}
              {HOURS.map((hour) => (
                <Fragment key={`row-${hour}`}>
                  <div className="h-10 flex items-center justify-end pr-2 text-xs text-muted-foreground font-mono">
                    {hour > 12 ? hour - 12 : hour} {hour >= 12 ? "PM" : "AM"}
                  </div>
                  {DAYS.map((day) => {
                    const k = key(day, hour);
                    const active = !!slots[k];
                    return (
                      <div
                        key={k}
                        className={cn(
                          "h-10 rounded border cursor-pointer transition-colors select-none",
                          active
                            ? "bg-magenta/20 border-magenta/40"
                            : "bg-marble border-border hover:bg-muted"
                        )}
                        onMouseDown={() => handleMouseDown(day, hour)}
                        onMouseEnter={() => handleMouseEnter(day, hour)}
                      />
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-magenta/20 border border-magenta/40" /> Available
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded bg-marble border border-border" /> Unavailable
            </div>
          </div>
        </DataCard>

        <DataCard>
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 w-full">
            <div className="w-full sm:max-w-xs">
              <Label htmlFor="rate" className="text-sm font-medium">
                Session Rate (₹ per hour)
              </Label>
              <Input
                id="rate"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="mt-1.5 w-full"
                placeholder="e.g. 1500"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-magenta hover:bg-magenta/90 text-white w-full sm:w-auto shrink-0"
            >
              {isSaving ? "Saving..." : "Save Availability"}
            </Button>
          </div>
        </DataCard>
      </div>

      {/* Coming Soon Overlay */}
      <div className="absolute inset-x-0 bottom-0 top-[80px] flex flex-col items-center justify-center bg-white/40 backdrop-blur-[0.5px] z-10 p-4 text-center">
        <div className="bg-slate-900/95 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-lg border border-white/10 backdrop-blur-md flex items-center gap-2">
          <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

export default MentorAvailability;

