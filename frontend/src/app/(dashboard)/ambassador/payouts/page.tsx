"use client";

import { useMemo } from "react";
import { DollarSign, Wallet, Calendar, Info } from "lucide-react";
import { KpiCard } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import { PageHeader } from "@/components/ui/page-header";
import { PanelDataTable, type Column } from "@/components/panel";
import { useAmbassadorDashboard, useAmbassadorReferrals } from "@/hooks/queries/useStudent";

export default function AmbassadorPayoutsPage() {
  const { data: dashboardData, isLoading: isDashboardLoading } = useAmbassadorDashboard();
  const { data: referralsData, isLoading: isReferralsLoading } = useAmbassadorReferrals();

  const stats = dashboardData?.data ?? {
    totalCommission: 0,
    unpaidCommission: 0,
    paidCommission: 0,
  };

  const referrals = referralsData?.data?.referrals ?? [];
  // Filter for completed/joined referrals that have commission earned > 0
  const payouts = useMemo(() => {
    return referrals.filter((r: any) => r.commissionEarned > 0);
  }, [referrals]);

  const columns = useMemo<Column<any>[]>(
    () => [
      {
        key: "referredEmail",
        label: "Student Email",
        sortable: true,
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
          let styles = "bg-warning/10 text-warning";
          if (row.payoutStatus === "paid") styles = "bg-success/10 text-success";
          return (
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wide ${styles}`}>
              {row.payoutStatus}
            </span>
          );
        },
      },
      {
        key: "updatedAt",
        label: "Last Updated",
        sortable: true,
        render: (row: any) => new Date(row.updatedAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Payout Overview"
        description="Monitor your referral commissions and track your paid and pending payouts."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isDashboardLoading ? (
          [0, 1, 2].map((i: number) => (
            <div key={i} className="h-28 rounded-xl border border-border bg-white animate-pulse" />
          ))
        ) : (
          <>
            <KpiCard label="Lifetime Commission" value={stats.totalCommission} prefix="₹" />
            <KpiCard label="Pending (Unpaid) Commission" value={stats.unpaidCommission} prefix="₹" />
            <KpiCard label="Paid Commission" value={stats.paidCommission} prefix="₹" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payouts Table */}
        <div className="lg:col-span-2">
          {isReferralsLoading ? (
            <div className="h-64 rounded-xl border border-border bg-white animate-pulse" />
          ) : payouts.length === 0 ? (
            <DataCard className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-1">No commission logs yet</h3>
              <p className="text-sm text-muted-foreground">
                Commissions appear here once your referred students verify and complete their enrollments.
              </p>
            </DataCard>
          ) : (
            <DataCard className="p-0 overflow-hidden">
              <PanelDataTable
                columns={columns}
                data={payouts}
                searchKey="referredEmail"
                pageSize={10}
              />
            </DataCard>
          )}
        </div>

        {/* Payout Policy Card */}
        <div className="space-y-6">
          <DataCard className="h-full bg-graphite text-white border-none flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold font-display mb-4 flex items-center gap-2">
                <Info className="h-5 w-5 text-magenta" /> Payout Terms
              </h2>
              <div className="space-y-4 text-sm text-white/80">
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-magenta shrink-0 mt-1.5" />
                  <p>
                    Commissions are computed as <strong className="text-white">10% of the net batch fee</strong> collected from referred students.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-magenta shrink-0 mt-1.5" />
                  <p>
                    Payouts are processed <strong className="text-white">offline</strong> on the first week of every month by the admin department.
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-magenta shrink-0 mt-1.5" />
                  <p>
                    Once a payout is released offline, the status here will be updated from <span className="text-warning">unpaid</span> to <span className="text-success">paid</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
              <Wallet className="h-10 w-10 text-magenta shrink-0" />
              <div>
                <p className="text-xs text-white/50 font-medium">Payment Queries?</p>
                <p className="text-sm font-semibold text-white">support@growthcraft.in</p>
              </div>
            </div>
          </DataCard>
        </div>
      </div>
    </div>
  );
}
