"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ChatWindow, type ChatContact } from "@/components/dashboard/ChatWindow";
import { useStudentMentors } from "@/hooks/queries/useStudent";
import { PageHeader } from "@/components/ui/page-header";

export default function StudentDoubtSessionsPage() {
  const searchParams = useSearchParams();
  const defaultSelectedId = searchParams.get("userId");

  const { data: mentorsResponse, isLoading } = useStudentMentors();

  const mentors = useMemo(() => {
    return mentorsResponse?.data?.mentors ?? [];
  }, [mentorsResponse]);

  const contacts = useMemo<ChatContact[]>(() => {
    const seen = new Set<string>();
    const result: ChatContact[] = [];

    for (const m of mentors) {
      const id = m.userId?._id || m.userId || m.id || m._id || "";
      if (!id || seen.has(id)) continue;
      seen.add(id);

      result.push({
        id,
        name: m.userId?.fullName || m.fullName || m.name || "Assigned Mentor",
        course: m.areaOfExpertise || m.specializations?.join(", ") || "Mentor",
        role: "Mentor",
      });
    }

    return result;
  }, [mentors]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doubt Sessions"
        description="Communicate with your assigned cohort mentors and schedule 1-on-1 Google Meet sessions."
      />
      <ChatWindow
        contacts={contacts}
        contactsLoading={isLoading}
        role="student"
        defaultSelectedId={defaultSelectedId}
      />
    </div>
  );
}
