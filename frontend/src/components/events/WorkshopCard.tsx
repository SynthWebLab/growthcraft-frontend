import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EventCardFrame, getEventCardToneStyles } from "@/components/events/EventCardFrame";
import { Workshop } from "@/data/events.mock";
import { getEventDetailBySlug } from "@/data/events-detail.mock";

interface WorkshopCardProps {
  workshop: Workshop;
  onCTAClick: (workshop: Workshop) => void;
}

const formatEventDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

export function WorkshopCard({ workshop, onCTAClick }: WorkshopCardProps) {
  const toneStyles = getEventCardToneStyles("purple");
  
  // Get CTAs from detail mock data
  const eventDetail = getEventDetailBySlug(workshop.slug);
  const primaryCTA = eventDetail?.data.event.primaryCTA || "Register Now";
  const secondaryCTA = eventDetail?.data.event.secondaryCTA;
  const isCallbackAction = primaryCTA.toLowerCase().includes("callback");
  const isFinalizedStatus = workshop.status === "Closed" || workshop.status === "Completed";
  const primaryButtonLabel = isFinalizedStatus ? workshop.status : primaryCTA;
  
  // Only disable primary button if it's a registration action AND (seats full OR event completed)
  // "Request Callback" buttons should always be enabled
  const isRegistrationAction = primaryCTA.toLowerCase().includes("register") || primaryCTA.toLowerCase().includes("reserve");
  const isPrimaryDisabled = isFinalizedStatus || (isRegistrationAction && (
    workshop.status === "Completed" || 
    !!(workshop.maxSeats && workshop.enrolledCount && workshop.maxSeats - workshop.enrolledCount === 0)
  ));
  const seatsAvailable = workshop.maxSeats && workshop.enrolledCount 
    ? workshop.maxSeats - workshop.enrolledCount 
    : null;

  return (
    <Link href={`/events/${workshop.slug}`} className="block">
      <EventCardFrame
        tone="purple"
        banner={
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2" />
            <p className="text-xs">{workshop.location}</p>
          </div>
        }
        badgeRow={
          <>
            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${toneStyles.badge}`}>
              Workshop
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
              {workshop.status}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
              <Clock className="h-3 w-3 inline mr-1" />
              {workshop.duration}
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
              {workshop.startTime} - {workshop.endTime}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              Duration: {workshop.duration}
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCTAClick(workshop);
                }}
              >
                {secondaryCTA}
              </Button>
            )}
            <Button
              className={`w-full sm:w-auto shadow-none ${
                isFinalizedStatus || isCallbackAction
                  ? ""
                  : "bg-magenta text-white hover:bg-magenta/90 disabled:bg-magenta disabled:text-white disabled:opacity-50"
              }`}
              size="default"
              variant={isFinalizedStatus || isCallbackAction ? "outline" : "default"}
              disabled={isPrimaryDisabled}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isPrimaryDisabled) onCTAClick(workshop);
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
          <div className="text-sm font-medium text-foreground">{workshop.domain}</div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          <span className="text-xs text-muted-foreground">Key Tools:</span>
          {workshop.keyTools.map((tool) => (
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
