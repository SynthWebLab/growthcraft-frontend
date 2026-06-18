"use client";

import { PageHeader } from "@/components/ui/page-header";
import PanelDataTable, { type Column } from "@/components/panel/PanelDataTable";

type Mentee = {
  name: string;
  course: string;
  sessionsCompleted: number;
  lastSession: string;
  nextSession: string;
};

const mentees: Mentee[] = [
  { name: "Rahul S.", course: "React Masterclass", sessionsCompleted: 12, lastSession: "Apr 14, 2026", nextSession: "Apr 16, 2026" },
  { name: "Priya D.", course: "Full Stack Dev", sessionsCompleted: 8, lastSession: "Apr 13, 2026", nextSession: "Apr 16, 2026" },
  { name: "Amit K.", course: "React Masterclass", sessionsCompleted: 6, lastSession: "Apr 12, 2026", nextSession: "Apr 17, 2026" },
  { name: "Sneha G.", course: "Node.js Advanced", sessionsCompleted: 15, lastSession: "Apr 14, 2026", nextSession: "Apr 18, 2026" },
  { name: "Vivek R.", course: "React Masterclass", sessionsCompleted: 10, lastSession: "Apr 10, 2026", nextSession: "Apr 19, 2026" },
  { name: "Neha P.", course: "Full Stack Dev", sessionsCompleted: 4, lastSession: "Apr 9, 2026", nextSession: "Apr 20, 2026" },
  { name: "Karan M.", course: "Node.js Advanced", sessionsCompleted: 9, lastSession: "Apr 8, 2026", nextSession: "Apr 21, 2026" },
];

const columns: Column<Mentee>[] = [
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

const MentorStudents = () => (
  <div className="space-y-6">
    <PageHeader
      title="My Students"
      description="Students assigned to you for mentoring"
    />
    <PanelDataTable columns={columns} data={mentees} searchKey="name" />
  </div>
);

export default MentorStudents;
