"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import PageHeader from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { Play, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

type Status = "all" | "active" | "completed" | "dropped";

const enrolledCourses = [
  {
    id: "1",
    title: "Full Stack Web Development",
    progress: 68,
    totalLessons: 42,
    completed: 28,
    category: "Web Dev",
    status: "active" as const,
    image: "🌐",
    slug: "full-stack-web",
  },
  {
    id: "2",
    title: "Data Science with Python",
    progress: 35,
    totalLessons: 36,
    completed: 13,
    category: "Data Science",
    status: "active" as const,
    image: "📊",
    slug: "data-science-python",
  },
  {
    id: "3",
    title: "React & Next.js Masterclass",
    progress: 90,
    totalLessons: 30,
    completed: 27,
    category: "Frontend",
    status: "active" as const,
    image: "⚛️",
    slug: "react-nextjs",
  },
  {
    id: "4",
    title: "UI/UX Design Fundamentals",
    progress: 100,
    totalLessons: 20,
    completed: 20,
    category: "Design",
    status: "completed" as const,
    image: "🎨",
    slug: "uiux-design",
  },
  {
    id: "5",
    title: "Python Basics",
    progress: 15,
    totalLessons: 24,
    completed: 4,
    category: "Programming",
    status: "dropped" as const,
    image: "🐍",
    slug: "python-basics",
  },
];

const filters: { label: string; value: Status }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
  { label: "Dropped", value: "dropped" },
];

export default function StudentCoursesPage() {
  const [filter, setFilter] = useState<Status>("all");

  const filtered =
    filter === "all"
      ? enrolledCourses
      : enrolledCourses.filter((c) => c.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Courses"
        description="Track your enrolled courses and learning progress"
      />

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count =
            f.value === "all"
              ? enrolledCourses.length
              : enrolledCourses.filter((c) => c.status === f.value).length;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === f.value
                  ? "bg-magenta text-white"
                  : "bg-white border border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Course Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <DataCard key={course.id}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{course.image}</span>
              <Badge
                variant={
                  course.status === "completed"
                    ? "default"
                    : course.status === "dropped"
                    ? "destructive"
                    : "secondary"
                }
                className={
                  course.status === "completed"
                    ? "bg-success text-white"
                    : course.status === "active"
                    ? "bg-magenta/10 text-magenta"
                    : ""
                }
              >
                {course.status === "active" && "Active"}
                {course.status === "completed" && (
                  <>
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
                  </>
                )}
                {course.status === "dropped" && (
                  <>
                    <XCircle className="h-3 w-3 mr-1" /> Dropped
                  </>
                )}
              </Badge>
            </div>

            <h3 className="font-semibold text-foreground text-sm mb-1">
              {course.title}
            </h3>
            <p className="text-xs text-muted-foreground mb-3">
              {course.category} · {course.completed}/{course.totalLessons}{" "}
              lessons
            </p>

            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span className="font-medium text-magenta">
                  {course.progress}%
                </span>
              </div>
              <Progress
                value={course.progress}
                className="h-2"
                indicatorClassName="bg-magenta"
              />
            </div>

            {course.status === "active" && (
              <Link href={`/student/courses/${course.slug}/learn`}>
                <Button
                  size="sm"
                  className="w-full bg-magenta text-white hover:bg-magenta/90"
                >
                  <Play className="h-3.5 w-3.5 mr-1.5" /> Continue
                </Button>
              </Link>
            )}
            {course.status === "completed" && (
              <Link href="/student/certificates">
                <Button size="sm" variant="outline" className="w-full">
                  View Certificate
                </Button>
              </Link>
            )}
          </DataCard>
        ))}
      </div>
    </div>
  );
}
