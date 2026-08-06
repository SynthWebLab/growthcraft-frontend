"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import PanelDataTable, { Column } from "@/components/panel/PanelDataTable";
import { useWorkshops } from "@/hooks/queries/useWorkshops";
import { useCollegeDashboard } from "@/hooks/queries/useCollege";
import { Button } from "@/components/ui/button";
import { Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { ManageAccessDialog } from "@/components/college/ManageAccessDialog";
import { Badge } from "@/components/ui/badge";

type WorkshopRow = any;

export default function CollegeWorkshopsPage() {
  const { data: response, isLoading, isError } = useWorkshops({ limit: 100 });
  const { data: dashboardRes } = useCollegeDashboard();

  const [selectedWorkshop, setSelectedWorkshop] = useState<{ id: string; title: string } | null>(null);

  const allWorkshops = response?.items ?? [];
  const dashboardData = (dashboardRes as any)?.data ?? dashboardRes;
  const activeEventIds: string[] = dashboardData?.activeEventIds ?? [];

  // Filter: ONLY show workshops enrolled by this college
  const workshops = allWorkshops.filter((row: any) =>
    activeEventIds.includes(String(row.id || row._id)) || row.isEnrolled
  );

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
        title="Enrolled Workshops"
        description="View workshops enrolled by your campus cohort and manage student access"
      />

      {isError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load workshops. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground py-8">Loading workshops…</div>
      ) : workshops.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-8 text-center space-y-3">
          <Users className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-semibold text-foreground">No Enrolled Workshops</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Your college has not enrolled in any workshops yet. Explore public workshops to enroll your campus cohort.
          </p>
          <Link href="/events?tab=workshops">
            <Button variant="default" size="sm" className="bg-magenta hover:bg-magenta/90 text-white text-xs">
              Explore All Workshops
            </Button>
          </Link>
        </div>
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
