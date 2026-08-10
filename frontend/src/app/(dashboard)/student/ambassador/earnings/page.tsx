"use client";

import { useAmbassadorEarnings } from "@/hooks/queries/useAmbassador";
import { KpiCard } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import { Loader2, Calendar, Wallet } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function AmbassadorEarningsPage() {
  const { data, isLoading, error } = useAmbassadorEarnings();

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-magenta" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-red-500">Failed to load earnings reports.</p>
      </div>
    );
  }

  const stats = data?.data || {};
  const chartData = stats.earningsByMonth || [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in p-4 sm:p-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">Earnings Report</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Review your payouts, commissions logs, and monthly referral earnings trend.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <KpiCard label="Total Earned" value={stats.totalEarnings ?? 0} prefix="₹" />
        <KpiCard label="Paid Out" value={stats.paidOut ?? 0} prefix="₹" />
        <KpiCard label="Pending Payout" value={stats.pendingPayout ?? 0} prefix="₹" />
      </div>

      {/* Chart and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Chart Card */}
        <DataCard className="lg:col-span-2 space-y-6 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-magenta" /> Monthly Earnings Trend
          </h2>

          <div className="h-60 sm:h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(value) => [`₹${value}`, "Earned"]} cursor={{ fill: "#f8fafc" }} />
                  <Bar dataKey="amount" fill="#d946ef" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-400 text-xs sm:text-sm">
                No referral earnings registered in previous months.
              </div>
            )}
          </div>
        </DataCard>

        {/* Payout Information Info Box */}
        <DataCard variant="dark" className="relative overflow-hidden flex flex-col justify-between p-5 sm:p-6 min-h-[280px] lg:min-h-0">
          <div className="absolute right-0 top-0 w-32 h-32 bg-magenta/10 rounded-full blur-2xl -z-10" />

          <div className="space-y-4 sm:space-y-6">
            <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-white">
              <Wallet className="h-5 w-5 text-magenta" /> Payout Policy
            </h3>
            
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              <p>Payouts are computed automatically at the end of each month.</p>
              <p>Commissions are verified and cleared after the referred student completes their enrollment fees registration confirmation.</p>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                <span className="text-[10px] text-magenta font-semibold uppercase">Verification</span>
                <p className="text-[10px] sm:text-xs text-slate-400 mt-1">Pending rewards require up to 14 days to clear following college cohort enrollment validations.</p>
              </div>
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );
}
