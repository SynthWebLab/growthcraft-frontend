import { Calendar, Clock, MapPin, ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventCardFrame, getEventCardToneStyles } from "@/components/events/EventCardFrame";
import { Hackathon, getHackathonCTA } from "@/data/events.mock";

interface HackathonCardProps {
  hackathon: Hackathon;
  onCTAClick: (hackathon: Hackathon) => void;
}

const formatEventDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

export function HackathonCard({ hackathon, onCTAClick }: HackathonCardProps) {
  const toneStyles = getEventCardToneStyles("orange");
  const ctaText = getHackathonCTA(hackathon);
  const isDisabled = ctaText === "Completed" || ctaText === "Closed" || ctaText === "Seats Full";
  const seatsAvailable = hackathon.maxSeats && hackathon.enrolledCount 
    ? hackathon.maxSeats - hackathon.enrolledCount 
    : null;

  return (
    <EventCardFrame
      tone="orange"
      banner={
        <div className="text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-xs">{hackathon.location}</p>
        </div>
      }
      badgeRow={
        <>
          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${toneStyles.badge}`}>
            Hackathon
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
            {hackathon.status}
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
            <Clock className="h-3 w-3 inline mr-1" />
            {hackathon.duration}
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
            Duration: {hackathon.duration}
          </span>
        </>
      }
      footerLeft={
        <div>
          {seatsAvailable !== null && seatsAvailable > 0 && hackathon.status === "Open" && (
            <p className="text-xs sm:text-sm font-bold text-primary mb-1">
              {seatsAvailable} seat{seatsAvailable !== 1 ? "s" : ""} left
            </p>
          )}
          {hackathon.prizePool ? (
            <>
              <p className="text-xs text-muted-foreground">Prize Pool</p>
              <p className="text-lg font-extrabold text-primary">
                {hackathon.prizePool}
              </p>
            </>
          ) : (
            <p className="text-lg font-extrabold text-foreground">Team Event</p>
          )}
        </div>
      }
      footerRight={
        <Button
          className={`${isDisabled ? '' : toneStyles.footerButton} w-full sm:w-auto`}
          size="default"
          variant={isDisabled ? "outline" : "default"}
          disabled={isDisabled}
          onClick={() => !isDisabled && onCTAClick(hackathon)}
        >
          <span className="hidden sm:inline">{ctaText}</span>
          <span className="sm:hidden">{ctaText === "Reserve Seat" ? "Reserve" : ctaText}</span>
          {!isDisabled && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      }
    >
      {hackathon.prizePool && (
        <div className="mb-3 p-2 bg-muted border border-border rounded inline-flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <div>
            <div className="text-xs text-muted-foreground">Prize Pool</div>
            <div className="text-sm font-bold text-foreground">{hackathon.prizePool}</div>
          </div>
        </div>
      )}

      <div className="mb-3">
        <div className="text-xs text-muted-foreground mb-1">Domain</div>
        <div className="text-sm font-medium text-foreground">{hackathon.domain}</div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <span className="text-xs text-muted-foreground">Key Tools:</span>
        {hackathon.keyTools.map((tool) => (
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
