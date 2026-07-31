"use client";

import { Calendar, Clock, MapPin, ArrowRight, Trophy, Flame } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventCardFrame, getEventCardToneStyles } from "@/components/events/EventCardFrame";
import type { Hackathon } from "@/types/hackathon";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface HackathonCardProps {
  hackathon: Hackathon;
  onCTAClick: (hackathon: Hackathon) => void;
  onSecondaryCTAClick?: (hackathon: Hackathon) => void;
}

const formatEventDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

export function HackathonCard({ hackathon, onCTAClick, onSecondaryCTAClick }: HackathonCardProps) {
  const { data: user } = useCurrentUser();
  const isMentor = user?.role === "mentor";
  const isEmployer = user?.role === "employer";
  const isRestrictedRole = isMentor || isEmployer;
  const toneStyles = getEventCardToneStyles("orange");
  
  // Get CTAs from hackathon data
  const primaryCTA = hackathon.primaryCTA || "Reserve Seat";
  const secondaryCTA = hackathon.secondaryCTA || "Request Callback";
  const isCallbackAction = primaryCTA.toLowerCase().includes("callback");
  const isFinalizedStatus = hackathon.status === "Closed" || hackathon.status === "Completed";
  const primaryButtonLabel = isRestrictedRole ? "Students Only" : (isFinalizedStatus ? hackathon.status : primaryCTA);
  
  // Only disable primary button if it's a registration action AND (seats full OR event completed)
  // "Request Callback" buttons should always be enabled
  const isRegistrationAction = primaryCTA.toLowerCase().includes("register") || primaryCTA.toLowerCase().includes("reserve");
  const seatsAvailable = hackathon.availableSeats ?? ((hackathon.maxSeats || 50) - (hackathon.enrolledCount || 0));
  const isPrimaryDisabled = isRestrictedRole || isFinalizedStatus || (isRegistrationAction && (
    hackathon.status === "Completed" || 
    seatsAvailable <= 0
  ));

  return (
    <Link href={`/events/${hackathon.slug}`} className="block">
      <EventCardFrame
        tone="orange"
        banner={
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p className="text-xs">{hackathon.mode}</p>
          </div>
        }
        badgeRow={
          <>
            {Boolean((hackathon as any).isFeatured || (hackathon as any).is_featured || (hackathon as any).isFeatured === "true" || (hackathon as any).is_featured === "true") && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-400/30 flex items-center gap-1">
                <Flame className="h-3 w-3" /> Trending
              </span>
            )}
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${toneStyles.badge}`}>
              Hackathon
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
              {hackathon.status}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
              <Clock className="h-3 w-3 inline mr-1" />
              {hackathon.mode}
            </span>
          </>
        }
        title={hackathon.title}
        description={hackathon.description}
        dateRow={
          <>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatEventDate(hackathon.startDate)} - {formatEventDate(hackathon.endDate)}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {hackathon.mode}
            </span>
          </>
        }
        footerLeft={
          <div>
            {seatsAvailable > 0 && hackathon.status === "Open" && (
              <p className="text-xs sm:text-sm font-bold text-primary mb-1">
                {seatsAvailable} seat{seatsAvailable !== 1 ? "s" : ""} left of {hackathon.maxSeats}
              </p>
            )}
            {seatsAvailable === 0 && hackathon.status === "Open" && (
              <p className="text-xs sm:text-sm font-bold text-danger mb-1">Seats Full</p>
            )}
            <p className="text-xs text-muted-foreground">Entry Fee</p>
            <p className="text-lg font-extrabold text-primary">
              {hackathon.price === 0 ? "Free" : `₹${hackathon.price.toLocaleString()}`}
            </p>
          </div>
        }
        footerRight={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {secondaryCTA && onSecondaryCTAClick && (
              <Button
                variant="outline"
                size="default"
                className="w-full sm:w-auto"
                disabled={isRestrictedRole}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isRestrictedRole) onSecondaryCTAClick(hackathon);
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
                if (!isPrimaryDisabled && !isRestrictedRole) onCTAClick(hackathon);
              }}
            >
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
            </Button>
          </div>
        }
      >
        <div className="mb-3">
          <div className="text-xs text-muted-foreground mb-1">Domain</div>
          <div className="text-sm font-medium text-foreground">{hackathon.category}</div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-xs text-muted-foreground">Key Tools:</span>
          {hackathon.skillsCovered.map((tool) => (
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
