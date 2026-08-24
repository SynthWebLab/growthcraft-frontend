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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 mb-12 sm:mb-16 md:mb-20">
          {collegeLogos.map((item) => (
            <Tooltip key={item.name}>
              <TooltipTrigger asChild>
                <div
                  className="group flex items-center justify-center h-20 sm:h-24 md:h-28 px-3 sm:px-4 py-2.5 rounded-xl sm:rounded-2xl bg-card border border-border/80 shadow-xs hover:border-magenta/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="h-10 sm:h-14 md:h-16 w-auto max-w-[100px] sm:max-w-[130px] md:max-w-[150px] object-contain transition-transform duration-300 group-hover:scale-105"
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
