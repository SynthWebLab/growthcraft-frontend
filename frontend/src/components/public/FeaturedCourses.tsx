"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { DataCard } from "@/components/ui/data-card";
import { useCourses } from "@/hooks/queries/useCourses";
import { useTrainingPrograms } from "@/hooks/queries/useTrainingPrograms";
import { useEvents } from "@/hooks/queries/useEvents";
import {
  Clock,
  BookOpen,
  Star,
  User,
  Loader2,
  Briefcase,
  Calendar,
  ArrowRight,
  Sparkles,
  Flame,
  Layers,
} from "lucide-react";

type CatalogueTab = "courses" | "training-programs" | "events";

export const FeaturedCourses = () => {
  const [activeTab, setActiveTab] = useState<CatalogueTab>("courses");
  const [selectedCourseCategory, setSelectedCourseCategory] = useState<string>("All");

  // Fetch Courses (limit 6)
  const { data: coursesData, isLoading: coursesLoading } = useCourses({
    limit: 6,
    category: selectedCourseCategory === "All" ? undefined : selectedCourseCategory,
  });
  const rawCourses = (coursesData as any)?.items || (coursesData as any)?.data || [];
  const courses = useMemo(() => {
    return [...rawCourses].sort(
      (a, b) => (b.isFeatured || b.is_featured ? 1 : 0) - (a.isFeatured || a.is_featured ? 1 : 0)
    );
  }, [rawCourses]);

  // Fetch Training Programs (limit 6)
  const { data: tpData, isLoading: tpLoading } = useTrainingPrograms({ limit: 6 });
  const rawTrainingPrograms = (tpData as any)?.data || [];
  const trainingPrograms = useMemo(() => {
    return [...rawTrainingPrograms].sort(
      (a, b) => (b.isFeatured || b.is_featured ? 1 : 0) - (a.isFeatured || a.is_featured ? 1 : 0)
    );
  }, [rawTrainingPrograms]);

  // Fetch Events (limit 6)
  const { data: eventsData, isLoading: eventsLoading } = useEvents({ limit: 6 });
  const rawEvents = (eventsData as any)?.data || (eventsData as any)?.items || [];
  const events = useMemo(() => {
    return [...rawEvents];
  }, [rawEvents]);

  const isLoading =
    (activeTab === "courses" && coursesLoading) ||
    (activeTab === "training-programs" && tpLoading) ||
    (activeTab === "events" && eventsLoading);

  // Tab configurations
  const tabs = [
    {
      id: "courses" as CatalogueTab,
      label: "Courses",
      subtitle: "Job-Ready Tech Stacks",
      icon: BookOpen,
      count: courses.length,
      viewAllHref: "/courses",
      viewAllText: "Explore All Courses",
    },
    {
      id: "training-programs" as CatalogueTab,
      label: "Training Programs",
      subtitle: "Offline Campus Internships",
      icon: Briefcase,
      count: trainingPrograms.length,
      viewAllHref: "/training-programs",
      viewAllText: "Explore All Training Programs",
    },
    {
      id: "events" as CatalogueTab,
      label: "Events",
      subtitle: "Live Hands-on Workshops & Bootcamps",
      icon: Calendar,
      count: events.length,
      viewAllHref: "/events",
      viewAllText: "Explore All Events",
    },
  ];

  const currentTabConfig = tabs.find((t) => t.id === activeTab) || tabs[0];

  const courseCategories = [
    "All",
    "Web Development",
    "Programming",
    "Data Science",
    "DevOps",
    "Design",
    "Business",
  ];

  return (
    <Section variant="graphite" className="relative overflow-hidden !py-12 sm:!py-16 md:!py-20 lg:!py-24">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-magenta/10 border border-magenta/20 text-magenta text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Learning Paths</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
            Built for builders. Taught by builders.
          </h2>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto mt-3">
            Explore industry-vetted courses, intensive campus internships, and hands-on bootcamps.
          </p>
        </div>

        {/* Primary Offering Tabs */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl overflow-x-auto max-w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? "bg-magenta text-white shadow-lg shadow-magenta/25 scale-[1.02]"
                      : "text-white/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-white/60"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sub-Category Filter for Courses */}
        {activeTab === "courses" && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 animate-fade-in">
            {courseCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCourseCategory(category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCourseCategory === category
                    ? "bg-white/20 text-white border border-white/30"
                    : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-transparent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-magenta mb-3" />
            <p className="text-white/50 text-xs sm:text-sm">Loading {currentTabConfig.label}...</p>
          </div>
        )}

        {/* Tab 1: Courses Content */}
        {!isLoading && activeTab === "courses" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
            {courses.map((course: any) => (
              <DataCard
                key={course._id || course.id}
                variant="dark"
                className="h-full flex flex-col hover:border-magenta/40 transition-all duration-300 group"
              >
                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-magenta/20 text-magenta text-[11px] font-semibold border border-magenta/30">
                    {course.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full border border-white/20 text-white/70 text-[11px]">
                    {course.difficultyLevel || course.level}
                  </span>
                  {(course.isFeatured || course.is_featured) && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30 flex items-center gap-1">
                      <Flame className="h-3 w-3" /> Trending
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-magenta transition-colors mb-2 line-clamp-2">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4 line-clamp-2 flex-grow">
                  {course.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-3 text-xs text-white/50 mb-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-lavender" />
                    {course.instructorName || course.instructor?.name || "GrowthCraft Mentor"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-lavender" />
                    {course.duration || course.totalHours || 20}h
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-lavender" />
                    {course.lessonsCount || 15} lessons
                  </span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-bold text-white">
                      ₹{course.price?.toLocaleString()}
                    </span>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="text-xs sm:text-sm line-through text-white/40">
                        ₹{course.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-xs sm:text-sm font-semibold text-magenta hover:text-white transition-colors flex items-center gap-1 group-hover:translate-x-1 duration-200"
                  >
                    {course.primaryCTA || "Enroll Now"} →
                  </Link>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-white/60">
                    {course.rating || 4.8} · {(course.enrollmentCount || 0).toLocaleString()} enrolled
                  </span>
                </div>
              </DataCard>
            ))}
          </div>
        )}

        {/* Tab 2: Training Programs Content */}
        {!isLoading && activeTab === "training-programs" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
            {trainingPrograms.map((program: any) => (
              <DataCard
                key={program._id}
                variant="dark"
                className="h-full flex flex-col hover:border-magenta/40 transition-all duration-300 group"
              >
                {/* Header tags */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-magenta/20 text-magenta text-[11px] font-semibold border border-magenta/30">
                    {program.domain}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full border border-white/20 text-white/70 text-[11px]">
                    {program.level}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30 flex items-center gap-1">
                    <Briefcase className="h-3 w-3" /> Internship
                  </span>
                </div>

                {/* Program Name as Title */}
                <h3 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-magenta transition-colors mb-1 line-clamp-1">
                  {program.programName || program.title}
                </h3>

                {/* Full Title as Subtitle */}
                {program.fullTitle && (
                  <p className="text-xs font-semibold text-lavender/90 mb-2 line-clamp-1">
                    {program.fullTitle}
                  </p>
                )}

                {/* Description */}
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4 line-clamp-2 flex-grow">
                  {program.description}
                </p>

                {/* Duration & Tools */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <Clock className="h-3.5 w-3.5 text-lavender" />
                    <span>{program.durationDays || program.duration || 40} Days Intensive</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {program.tools?.slice(0, 3).map((tool: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-white/80 border border-white/10"
                      >
                        {tool}
                      </span>
                    ))}
                    {program.tools?.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-white/50">
                        +{program.tools.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-bold text-white">
                      ₹{program.price?.toLocaleString()}
                    </span>
                    {program.originalPrice && program.originalPrice > program.price && (
                      <span className="text-xs sm:text-sm line-through text-white/40">
                        ₹{program.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/training-programs/${program.slug}`}
                    className="text-xs sm:text-sm font-semibold text-magenta hover:text-white transition-colors flex items-center gap-1 group-hover:translate-x-1 duration-200"
                  >
                    Apply Now →
                  </Link>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-white/60">
                    {program.rating || 4.8} · {(program.enrollmentCount || 0).toLocaleString()} enrolled
                  </span>
                </div>
              </DataCard>
            ))}
          </div>
        )}

        {/* Tab 3: Events Content */}
        {!isLoading && activeTab === "events" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
            {events.map((event: any) => (
              <DataCard
                key={event._id}
                variant="dark"
                className="h-full flex flex-col hover:border-magenta/40 transition-all duration-300 group"
              >
                {/* Header tags */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-magenta/20 text-magenta text-[11px] font-semibold border border-magenta/30 capitalize">
                    {event.type || "Workshop"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full border border-white/20 text-white/70 text-[11px]">
                    {event.mode || "Offline"}
                  </span>
                  {event.category && (
                    <span className="px-2.5 py-0.5 rounded-full border border-white/20 text-white/70 text-[11px]">
                      {event.category}
                    </span>
                  )}
                  {event.status === "Open" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-500/30">
                      Open
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold font-display text-white group-hover:text-magenta transition-colors mb-2 line-clamp-2">
                  {event.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4 line-clamp-2 flex-grow">
                  {event.description}
                </p>

                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs text-white/50 mb-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-lavender" />
                    {event.mentorName || (Array.isArray(event.mentorNames) ? event.mentorNames[0] : "GrowthCraft Mentor")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-lavender" />
                    {event.duration ? `${event.duration}h` : event.durationDays ? `${event.durationDays} Days` : "Full Day"}
                  </span>
                  {event.availableSeats !== undefined && event.availableSeats > 0 && (
                    <span className="flex items-center gap-1 text-emerald-400">
                      • {event.availableSeats} seats left
                    </span>
                  )}
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10 mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-bold text-white">
                      {event.price && event.price > 0 ? `₹${event.price.toLocaleString()}` : "Free"}
                    </span>
                    {event.originalPrice && event.originalPrice > event.price && (
                      <span className="text-xs sm:text-sm line-through text-white/40">
                        ₹{event.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/events/${event.slug}`}
                    className="text-xs sm:text-sm font-semibold text-magenta hover:text-white transition-colors flex items-center gap-1 group-hover:translate-x-1 duration-200"
                  >
                    {event.primaryCTA || "Register Now"} →
                  </Link>
                </div>

                {/* Rating / Enrolled */}
                <div className="flex items-center gap-1 mt-2.5">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-xs text-white/60">
                    {event.rating || 4.9} · {(event.enrolledCount || event.enrollmentCount || 0).toLocaleString()}{" "}
                    registered
                  </span>
                </div>
              </DataCard>
            ))}
          </div>
        )}

        {/* Dynamic "Explore All" / "More" Action Button */}
        <div className="text-center mt-10 sm:mt-12 md:mt-14">
          <Link
            href={currentTabConfig.viewAllHref}
            className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-magenta to-lavender text-white font-bold text-sm sm:text-base shadow-xl shadow-magenta/20 hover:shadow-magenta/40 hover:scale-[1.03] transition-all duration-300 group"
          >
            <span>{currentTabConfig.viewAllText}</span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </div>
      </div>
    </Section>
  );
};
