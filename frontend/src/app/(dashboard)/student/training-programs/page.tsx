"use client";

import { GraduationCap } from "lucide-react";
import { StudentEnrollmentGrid, type EnrollmentGridItem } from "@/components/dashboard/student-enrollment-grid";
import { useStudentTrainingPrograms } from "@/hooks/queries/useStudent";
import { resolveRef } from "@/lib/student-dashboard.utils";

export default function StudentTrainingProgramsPage() {
  const { data, isLoading, isError } = useStudentTrainingPrograms();

  const items: EnrollmentGridItem[] = (data?.data?.trainingPrograms ?? []).map((e) => {
    const program = resolveRef(e.programId);
    const slug = program?.slug || "industrial-software-engineering-program";
    return {
      id: e._id,
      title: program?.programName || program?.title || e.title || "Training Program",
      subtitle: program?.fullTitle || program?.domain || "Industrial Training",
      status: e.status,
      paymentStatus: e.paymentStatus || (e.status === "confirmed" ? "completed" : "pending"),
      enrollmentDate: e.createdAt || e.enrollmentDate || new Date().toISOString(),
      href: `/training-programs/${slug}`,
      workspaceHref: `/student/training-programs/${slug}`,
      emoji: "💼",
      type: "training-program",
    };
  });

  return (
    <StudentEnrollmentGrid
      pageTitle="My Training Programs"
      pageDescription="Industrial training programs you've enrolled in"
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
