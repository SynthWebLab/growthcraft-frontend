"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import PanelDataTable, { Column } from "@/components/panel/PanelDataTable";
import { useHackathons } from "@/hooks/queries/useHackathons";
import { useCollegeDashboard } from "@/hooks/queries/useCollege";
import { Button } from "@/components/ui/button";
import { Trophy, AlertCircle, CheckCircle2 } from "lucide-react";
import { ManageAccessDialog } from "@/components/college/ManageAccessDialog";
import { Badge } from "@/components/ui/badge";

type HackathonRow = any;

export default function CollegeHackathonsPage() {
  const { data: response, isLoading, isError } = useHackathons({ limit: 100 });
  const { data: dashboardRes } = useCollegeDashboard();

  const [selectedHackathon, setSelectedHackathon] = useState<{ id: string; title: string } | null>(null);

  const allHackathons = response?.items ?? [];
  const dashboardData = (dashboardRes as any)?.data ?? dashboardRes;
  const activeEventIds: string[] = dashboardData?.activeEventIds ?? [];

  // Filter: ONLY show hackathons enrolled by this college
  const hackathons = allHackathons.filter((row: any) =>
    activeEventIds.includes(String(row.id || row._id)) || row.isEnrolled
  );

  const columns: Column<HackathonRow>[] = [
    {
      key: "title",
      label: "Hackathon Title",
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
          onClick={() => setSelectedHackathon({ id: row.id || row._id, title: row.title })}
          className="h-8 text-xs font-medium border-border hover:bg-magenta hover:text-white transition-colors"
        >
          <Trophy className="h-3.5 w-3.5 mr-1.5" />
          Manage Access
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enrolled Hackathons"
        description="View hackathons enrolled by your campus cohort and manage student access"
      />

      {isError && (
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load hackathons. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground py-8">Loading hackathons…</div>
      ) : hackathons.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-8 text-center space-y-3">
          <Trophy className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-semibold text-foreground">No Enrolled Hackathons</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Your college has not enrolled in any hackathons yet. Explore public hackathons to enroll your campus cohort.
          </p>
          <Link href="/events?tab=hackathons">
            <Button variant="default" size="sm" className="bg-magenta hover:bg-magenta/90 text-white text-xs">
              Explore All Hackathons
            </Button>
          </Link>
        </div>
      ) : (
        <PanelDataTable
          columns={columns}
          data={hackathons}
          searchKey="title"
          pageSize={10}
        />
      )}

      {selectedHackathon && (
        <ManageAccessDialog
          eventId={selectedHackathon.id}
          eventTitle={selectedHackathon.title}
          eventType="Hackathon"
          isOpen={!!selectedHackathon}
          onClose={() => setSelectedHackathon(null)}
        />
      )}
    </div>
  );
}
