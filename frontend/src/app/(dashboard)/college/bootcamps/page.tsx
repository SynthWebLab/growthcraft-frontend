"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import PanelDataTable, { Column } from "@/components/panel/PanelDataTable";
import { useBootcamps } from "@/hooks/queries/useBootcamps";
import { useCollegeDashboard } from "@/hooks/queries/useCollege";
import { Button } from "@/components/ui/button";
import { GraduationCap, AlertCircle, CheckCircle2 } from "lucide-react";
import { ManageAccessDialog } from "@/components/college/ManageAccessDialog";
import { Badge } from "@/components/ui/badge";

type BootcampRow = any;

export default function CollegeBootcampsPage() {
  const { data: response, isLoading, isError } = useBootcamps({ limit: 100 });
  const { data: dashboardRes } = useCollegeDashboard();

  const [selectedBootcamp, setSelectedBootcamp] = useState<{ id: string; title: string } | null>(null);

  const allBootcamps = response?.items ?? [];
  const dashboardData = (dashboardRes as any)?.data ?? dashboardRes;
  const activeEventIds: string[] = dashboardData?.activeEventIds ?? [];

  // Filter: ONLY show bootcamps enrolled by this college
  const bootcamps = allBootcamps.filter((row: any) =>
    activeEventIds.includes(String(row.id || row._id)) || row.isEnrolled
  );

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
      key: "status",
      label: "Campus Access Status",
      sortable: true,
      render: () => (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
          <CheckCircle2 className="h-3 w-3" /> Campus Enrolled
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
        title="Enrolled Bootcamps"
        description="View bootcamps enrolled by your campus cohort and manage student access"
      />

      {isError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load bootcamps. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground py-8">Loading bootcamps…</div>
      ) : bootcamps.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-8 text-center space-y-3">
          <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-semibold text-foreground">No Enrolled Bootcamps</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Your college has not enrolled in any bootcamps yet. Explore public bootcamps to enroll your campus cohort.
          </p>
          <Link href="/events?tab=bootcamps">
            <Button variant="default" size="sm" className="bg-magenta hover:bg-magenta/90 text-white text-xs">
              Explore All Bootcamps
            </Button>
          </Link>
        </div>
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
