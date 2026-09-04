"use client";

import { Calendar, Clock, ArrowRight, Flame, Loader2, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";
import type { Workshop } from "@/types/workshop";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserEnrollments } from "@/hooks/useUserEnrollments";

interface WorkshopCardProps {
  workshop: Workshop;
  onCTAClick: (workshop: Workshop) => void;
  onSecondaryCTAClick: (workshop: Workshop) => void;
  isProcessing?: boolean;
}

import { formatDisplayDate, isDateScheduled } from "@/lib/dateUtils";

const formatEventDate = (date: any, endDate?: any, isDateTBA?: boolean) => {
  return formatDisplayDate(date, endDate, isDateTBA);
};

const formatEventTime = (date: string) => {
  if (!date) return "";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

export function WorkshopCard({ workshop, onCTAClick, onSecondaryCTAClick, isProcessing }: WorkshopCardProps) {
  const { data: user } = useCurrentUser();
  const { isStudent, isEventEnrolled } = useUserEnrollments();
  const isMentor = user?.role === "mentor";
  const isEmployer = user?.role === "employer";
  const isRestrictedRole = isMentor || isEmployer;

  const enrolledFromUser = isEventEnrolled(workshop.id) || isEventEnrolled(workshop.slug) || isEventEnrolled((workshop as any)._id);
  const isEnrolled = isStudent
    ? enrolledFromUser
    : Boolean(
        (workshop as any).isEnrolled ||
        workshop.primaryCTA === "Already Enrolled" ||
        workshop.primaryCTA === "Interest Registered" ||
        workshop.primaryCTA === "Seat Reserved"
      );

  const rawPrimaryCTA = workshop.primaryCTA || "Reserve Seat";
  const primaryCTA = isEnrolled ? "Seat Reserved" : (rawPrimaryCTA === "Seat Reserved" || rawPrimaryCTA === "Already Enrolled" ? "Reserve Seat" : rawPrimaryCTA);
  const isFinalizedStatus = workshop.status === "Closed" || workshop.status === "Completed";
  const primaryButtonLabel = isRestrictedRole ? "Students Only" : (isFinalizedStatus ? workshop.status : primaryCTA);

  const isRegistrationAction = primaryCTA.toLowerCase().includes("register") || primaryCTA.toLowerCase().includes("reserve") || isEnrolled;
  const seatsAvailable = workshop.availableSeats ?? ((workshop.maxSeats || 50) - (workshop.enrolledCount || 0));
  const isPrimaryDisabled = Boolean(isProcessing) || isRestrictedRole || isFinalizedStatus || isEnrolled || (isRegistrationAction && (
    workshop.status === "Completed" || 
    seatsAvailable <= 0
  ));

  const mentorName = (workshop as any).mentorName || (Array.isArray((workshop as any).mentorNames) ? (workshop as any).mentorNames.join(", ") : "");

  return (
    <Link href={`/events/${workshop.slug}`} className="group block h-full">
      <DataCard className="h-full flex flex-col justify-between hover:border-primary/40 hover:shadow-lg transition-all duration-300 p-5 sm:p-6">
        <div>
          {/* Badge Row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {Boolean((workshop as any).isFeatured || (workshop as any).is_featured || (workshop as any).isFeatured === "true" || (workshop as any).is_featured === "true") && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-400/30 flex items-center gap-1">
                <Flame className="h-3 w-3" /> Trending
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-magenta/10 text-magenta">
              Workshop
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusColor(workshop.status)}`}>
              {workshop.status}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
              {workshop.mode}
            </span>
          </div>

          {/* Mentor */}
          {mentorName && (
            <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
              <User className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-foreground/80 truncate">{mentorName}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-foreground group-hover:text-magenta transition-colors mb-2 line-clamp-2">
            {workshop.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {workshop.description}
          </p>

          {/* Date, Time & Seats Info */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
              <Calendar className="h-3 w-3" />
              {formatEventDate(workshop.startDate, workshop.endDate, (workshop as any).isDateTBA)}
            </span>
            {isDateScheduled(workshop.startDate, (workshop as any).isDateTBA) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                <Clock className="h-3 w-3" />
                {formatEventTime(workshop.startDate as string)}
              </span>
            )}
            {seatsAvailable !== null && seatsAvailable > 0 && workshop.status === "Open" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-success/10 text-success">
                {seatsAvailable} seat{seatsAvailable !== 1 ? "s" : ""} left
              </span>
            )}
          </div>

          {/* Key Tools / Skills */}
          {workshop.skillsCovered && workshop.skillsCovered.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {workshop.skillsCovered.slice(0, 4).map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
              {workshop.skillsCovered.length > 4 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                  +{workshop.skillsCovered.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer with Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
          <div>
            <span className="text-lg font-extrabold text-magenta">
              {workshop.price && workshop.price > 0 ? `₹${workshop.price.toLocaleString()}` : "Free"}
            </span>
            {workshop.originalPrice && workshop.originalPrice > workshop.price && (
              <span className="text-xs text-muted-foreground line-through ml-2">
                ₹{workshop.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <Button
            size="sm"
            className={`${
              isFinalizedStatus || isRestrictedRole
                ? ""
                : "bg-magenta text-white hover:bg-magenta/90 disabled:bg-magenta disabled:text-white disabled:opacity-50"
            }`}
            variant={isFinalizedStatus || isRestrictedRole ? "outline" : "default"}
            disabled={isPrimaryDisabled}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isPrimaryDisabled && !isRestrictedRole) onCTAClick(workshop);
            }}
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>{primaryButtonLabel}</span>
                {!isPrimaryDisabled && <ArrowRight className="ml-1.5 h-3.5 w-3.5" />}
              </>
            )}
          </Button>
        </div>
      </DataCard>
    </Link>
  );
}
