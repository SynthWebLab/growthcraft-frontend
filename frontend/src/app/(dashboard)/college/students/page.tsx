"use client";

import { useRef, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import PanelDataTable, { Column } from "@/components/panel/PanelDataTable";
import { StatusPill } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { Download, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCollegeStudents, useCollegeCohort, useImportStudents, useToggleAmbassadorStatus } from "@/hooks/queries/useCollege";
import type { CollegeStudentRow } from "@/types/college";

type Student = CollegeStudentRow;

const exportColumns: { key: keyof Student; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "courses", label: "Enrolled Courses/Events" },
  { key: "avgProgress", label: "Avg Progress (%)" },
  { key: "status", label: "Status" },
  { key: "lastActive", label: "Last Active" },
];

const toCsvValue = (value: any) => {
  const str = String(value ?? "");
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
};

const downloadCsv = (rows: Student[]) => {
  const header = exportColumns.map((c) => toCsvValue(c.label)).join(",");
  const body = rows
    .map((row) => exportColumns.map((c) => toCsvValue(row[c.key])).join(","))
    .join("\n");
  const csv = `${header}\n${body}`;

  const blob = new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "students.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const CollegeStudents = () => {
  const [filter, setFilter] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading } = useCollegeStudents({ limit: 1000 });
  const { data: cohortRes } = useCollegeCohort();
  const importStudents = useImportStudents();
  const toggleAmbassador = useToggleAmbassadorStatus();

  const columns: Column<Student>[] = [
    {
      key: "name",
      label: "Student",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-lavender/10 text-lavender flex items-center justify-center text-xs font-bold">
            {row.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="text-sm font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: "courses", label: "Enrolled Courses/Events", sortable: true },
    {
      key: "avgProgress",
      label: "Avg Progress",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-muted rounded-full h-1.5">
            <div className="bg-magenta rounded-full h-1.5" style={{ width: `${row.avgProgress}%` }} />
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
          variant={row.status === "completed" ? "completed" : row.status === "pending" ? "pending" : "active"}
        />
      ),
    },
    {
      key: "isAmbassador",
      label: "Ambassador Status",
      sortable: true,
      render: (row) => (
        <Button
          size="sm"
          variant={row.isAmbassador ? "default" : "outline"}
          onClick={() => toggleAmbassador.mutate(row.userId)}
          disabled={toggleAmbassador.isPending}
          className={row.isAmbassador ? "bg-magenta text-white hover:bg-magenta/90 text-xs py-1 h-7" : "text-xs py-1 h-7 border-border hover:bg-marble text-muted-foreground"}
        >
          {row.isAmbassador ? "Active" : "Activate"}
        </Button>
      ),
    },
    {
      key: "lastActive",
      label: "Last Active",
      sortable: true,
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.lastActive ? new Date(row.lastActive).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];

  const students = data?.data ?? [];
  const cohort = cohortRes?.data;
  const subscribed = cohort?.subscribed ?? true;

  const filtered = filter === "all" ? students : students.filter((s) => s.status === filter);
  const chips = [
    { key: "all", label: "All", count: students.length },
    { key: "active", label: "Active", count: students.filter((s) => s.status === "active").length },
    { key: "completed", label: "Completed", count: students.filter((s) => s.status === "completed").length },
    { key: "pending", label: "Pending", count: students.filter((s) => s.status === "pending").length },
  ];

  const requireSubscription = () => {
    toast.error("Subscription required", {
      description: "Choose a partnership plan before importing or exporting students.",
    });
  };

  const handleExport = () => {
    if (!subscribed) return requireSubscription();
    downloadCsv(filtered);
  };

  const handleImportClick = () => {
    if (!subscribed) return requireSubscription();
    fileInputRef.current?.click();
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;
    const csv = await file.text();
    importStudents.mutate({ csv });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Track students enrolled in GrowthCraft programs from your campus"
        action={
          <div className="flex items-center gap-2">
            {cohort && (
              <span className="text-xs text-muted-foreground mr-1">
                {cohort.used}
                {cohort.unlimited ? "" : ` / ${cohort.limit}`} students
              </span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleFile}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportClick}
              disabled={importStudents.isPending}
            >
              {importStudents.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Import CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" /> Export CSV
            </Button>
          </div>
        }
      />

      {!subscribed && (
        <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm text-muted-foreground">
          You don&apos;t have an active subscription. Choose a partnership plan to import/export students.
        </div>
      )}

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

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading students…</p>
      ) : (
        <PanelDataTable columns={columns} data={filtered} searchKey="name" pageSize={10} />
      )}
    </div>
  );
};

export default CollegeStudents;
