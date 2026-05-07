"use client";

import { Section } from "@/components/ui/section";

const steps = [
  {
    num: "01",
    title: "Learn",
    desc: "Industry-designed curriculum taught by engineers who ship daily.",
  },
  {
    num: "02",
    title: "Build",
    desc: "5+ production projects that solve real problems, not toy apps.",
  },
  {
    num: "03",
    title: "Get Mentored",
    desc: "Weekly 1-on-1 sessions with senior engineers from top companies.",
  },
  {
    num: "04",
    title: "Get Hired",
    desc: "Direct interviews with 120+ hiring partners. No job boards.",
  },
];

export const HowItWorks = () => {
  return (
    <Section variant="white" >
      <div className="text-center mb-12 sm:mb-14 md:mb-16 animate-fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3">
          The journey
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display">
          How it works
        </h2>
      </div>

      <div className="relative">
        {/* Connecting Line - Desktop Only */}
        <div className="hidden md:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map(({ num, title, desc }) => (
            <div
              key={num}
              className="text-center relative animate-fade-up"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-card border border-border mb-3 sm:mb-4 relative z-10">
                <span className="text-xl sm:text-2xl font-extrabold font-display text-primary/40">
                  {num}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-display mb-1 sm:mb-2">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed px-2 sm:px-0">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};
