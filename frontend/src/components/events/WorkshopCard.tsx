import { Calendar, Clock, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCardFrame, getEventCardToneStyles } from "@/components/events/EventCardFrame";
import { Workshop, getWorkshopCTA } from "@/data/events.mock";

interface WorkshopCardProps {
  workshop: Workshop;
  onCTAClick: (workshop: Workshop) => void;
}

const formatEventDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

export function WorkshopCard({ workshop, onCTAClick }: WorkshopCardProps) {
  const toneStyles = getEventCardToneStyles("purple");
  const ctaText = getWorkshopCTA(workshop);
  const isDisabled = ctaText === "Completed" || ctaText === "Closed" || ctaText === "Seats Full";
  const seatsAvailable = workshop.maxSeats && workshop.enrolledCount 
    ? workshop.maxSeats - workshop.enrolledCount 
    : null;

  return (
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
              {seatsAvailable} seat{seatsAvailable !== 1 ? "s" : ""} left
            </p>
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
        <Button
          className={`${isDisabled ? '' : toneStyles.footerButton} w-full sm:w-auto`}
          size="default"
          variant={isDisabled ? "outline" : "default"}
          disabled={isDisabled}
          onClick={() => !isDisabled && onCTAClick(workshop)}
        >
          <span className="hidden sm:inline">{ctaText}</span>
          <span className="sm:hidden">{ctaText === "Reserve Seat" ? "Reserve" : ctaText}</span>
          {!isDisabled && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
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
  );
}
