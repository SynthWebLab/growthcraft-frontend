"use client";

import { Section } from "@/components/ui/section";
import {
  BookX,
  FolderX,
  UserX,
  Briefcase,
  Users,
  BookOpen,
  Hammer,
  Handshake,
} from "lucide-react";

const pains = [
  { icon: BookX, text: "Tutorial hell — watching hours, building nothing" },
  { icon: FolderX, text: "No real projects to show in interviews" },
  { icon: UserX, text: "No access to industry mentors" },
  { icon: Briefcase, text: "No hiring pipeline after completion" },
];

const pillars = [
  {
    icon: Users,
    title: "Live Mentorship",
    desc: "Weekly 1-on-1s with engineers from top companies. Not recorded lectures — real conversations.",
  },
  {
    icon: BookOpen,
    title: "Industry Curriculum",
    desc: "Built with hiring managers. Covers what companies actually test, not textbook theory.",
  },
  {
    icon: Hammer,
    title: "Real Projects",
    desc: "Ship 5+ production-grade projects. Each one designed to solve a real-world problem.",
  },
  {
    icon: Handshake,
    title: "Direct Hiring",
    desc: "Our hiring partners interview you directly. No job boards, no spray-and-pray.",
  },
];

export const PainPath = () => {
  return (
    <Section variant="marble" >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16">
        {/* Left Column - Pain Points */}
        <div className="animate-fade-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display mb-6 sm:mb-8 leading-tight">
            Most coding courses leave you with tutorials, not a job.
          </h2>
          <div className="space-y-4 sm:space-y-5">
            {pains.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 sm:gap-4">
                <div className="mt-1 flex-shrink-0 rounded-lg bg-primary/10 p-2">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Solutions */}
        <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display mb-6 sm:mb-8 leading-tight">
            GrowthCraft fixes this.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-4 sm:p-5 hover:shadow-md transition-shadow"
              >
                <div className="rounded-lg bg-primary/10 p-2 w-fit mb-3">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h3 className="font-bold font-display text-sm sm:text-base mb-1">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};
