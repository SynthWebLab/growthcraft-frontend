"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/ui/section";
import { RoleBadge } from "@/components/ui/role-badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Building2,
  Users,
  Briefcase,
  HelpCircle,
  MessageCircleQuestion,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type RoleKey = "Student" | "College" | "Mentor" | "Employer";

interface PersonaData {
  label: RoleKey;
  subtitle: string;
  icon: typeof GraduationCap;
  pain: string;
  value: string;
  benefits: string[];
  cta: string;
  link: string;
  faqs: { q: string; a: string }[];
}

const personas: Record<RoleKey, PersonaData> = {
  Student: {
    label: "Student",
    subtitle: "For Aspiring Developers",
    icon: GraduationCap,
    pain: "Stuck in tutorial loops with no clear path to a job.",
    value: "From zero to hired in 6 months.",
    benefits: [
      "Project-based learning with real-world codebases",
      "1-on-1 mentorship from senior engineers",
      "Direct placement pipeline to 120+ companies",
    ],
    cta: "Browse Courses",
    link: "/courses",
    faqs: [
      {
        q: "I'm a complete beginner — is this for me?",
        a: "Absolutely. Our courses start from absolute scratch. No prior coding experience needed. You'll write your first program in Day 1 and ship production apps by Week 8.",
      },
      {
        q: "What if I can't get a job after the program?",
        a: "We provide extended mentorship and placement support until you land a role. Our 94% placement rate speaks for itself — we stay committed to your success.",
      },
      {
        q: "Do I get a certificate & real portfolio?",
        a: "Yes — a verified completion certificate for every track, plus a portfolio of 5+ production applications that hiring managers actually respect.",
      },
      {
        q: "What are the EMI options available?",
        a: "We offer 0% EMI through banking partners for 3, 6, and 12-month tenures. Need-based scholarships are also available upon application.",
      },
    ],
  },
  College: {
    label: "College",
    subtitle: "For Campuses & Universities",
    icon: Building2,
    pain: "Students graduate with degrees but lack job-ready skills.",
    value: "Industry-ready grads, taught on your campus.",
    benefits: [
      "Plug-and-play curriculum designed with hiring leads",
      "Dedicated industry mentors assigned to your campus",
      "Institutional placement reports and analytics dashboard",
    ],
    cta: "Partner with Us",
    link: "/partnerships",
    faqs: [
      {
        q: "How does campus integration work?",
        a: "We deliver curriculum in-person on your campus with dedicated mentors, working within your existing semester schedule without disruption.",
      },
      {
        q: "What cohort sizes can you accommodate?",
        a: "We support cohorts from 50 to 200+ students with tailored mentor-to-student ratios, ensuring personalized feedback for every learner.",
      },
      {
        q: "Do you provide institutional analytics?",
        a: "Yes. Your administration receives a dashboard tracking real-time student attendance, project milestones, assessment scores, and placement outcomes.",
      },
      {
        q: "What lab infrastructure is required?",
        a: "Standard computer labs with modern browsers and internet access are all that is needed. No costly server licenses required.",
      },
    ],
  },
  Mentor: {
    label: "Mentor",
    subtitle: "For Working Engineers",
    icon: Users,
    pain: "Have deep tech expertise but no structured way to teach.",
    value: "Teach what you've mastered. Get paid.",
    benefits: [
      "Flexible scheduling — mentor on your own terms",
      "Pre-built, battle-tested curriculum to customize",
      "Predictable per-session payouts with zero lock-ins",
    ],
    cta: "Apply as Mentor",
    link: "/partnerships",
    faqs: [
      {
        q: "What is the weekly time commitment?",
        a: "Mentoring is designed around your work schedule. Most mentors commit 3–5 hours per week during evenings or weekends with flexible slot booking.",
      },
      {
        q: "How and when are payouts processed?",
        a: "Payouts are made on a predictable per-session or monthly basis directly into your bank account with complete transparent reporting.",
      },
      {
        q: "Do I have to create curriculum from scratch?",
        a: "No. We provide structured lesson outlines, decks, and project templates that you can easily enhance with your industry insights.",
      },
      {
        q: "Can I mentor alongside my full-time job?",
        a: "Yes! 85% of our mentors work full-time at tech companies and mentor to give back, build leadership skills, and earn side income.",
      },
    ],
  },
  Employer: {
    label: "Employer",
    subtitle: "For Tech Hiring Teams",
    icon: Briefcase,
    pain: "Filtering 500 resumes just to find 5 competent candidates.",
    value: "Hire pre-vetted MERN talent. Zero noise.",
    benefits: [
      "Every candidate has shipped 5+ production projects",
      "Skill-matched recommendations mapped to your JD",
      "Zero recruitment fees for your first 3 hires",
    ],
    cta: "Hire from Us",
    link: "/partnerships",
    faqs: [
      {
        q: "How are candidates vetted and assessed?",
        a: "Every candidate builds 5+ full-stack production projects and passes live mock technical interviews evaluated by senior software engineers.",
      },
      {
        q: "What are the recruitment or placement fees?",
        a: "We offer zero recruitment fees for your first 3 hires, followed by transparent, predictable pricing for future cohorts.",
      },
      {
        q: "Can we hire for specific tech stacks?",
        a: "Yes. All candidates specialize in the modern MERN ecosystem and are ready for immediate full-time or internship placement.",
      },
      {
        q: "How quickly can we receive candidate shortlists?",
        a: "We provide skill-matched candidate profiles and verified project codebases within 48 hours of receiving your requirements.",
      },
    ],
  },
};

const roles: RoleKey[] = ["Student", "College", "Mentor", "Employer"];
const AUTO_SLIDE_DURATION = 5500; // 5.5s

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 70 : -70,
    opacity: 0,
    filter: "blur(4px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -70 : 70,
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1] as const,
    },
  }),
};

export const PlatformAndFaqHub = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [timerKey, setTimerKey] = useState(0);

  // Auto-sliding timer (pauses on hover)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % roles.length);
      setTimerKey((k) => k + 1);
    }, AUTO_SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  const goToRole = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setTimerKey((k) => k + 1);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % roles.length);
    setTimerKey((k) => k + 1);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + roles.length) % roles.length);
    setTimerKey((k) => k + 1);
  };

  const activeRole = roles[currentIndex];
  const current = personas[activeRole];

  return (
    <Section variant="marble" className="!py-12 sm:!py-16 md:!py-20 lg:!py-24">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-up">
        <p className="text-xs sm:text-sm uppercase tracking-widest text-muted-foreground mb-2 font-semibold">
          One Platform · Clear Answers
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-display tracking-tight">
          Choose your path. Clear your doubts.
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-xl mx-auto mt-2 sm:mt-3">
          Explore tailored tracks and honest answers designed specifically for who you are.
        </p>
      </div>

      {/* Role Navigation Bar with Slider Controls */}
      <div
        className="max-w-2xl mx-auto mb-8 sm:mb-10 px-2 flex items-center justify-center gap-2 sm:gap-3"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous path"
          className="p-2 sm:p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-card/80 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Horizontal Segmented Tabs */}
        <div className="flex-1 max-w-lg grid grid-cols-2 sm:grid-cols-4 p-1.5 bg-card/80 backdrop-blur-xs rounded-2xl border border-border/80 shadow-xs gap-1 relative overflow-hidden">
          {roles.map((role, idx) => {
            const p = personas[role];
            const Icon = p.icon;
            const isActive = idx === currentIndex;

            return (
              <button
                key={role}
                type="button"
                onClick={() => goToRole(idx)}
                className={`relative z-10 flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2.5 sm:px-3 rounded-xl font-bold text-xs sm:text-sm transition-colors duration-200 cursor-pointer ${
                  isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {/* Sliding Indicator Pill */}
                {isActive && (
                  <motion.div
                    layoutId="roleTabPill"
                    className="absolute inset-0 bg-primary rounded-xl shadow-md shadow-primary/25 z-0"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 34,
                    }}
                  />
                )}

                {/* Animated Auto-Slide Progress Bar on Active Tab */}
                {isActive && !isPaused && (
                  <motion.div
                    key={`progress-${role}-${timerKey}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: AUTO_SLIDE_DURATION / 1000, ease: "linear" }}
                    style={{ originX: 0 }}
                    className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-white/60 rounded-full z-20"
                  />
                )}

                <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 relative z-10 ${isActive ? "text-white" : "text-primary"}`} />
                <span className="relative z-10 truncate">{p.label}</span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next path"
          className="p-2 sm:p-2.5 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-card/80 transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Unified Sliding 2-Column Card */}
      <div
        className="max-w-5xl mx-auto overflow-hidden px-2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeRole}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="rounded-2xl border border-border bg-card p-6 sm:p-8 lg:p-10 shadow-card relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              {/* LEFT COLUMN: Role Pitch & CTA (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-border/70 pb-6 lg:pb-0 lg:pr-8">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <RoleBadge role={activeRole} />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {current.subtitle}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 font-medium italic">
                    &ldquo;{current.pain}&rdquo;
                  </p>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-display mb-4 text-foreground leading-snug">
                    {current.value}
                  </h3>

                  <ul className="space-y-3 mb-6 sm:mb-8">
                    {current.benefits.map((benefit, idx) => (
                      <motion.li
                        key={benefit}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.25, delay: idx * 0.06 }}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-foreground/90 font-medium">{benefit}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto group shadow-md shadow-primary/20 text-sm sm:text-base px-6 py-2.5 transition-all hover:scale-[1.02]"
                  >
                    <Link href={current.link}>
                      {current.cta}{" "}
                      <ArrowRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>

              {/* RIGHT COLUMN: Tailored FAQs (6 cols) */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                      <HelpCircle className="h-4 w-4" />
                    </div>
                    <h4 className="text-sm sm:text-base font-bold font-display text-foreground">
                      Common Questions for {current.label}s
                    </h4>
                  </div>

                  <Accordion type="single" collapsible defaultValue="faq-0" className="space-y-2.5">
                    {current.faqs.map(({ q, a }, i) => (
                      <AccordionItem
                        key={i}
                        value={`faq-${i}`}
                        className="rounded-xl border border-border/80 bg-background/50 px-4 data-[state=open]:bg-background data-[state=open]:shadow-xs transition-all"
                      >
                        <AccordionTrigger className="text-left font-display font-semibold text-xs sm:text-sm hover:no-underline py-3.5 leading-snug">
                          {q}
                        </AccordionTrigger>
                        <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pb-3.5">
                          {a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <MessageCircleQuestion className="h-3.5 w-3.5 text-primary" />
                    Have another question?
                  </span>
                  <Link
                    href="/contact"
                    className="text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    Contact our advisors <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Section>
  );
};
