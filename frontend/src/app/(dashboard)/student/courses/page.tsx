"use client";

import { BookOpen } from "lucide-react";
import { StudentEnrollmentGrid, type EnrollmentGridItem } from "@/components/dashboard/student-enrollment-grid";
import { useStudentCourses } from "@/hooks/queries/useStudent";
import { resolveRef } from "@/lib/student-dashboard.utils";

export default function StudentCoursesPage() {
  const { data, isLoading, isError } = useStudentCourses();

  const items: EnrollmentGridItem[] = (data?.data?.courses ?? [])
    .filter((e) => {
      const isPaid = e.paymentStatus === "completed" || e.status === "confirmed";
      return isPaid && e.paymentStatus !== "pending" && e.status !== "pending";
    })
    .map((e) => {
      const course = resolveRef(e.courseId);
      const slug = course?.slug || "full-stack-web-development";
      return {
        id: e._id,
        title: course?.title ?? e.title,
        subtitle: course?.category || course?.difficultyLevel || "Development",
        status: e.status,
        paymentStatus: e.paymentStatus || (e.status === "confirmed" ? "completed" : "pending"),
        enrollmentDate: e.createdAt || e.enrollmentDate || new Date().toISOString(),
        href: `/courses/${slug}`,
        workspaceHref: `/student/courses/${slug}`,
        emoji: "📚",
        type: "course",
      };
    });

  return (
    <StudentEnrollmentGrid
      pageTitle="My Courses"
      pageDescription="Track your enrolled courses and active learning modules"
      items={items}
      isLoading={isLoading}
      isError={isError}
      icon={<BookOpen className="h-12 w-12" />}
      emptyTitle="No courses yet"
      emptyDescription="You haven't enrolled in any courses."
      browseHref="/courses"
      browseLabel="Browse Courses"
    />
  );
}
