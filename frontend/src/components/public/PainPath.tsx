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
    <Section variant="marble" className="!py-10 sm:!py-14 md:!py-18 lg:!py-22">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-start">
        {/* Left Column - Pain Points */}
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-semibold uppercase tracking-wider mb-3">
            The Problem
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display mb-4 sm:mb-6 leading-tight">
            Most coding courses leave you with tutorials, not a job.
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {pains.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 sm:gap-4 p-3 rounded-lg bg-card/60 border border-border/50">
                <div className="mt-0.5 flex-shrink-0 rounded-lg bg-destructive/10 p-2">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
                </div>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Solutions */}
        <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
            The GrowthCraft Way
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display mb-4 sm:mb-6 leading-tight">
            Built from scratch to fix this.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-5">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-xl border border-border bg-card p-4 sm:p-5 hover:shadow-md hover:border-primary/30 transition-all"
              >
                <div className="rounded-lg bg-primary/10 p-2 w-fit mb-2.5 sm:mb-3">
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
