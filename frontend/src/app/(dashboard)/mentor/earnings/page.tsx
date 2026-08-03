"use client";

import { useState } from "react";
import { DollarSign, CreditCard, Building2, Send } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import DataCard from "@/components/ui/data-card";
import PanelDataTable, { type Column } from "@/components/panel/PanelDataTable";
import { StatusPill } from "@/components/panel";
import { useMentorEarnings, useWithdrawMentorEarnings } from "@/hooks/queries/useMentor";
import type { MentorMonthlyEarningsData, MentorPayoutHistoryItem } from "@/types/mentor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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

  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "Bank Transfer">("UPI");
  const [paymentDetails, setPaymentDetails] = useState("");

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

  const handleOpenWithdraw = () => {
    setAmount(summary.pendingPayout.toString());
    setPaymentMethod("UPI");
    setPaymentDetails("");
    setWithdrawOpen(true);
  };

  const handleConfirmWithdraw = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid withdrawal amount");
      return;
    }

    if (numAmount > summary.pendingPayout) {
      toast.error(`Amount cannot exceed pending balance of ₹${summary.pendingPayout.toLocaleString()}`);
      return;
    }

    if (!paymentDetails.trim()) {
      toast.error(`Please enter your ${paymentMethod === "UPI" ? "UPI ID" : "Bank Account details"}`);
      return;
    }

    withdrawEarnings(
      {
        amount: numAmount,
        paymentMethod,
        paymentDetails: paymentDetails.trim(),
      },
      {
        onSuccess: () => {
          setWithdrawOpen(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Earnings"
        description="Track your monthly earnings and payouts"
        action={
          <Button
            className="bg-magenta hover:bg-magenta/90 text-white gap-1.5"
            onClick={handleOpenWithdraw}
            disabled={isWithdrawing || summary.pendingPayout === 0}
          >
            <DollarSign className="h-4 w-4" /> Withdraw
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

      {/* WITHDRAWAL DIALOG */}
      <Dialog open={withdrawOpen} onOpenChange={setWithdrawOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <DollarSign className="h-5 w-5 text-magenta" /> Request Earnings Withdrawal
            </DialogTitle>
            <DialogDescription>
              Submit a disbursal request for your approved mentoring earnings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="p-3 bg-muted/40 rounded-lg border border-border flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Available Pending Balance</span>
              <span className="font-bold text-warning text-base">₹{summary.pendingPayout.toLocaleString()}</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount to Withdraw (₹)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                max={summary.pendingPayout}
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Transfer Method</Label>
              <Select
                value={paymentMethod}
                onValueChange={(val: any) => setPaymentMethod(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPI">UPI (Google Pay, PhonePe, Paytm)</SelectItem>
                  <SelectItem value="Bank Transfer">Bank Account (IMPS / NEFT)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-details">
                {paymentMethod === "UPI" ? "VPA / UPI ID" : "Account Number & IFSC Code"}
              </Label>
              <Input
                id="payment-details"
                value={paymentDetails}
                onChange={(e) => setPaymentDetails(e.target.value)}
                placeholder={
                  paymentMethod === "UPI"
                    ? "e.g. mentor@upi or 9876543210@paytm"
                    : "e.g. A/C: 123456789012, IFSC: HDFC0001234"
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmWithdraw}
              disabled={isWithdrawing || !amount || !paymentDetails.trim()}
              className="bg-magenta text-white hover:bg-magenta/90 gap-1.5"
            >
              {isWithdrawing ? "Submitting..." : "Confirm Withdrawal"} <Send className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentorEarnings;

