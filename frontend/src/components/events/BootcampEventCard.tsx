import { Calendar, ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Bootcamp } from "@/types/bootcamp";

interface BootcampEventCardProps {
  bootcamp: Bootcamp;
  onPrimaryCTAClick: (bootcamp: Bootcamp) => void;
  onSecondaryCTAClick?: (bootcamp: Bootcamp) => void;
}

const formatBootcampDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB");

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
}: BootcampEventCardProps) {
  const isFinalizedStatus = bootcamp.status === "Closed" || bootcamp.status === "Completed";
  const isPrimaryDisabled = bootcamp.cta.disabled || isFinalizedStatus;
  const primaryButtonLabel = isFinalizedStatus ? bootcamp.status : bootcamp.primaryCTA;

  return (
    <Link 
      href={`/events/${bootcamp.slug}`}
      className="flex flex-col lg:flex-row gap-0 lg:gap-6 rounded-xl border overflow-hidden bg-card hover:border-primary/30 hover:shadow-lg transition-all block"
    >
      <div className="lg:w-[40%] h-32 sm:h-48 lg:h-auto bg-graphite flex items-center justify-center">
        <div className="text-center text-white/40">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <p className="text-xs">{bootcamp.mode}</p>
        </div>
      </div>

      <div className="lg:w-[60%] p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getStatusColor(
                bootcamp.status
              )}`}
            >
              {bootcamp.status}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
              Bootcamp
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground">
              {bootcamp.mode}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold mb-2">{bootcamp.title}</h2>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {bootcamp.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs sm:text-sm">
                {formatBootcampDate(bootcamp.startDate)} -{" "}
                {formatBootcampDate(bootcamp.endDate)}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 mb-4">
            {bootcamp.mentorNames.map((name) => (
              <img
                key={name}
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`}
                alt={name}
                className="h-7 w-7 rounded-full border-2 border-background -ml-1 first:ml-0"
                title={name}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              {bootcamp.mentorNames.length} mentor
              {bootcamp.mentorNames.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {bootcamp.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 border-t gap-3 sm:gap-4">
          <div>
            {bootcamp.availableSeats > 0 && bootcamp.status === "Open" && (
              <p className="text-xs sm:text-sm font-bold text-primary">
                {bootcamp.availableSeats} seat
                {bootcamp.availableSeats !== 1 ? "s" : ""} left of {bootcamp.maxSeats}
              </p>
            )}
            {bootcamp.availableSeats === 0 && bootcamp.status === "Open" && (
              <p className="text-xs sm:text-sm font-bold text-danger">Seats Full</p>
            )}
            <p className="text-lg font-extrabold text-foreground">
              ₹{bootcamp.price.toLocaleString()}
            </p>
            {bootcamp.originalPrice && bootcamp.originalPrice > bootcamp.price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{bootcamp.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            {bootcamp.secondaryCTA && (
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (onSecondaryCTAClick) {
                    onSecondaryCTAClick(bootcamp);
                    return;
                  }
                  onPrimaryCTAClick(bootcamp);
                }}
              >
                {bootcamp.secondaryCTA}
              </Button>
            )}
            <Button
              className={`w-full sm:w-auto ${
                isPrimaryDisabled
                  ? "cursor-not-allowed opacity-50"
                  : bootcamp.canRegister
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : ""
              }`}
              size="default"
              variant={isFinalizedStatus ? "outline" : bootcamp.canRegister ? "default" : "outline"}
              disabled={isPrimaryDisabled}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isPrimaryDisabled) {
                  onPrimaryCTAClick(bootcamp);
                }
              }}
            >
              {primaryButtonLabel}
              {!isFinalizedStatus && bootcamp.canRegister && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
