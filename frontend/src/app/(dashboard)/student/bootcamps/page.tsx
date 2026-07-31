"use client";

import { Rocket } from "lucide-react";
import { StudentEnrollmentGrid, type EnrollmentGridItem } from "@/components/dashboard/student-enrollment-grid";
import { useStudentBootcamps } from "@/hooks/queries/useStudent";
import { resolveRef } from "@/lib/student-dashboard.utils";

export default function StudentBootcampsPage() {
  const { data, isLoading, isError } = useStudentBootcamps();

  const items: EnrollmentGridItem[] = (data?.data?.bootcamps ?? []).map((e) => {
    const event = resolveRef(e.eventId);
    const slug = event?.slug || "fullstack-web-dev-bootcamp-2026";
    return {
      id: e._id,
      title: event?.title ?? e.title,
      subtitle: event?.mode || event?.domain,
      status: e.status,
      paymentStatus: e.paymentStatus || (e.status === "confirmed" ? "completed" : "pending"),
      enrollmentDate: e.enrollmentDate,
      href: `/events/${slug}`,
      workspaceHref: `/student/bootcamps/${slug}`,
      emoji: "🚀",
    };
  });

  return (
    <StudentEnrollmentGrid
      pageTitle="My Bootcamps"
      pageDescription="Bootcamps you've registered for"
      items={items}
      isLoading={isLoading}
      isError={isError}
      icon={<Rocket className="h-12 w-12" />}
      emptyTitle="No bootcamps yet"
      emptyDescription="You haven't registered for any bootcamps."
      browseHref="/events?tab=bootcamps"
      browseLabel="Browse Bootcamps"
    />
  );
}
