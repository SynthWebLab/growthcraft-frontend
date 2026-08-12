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
    return mentors.map((m: any) => ({
      id: m.userId?._id || "",
      name: m.userId?.fullName || "Assigned Mentor",
      course: m.areaOfExpertise || "Mentor",
      role: "Mentor",
    }));
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
