"use client";

import { Section } from "@/components/ui/section";
import { DataCard } from "@/components/ui/data-card";
import { mentorsMock } from "@/data/mentors.mock";
import { Star } from "lucide-react";

export const MentorShowcase = () => {
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
        {mentorsMock.map((mentor) => (
          <DataCard key={mentor._id} className="text-center h-full p-4 sm:p-5 md:p-6">
            <img
              src={mentor.photo}
              alt={mentor.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto mb-3 sm:mb-4 bg-muted object-cover"
            />
            <h3 className="font-bold font-display text-sm sm:text-base mb-1">
              {mentor.name}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
              {mentor.company}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3 sm:mb-4">
              {mentor.expertiseTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-secondary/10 text-[11px] sm:text-xs font-medium text-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs text-muted-foreground pt-2 border-t border-border/50">
              <span>{mentor.sessionsDelivered} sessions</span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <Star
                  className="h-3 w-3 fill-amber-400 text-amber-400"
                />
                {mentor.rating}
              </span>
            </div>
          </DataCard>
        ))}
      </div>
    </Section>
  );
};
