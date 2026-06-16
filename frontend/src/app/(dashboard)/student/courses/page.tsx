"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { PanelEmptyState } from "@/components/panel";
import { BookOpen } from "lucide-react";
import { useStudentCourses } from "@/hooks/queries/useStudent";
import { formatDate, resolveRef, statusBadge } from "@/lib/student-dashboard.utils";
import type { EnrollmentStatus } from "@/types/student";

type Filter = "all" | "confirmed" | "pending";

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Pending", value: "pending" },
];

function StudentCoursesContent() {
  const [filter, setFilter] = useState<Filter>("all");
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const { data, isLoading, isError } = useStudentCourses();
  const courses = data?.data?.courses ?? [];

  const countFor = (value: Filter) =>
    value === "all"
      ? courses.length
      : courses.filter((c) => c.status === (value as EnrollmentStatus)).length;

  const filtered = courses.filter((c) => {
    const course = resolveRef(c.courseId);
    const title = (course?.title ?? c.title ?? "").toLowerCase();
    const matchesQuery = title.includes(q.toLowerCase());
    const matchesFilter = filter === "all" || c.status === (filter as EnrollmentStatus);
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        description="Track your enrolled courses"
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-44 rounded-xl border border-border bg-white animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <PanelEmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="Couldn't load your courses"
          description="Something went wrong. Please refresh and try again."
        />
      ) : courses.length === 0 ? (
        <PanelEmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="No courses yet"
          description="You haven't enrolled in any courses. Explore the catalogue to get started!"
          action={
            <Link href="/courses">
              <Button className="bg-magenta text-white hover:bg-magenta/90">
                Browse Courses
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f.value
                    ? "bg-magenta text-white"
                    : "bg-white border border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {f.label} ({countFor(f.value)})
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <PanelEmptyState
              icon={<BookOpen className="h-12 w-12" />}
              title="No results found"
              description={`We couldn't find any courses matching "${q}".`}
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((enrollment) => {
                const course = resolveRef(enrollment.courseId);
                const badge = statusBadge(enrollment.status);
                const title = course?.title ?? enrollment.title;
                return (
                  <DataCard key={enrollment._id}>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">📘</span>
                      <Badge variant="secondary" className={badge.className}>
                        {badge.label}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-foreground text-sm mb-1">
                      {title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      {course?.category ? `${course.category} · ` : ""}
                      Enrolled {formatDate(enrollment.enrollmentDate)}
                    </p>

                    {course?.slug && (
                      <Link href={`/courses/${course.slug}`}>
                        <Button size="sm" variant="outline" className="w-full">
                          View Course
                        </Button>
                      </Link>
                    )}
                  </DataCard>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function StudentCoursesPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <PageHeader
            title="My Courses"
            description="Track your enrolled courses"
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-44 rounded-xl border border-border bg-white animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <StudentCoursesContent />
    </Suspense>
  );
}
