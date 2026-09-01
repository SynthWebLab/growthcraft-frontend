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

  const renderMobileBootcampCard = (row: any) => {
    return (
      <div className="space-y-4 text-xs">
        {/* Top block: Title & Mode */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-border/40">
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-foreground leading-snug">{row.title}</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">{row.domain}</p>
          </div>
          <Badge variant={row.mode === "Online" ? "outline" : "secondary"} className="shrink-0 text-[10px] py-0.5 px-2 font-semibold">
            {row.mode}
          </Badge>
        </div>

        {/* Date and Access status row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Start Date</span>
            <p className="font-semibold text-foreground">
              {new Date(row.startDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Access Status</span>
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 mt-0.5">
                <CheckCircle2 className="h-3 w-3 animate-pulse" /> Enrolled
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-border/40 mt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedBootcamp({ id: row.id || row._id, title: row.title })}
            className="w-full h-9 text-xs font-semibold border-border hover:bg-magenta hover:text-white transition-colors rounded-xl flex items-center justify-center gap-1.5"
          >
            <GraduationCap className="h-3.5 w-3.5" />
            Manage Access
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-0">
      <PageHeader
        title="Enrolled Bootcamps"
        description="View bootcamps enrolled by your campus cohort and manage student access"
      />

      {isError && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs sm:text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load bootcamps. Please try again.
        </div>
      )}

      {isLoading ? (
        <div className="text-xs sm:text-sm text-muted-foreground py-8">Loading bootcamps…</div>
      ) : bootcamps.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-8 text-center space-y-3">
          <GraduationCap className="h-10 w-10 text-muted-foreground mx-auto" />
          <h3 className="text-sm sm:text-base font-semibold text-foreground">No Enrolled Bootcamps</h3>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Your college has not enrolled in any bootcamps yet. Explore public bootcamps to enroll your campus cohort.
          </p>
          <Link href="/events?tab=bootcamps">
            <Button variant="default" size="sm" className="bg-magenta hover:bg-magenta/90 text-white text-xs h-9 px-4 rounded-xl font-semibold">
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
          className="border-border/60"
          mobileRender={renderMobileBootcampCard}
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
