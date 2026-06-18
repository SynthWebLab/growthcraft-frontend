"use client";

import { DollarSign } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import DataCard from "@/components/ui/data-card";
import PanelDataTable, { type Column } from "@/components/panel/PanelDataTable";
import { StatusPill } from "@/components/panel";
import { toast } from "sonner";

type MonthlyEarning = {
  month: string;
  sessions: number;
  amount: number;
  bonus: number;
  total: number;
};
type Payout = {
  date: string;
  amount: number;
  status: "completed" | "pending";
  txnId: string;
};

const monthlyData: MonthlyEarning[] = [
  { month: "April 2026", sessions: 22, amount: 33000, bonus: 2000, total: 35000 },
  { month: "March 2026", sessions: 18, amount: 27000, bonus: 1500, total: 28500 },
  { month: "February 2026", sessions: 20, amount: 30000, bonus: 0, total: 30000 },
  { month: "January 2026", sessions: 15, amount: 22500, bonus: 1000, total: 23500 },
  { month: "December 2025", sessions: 16, amount: 24000, bonus: 0, total: 24000 },
  { month: "November 2025", sessions: 12, amount: 18000, bonus: 0, total: 18000 },
];

const payouts: Payout[] = [
  { date: "Apr 1, 2026", amount: 28500, status: "completed", txnId: "TXN-2026-0401" },
  { date: "Mar 1, 2026", amount: 30000, status: "completed", txnId: "TXN-2026-0301" },
  { date: "Feb 1, 2026", amount: 23500, status: "completed", txnId: "TXN-2026-0201" },
  { date: "Jan 1, 2026", amount: 24000, status: "completed", txnId: "TXN-2026-0101" },
];

const monthCols: Column<MonthlyEarning>[] = [
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

const payoutCols: Column<Payout>[] = [
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

const MentorEarnings = () => (
  <div className="space-y-6">
    <PageHeader
      title="Earnings"
      description="Track your monthly earnings and payouts"
      action={
        <Button
          className="bg-magenta hover:bg-magenta/90 text-white"
          onClick={() => toast.info("Withdrawal request submitted!")}
        >
          <DollarSign className="h-4 w-4 mr-1" /> Withdraw
        </Button>
      }
    />

    <div className="grid sm:grid-cols-3 gap-4">
      <DataCard>
        <p className="text-xs text-muted-foreground">This Month</p>
        <p className="text-2xl font-bold text-foreground mt-1">₹35,000</p>
      </DataCard>
      <DataCard>
        <p className="text-xs text-muted-foreground">Pending Payout</p>
        <p className="text-2xl font-bold text-warning mt-1">₹35,000</p>
      </DataCard>
      <DataCard>
        <p className="text-xs text-muted-foreground">Lifetime Earnings</p>
        <p className="text-2xl font-bold text-foreground mt-1">₹1,59,000</p>
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

export default MentorEarnings;
