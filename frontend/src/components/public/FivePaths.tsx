"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/ui/section";
import { RoleBadge } from "@/components/ui/role-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

type RoleKey = "Student" | "College" | "Mentor" | "Employer";

const personas: Record<
  RoleKey,
  {
    pain: string;
    value: string;
    benefits: string[];
    cta: string;
    link: string;
  }
> = {
  Student: {
    pain: "Stuck in tutorial loops with no clear path to a job.",
    value: "From zero to hired in 6 months.",
    benefits: [
      "Project-based learning with real-world codebases",
      "1-on-1 mentorship from senior engineers",
      "Direct placement pipeline to 120+ companies",
    ],
    cta: "Browse Courses",
    link: "/courses",
  },
  College: {
    pain: "Your students graduate with degrees but not job-ready skills.",
    value: "Industry-ready graduates, taught on your campus.",
    benefits: [
      "Plug-and-play curriculum designed with hiring managers",
      "Dedicated mentors for your institution",
      "Placement reports and analytics dashboard",
    ],
    cta: "Partner with Us",
    link: "/partnerships",
  },
  Mentor: {
    pain: "You have industry expertise but no structured way to teach.",
    value: "Teach what you've mastered. Get paid.",
    benefits: [
      "Flexible scheduling — mentor on your terms",
      "Pre-built curriculum you can customize",
      "Per-session payments, no commitments",
    ],
    cta: "Apply as Mentor",
    link: "/partnerships",
  },
  Employer: {
    pain: "Tired of filtering 500 resumes to find 5 competent hires.",
    value: "Hire pre-vetted MERN talent. No noise.",
    benefits: [
      "Every candidate has shipped 5+ real projects",
      "Skill-matched recommendations for your JD",
      "Zero recruitment fees for the first 3 hires",
    ],
    cta: "Hire from Us",
    link: "/partnerships",
  },
};

const roles: RoleKey[] = ["Student", "College", "Mentor", "Employer"];

export const FivePaths = () => {
  const [activeRole, setActiveRole] = useState<RoleKey>("Student");
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    if (userInteracted) return;

    const timer = setInterval(() => {
      setActiveRole((prev) => {
        const currentIndex = roles.indexOf(prev);
        const nextIndex = (currentIndex + 1) % roles.length;
        return roles[nextIndex];
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [userInteracted]);

  const handleTabChange = (val: string) => {
    setUserInteracted(true);
    setActiveRole(val as RoleKey);
  };

  return (
    <Section variant="marble" className="!py-10 sm:!py-14 md:!py-18 lg:!py-22">
      <div className="text-center mb-8 sm:mb-12 md:mb-14 animate-fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3 font-semibold">
          For everyone
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display">
          One platform. Four ways in.
        </h2>
      </div>

      <Tabs
        value={activeRole}
        onValueChange={handleTabChange}
        className="max-w-4xl mx-auto"
      >
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto bg-card border border-border rounded-xl p-1 gap-1 relative z-10 shadow-xs">
          {roles.map((role) => (
            <TabsTrigger
              key={role}
              value={role}
              className="text-xs sm:text-sm py-2 sm:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all duration-300 relative"
            >
              {role}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait">
            {roles.map((role) => {
              if (role !== activeRole) return null;
              const p = personas[role];
              return (
                <TabsContent
                  key={role}
                  value={role}
                  forceMount
                  asChild
                >
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="mt-6 sm:mt-8 rounded-xl border border-border bg-card p-5 sm:p-8 shadow-sm relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <RoleBadge role={role} />
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium">
                      {p.pain}
                    </p>

                    <h3 className="text-base sm:text-xl md:text-2xl font-extrabold font-display mb-3 sm:mb-5 text-foreground leading-snug">
                      {p.value}
                    </h3>

                    <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-7">
                      {p.benefits.map((benefit, idx) => (
                        <motion.li
                          key={benefit}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.08 }}
                          className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>

                    <Button asChild className="w-full sm:w-auto group shadow-md transition-all hover:scale-[1.02]">
                      <Link href={p.link}>
                        {p.cta} <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </motion.div>
                </TabsContent>
              );
            })}
          </AnimatePresence>
        </div>
      </Tabs>
    </Section>
  );
};
