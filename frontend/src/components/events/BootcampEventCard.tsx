"use client";

import { Calendar, ArrowRight, MapPin, Flame, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import type { Bootcamp } from "@/types/bootcamp";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface BootcampEventCardProps {
  bootcamp: Bootcamp;
  onPrimaryCTAClick: (bootcamp: Bootcamp) => void;
  onSecondaryCTAClick?: (bootcamp: Bootcamp) => void;
  isProcessing?: boolean;
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
  isProcessing,
}: BootcampEventCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: user } = useCurrentUser();
  const isMentor = isMounted && user?.role === "mentor";
  const isEmployer = isMounted && user?.role === "employer";
  const isRestrictedRole = isMentor || isEmployer;
  const isEnrolled = (bootcamp as any).isEnrolled || 
    bootcamp.primaryCTA === "Already Enrolled" || 
    bootcamp.primaryCTA === "Interest Registered" ||
    bootcamp.primaryCTA === "Seat Reserved";

  const rawPrimaryCTA = bootcamp.primaryCTA || "Reserve Seat";
  const primaryCTA = isEnrolled ? "Seat Reserved" : rawPrimaryCTA;
  const rawSecondaryCTA = isEnrolled ? null : bootcamp.secondaryCTA;
  const secondaryCTA = (rawSecondaryCTA === primaryCTA || primaryCTA === "Request Callback" || primaryCTA === "Seat Reserved") ? null : rawSecondaryCTA;
  const isFinalizedStatus = bootcamp.status === "Closed" || bootcamp.status === "Completed";
  const isPrimaryDisabled = Boolean(isProcessing) || isRestrictedRole || isEnrolled || (bootcamp.cta?.disabled ?? (!bootcamp.canRegister || isFinalizedStatus));
  const primaryButtonLabel = isRestrictedRole ? "Students Only" : (isFinalizedStatus ? bootcamp.status : primaryCTA);

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
            {Boolean((bootcamp as any).isFeatured || (bootcamp as any).is_featured || (bootcamp as any).isFeatured === "true" || (bootcamp as any).is_featured === "true") && (
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 border border-amber-400/30 flex items-center gap-1">
                <Flame className="h-3 w-3" /> Trending
              </span>
            )}
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

          {/* Mentors */}
          {(bootcamp as any).mentors && (bootcamp as any).mentors.length > 0 ? (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-1.5 overflow-hidden">
                {(bootcamp as any).mentors.map((m: any, idx: number) => (
                  <Avatar key={idx} className="inline-block h-6 w-6 rounded-full ring-1 ring-background">
                    <AvatarImage src={m.avatar || undefined} />
                    <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-bold">
                      {(m.name || m.fullName || "M").charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-xs font-medium text-foreground/80 truncate">
                {(bootcamp as any).mentors.map((m: any) => m.name || m.fullName).filter(Boolean).join(", ")}
              </span>
            </div>
          ) : bootcamp.mentorNames && bootcamp.mentorNames.length > 0 ? (
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs text-muted-foreground">
                {bootcamp.mentorNames.join(", ")}
              </span>
            </div>
          ) : null}

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
            {secondaryCTA && (
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto"
                disabled={isRestrictedRole}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isRestrictedRole) return;
                  if (onSecondaryCTAClick) {
                    onSecondaryCTAClick(bootcamp);
                    return;
                  }
                  onPrimaryCTAClick(bootcamp);
                }}
              >
                {isRestrictedRole ? "Students Only" : secondaryCTA}
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
              variant={isFinalizedStatus || isRestrictedRole ? "outline" : bootcamp.canRegister ? "default" : "outline"}
              disabled={isPrimaryDisabled}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isRestrictedRole) onPrimaryCTAClick(bootcamp);
              }}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Checking Payment...
                </>
              ) : (
                <>
                  {primaryButtonLabel}
                  {!isFinalizedStatus && bootcamp.canRegister && <ArrowRight className="ml-2 h-4 w-4" />}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
