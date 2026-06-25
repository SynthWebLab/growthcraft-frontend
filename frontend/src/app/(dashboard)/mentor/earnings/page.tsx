"use client";

import { DollarSign } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import DataCard from "@/components/ui/data-card";
import PanelDataTable, { type Column } from "@/components/panel/PanelDataTable";
import { StatusPill } from "@/components/panel";
import { useMentorEarnings, useWithdrawMentorEarnings } from "@/hooks/queries/useMentor";
import type { MentorMonthlyEarningsData, MentorPayoutHistoryItem } from "@/types/mentor";

const monthCols: Column<MentorMonthlyEarningsData>[] = [
  { key: "month", label: "Month", sortable: true },
  { key: "sessions", label: "Sessions", sortable: true },
  { key: "amount", label: "Base (₹)", sortable: true, render: (r) => `₹${r.amount.toLocaleString()}` },
  { key: "bonus", label: "Bonus (₹)", render: (r) => (r.bonus > 0 ? `₹${r.bonus.toLocaleString()}` : "—") },
  {
    key: "total",
    label: "Total (₹)",
    sortable: true,
    render: (r) => <span className="font-semibold">₹{r.total.toLocaleString()}</span>,
  },
];

const payoutCols: Column<MentorPayoutHistoryItem>[] = [
  { key: "date", label: "Date", sortable: true },
  { key: "amount", label: "Amount (₹)", sortable: true, render: (r) => `₹${r.amount.toLocaleString()}` },
  {
    key: "status",
    label: "Status",
    render: (r) => <StatusPill variant={r.status === "completed" ? "completed" : "pending"} />,
  },
  {
    key: "txnId",
    label: "Transaction ID",
    render: (r) => <code className="text-xs font-mono text-muted-foreground">{r.txnId}</code>,
  },
];

const EarningsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <div className="h-8 w-48 bg-muted/40 rounded" />
      <div className="h-4 w-80 bg-muted/40 rounded" />
    </div>
    <div className="grid sm:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 bg-muted/40 rounded-xl" />
      ))}
    </div>
    <div className="h-64 bg-muted/40 rounded-xl" />
    <div className="h-64 bg-muted/40 rounded-xl" />
  </div>
);

const MentorEarnings = () => {
  const { data: earningsResponse, isLoading, error } = useMentorEarnings();
  const { mutate: withdrawEarnings, isPending: isWithdrawing } = useWithdrawMentorEarnings();

  if (isLoading) {
    return <EarningsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <p className="text-red-500 font-medium">Failed to load earnings stats</p>
        <p className="text-sm text-muted-foreground">
          {(error as any)?.message || "Please check your connection to the server."}
        </p>
      </div>
    );
  }

  const earnings = earningsResponse?.data;
  const summary = earnings?.summary || { thisMonth: 0, pendingPayout: 0, lifetime: 0 };
  const monthlyData = earnings?.monthlyData || [];
  const payouts = earnings?.payouts || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Earnings"
        description="Track your monthly earnings and payouts"
        action={
          <Button
            className="bg-magenta hover:bg-magenta/90 text-white"
            onClick={() => withdrawEarnings()}
            disabled={isWithdrawing || summary.pendingPayout === 0}
          >
            <DollarSign className="h-4 w-4 mr-1" /> {isWithdrawing ? "Withdrawing..." : "Withdraw"}
          </Button>
        }
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <DataCard>
          <p className="text-xs text-muted-foreground">This Month</p>
          <p className="text-2xl font-bold text-foreground mt-1">₹{summary.thisMonth.toLocaleString()}</p>
        </DataCard>
        <DataCard>
          <p className="text-xs text-muted-foreground">Pending Payout</p>
          <p className="text-2xl font-bold text-warning mt-1">₹{summary.pendingPayout.toLocaleString()}</p>
        </DataCard>
        <DataCard>
          <p className="text-xs text-muted-foreground">Lifetime Earnings</p>
          <p className="text-2xl font-bold text-foreground mt-1">₹{summary.lifetime.toLocaleString()}</p>
        </DataCard>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Monthly Breakdown</h2>
        <PanelDataTable columns={monthCols} data={monthlyData} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Payout History</h2>
        <PanelDataTable columns={payoutCols} data={payouts} />
      </div>
    </div>
  );
};

export default MentorEarnings;

