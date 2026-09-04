"use client";

import { Calendar, ArrowRight, Flame, Loader2, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import type { Bootcamp } from "@/types/bootcamp";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserEnrollments } from "@/hooks/useUserEnrollments";

interface BootcampEventCardProps {
  bootcamp: Bootcamp;
  onPrimaryCTAClick: (bootcamp: Bootcamp) => void;
  onSecondaryCTAClick?: (bootcamp: Bootcamp) => void;
  isProcessing?: boolean;
}

import { formatDisplayDate } from "@/lib/dateUtils";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-success/10 text-success";
    case "Closed":
      return "bg-danger/10 text-danger";
    case "Completed":
      return "bg-muted text-muted-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function BootcampEventCard({
  bootcamp,
  onPrimaryCTAClick,
  onSecondaryCTAClick,
  isProcessing,
}: BootcampEventCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: user } = useCurrentUser();
  const { isStudent, isEventEnrolled } = useUserEnrollments();
  const isMentor = isMounted && user?.role === "mentor";
  const isEmployer = isMounted && user?.role === "employer";
  const isRestrictedRole = isMentor || isEmployer;

  const enrolledFromUser = isEventEnrolled(bootcamp.id) || isEventEnrolled(bootcamp.slug) || isEventEnrolled((bootcamp as any)._id);
  const isEnrolled = isStudent
    ? enrolledFromUser
    : Boolean(
        (bootcamp as any).isEnrolled ||
        bootcamp.primaryCTA === "Already Enrolled" ||
        bootcamp.primaryCTA === "Interest Registered" ||
        bootcamp.primaryCTA === "Seat Reserved"
      );

  const rawPrimaryCTA = bootcamp.primaryCTA || "Reserve Seat";
  const primaryCTA = isEnrolled ? "Seat Reserved" : (rawPrimaryCTA === "Seat Reserved" || rawPrimaryCTA === "Already Enrolled" ? "Reserve Seat" : rawPrimaryCTA);
  const isFinalizedStatus = bootcamp.status === "Closed" || bootcamp.status === "Completed";
  const isPrimaryDisabled = Boolean(isProcessing) || isRestrictedRole || isEnrolled || (bootcamp.cta?.disabled ?? (!bootcamp.canRegister || isFinalizedStatus));
  const primaryButtonLabel = isRestrictedRole ? "Students Only" : (isFinalizedStatus ? bootcamp.status : primaryCTA);

  const mentorsList = (bootcamp as any).mentors || [];
  const mentorNames = bootcamp.mentorNames || [];

  return (
    <Link 
      href={`/events/${bootcamp.slug}`}
      className="group block h-full"
    >
      <DataCard className="h-full flex flex-col justify-between hover:border-primary/40 hover:shadow-lg transition-all duration-300 p-5 sm:p-6">
        <div>
          {/* Badge Row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {Boolean((bootcamp as any).isFeatured || (bootcamp as any).is_featured || (bootcamp as any).isFeatured === "true" || (bootcamp as any).is_featured === "true") && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-400/30 flex items-center gap-1">
                <Flame className="h-3 w-3" /> Trending
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-magenta/10 text-magenta">
              Bootcamp
            </span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusColor(
                bootcamp.status
              )}`}
            >
              {bootcamp.status}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
              {bootcamp.mode}
            </span>
          </div>

          {/* Assigned Mentors */}
          {mentorsList.length > 0 ? (
            <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
              <div className="flex -space-x-1.5 overflow-hidden">
                {mentorsList.slice(0, 3).map((m: any, idx: number) => (
                  <Avatar key={idx} className="inline-block h-5 w-5 rounded-full ring-1 ring-background">
                    <AvatarImage src={m.avatar || undefined} />
                    <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                      {(m.name || m.fullName || "M").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-xs font-medium text-foreground/80 truncate">
                {mentorsList.map((m: any) => m.name || m.fullName).filter(Boolean).join(", ")}
              </span>
            </div>
          ) : mentorNames.length > 0 ? (
            <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5 text-primary" />
              <span className="truncate">{mentorNames.join(", ")}</span>
            </div>
          ) : null}

          {/* Title */}
          <h3 className="text-lg font-bold text-foreground group-hover:text-magenta transition-colors mb-2 line-clamp-2">
            {bootcamp.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {bootcamp.description}
          </p>

          {/* Date & Seats Info */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
              <Calendar className="h-3 w-3" />
              {formatDisplayDate(bootcamp.startDate, bootcamp.endDate, (bootcamp as any).isDateTBA, (bootcamp as any).durationDays || (bootcamp as any).duration)}
            </span>
            {bootcamp.availableSeats > 0 && bootcamp.status === "Open" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-success/10 text-success">
                {bootcamp.availableSeats} seat{bootcamp.availableSeats !== 1 ? "s" : ""} left
              </span>
            )}
            {bootcamp.availableSeats === 0 && bootcamp.status === "Open" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-danger/10 text-danger">
                Seats Full
              </span>
            )}
          </div>

          {/* Skills / Tools Chips */}
          {bootcamp.skillsCovered && bootcamp.skillsCovered.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {bootcamp.skillsCovered.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground"
                >
                  {skill}
                </span>
              ))}
              {bootcamp.skillsCovered.length > 4 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                  +{bootcamp.skillsCovered.length - 4}
                </span>
              )}
            </div>
          ) : bootcamp.tags && bootcamp.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {bootcamp.tags.slice(0, 4).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Footer with Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
          <div>
            <span className="text-lg font-extrabold text-magenta">
              ₹{bootcamp.price.toLocaleString()}
            </span>
            {bootcamp.originalPrice && bootcamp.originalPrice > bootcamp.price && (
              <span className="text-xs text-muted-foreground line-through ml-2">
                ₹{bootcamp.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <Button
            size="sm"
            className={`${
              isPrimaryDisabled
                ? "cursor-not-allowed opacity-50"
                : bootcamp.canRegister
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : ""
            }`}
            variant={isFinalizedStatus || isRestrictedRole ? "outline" : bootcamp.canRegister ? "default" : "outline"}
            disabled={isPrimaryDisabled}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isRestrictedRole) onPrimaryCTAClick(bootcamp);
            }}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>{primaryButtonLabel}</span>
                {!isFinalizedStatus && bootcamp.canRegister && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
              </>
            )}
          </Button>
        </div>
      </DataCard>
    </Link>
  );
}
