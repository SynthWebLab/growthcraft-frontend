"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/page-header";
import PanelDataTable, { Column } from "@/components/panel/PanelDataTable";
import { StatusPill } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface Student {
  name: string;
  email: string;
  courses: number;
  avgProgress: number;
  status: "active" | "completed" | "pending";
  lastActive: string;
}

const students: Student[] = [
  {
    name: "Rahul Sharma",
    email: "rahul@college.edu",
    courses: 2,
    avgProgress: 78,
    status: "active",
    lastActive: "2 hours ago",
  },
  {
    name: "Priya Devi",
    email: "priya@college.edu",
    courses: 1,
    avgProgress: 96,
    status: "active",
    lastActive: "1 hour ago",
  },
  {
    name: "Amit Kumar",
    email: "amit@college.edu",
    courses: 1,
    avgProgress: 100,
    status: "completed",
    lastActive: "1 day ago",
  },
  {
    name: "Sneha Gupta",
    email: "sneha@college.edu",
    courses: 1,
    avgProgress: 45,
    status: "active",
    lastActive: "3 hours ago",
  },
  {
    name: "Ravi Patel",
    email: "ravi@college.edu",
    courses: 1,
    avgProgress: 60,
    status: "active",
    lastActive: "5 hours ago",
  },
  {
    name: "Meera Singh",
    email: "meera@college.edu",
    courses: 2,
    avgProgress: 100,
    status: "completed",
    lastActive: "2 days ago",
  },
  {
    name: "Arjun Nair",
    email: "arjun@college.edu",
    courses: 1,
    avgProgress: 12,
    status: "pending",
    lastActive: "1 week ago",
  },
  {
    name: "Kavitha R.",
    email: "kavitha@college.edu",
    courses: 3,
    avgProgress: 72,
    status: "active",
    lastActive: "4 hours ago",
  },
];

const columns: Column<Student>[] = [
  {
    key: "name",
    label: "Student",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-lavender/10 text-lavender flex items-center justify-center text-xs font-bold">
          {row.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <p className="text-sm font-medium">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      </div>
    ),
  },
  { key: "courses", label: "Enrolled Courses", sortable: true },
  {
    key: "avgProgress",
    label: "Avg Progress",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2">
        <div className="w-16 bg-muted rounded-full h-1.5">
          <div
            className="bg-magenta rounded-full h-1.5"
            style={{ width: `${row.avgProgress}%` }}
          />
        </div>
        <span className="text-xs font-medium">{row.avgProgress}%</span>
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <StatusPill
        variant={
          row.status === "completed"
            ? "completed"
            : row.status === "pending"
            ? "pending"
            : "active"
        }
      />
    ),
  },
  { key: "lastActive", label: "Last Active", sortable: true },
];

export default function CollegeStudents() {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? students
      : students.filter((s) => s.status === filter);

  const chips = [
    { key: "all", label: "All", count: students.length },
    {
      key: "active",
      label: "Active",
      count: students.filter((s) => s.status === "active").length,
    },
    {
      key: "completed",
      label: "Completed",
      count: students.filter((s) => s.status === "completed").length,
    },
    {
      key: "pending",
      label: "Pending",
      count: students.filter((s) => s.status === "pending").length,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Track students enrolled in GrowthCraft programs from your campus"
        action={
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.key}
            onClick={() => setFilter(c.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filter === c.key
                ? "bg-magenta text-white border-magenta"
                : "bg-white text-muted-foreground border-border hover:border-foreground"
            }`}
          >
            {c.label} ({c.count})
          </button>
        ))}
      </div>

      <PanelDataTable columns={columns} data={filtered} searchKey="name" pageSize={10} />
    </div>
  );
}
