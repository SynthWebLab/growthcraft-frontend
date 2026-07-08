"use client";

import { Section } from "@/components/ui/section";
import { DataCard } from "@/components/ui/data-card";
import { useCourses } from "@/hooks/queries/useCourses";
import { Clock, BookOpen, Star, User, Loader2 } from "lucide-react";
import Link from "next/link";
export const FeaturedCourses = () => {
  const { data: coursesData, isLoading } = useCourses({ limit: 6 });
  const featured = (coursesData as any)?.items || coursesData?.data || [];

  return (
    <Section variant="graphite" className="relative overflow-hidden !py-8 sm:!py-12 md:!py-16 lg:!py-20">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-14 animate-fade-up">
          <p className="text-xs sm:text-sm uppercase tracking-widest text-white/50 mb-2 sm:mb-3">
            Courses
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white">
            Built for builders. Taught by builders.
          </h2>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {/* Course Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {featured.map((course: any) => (
              <DataCard
                key={course._id}
                variant="dark"
                className="h-full flex flex-col"
              >
                {/* Tags */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-xs font-semibold">
                    {course.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full border border-white/20 text-white/70 text-xs">
                    {course.difficultyLevel}
                  </span>
                  {course.status === "Coming Soon" && (
                    <span className="px-2.5 py-0.5 rounded-full bg-secondary text-white text-xs font-semibold">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold font-display text-white mb-2 sm:mb-3">
                  {course.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-3 sm:mb-4 flex-grow">
                  {course.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-2 sm:gap-3 text-xs text-white/50 mb-3 sm:mb-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-secondary" />
                    {course.instructorName}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-secondary" />
                    {course.duration}h
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-secondary" />
                    {course.lessonsCount} lessons
                  </span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base sm:text-lg font-bold text-white">
                      ₹{course.price.toLocaleString()}
                    </span>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="text-xs sm:text-sm line-through text-white/40">
                        ₹{course.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="text-xs sm:text-sm font-medium text-secondary hover:text-white transition-colors"
                  >
                    {course.primaryCTA || "View Details"} →
                  </Link>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-2 sm:mt-3">
                  <Star
                    className="h-3.5 w-3.5 fill-current"
                    style={{ color: "#fbbf24" }}
                  />
                  <span className="text-xs text-white/60">
                    {course.rating} · {course.enrollmentCount.toLocaleString()}{" "}
                    enrolled
                  </span>
                </div>
              </DataCard>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
};
