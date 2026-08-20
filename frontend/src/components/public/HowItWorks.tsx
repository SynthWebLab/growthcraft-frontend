"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <Section variant="white">
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
        <div className="hidden md:block absolute top-[28px] left-[12.5%] right-[12.5%] h-1 bg-border/60 rounded-full z-0 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-primary to-secondary rounded-full shadow-[0_0_12px_rgba(247,100,60,0.6)]"
            initial={{ width: "0%" }}
            animate={{
              width: `${(activeStep / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative z-10">
          {steps.map(({ num, title, desc }, index) => {
            const isActive = index === activeStep;
            const isPassed = index <= activeStep;

            return (
              <div
                key={num}
                onClick={() => setActiveStep(index)}
                className="text-center relative group cursor-pointer"
              >
                <div className="relative inline-flex items-center justify-center mb-3 sm:mb-4">
                  {/* Glowing halo for active step */}
                  {isActive && (
                    <motion.div
                      layoutId="activeGlow"
                      className="absolute -inset-2 rounded-full bg-primary/25 blur-md z-0"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}

                  {/* Pulsing ring outline */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75 z-0" />
                  )}

                  {/* Step Circle */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.15 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center relative z-10 transition-colors duration-500 ${
                      isActive
                        ? "bg-primary border-primary text-white shadow-lg shadow-primary/40"
                        : isPassed
                        ? "bg-white border-primary text-primary"
                        : "bg-white border-border text-muted-foreground/40"
                    }`}
                  >
                    <span
                      className={`text-xl sm:text-2xl font-extrabold font-display transition-colors duration-300 ${
                        isActive
                          ? "text-white"
                          : isPassed
                          ? "text-primary"
                          : "text-muted-foreground/40"
                      }`}
                    >
                      {num}
                    </span>
                  </motion.div>
                </div>

                <h3
                  className={`text-base sm:text-lg font-bold font-display mb-1 sm:mb-2 transition-colors duration-300 ${
                    isActive ? "text-primary font-extrabold" : "text-foreground"
                  }`}
                >
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed px-2 sm:px-0">
                  {desc}
                </p>

                {/* Processing step badge underneath */}
                <div className="h-5 mt-2 flex items-center justify-center">
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-semibold text-primary"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span>Step {num}</span>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

