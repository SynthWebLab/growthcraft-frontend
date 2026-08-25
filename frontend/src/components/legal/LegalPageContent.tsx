"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import {
  Shield,
  FileText,
  Lock,
  Eye,
  Share2,
  Copy,
  Check,
  ArrowRight,
  ArrowUp,
  Search,
  X,
  Mail,
  Sparkles,
  Scale,
  BookOpen,
  HelpCircle,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  Printer,
  Calendar,
  ExternalLink,
  Layers,
  FileCheck,
  Zap,
  SlidersHorizontal,
  ChevronDown,
  Info,
  Clock,
  Award,
  RefreshCw,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Section from "@/components/ui/section";
import { cn } from "@/lib/utils";
import { COMPANY, LAST_UPDATED, LegalSection } from "@/data/legal.data";

export type LegalIconKey =
  | "lock"
  | "eye"
  | "user-check"
  | "scale"
  | "file-text"
  | "shield"
  | "check"
  | "book"
  | "award"
  | "refresh"
  | "credit-card"
  | "clock"
  | "calendar";

const ICON_MAP: Record<LegalIconKey, React.ElementType> = {
  lock: Lock,
  eye: Eye,
  "user-check": UserCheck,
  scale: Scale,
  "file-text": FileText,
  shield: Shield,
  check: CheckCircle2,
  book: BookOpen,
  award: Award,
  refresh: RefreshCw,
  "credit-card": CreditCard,
  clock: Clock,
  calendar: Calendar,
};

export interface LegalHighlight {
  iconName: LegalIconKey;
  tag?: string;
  title: string;
  description: string;
  targetSectionId: string;
}

export interface LegalFaq {
  question: string;
  answer: string;
}

export interface LegalPageProps {
  type: "privacy" | "terms" | "refund";
  title: string;
  subtitle: string;
  sections: LegalSection[];
  highlights: LegalHighlight[];
  faqs: LegalFaq[];
}

/** Helper component to highlight matching search words */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const escapedQuery = query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-magenta/25 text-magenta font-semibold rounded px-1 py-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export function LegalPageContent({
  type,
  title,
  subtitle,
  sections,
  highlights,
  faqs,
}: LegalPageProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"full" | "summary">("full");
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [isCopiedPage, setIsCopiedPage] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [scrollProgressPercent, setScrollProgressPercent] = useState(0);

  // Scroll progress for top reading bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Track exact numerical scroll percentage
  useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setScrollProgressPercent(Math.min(100, Math.round(latest * 100)));
    });
  }, [scrollYProgress]);

  // Unique tags for filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    sections.forEach((s) => {
      if (s.tag) tags.add(s.tag);
    });
    return ["all", ...Array.from(tags)];
  }, [sections]);

  // Filter sections based on search query and category tag
  const filteredSections = useMemo(() => {
    let result = sections;

    if (selectedTag !== "all") {
      result = result.filter((s) => s.tag === selectedTag);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          (s.summary && s.summary.toLowerCase().includes(q)) ||
          (s.tag && s.tag.toLowerCase().includes(q)) ||
          s.content.some((p) => p.toLowerCase().includes(q)) ||
          (s.keyPoints && s.keyPoints.some((k) => k.toLowerCase().includes(q)))
      );
    }

    return result;
  }, [sections, searchQuery, selectedTag]);

  // Scrollspy to detect currently active section
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }

      const scrollPosition = window.scrollY + 220;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSection(id);
      setMobileTocOpen(false);
    }
  };

  const copySectionLink = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedSectionId(id);
    toast.success("Section permalink copied to clipboard!");
    setTimeout(() => setCopiedSectionId(null), 2500);
  };

  const copyPageLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopiedPage(true);
    toast.success("Document link copied to clipboard!");
    setTimeout(() => setIsCopiedPage(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const isPrivacy = type === "privacy";

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-magenta/20 selection:text-magenta">
      {/* ─── Fixed Reading Progress Bar ──────────────────────────────────── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-magenta via-primary to-lavender origin-left z-50 shadow-[0_0_12px_rgba(235,59,90,0.5)]"
        style={{ scaleX }}
      />

      {/* ─── Hero Section with Animated Dynamic Glow & Mesh ─────────────── */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-card/40 to-marble/30 dark:from-background dark:via-card/20 dark:to-background">
        {/* Animated Glow Blobs Backdrop */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
              x: [0, 30, 0],
              y: [0, -25, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-4 left-1/2 -translate-x-1/2 w-[400px] sm:w-[650px] h-[350px] sm:h-[450px] bg-magenta/15 rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.25, 0.45, 0.25],
              x: [0, -40, 0],
              y: [0, 35, 0],
            }}
            transition={{
              duration: 11,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute top-16 right-6 w-[300px] sm:w-[480px] h-[300px] sm:h-[480px] bg-lavender/25 rounded-full blur-[130px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#8080800d_1px,transparent_1px)] bg-[size:28px_28px]" />
        </div>

        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground mb-8"
          >
            <div className="flex items-center gap-2 font-medium">
              <Link href="/" className="hover:text-magenta transition-colors">
                Home
              </Link>
              <span>/</span>
              <span className="text-muted-foreground/80">Legal</span>
              <span>/</span>
              <span className="text-magenta font-bold">{title}</span>
            </div>
          </motion.div>

          {/* Hero Main Header Content */}
          <div className="text-center max-w-3xl mx-auto">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-5 leading-[1.15]"
            >
              {title.split(" ")[0]}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta via-primary to-lavender font-extrabold">
                {title.split(" ").slice(1).join(" ")}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8 font-normal"
            >
              {subtitle}
            </motion.p>

            {/* Interactive Search & Quick Action Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto"
            >
              {/* Search Bar with live clear */}
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={`Search ${isPrivacy ? "privacy clauses" : "terms & conditions"}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-10 py-2.5 h-12 bg-card/95 backdrop-blur-md border-border/90 rounded-2xl focus-visible:ring-magenta/30 text-sm shadow-xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Action Buttons: Share & Print */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="default"
                  onClick={copyPageLink}
                  className="h-12 px-4 rounded-2xl flex-1 sm:flex-none border-border/90 bg-card/95 hover:bg-card hover:text-magenta transition-all gap-2 shadow-xs font-semibold"
                >
                  {isCopiedPage ? (
                    <>
                      <Check className="h-4 w-4 text-success" />
                      <span className="text-xs">Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-4 w-4" />
                      <span className="text-xs">Share Link</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  size="default"
                  onClick={handlePrint}
                  className="h-12 px-4 rounded-2xl flex-1 sm:flex-none border-border/90 bg-card/95 hover:bg-card hover:text-magenta transition-all gap-2 shadow-xs font-semibold"
                >
                  <Printer className="h-4 w-4" />
                  <span className="text-xs">Print / PDF</span>
                </Button>
              </div>
            </motion.div>

            {/* Quick Category Filter Pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-1.5 mt-5 pt-2"
            >
              <span className="text-xs font-semibold text-muted-foreground mr-1 flex items-center gap-1">
                <SlidersHorizontal className="h-3 w-3" /> Filter:
              </span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 capitalize",
                    selectedTag === tag
                      ? "bg-magenta text-white font-bold shadow-xs shadow-magenta/20"
                      : "bg-card/80 hover:bg-card text-muted-foreground hover:text-foreground border border-border/60"
                  )}
                >
                  {tag === "all" ? "All Clauses" : tag}
                </button>
              ))}
            </motion.div>

            {/* Search Match Feedback */}
            {searchQuery && (
              <p className="text-xs font-medium text-muted-foreground mt-3">
                Found <strong className="text-magenta">{filteredSections.length}</strong> matching clause{filteredSections.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ─── Executive Summary / Key Highlights (At A Glance) ────────────── */}
      <section className="py-14 bg-marble/60 dark:bg-card/10 border-b border-border/60">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-9">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-wider uppercase text-magenta mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Executive Summary</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Key Commitments at a Glance
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md">
              A quick digest of our core pledges to students, colleges, mentors, and hiring partners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {highlights.map((h, idx) => {
              const Icon = ICON_MAP[h.iconName] || Shield;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  onClick={() => scrollToSection(h.targetSectionId)}
                  className="group relative bg-card/90 hover:bg-card border border-border/80 hover:border-magenta/50 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Subtle Corner Glow */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-magenta/5 rounded-full blur-2xl group-hover:bg-magenta/15 transition-all pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="inline-flex p-3 rounded-xl bg-magenta/10 group-hover:bg-magenta group-hover:text-white text-magenta transition-all duration-300 shadow-2xs">
                        <Icon className="h-5 w-5" />
                      </div>
                      {h.tag && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-muted text-muted-foreground">
                          {h.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-foreground group-hover:text-magenta transition-colors mb-2">
                      {h.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {h.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-border/50 flex items-center justify-between text-xs font-bold text-magenta opacity-90 group-hover:opacity-100 transition-all">
                    <span>Jump to full clause</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Mobile Sticky TOC Pill ──────────────────────────────────────── */}
      <div className="lg:hidden sticky top-16 z-30 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate text-xs">
            <span className="font-semibold text-muted-foreground">Clause:</span>
            <span className="font-bold text-foreground truncate">
              {sections.find((s) => s.id === activeSection)?.title || "Select Clause"}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            className="h-8 text-xs shrink-0 rounded-xl border-border font-bold gap-1.5"
          >
            <span>Table of Contents</span>
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", mobileTocOpen && "rotate-180")} />
          </Button>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileTocOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-border max-h-[60vh] overflow-y-auto space-y-1.5"
            >
              {sections.map((sec, i) => (
                <button
                  key={sec.id}
                  onClick={() => scrollToSection(sec.id)}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between",
                    activeSection === sec.id
                      ? "bg-magenta text-white shadow-xs"
                      : "text-foreground hover:bg-muted/80"
                  )}
                >
                  <span className="truncate">
                    {String(i + 1).padStart(2, "0")}. {sec.title}
                  </span>
                  {activeSection === sec.id && <CheckCircle2 className="h-4 w-4 shrink-0 ml-2" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Main Content Stream + Desktop Sticky Sidebar ───────────────── */}
      <Section variant="white" className="py-12 md:py-20">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          
          {/* Top Control Bar: View Mode Switcher (Full vs TL;DR) */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-border/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span>Showing:</span>
              <strong className="text-foreground">{filteredSections.length} of {sections.length}</strong>
              <span>Clauses</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="inline-flex p-1 rounded-xl bg-muted/80 border border-border/60 text-xs">
                <button
                  onClick={() => setViewMode("full")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
                    viewMode === "full"
                      ? "bg-card text-magenta shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Full Legal Text</span>
                </button>
                <button
                  onClick={() => setViewMode("summary")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5",
                    viewMode === "summary"
                      ? "bg-card text-magenta shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Zap className="h-3.5 w-3.5" />
                  <span>Plain English (TL;DR)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
            
            {/* Desktop Sticky Table of Contents Sidebar (4 cols) */}
            <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-6">
              {/* TOC Card */}
              <div className="bg-card/95 backdrop-blur-xl rounded-3xl border border-border/80 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/70">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-magenta" />
                    <span>Table of Contents</span>
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-magenta/10 text-magenta">
                    {scrollProgressPercent}% Read
                  </span>
                </div>

                <nav aria-label="Table of contents" className="space-y-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-1">
                  {sections.map((section, idx) => {
                    const isActive = activeSection === section.id;
                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={cn(
                          "relative w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center justify-between group",
                          isActive
                            ? "text-magenta font-extrabold bg-magenta/10 shadow-xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        )}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span
                            className={cn(
                              "text-xs font-mono font-bold shrink-0 transition-colors",
                              isActive
                                ? "text-magenta font-extrabold"
                                : "text-muted-foreground/60 group-hover:text-muted-foreground"
                            )}
                          >
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <span className="truncate">{section.title}</span>
                        </div>

                        {isActive && (
                          <motion.div
                            layoutId="activeTOCIndicator"
                            className="h-2 w-2 rounded-full bg-magenta shrink-0 shadow-[0_0_8px_rgba(235,59,90,0.8)]"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Sidebar Support Micro-card */}
              <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-magenta/5 via-card to-lavender/5 p-5 shadow-xs relative overflow-hidden">
                <div className="flex items-center gap-2 text-foreground font-bold text-sm mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span>Operations & Legal Desk</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Need official written verification or institutional data processing agreements?
                </p>
                <a
                  href={`mailto:${COMPANY.supportEmail}`}
                  className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold bg-magenta text-white hover:bg-magenta/90 shadow-xs transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Email Legal Team</span>
                </a>
              </div>
            </aside>

            {/* Main Articles Stream (8 cols) */}
            <main className="lg:col-span-8 space-y-8">
              {filteredSections.length === 0 ? (
                <div className="text-center py-20 px-6 bg-card/60 rounded-3xl border border-dashed border-border">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No Matching Clauses Found</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                    No policy clause matched &quot;{searchQuery}&quot;. Try adjusting your search query or category filter.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedTag("all");
                    }}
                    className="rounded-xl font-bold"
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                filteredSections.map((section, idx) => {
                  const originalIndex = sections.findIndex((s) => s.id === section.id);
                  const isHighlighted = activeSection === section.id;

                  return (
                    <motion.article
                      key={section.id}
                      id={section.id}
                      initial={{ opacity: 0, y: 25 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.45 }}
                      className={cn(
                        "group scroll-mt-24 rounded-3xl border p-6 sm:p-9 transition-all duration-300 relative overflow-hidden shadow-xs",
                        isHighlighted
                          ? "bg-card border-magenta/40 shadow-lg ring-1 ring-magenta/20"
                          : "bg-card/90 hover:bg-card border-border/80 hover:border-border"
                      )}
                    >
                      {/* Top Header Row with Number + Title + Permalink Copy */}
                      <div className="flex items-start justify-between gap-4 mb-6 pb-4 border-b border-border/70">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <span className="flex items-center justify-center h-9 w-9 sm:h-11 sm:w-11 rounded-2xl bg-magenta/10 text-magenta font-mono font-extrabold text-sm sm:text-base shrink-0 shadow-2xs">
                            {String(originalIndex + 1).padStart(2, "0")}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              {section.tag && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-muted text-muted-foreground">
                                  {section.tag}
                                </span>
                              )}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight group-hover:text-magenta transition-colors">
                              <HighlightText text={section.title} query={searchQuery} />
                            </h2>
                          </div>
                        </div>

                        {/* Copy Permalink Action */}
                        <button
                          onClick={() => copySectionLink(section.id)}
                          title="Copy permalink to this clause"
                          aria-label={`Copy link to section ${section.title}`}
                          className="p-2.5 rounded-xl text-muted-foreground hover:text-magenta hover:bg-magenta/10 transition-colors opacity-80 group-hover:opacity-100 shrink-0"
                        >
                          {copiedSectionId === section.id ? (
                            <Check className="h-4 w-4 text-success" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      {/* "In Plain English / TL;DR" Summary Box */}
                      {section.summary && (
                        <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-magenta/10 via-primary/5 to-transparent border border-magenta/20 shadow-2xs">
                          <div className="flex items-center gap-2 text-magenta font-extrabold text-xs uppercase tracking-wider mb-1.5">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>In Plain English:</span>
                          </div>
                          <p className="text-sm font-medium text-foreground/90 leading-relaxed">
                            <HighlightText text={section.summary} query={searchQuery} />
                          </p>
                        </div>
                      )}

                      {/* Key Takeaways / Bullet points */}
                      {section.keyPoints && section.keyPoints.length > 0 && (
                        <div className="mb-6 grid grid-cols-1 gap-2.5">
                          {section.keyPoints.map((point, kIdx) => (
                            <div
                              key={kIdx}
                              className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/80 bg-muted/40 p-3 rounded-xl border border-border/50"
                            >
                              <CheckCircle2 className="h-4 w-4 text-magenta shrink-0 mt-0.5" />
                              <span className="leading-relaxed">
                                <HighlightText text={point} query={searchQuery} />
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Detailed Legal Paragraphs (Shown in "full" mode) */}
                      {viewMode === "full" && (
                        <div className="space-y-4 pt-2">
                          {section.content.map((paragraph, pIdx) => {
                            const isCriticalSecurityOrIp =
                              (section.id === "data-security" && pIdx === 0) ||
                              (section.id === "intellectual-property" && pIdx === 0) ||
                              (section.id === "payments" && pIdx === 1);

                            return (
                              <div key={pIdx}>
                                {isCriticalSecurityOrIp ? (
                                  <div className="p-4 rounded-xl bg-card border border-magenta/25 text-foreground/90 my-2 shadow-2xs">
                                    <p className="text-xs sm:text-sm md:text-base leading-relaxed font-semibold">
                                      <HighlightText text={paragraph} query={searchQuery} />
                                    </p>
                                  </div>
                                ) : (
                                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                                    <HighlightText text={paragraph} query={searchQuery} />
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.article>
                  );
                })
              )}
            </main>
          </div>
        </div>
      </Section>

      {/* ─── Frequently Asked Legal Questions ───────────────────────────── */}
      {faqs && faqs.length > 0 && (
        <section className="py-16 bg-marble/60 dark:bg-card/10 border-t border-b border-border/60">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-1.5 text-xs font-extrabold tracking-wider uppercase text-magenta mb-2">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Frequently Asked</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Common Legal & Privacy Inquiries
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-lg mx-auto">
                Quick answers regarding offline cohort policies, credential verification, and learner rights.
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-3.5">
              {faqs.map((faq, fIdx) => (
                <AccordionItem
                  key={fIdx}
                  value={`faq-${fIdx}`}
                  className="bg-card/95 border border-border/80 rounded-2xl px-5 sm:px-6 shadow-xs overflow-hidden transition-all duration-200"
                >
                  <AccordionTrigger className="text-sm sm:text-base font-bold text-foreground hover:text-magenta py-4 text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-1 pb-5 border-t border-border/40">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* ─── Bottom Contact CTA Banner ──────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-b from-background via-background to-marble/40">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl border border-border/90 bg-gradient-to-br from-card via-card to-magenta/5 p-8 sm:p-14 text-center shadow-xl relative overflow-hidden">
            {/* Ambient Corner Flares */}
            <div className="absolute -top-14 -right-14 w-56 h-56 bg-magenta/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-14 -left-14 w-56 h-56 bg-lavender/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-xl mx-auto">
              <div className="inline-flex p-3.5 rounded-2xl bg-magenta/10 text-magenta mb-2 shadow-2xs">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                {isPrivacy
                  ? "Questions about our data protections?"
                  : "Need further operational clarity?"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
                We believe in 100% transparency for our students, mentors, and partner colleges. Reach out anytime.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-magenta text-white hover:bg-magenta/90 shadow-md rounded-2xl font-bold gap-2 px-6 h-12"
                >
                  <a href={`mailto:${COMPANY.supportEmail}`}>
                    <Mail className="h-4 w-4" />
                    <span>Email Support Desk</span>
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-2xl border-border/80 bg-card hover:bg-muted font-bold gap-2 px-6 h-12"
                >
                  <Link href="/contact">
                    <span>Contact Us Form</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="pt-6 border-t border-border/60 text-xs text-muted-foreground flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                <span>Related Documents:</span>
                {type !== "privacy" && (
                  <Link
                    href="/privacy"
                    className="text-magenta hover:underline font-extrabold inline-flex items-center gap-1"
                  >
                    <span>Privacy Policy</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
                {type !== "terms" && (
                  <>
                    {type !== "privacy" && <span>•</span>}
                    <Link
                      href="/terms"
                      className="text-magenta hover:underline font-extrabold inline-flex items-center gap-1"
                    >
                      <span>Terms of Service</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </>
                )}
                {type !== "refund" && (
                  <>
                    <span>•</span>
                    <Link
                      href="/refund"
                      className="text-magenta hover:underline font-extrabold inline-flex items-center gap-1"
                    >
                      <span>Refund Policy</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </>
                )}
                <span>•</span>
                <Link href="/about" className="text-foreground/80 hover:text-magenta transition-colors">
                  About GrowthCraft
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Floating Action Widget (Back to Top & Reading Ring) ─────────── */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
          >
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="relative group p-3.5 rounded-full bg-magenta text-white shadow-xl shadow-magenta/30 hover:bg-magenta/90 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center"
            >
              {/* Progress Ring SVG */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="19"
                  fill="none"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="2.5"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="19"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  strokeDasharray="119.38"
                  strokeDashoffset={119.38 - (119.38 * scrollProgressPercent) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <ArrowUp className="h-5 w-5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
