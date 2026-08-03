"use client";

import { Calendar, Clock, MapPin, ArrowRight, Flame, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventCardFrame, getEventCardToneStyles } from "@/components/events/EventCardFrame";
import type { Workshop } from "@/types/workshop";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface WorkshopCardProps {
  workshop: Workshop;
  onCTAClick: (workshop: Workshop) => void;
  onSecondaryCTAClick: (workshop: Workshop) => void;
  isProcessing?: boolean;
}

const formatEventDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

const formatEventTime = (date: string) =>
  new Date(date).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

export function WorkshopCard({ workshop, onCTAClick, onSecondaryCTAClick, isProcessing }: WorkshopCardProps) {
  const { data: user } = useCurrentUser();
  const isMentor = user?.role === "mentor";
  const isEmployer = user?.role === "employer";
  const isRestrictedRole = isMentor || isEmployer;
  const toneStyles = getEventCardToneStyles("purple");
  const isEnrolled = (workshop as any).isEnrolled || 
    workshop.primaryCTA === "Already Enrolled" || 
    workshop.primaryCTA === "Interest Registered" ||
    workshop.primaryCTA === "Seat Reserved";

  const rawPrimaryCTA = workshop.primaryCTA || "Reserve Seat";
  const primaryCTA = isEnrolled ? "Seat Reserved" : rawPrimaryCTA;
  const rawSecondaryCTA = isEnrolled ? null : workshop.secondaryCTA;
  const secondaryCTA = (rawSecondaryCTA === primaryCTA || primaryCTA === "Request Callback" || primaryCTA === "Seat Reserved") ? null : rawSecondaryCTA;
  const isCallbackAction = primaryCTA.toLowerCase().includes("callback");
  const isFinalizedStatus = workshop.status === "Closed" || workshop.status === "Completed";
  const primaryButtonLabel = isRestrictedRole ? "Students Only" : (isFinalizedStatus ? workshop.status : primaryCTA);

  const isRegistrationAction = primaryCTA.toLowerCase().includes("register") || primaryCTA.toLowerCase().includes("reserve") || isEnrolled;
  const seatsAvailable = workshop.availableSeats ?? ((workshop.maxSeats || 50) - (workshop.enrolledCount || 0));
  const isPrimaryDisabled = Boolean(isProcessing) || isRestrictedRole || isFinalizedStatus || isEnrolled || (isRegistrationAction && (
    workshop.status === "Completed" || 
    seatsAvailable <= 0
  ));

  return (
    <Link href={`/events/${workshop.slug}`} className="block">
      <EventCardFrame
        tone="purple"
        banner={
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p className="text-xs">{workshop.mode}</p>
          </div>
        }
        badgeRow={
          <>
            {Boolean((workshop as any).isFeatured || (workshop as any).is_featured || (workshop as any).isFeatured === "true" || (workshop as any).is_featured === "true") && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-400/30 flex items-center gap-1">
                <Flame className="h-3 w-3" /> Trending
              </span>
            )}
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${toneStyles.badge}`}>
              Workshop
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
              {workshop.status}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
              <Clock className="h-3 w-3 inline mr-1" />
              {formatEventTime(workshop.startDate)}
            </span>
          </>
        }
        title={workshop.title}
        description={workshop.description}
        dateRow={
          <>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatEventDate(workshop.startDate)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatEventTime(workshop.startDate)} - {formatEventTime(workshop.endDate)}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              {workshop.mode}
            </span>
          </>
        }
        footerLeft={
          <div>
            {seatsAvailable !== null && seatsAvailable > 0 && workshop.status === "Open" && (
              <p className="text-xs sm:text-sm font-bold text-primary mb-1">
                {seatsAvailable} seat{seatsAvailable !== 1 ? "s" : ""} left of {workshop.maxSeats}
              </p>
            )}
            {seatsAvailable === 0 && workshop.status === "Open" && (
              <p className="text-xs sm:text-sm font-bold text-danger mb-1">Seats Full</p>
            )}
            {workshop.price ? (
              <p className="text-lg font-extrabold text-foreground">
                ₹{workshop.price.toLocaleString()}
              </p>
            ) : (
              <p className="text-lg font-extrabold text-primary">Free</p>
            )}
          </div>
        }
        footerRight={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {secondaryCTA && (
              <Button
                variant="outline"
                size="default"
                className="w-full sm:w-auto"
                disabled={isRestrictedRole}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isRestrictedRole) onSecondaryCTAClick(workshop);
                }}
              >
                {isRestrictedRole ? "Students Only" : secondaryCTA}
              </Button>
            )}
            <Button
              className={`w-full sm:w-auto shadow-none ${
                isFinalizedStatus || isCallbackAction || isRestrictedRole
                  ? ""
                  : "bg-magenta text-white hover:bg-magenta/90 disabled:bg-magenta disabled:text-white disabled:opacity-50"
              }`}
              size="default"
              variant={isFinalizedStatus || isCallbackAction || isRestrictedRole ? "outline" : "default"}
              disabled={isPrimaryDisabled}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isPrimaryDisabled && !isRestrictedRole) onCTAClick(workshop);
              }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Checking Payment...
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">
                    {primaryButtonLabel}
                  </span>
                  <span className="sm:hidden">
                    {isFinalizedStatus
                      ? primaryButtonLabel
                      : primaryCTA === "Register Now"
                      ? "Register"
                      : primaryCTA}
                  </span>
                  {!isPrimaryDisabled && <ArrowRight className="ml-2 h-4 w-4" />}
                </>
              )}
            </Button>
          </div>
        }
      >
        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">Domain</div>
          <div className="text-sm font-medium text-foreground">{workshop.category}</div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-xs text-muted-foreground">Key Tools:</span>
          {workshop.skillsCovered.map((tool) => (
            <span
              key={tool}
              className={`px-2 py-0.5 rounded text-[10px] font-medium border ${toneStyles.chip}`}
            >
              {tool}
            </span>
          ))}
        </div>
      </EventCardFrame>
    </Link>
  );
}
