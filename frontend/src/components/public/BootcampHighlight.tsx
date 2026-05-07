"use client";

import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { bootcampsMock } from "@/data/bootcamps.mock";
import { Calendar, MapPin, Users } from "lucide-react";
import { getPrimaryCta } from "@/lib/ctaPolicy";

export const BootcampHighlight = () => {
  const openBootcamp = bootcampsMock.find((b) => b.status === "Open");

  if (!openBootcamp) return null;

  const seatsLeft = openBootcamp.maxSeats - openBootcamp.enrolledCount;
  
  const cta = getPrimaryCta({
    type: "bootcamp",
    status: openBootcamp.status,
    maxSeats: openBootcamp.maxSeats,
    enrolledCount: openBootcamp.enrolledCount,
    startDate: openBootcamp.startDate,
  });

  return (
    <Section variant="white" className="!py-8 sm:!py-12 md:!py-16 lg:!py-20">
      <div className="text-center mb-10 sm:mb-12 md:mb-14 animate-fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3">
          Next bootcamp
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display">
          Intensive. Immersive. Industry-ready.
        </h2>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-card animate-fade-up">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Side - Bootcamp Info */}
          <div className="bg-marble p-6 sm:p-8 lg:p-12 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Enrolling Now
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display mb-2">
                {openBootcamp.title}
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                {openBootcamp.skillsCovered.slice(0, 5).map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 sm:px-3 py-1 rounded-full bg-secondary/10 text-xs sm:text-sm font-medium text-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">
            <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
              <div className="flex items-center gap-3 text-sm sm:text-base text-muted-foreground">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
                <span>
                  {openBootcamp.startDate} — {openBootcamp.endDate}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base text-muted-foreground">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
                <span>{openBootcamp.mode} · 12 weeks</span>
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-base">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0" />
                <span className="text-primary font-bold">{seatsLeft} seats left</span>
                <span className="text-muted-foreground">
                  out of {openBootcamp.maxSeats}
                </span>
              </div>
            </div>

            {/* Mentors */}
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div className="flex -space-x-2">
                {openBootcamp.mentorNames.map((name) => (
                  <img
                    key={name}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name
                      .split(" ")[0]
                      .toLowerCase()}`}
                    alt={name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-card"
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                Mentored by {openBootcamp.mentorNames.join(", ")}
              </span>
            </div>

            {/* CTA & Price */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto" asChild>
                  <Link href={`/bootcamps/${openBootcamp.slug}`}>
                    {cta.primary.label}
                  </Link>
                </Button>
                {cta.secondary && (
                  <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
                    <Link href={`/bootcamps/${openBootcamp.slug}`}>
                      {cta.secondary.label}
                    </Link>
                  </Button>
                )}
              </div>
              <span className="text-xl sm:text-2xl font-bold font-display">
                ₹{openBootcamp.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};
