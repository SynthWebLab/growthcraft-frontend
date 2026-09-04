"use client";

import { useState, useEffect } from "react";
import { Section } from "@/components/ui/section";
import { DataCard } from "@/components/ui/data-card";
import { usePublicMentors } from "@/hooks/queries/useMentor";
import { Star } from "lucide-react";

interface Mentor {
  _id: string;
  name: string;
  photo: string;
  company: string;
  expertiseTags: string[];
  sessionsDelivered: number;
  rating: number;
}

export const MentorShowcase = () => {
  const { data, isLoading } = usePublicMentors();

  const mentors = data?.data?.mentors || [];

  return (
    <Section variant="white" className="!py-8 sm:!py-12 md:!py-16 lg:!py-20">
      <div className="text-center mb-8 sm:mb-12 md:mb-14 animate-fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3 font-semibold">
          Mentors
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display">
          Learn from engineers who ship in production.
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {isLoading ? (
          // Skeleton loading cards
          Array.from({ length: 8 }).map((_, idx) => (
            <DataCard key={idx} className="text-center h-full p-4 sm:p-5 md:p-6 animate-pulse">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4 bg-muted/60" />
              <div className="h-4 w-28 bg-muted/60 rounded mx-auto mb-2" />
              <div className="h-3 w-20 bg-muted/40 rounded mx-auto mb-3" />
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3 sm:mb-4">
                <div className="h-5 w-14 bg-muted/50 rounded-full" />
                <div className="h-5 w-16 bg-muted/50 rounded-full" />
              </div>
              <div className="h-4 w-32 bg-muted/30 rounded mx-auto pt-2 border-t border-border/50" />
            </DataCard>
          ))
        ) : mentors.length > 0 ? (
          mentors.map((mentor) => (
            <DataCard key={mentor._id} className="text-center h-full p-4 sm:p-5 md:p-6 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
              <img
                src={mentor.photo}
                alt={mentor.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4 bg-muted object-cover border border-border/50"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                    mentor.name
                  )}`;
                }}
              />
              <h3 className="font-bold font-display text-sm sm:text-base mb-1 text-foreground">
                {mentor.name}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 font-medium">
                {mentor.company}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3 sm:mb-4 min-h-[26px]">
                {mentor.expertiseTags && mentor.expertiseTags.length > 0 ? (
                  mentor.expertiseTags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full bg-secondary/10 text-[11px] sm:text-xs font-medium text-foreground"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-secondary/10 text-[11px] sm:text-xs font-medium text-foreground">
                    {mentor.areaOfExpertise || "Mentor"}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs text-muted-foreground pt-2 border-t border-border/50">
                <span>{mentor.sessionsDelivered} sessions</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 font-medium">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {mentor.rating}
                </span>
              </div>
            </DataCard>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            No mentors currently available.
          </div>
        )}
      </div>
    </Section>
  );
};

