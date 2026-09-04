"use client";

import { Calendar, ArrowRight, Flame, Loader2, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataCard } from "@/components/ui/data-card";
import type { Hackathon } from "@/types/hackathon";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserEnrollments } from "@/hooks/useUserEnrollments";

interface HackathonCardProps {
  hackathon: Hackathon;
  onCTAClick: (hackathon: Hackathon) => void;
  onSecondaryCTAClick?: (hackathon: Hackathon) => void;
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

export function HackathonCard({ hackathon, onCTAClick, onSecondaryCTAClick, isProcessing }: HackathonCardProps) {
  const { data: user } = useCurrentUser();
  const { isStudent, isEventEnrolled } = useUserEnrollments();
  const isMentor = user?.role === "mentor";
  const isEmployer = user?.role === "employer";
  const isRestrictedRole = isMentor || isEmployer;

  const enrolledFromUser = isEventEnrolled(hackathon.id) || isEventEnrolled(hackathon.slug) || isEventEnrolled((hackathon as any)._id);
  const isEnrolled = isStudent
    ? enrolledFromUser
    : Boolean(
        (hackathon as any).isEnrolled ||
        hackathon.primaryCTA === "Already Enrolled" ||
        hackathon.primaryCTA === "Interest Registered" ||
        hackathon.primaryCTA === "Seat Reserved"
      );

  const rawPrimaryCTA = hackathon.primaryCTA || "Register Now";
  const primaryCTA = isEnrolled ? "Seat Reserved" : (rawPrimaryCTA === "Seat Reserved" || rawPrimaryCTA === "Already Enrolled" ? "Reserve Seat" : rawPrimaryCTA);
  const isFinalizedStatus = hackathon.status === "Closed" || hackathon.status === "Completed";
  const primaryButtonLabel = isRestrictedRole ? "Students Only" : (isFinalizedStatus ? hackathon.status : primaryCTA);
  
  const isRegistrationAction = primaryCTA.toLowerCase().includes("register") || primaryCTA.toLowerCase().includes("reserve") || isEnrolled;
  const seatsAvailable = hackathon.availableSeats ?? ((hackathon.maxSeats || 50) - (hackathon.enrolledCount || 0));
  const isPrimaryDisabled = Boolean(isProcessing) || isRestrictedRole || isFinalizedStatus || isEnrolled || (isRegistrationAction && (
    hackathon.status === "Completed" || 
    seatsAvailable <= 0
  ));

  return (
    <Link href={`/events/${hackathon.slug}`} className="group block h-full">
      <DataCard className="h-full flex flex-col justify-between hover:border-primary/40 hover:shadow-lg transition-all duration-300 p-5 sm:p-6">
        <div>
          {/* Badge Row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {Boolean((hackathon as any).isFeatured || (hackathon as any).is_featured || (hackathon as any).isFeatured === "true" || (hackathon as any).is_featured === "true") && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-400/30 flex items-center gap-1">
                <Flame className="h-3 w-3" /> Trending
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-magenta/10 text-magenta flex items-center gap-1">
              <Trophy className="h-3 w-3" /> Hackathon
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusColor(hackathon.status)}`}>
              {hackathon.status}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
              {hackathon.mode}
            </span>
          </div>

          {/* Domain / Category */}
          {hackathon.category && (
            <p className="text-xs font-semibold text-primary/80 dark:text-lavender mb-1.5">
              {hackathon.category}
            </p>
          )}

          {/* Title */}
          <h3 className="text-lg font-bold text-foreground group-hover:text-magenta transition-colors mb-2 line-clamp-2">
            {hackathon.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {hackathon.description}
          </p>

          {/* Date & Seats Info */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
              <Calendar className="h-3 w-3" />
              {formatDisplayDate(hackathon.startDate, hackathon.endDate, (hackathon as any).isDateTBA, (hackathon as any).durationDays || (hackathon as any).duration)}
            </span>
            {seatsAvailable > 0 && hackathon.status === "Open" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-success/10 text-success">
                {seatsAvailable} seat{seatsAvailable !== 1 ? "s" : ""} left
              </span>
            )}
          </div>

          {/* Key Tools / Skills */}
          {hackathon.skillsCovered && hackathon.skillsCovered.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {hackathon.skillsCovered.slice(0, 4).map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground"
                >
                  {tool}
                </span>
              ))}
              {hackathon.skillsCovered.length > 4 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                  +{hackathon.skillsCovered.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Footer with Price and CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border mt-2">
          <div>
            <span className="text-lg font-extrabold text-magenta">
              {hackathon.price === 0 ? "Free Entry" : `₹${hackathon.price.toLocaleString()}`}
            </span>
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
              if (!isPrimaryDisabled && !isRestrictedRole) onCTAClick(hackathon);
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
