"use client";

import { Section } from "@/components/ui/section";
import { StatCounter } from "@/components/ui/stat-counter";

const logos = [
  "IIT Guwahati",
  "NIT Silchar",
  "Tezpur University",
  "Assam Engineering",
  "Cotton University",
  "Gauhati University",
];

export const TrustStrip = () => {
  return (
    <Section variant="white" className="!py-8 sm:!py-12 md:!py-16 lg:!py-20">
      <div className="text-center mb-5 sm:mb-8 md:mb-10 animate-fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground">
          Trusted by learners from
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8 lg:gap-12 mb-6 sm:mb-10 md:mb-12">
        {logos.map((name) => (
          <div
            key={name}
            className="h-8 sm:h-9 md:h-10 px-3 sm:px-4 md:px-6 flex items-center justify-center rounded-md bg-muted text-muted-foreground text-xs sm:text-sm font-medium grayscale opacity-60 hover:opacity-80 transition-opacity"
          >
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
        <StatCounter value={4200} suffix="+" label="Students Trained" />
        <StatCounter value={120} suffix="+" label="Hiring Partners" />
        <StatCounter value={94} suffix="%" label="Placement Rate" />
      </div>
    </Section>
  );
};
