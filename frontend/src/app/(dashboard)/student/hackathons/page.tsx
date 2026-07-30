"use client";

import { Trophy } from "lucide-react";
import { StudentEnrollmentGrid, type EnrollmentGridItem } from "@/components/dashboard/student-enrollment-grid";
import { useStudentHackathons } from "@/hooks/queries/useStudent";
import { resolveRef } from "@/lib/student-dashboard.utils";

export default function StudentHackathonsPage() {
  const { data, isLoading, isError } = useStudentHackathons();

  const items: EnrollmentGridItem[] = (data?.data?.hackathons ?? []).map((e) => {
    const event = resolveRef(e.eventId);
    const slug = event?.slug || "build-a-thon-2026";
    return {
      id: e._id,
      title: event?.title ?? e.title,
      subtitle: event?.mode || event?.domain,
      status: e.status,
      enrollmentDate: e.enrollmentDate,
      href: `/events/${slug}`,
      workspaceHref: `/student/hackathons/${slug}`,
      emoji: "🏆",
    };
  });

  return (
    <StudentEnrollmentGrid
      pageTitle="My Hackathons"
      pageDescription="Hackathons you've registered for"
      items={items}
      isLoading={isLoading}
      isError={isError}
      icon={<Trophy className="h-12 w-12" />}
      emptyTitle="No hackathons yet"
      emptyDescription="You haven't registered for any hackathons."
      browseHref="/events"
      browseLabel="Browse Hackathons"
    />
  );
}
