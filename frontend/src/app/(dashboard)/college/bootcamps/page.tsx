"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import PanelDataTable, { Column } from "@/components/panel/PanelDataTable";
import { useBootcamps } from "@/hooks/queries/useBootcamps";
import { Button } from "@/components/ui/button";
import { GraduationCap, AlertCircle } from "lucide-react";
import { ManageAccessDialog } from "@/components/college/ManageAccessDialog";
import { Badge } from "@/components/ui/badge";

type BootcampRow = any;

export default function CollegeBootcampsPage() {
  const { data: response, isLoading, isError } = useBootcamps({ limit: 100 });
  const [selectedBootcamp, setSelectedBootcamp] = useState<{ id: string; title: string } | null>(null);

  const bootcamps = response?.items ?? [];

  const columns: Column<BootcampRow>[] = [
    {
      key: "title",
      label: "Bootcamp Title",
      sortable: true,
      render: (row) => (
        <div>
          <p className="text-sm font-semibold text-foreground">{row.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{row.domain}</p>
        </div>
      ),
    },
    {
      key: "mode",
      label: "Mode",
      sortable: true,
      render: (row) => (
        <Badge variant={row.mode === "Online" ? "outline" : "secondary"}>
          {row.mode}
        </Badge>
      ),
    },
    {
      key: "startDate",
      label: "Start Date",
      sortable: true,
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {new Date(row.startDate).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      key: "capacity",
      label: "Enrollments",
      render: (row) => (
        <div className="flex flex-col gap-1 w-24">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span>{row.enrolledCount ?? 0} enrolled</span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-magenta rounded-full h-1.5 transition-all duration-300"
              style={{
                width: `${Math.min(
                  100,
                  (((row.enrolledCount ?? 0) / (row.maxSeats || 100)) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold select-none capitalize ${
            row.status === "Open"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
              : row.status === "Closed"
              ? "bg-amber-50 text-amber-700 border border-amber-100"
              : "bg-muted text-muted-foreground border border-border"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Access Control",
      render: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedBootcamp({ id: row.id || row._id, title: row.title })}
          className="h-8 text-xs font-medium border-border hover:bg-magenta hover:text-white transition-colors"
        >
          <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
          Manage Access
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bootcamps"
        description="View all bootcamps and authorize cohort students to join them"
      />

      {isError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load bootcamps. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground py-8">Loading bootcamps…</div>
      ) : (
        <PanelDataTable
          columns={columns}
          data={bootcamps}
          searchKey="title"
          pageSize={10}
        />
      )}

      {selectedBootcamp && (
        <ManageAccessDialog
          eventId={selectedBootcamp.id}
          eventTitle={selectedBootcamp.title}
          eventType="Bootcamp"
          isOpen={!!selectedBootcamp}
          onClose={() => setSelectedBootcamp(null)}
        />
      )}
    </div>
  );
}
