"use client";

import { Section } from "@/components/ui/section";
import { RoleBadge } from "@/components/ui/role-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
  return (
    <Section variant="marble" >
      <div className="text-center mb-10 sm:mb-12 md:mb-14 animate-fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-2 sm:mb-3">
          For everyone
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display">
          One platform. Four ways in.
        </h2>
      </div>

      <Tabs defaultValue="Student" className="max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto bg-card border border-border rounded-xl p-1 gap-1">
          {roles.map((role) => (
            <TabsTrigger
              key={role}
              value={role}
              className="text-xs sm:text-sm py-2 sm:py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all"
            >
              {role}
            </TabsTrigger>
          ))}
        </TabsList>

        {roles.map((role) => {
          const p = personas[role];
          return (
            <TabsContent key={role} value={role} className="mt-6 sm:mt-8">
              <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3 sm:mb-4">
                  <RoleBadge role={role} />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  {p.pain}
                </p>
                <h3 className="text-lg sm:text-xl font-bold font-display mb-3 sm:mb-4">
                  {p.value}
                </h3>
                <ul className="space-y-2 sm:space-y-3 mb-5 sm:mb-6">
                  {p.benefits.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 sm:mt-2 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Button asChild>
                  <Link href={p.link}>
                    {p.cta} <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </Section>
  );
};
