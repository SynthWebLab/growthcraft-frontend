"use client";

import { GraduationCap } from "lucide-react";
import { StudentEnrollmentGrid, type EnrollmentGridItem } from "@/components/dashboard/student-enrollment-grid";
import { useStudentTrainingPrograms } from "@/hooks/queries/useStudent";
import { resolveRef } from "@/lib/student-dashboard.utils";

export default function StudentTrainingProgramsPage() {
  const { data, isLoading, isError } = useStudentTrainingPrograms();

  const items: EnrollmentGridItem[] = (data?.data?.trainingPrograms ?? []).map((e) => {
    const program = resolveRef(e.programId);
    return {
      id: e._id,
      title: program?.title ?? e.title,
      subtitle: program?.domain,
      status: e.status,
      enrollmentDate: e.enrollmentDate,
      href: program?.slug
        ? (e.status === "confirmed" ? `/student/courses/${program.slug}` : `/training-programs/${program.slug}`)
        : undefined,
      emoji: "💼",
    };
  });

  return (
    <StudentEnrollmentGrid
      pageTitle="My Training Programs"
      pageDescription="Training programs you've enrolled in"
      items={items}
      isLoading={isLoading}
      isError={isError}
      icon={<GraduationCap className="h-12 w-12" />}
      emptyTitle="No training programs yet"
      emptyDescription="You haven't enrolled in any training programs."
      browseHref="/training-programs"
      browseLabel="Browse Training Programs"
    />
  );
}
