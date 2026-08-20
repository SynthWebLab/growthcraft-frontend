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
    const seen = new Set<string>();
    const result: ChatContact[] = [];

    for (const s of mentees) {
      const id = s.id || s._id || s.userId?._id || s.userId || "";
      if (!id || seen.has(id)) continue;
      seen.add(id);

      result.push({
        id,
        name: s.name || s.fullName || s.userId?.fullName || "Student",
        course: s.course || (s.batchId?.code ? `Batch ${s.batchId.code}` : "Cohort Student"),
        role: "Student",
      });
    }

    return result;
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
