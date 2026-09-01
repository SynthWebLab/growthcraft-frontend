"use client";

import { PageHeader } from "@/components/ui/page-header";
import PanelDataTable, { type Column } from "@/components/panel/PanelDataTable";
import { useMentorStudents } from "@/hooks/queries/useMentor";
import type { MentorStudent } from "@/types/mentor";

const columns: Column<MentorStudent>[] = [
  {
    key: "name",
    label: "Student",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
          {row.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <span className="font-medium text-sm">{row.name}</span>
      </div>
    ),
  },
  { key: "course", label: "Course", sortable: true },
  { key: "sessionsCompleted", label: "Sessions", sortable: true },
  { key: "lastSession", label: "Last Session", sortable: true },
  { key: "nextSession", label: "Next Session", sortable: true },
];

const StudentsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <div className="h-8 w-48 bg-muted/40 rounded" />
      <div className="h-4 w-80 bg-muted/40 rounded" />
    </div>
    <div className="h-96 bg-muted/40 rounded-xl" />
  </div>
);

const MentorStudents = () => {
  const { data: studentsResponse, isLoading, error } = useMentorStudents();

  const mobileRender = (row: MentorStudent) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
            {row.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="min-w-0">
            <span className="font-semibold text-sm text-foreground block truncate">{row.name}</span>
            <span className="text-xs text-muted-foreground block truncate">{row.course}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs pt-1.5 border-t border-border/40">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase">Sessions</span>
            <span className="font-semibold text-foreground">{row.sessionsCompleted}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase">Last Session</span>
            <span className="font-medium text-foreground">{row.lastSession || "-"}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase">Next Session</span>
            <span className="font-medium text-foreground">{row.nextSession || "-"}</span>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <StudentsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <p className="text-red-500 font-medium">Failed to load students directory</p>
        <p className="text-sm text-muted-foreground">
          {(error as any)?.message || "Please check your connection to the server."}
        </p>
      </div>
    );
  }

  const mentees = studentsResponse?.data?.students || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Students"
        description="Students assigned to you for mentoring"
      />
      <PanelDataTable
        columns={columns}
        data={mentees}
        searchKey="name"
        mobileRender={mobileRender}
      />
    </div>
  );
};

export default MentorStudents;

