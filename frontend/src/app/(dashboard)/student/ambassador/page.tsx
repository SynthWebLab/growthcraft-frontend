"use client";

import { useAmbassadorDashboard } from "@/hooks/queries/useAmbassador";
import { useAuth } from "@/hooks/useAuth";
import { KpiCard } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import { Loader2, Copy, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function AmbassadorDashboardPage() {
  const { user } = useAuth();
  const { data: statsResponse, isLoading, error } = useAmbassadorDashboard();
  const stats = statsResponse?.data;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-magenta" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-red-500">Failed to load ambassador details.</p>
        <p className="text-sm text-muted-foreground">Make sure you are an activated ambassador.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Ambassador Workspace</h1>
        <p className="text-muted-foreground mt-1 font-sans">Hello, {user?.fullName || "Ambassador"}. Track your earnings and refer friends to GrowthCraft.</p>
      </div>

      {/* Referral Link Copy Card */}
      <DataCard variant="dark" className="relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-magenta/10 rounded-full blur-3xl -z-10" />
        <div className="max-w-2xl">
          <span className="text-xs uppercase font-semibold text-magenta tracking-wider">Your Referral Link</span>
          <h2 className="text-xl md:text-2xl font-bold mt-1 mb-4 text-white">Invite friends & earn 5% cash reward on their enrollment fee!</h2>
          
          <div className="flex flex-col sm:flex-row gap-2 bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
            <input
              type="text"
              readOnly
              value={stats.referralLink}
              className="bg-transparent border-none outline-none flex-1 text-sm py-2 px-3 text-white select-all font-mono"
            />
            <button
              onClick={handleCopyLink}
              className="bg-magenta hover:bg-magenta/90 text-white rounded-lg px-4 py-2 text-sm font-semibold transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" /> Copy Link
                </>
              )}
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-300">
            <span>Referral Code: <strong className="text-magenta font-mono text-sm">{stats.referralCode}</strong></span>
          </div>
        </div>
      </DataCard>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard label="Total Invited" value={stats.totalReferrals ?? 0} />
        <KpiCard label="Conversions" value={stats.totalConversions ?? 0} />
        <KpiCard label="Pending Payout" value={stats.pendingPayout ?? 0} prefix="₹" />
      </div>

      {/* Recent Referrals List */}
      <DataCard>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Recent Invites</h2>
          <Link
            href="/student/ambassador/referrals"
            className="text-xs font-semibold text-magenta hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {stats.recentReferrals && stats.recentReferrals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-400 font-medium">
                  <th className="pb-3 font-medium">Email Address</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Joined Date</th>
                  <th className="pb-3 font-medium">Commission</th>
                </tr>
              </thead>
              <tbody className="divide-y text-slate-600">
                {stats.recentReferrals.map((ref: any) => (
                  <tr key={ref._id} className="hover:bg-slate-50/50">
                    <td className="py-4 font-medium text-slate-800">{ref.referredEmail}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          ref.status === "enrolled"
                            ? "bg-emerald-50 text-emerald-700"
                            : ref.status === "registered"
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-slate-50 text-slate-600"
                        }`}
                      >
                        {ref.status}
                      </span>
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {new Date(ref.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-4 font-semibold text-slate-800">
                      {ref.commissionAmount > 0 ? `₹${ref.commissionAmount}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 text-sm">No invites sent yet.</p>
          </div>
        )}
      </DataCard>
    </div>
  );
}
