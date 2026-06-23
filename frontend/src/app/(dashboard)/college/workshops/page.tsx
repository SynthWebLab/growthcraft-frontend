"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import PanelDataTable, { Column } from "@/components/panel/PanelDataTable";
import { useWorkshops } from "@/hooks/queries/useWorkshops";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle } from "lucide-react";
import { ManageAccessDialog } from "@/components/college/ManageAccessDialog";
import { Badge } from "@/components/ui/badge";

type WorkshopRow = any; // We can use the Workshop type or any for list mapping

export default function CollegeWorkshopsPage() {
  const { data: response, isLoading, isError } = useWorkshops({ limit: 100 });
  const [selectedWorkshop, setSelectedWorkshop] = useState<{ id: string; title: string } | null>(null);

  const workshops = response?.items ?? [];

  const columns: Column<WorkshopRow>[] = [
    {
      key: "title",
      label: "Workshop Title",
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
      label: "Date",
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
          onClick={() => setSelectedWorkshop({ id: row.id || row._id, title: row.title })}
          className="h-8 text-xs font-medium border-border hover:bg-magenta hover:text-white transition-colors"
        >
          <Users className="h-3.5 w-3.5 mr-1.5" />
          Manage Access
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workshops"
        description="View all workshops and authorize cohort students to join them"
      />

      {isError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load workshops. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground py-8">Loading workshops…</div>
      ) : (
        <PanelDataTable
          columns={columns}
          data={workshops}
          searchKey="title"
          pageSize={10}
        />
      )}

      {selectedWorkshop && (
        <ManageAccessDialog
          eventId={selectedWorkshop.id}
          eventTitle={selectedWorkshop.title}
          eventType="Workshop"
          isOpen={!!selectedWorkshop}
          onClose={() => setSelectedWorkshop(null)}
        />
      )}
    </div>
  );
}
