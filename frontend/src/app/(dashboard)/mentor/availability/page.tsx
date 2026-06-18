"use client";

import { Fragment, useCallback, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataCard from "@/components/ui/data-card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM – 8 PM

const initialSlots: Record<string, boolean> = {};

const MentorAvailability = () => {
  const [slots, setSlots] = useState<Record<string, boolean>>(initialSlots);
  const [rate, setRate] = useState("1500");
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState(false);

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
    toast.success("Availability saved successfully!");
  };

  return (
    <div className="space-y-6" onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
      <PageHeader
        title="Availability"
        description="Click or drag to set your available time slots"
      />

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
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1 max-w-xs">
            <Label htmlFor="rate" className="text-sm font-medium">
              Session Rate (₹ per hour)
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
          <Button onClick={handleSave} className="bg-magenta hover:bg-magenta/90 text-white">
            Save Availability
          </Button>
        </div>
      </DataCard>
    </div>
  );
};

export default MentorAvailability;
