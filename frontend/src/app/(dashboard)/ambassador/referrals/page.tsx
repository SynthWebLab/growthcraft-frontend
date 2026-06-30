"use client";

import { useMemo } from "react";
import { Megaphone, RefreshCw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import DataCard from "@/components/ui/data-card";
import { PageHeader } from "@/components/ui/page-header";
import { PanelDataTable, type Column, PanelEmptyState } from "@/components/panel";
import { useAmbassadorReferrals } from "@/hooks/queries/useStudent";
import { toast } from "sonner";

export default function AmbassadorReferralsPage() {
  const { data, isLoading, refetch, isFetching } = useAmbassadorReferrals();

  const referrals = data?.data?.referrals ?? [];

  const handleRefetch = async () => {
    await refetch();
    toast.success("Referrals updated!");
  };

  const columns = useMemo<Column<any>[]>(
    () => [
      {
        key: "referredEmail",
        label: "Referee Email",
        sortable: true,
      },
      {
        key: "referredItemType",
        label: "Referral Program Type",
        sortable: true,
        render: (row: any) => (
          <span className="font-medium text-foreground">
            {row.referredItemType === "TrainingProgram" ? "Training Program" : row.referredItemType}
          </span>
        ),
      },
      {
        key: "createdAt",
        label: "Date Invited",
        sortable: true,
        render: (row: any) => new Date(row.createdAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      },
      {
        key: "status",
        label: "Referral Status",
        sortable: true,
        render: (row: any) => {
          let styles = "bg-warning/10 text-warning";
          if (row.status === "joined") styles = "bg-magenta/10 text-magenta";
          if (row.status === "completed") styles = "bg-success/10 text-success";
          return (
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${styles}`}>
              {row.status}
            </span>
          );
        },
      },
      {
        key: "commissionEarned",
        label: "Commission Earned",
        sortable: true,
        render: (row: any) => (
          <span className="font-semibold text-foreground">
            ₹{row.commissionEarned}
          </span>
        ),
      },
      {
        key: "payoutStatus",
        label: "Payout Status",
        sortable: true,
        render: (row: any) => {
          let styles = "bg-muted text-muted-foreground";
          if (row.payoutStatus === "unpaid") styles = "bg-warning/10 text-warning";
          if (row.payoutStatus === "paid") styles = "bg-success/10 text-success";
          return (
            <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${styles}`}>
              {row.payoutStatus}
            </span>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Track Referrals"
          description="View all of your sent invitations and track conversions when your friends enroll."
        />
        <Button variant="outline" size="sm" onClick={handleRefetch} disabled={isFetching} className="shrink-0 self-start md:self-auto">
          <RefreshCw className={`h-4 w-4 mr-1.5 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="h-64 rounded-xl border border-border bg-white animate-pulse" />
      ) : referrals.length === 0 ? (
        <PanelEmptyState
          icon={<Megaphone className="h-12 w-12 text-muted-foreground" />}
          title="No referrals found"
          description="Generate a referral link on your dashboard to start inviting friends."
        />
      ) : (
        <DataCard className="p-0 overflow-hidden">
          <PanelDataTable
            columns={columns}
            data={referrals}
            searchKey="referredEmail"
            pageSize={10}
          />
        </DataCard>
      )}
    </div>
  );
}
