"use client";

import { Presentation } from "lucide-react";
import { StudentEnrollmentGrid, type EnrollmentGridItem } from "@/components/dashboard/student-enrollment-grid";
import { useStudentWorkshops } from "@/hooks/queries/useStudent";
import { resolveRef } from "@/lib/student-dashboard.utils";

export default function StudentWorkshopsPage() {
  const { data, isLoading, isError } = useStudentWorkshops();

  const items: EnrollmentGridItem[] = (data?.data?.workshops ?? []).map((e) => {
    const event = resolveRef(e.eventId);
    const slug = event?.slug || "fullstack-ai-workshop-2026";
    return {
      id: e._id,
      title: event?.title ?? e.title,
      subtitle: event?.mode || event?.domain,
      status: e.status,
      paymentStatus: e.paymentStatus || (e.status === "confirmed" ? "completed" : "pending"),
      enrollmentDate: e.enrollmentDate,
      href: `/events/${slug}`,
      workspaceHref: `/student/workshops/${slug}`,
      emoji: "🛠️",
    };
  });

  return (
    <StudentEnrollmentGrid
      pageTitle="My Workshops"
      pageDescription="Workshops you've registered for"
      items={items}
      isLoading={isLoading}
      isError={isError}
      icon={<Presentation className="h-12 w-12" />}
      emptyTitle="No workshops yet"
      emptyDescription="You haven't registered for any workshops."
      browseHref="/events?tab=workshops"
      browseLabel="Browse Workshops"
    />
  );
}
