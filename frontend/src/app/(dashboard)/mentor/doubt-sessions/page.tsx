"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ChatWindow, type ChatContact } from "@/components/dashboard/ChatWindow";
import { useMentorStudents } from "@/hooks/queries/useMentor";
import { PageHeader } from "@/components/ui/page-header";

export default function MentorDoubtSessionsPage() {
  const searchParams = useSearchParams();
  const defaultSelectedId = searchParams.get("userId");

  const { data: studentsResponse, isLoading } = useMentorStudents();

  const mentees = useMemo(() => {
    return studentsResponse?.data?.students ?? [];
  }, [studentsResponse]);

  const contacts = useMemo<ChatContact[]>(() => {
    return mentees.map((s: any) => ({
      id: s.id || "",
      name: s.name || "Student",
      course: s.course || "Cohort Student",
      role: "Student",
    }));
  }, [mentees]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Doubt Sessions"
        description="Review student doubts, schedule Google Meet sessions, and check joining requests."
      />
      <ChatWindow
        contacts={contacts}
        contactsLoading={isLoading}
        role="mentor"
        defaultSelectedId={defaultSelectedId}
      />
    </div>
  );
}
