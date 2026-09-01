"use client";

import { useAmbassadorReferrals } from "@/hooks/queries/useAmbassador";
import DataCard from "@/components/ui/data-card";
import { Loader2, ArrowLeft, ArrowRight, Filter } from "lucide-react";
import { useState } from "react";

export default function AmbassadorReferralsPage() {
  const [status, setStatus] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, error } = useAmbassadorReferrals({ status, page, limit: 10 });

  const handleStatusFilterChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

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
        <p className="text-lg font-semibold text-red-500">Failed to load invites ledger.</p>
      </div>
    );
  }

  const referralsData = data?.data || {};
  const referralsList = referralsData.referrals || [];
  const totalItems = referralsData.total || 0;
  const totalPages = Math.ceil(totalItems / 10) || 1;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in p-4 sm:p-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">My Invites</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">Track the journey of your referred friends and your commission status.</p>
      </div>

      {/* Filter and Content */}
      <DataCard className="p-4 sm:p-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-semibold">
            <Filter className="h-4 w-4" /> Filter Status
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {[
              { label: "All Statuses", val: "" },
              { label: "Invited", val: "sent" },
              { label: "Registered", val: "registered" },
              { label: "Enrolled", val: "enrolled" },
            ].map((btn) => (
              <button
                key={btn.val}
                onClick={() => handleStatusFilterChange(btn.val)}
                className={`text-[10px] sm:text-xs px-2.5 py-1.5 rounded-lg font-semibold border transition-all ${
                  status === btn.val
                    ? "bg-magenta text-white border-magenta shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ledger Table */}
        {referralsList.length > 0 ? (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <table className="min-w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b text-slate-400 font-medium">
                    <th className="pb-3 font-medium">Email Address</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Invite Date</th>
                    <th className="pb-3 font-medium">Commission Status</th>
                    <th className="pb-3 font-medium text-right">Commission Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-600">
                  {referralsList.map((ref: any) => (
                    <tr key={ref._id} className="hover:bg-slate-50/50">
                      <td className="py-4 font-medium text-slate-800 max-w-[150px] sm:max-w-none truncate pr-2">{ref.referredEmail}</td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
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
                      <td className="py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(ref.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 whitespace-nowrap">
                        {ref.status === "enrolled" ? (
                          <span
                            className={`inline-flex items-center text-[11px] sm:text-xs font-semibold ${
                              ref.commissionPaid ? "text-emerald-600" : "text-amber-600"
                            }`}
                          >
                            ● {ref.commissionPaid ? "Paid Out" : "Pending Payout"}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-4 font-semibold text-slate-800 text-right whitespace-nowrap">
                        {ref.commissionAmount > 0 ? `₹${ref.commissionAmount}` : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-6 border-t">
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  Page <strong>{page}</strong> of <strong>{totalPages}</strong> (<strong>{totalItems}</strong> items)
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-50 transition-all"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-400 text-xs sm:text-sm">No invites found with this filter.</p>
          </div>
        )}
      </DataCard>
    </div>
  );
}
