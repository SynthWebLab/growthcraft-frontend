"use client";

import { Section } from "@/components/ui/section";
import { StatCounter } from "@/components/ui/stat-counter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const collegeLogos = [
  {
    name: "IIT Guwahati",
    logo: "/logos/iitg.jpg",
  },
  {
    name: "NIT Silchar",
    logo: "/logos/nit-silchar.png",
  },
  {
    name: "Lovely Professional University",
    logo: "/logos/lpu.svg",
  },
  {
    name: "Tezpur University",
    logo: "/logos/tezpur.png",
  },
  {
    name: "Assam Engineering College",
    logo: "/logos/assam-ec.png",
  },
  {
    name: "Cotton University",
    logo: "/logos/cotton.jpg",
  },
];

export const TrustStrip = () => {
  return (
    <Section variant="white" className="!py-8 sm:!py-12 md:!py-16 lg:!py-20">
      <div className="text-center mb-6 sm:mb-8 md:mb-10 animate-fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground font-semibold">
          Trusted by learners from
        </p>
      </div>

      <TooltipProvider delayDuration={0}>
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 md:gap-8 lg:gap-10 mb-14 sm:mb-18 md:mb-22">
          {collegeLogos.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <div
                  className="group flex items-center justify-center h-24 sm:h-28 md:h-32 min-w-[150px] sm:min-w-[180px] md:min-w-[220px] px-6 sm:px-8 py-3.5 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-magenta/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="h-16 sm:h-20 md:h-22 w-auto max-w-[140px] sm:max-w-[170px] md:max-w-[200px] object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold px-3 py-1.5 text-xs rounded-lg shadow-lg border border-slate-700/50"
              >
                {item.name}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
        <StatCounter value={4200} suffix="+" label="Students Trained" />
        <StatCounter value={120} suffix="+" label="Hiring Partners" />
        <StatCounter value={94} suffix="%" label="Placement Rate" />
      </div>
    </Section>
  );
};

