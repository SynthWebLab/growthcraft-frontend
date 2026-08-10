"use client";

import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { StatusPill } from "@/components/panel";
import { Check, Minus } from "lucide-react";
import UpgradeTierButton from "./UpgradeTierButton";
import { useCollegePartnership } from "@/hooks/queries/useCollege";

const tierColor: Record<string, string> = {
  Silver: "text-muted-foreground",
  Gold: "text-magenta",
  Platinum: "text-lavender",
};

const CollegePartnership = () => {
  const { data, isLoading } = useCollegePartnership();
  const p = data?.data;

  const spocName = p?.spoc?.name;
  const startDate = p?.startDate ? new Date(p.startDate).toLocaleDateString() : null;

  const renderMobileTierCards = () => {
    if (!p) return null;
    return (
      <div className="block lg:hidden space-y-6">
        {p.tiers.map((tier: any) => {
          const isCurrent = tier === p.currentTier;
          return (
            <div
              key={tier}
              className={`rounded-xl border p-5 bg-white relative transition-all ${
                isCurrent
                  ? "border-magenta ring-2 ring-magenta/10 shadow-md"
                  : "border-border/80 shadow-sm"
              }`}
            >
              {isCurrent && (
                <span className="absolute -top-3 right-4 bg-magenta text-white text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm">
                  Current Tier
                </span>
              )}
              <h4 className={`text-lg font-bold font-display ${tierColor[tier] ?? ""}`}>
                {tier} Tier
              </h4>

              <div className="mt-4 space-y-3.5">
                {p.comparison.map((row: any, i: number) => {
                  const tierIndex = p.tiers.indexOf(tier);
                  const val = row.values[tierIndex];

                  return (
                    <div key={i} className="flex items-center justify-between gap-4 py-2 border-b border-border/30 last:border-0 pb-2">
                      <span className="text-xs text-muted-foreground font-medium">{row.label}</span>
                      <div className="text-right">
                        {typeof val === "boolean" ? (
                          val ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-magenta bg-magenta/5 px-2 py-0.5 rounded-md">
                              <Check className="h-3.5 w-3.5" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                              <Minus className="h-3.5 w-3.5" /> No
                            </span>
                          )
                        ) : (
                          <span className="text-xs font-bold text-foreground">{val}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-0">
      <PageHeader
        title="Partnership"
        description="Manage your campus partnership tier and benefits"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DataCard className="lg:col-span-2 p-4 sm:p-6 border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Tier</p>
              <div className="flex items-center gap-3">
                <StatusPill
                  variant="active"
                  label={p?.currentTier ?? "—"}
                  className="text-sm px-3 py-1 font-semibold"
                />
                {startDate && (
                  <span className="text-xs text-muted-foreground font-medium">since {startDate}</span>
                )}
              </div>
            </div>
          </div>

          <h4 className="text-sm font-semibold mb-3 text-foreground uppercase tracking-wider">Your Benefits</h4>
          <ul className="space-y-2.5">
            {(p?.benefits ?? []).map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-600 font-medium">
                <Check className="h-4 w-4 text-magenta flex-shrink-0 mt-0.5" />
                {b}
              </li>
            ))}
          </ul>
        </DataCard>

        <DataCard className="p-4 sm:p-6 border-border/60">
          <h4 className="text-sm font-semibold mb-4 text-foreground uppercase tracking-wider">Your SPOC</h4>
          {spocName ? (
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 pb-3 border-b border-border/40">
                <div className="h-10 w-10 rounded-full bg-lavender/10 text-lavender flex items-center justify-center font-bold text-sm shrink-0">
                  {spocName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{spocName}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {p?.spoc?.designation || "Partnership Manager"}
                  </p>
                </div>
              </div>
              {p?.spoc?.email && (
                <div className="space-y-0.5">
                  <p className="text-muted-foreground text-xs uppercase font-medium">Email</p>
                  <p className="font-semibold text-foreground truncate">{p.spoc.email}</p>
                </div>
              )}
              {p?.spoc?.phone && (
                <div className="space-y-0.5">
                  <p className="text-muted-foreground text-xs uppercase font-medium">Phone</p>
                  <p className="font-semibold text-foreground truncate">{p.spoc.phone}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isLoading ? "Loading…" : "A dedicated SPOC is assigned on Gold and Platinum tiers."}
            </p>
          )}
        </DataCard>
      </div>

      <DataCard className="p-4 sm:p-6 border-border/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold font-display text-foreground">Tier Comparison</h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">Review and compare features across tiers</p>
          </div>
          {p && <UpgradeTierButton currentTier={p.currentTier} nextTier={p.nextTier} />}
        </div>

        {/* Mobile View Tiers Cards */}
        {renderMobileTierCards()}

        {/* Desktop View Tiers Table */}
        <div className="hidden lg:block overflow-x-auto scrollbar-hide border border-border/50 rounded-xl">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-border/60 bg-slate-50/50">
                <th className="text-left py-3.5 px-4 font-semibold text-muted-foreground">Benefit</th>
                {(p?.tiers ?? []).map((t) => (
                  <th
                    key={t}
                    className={`text-center py-3.5 px-4 font-bold ${tierColor[t] ?? ""}`}
                  >
                    {t}
                    {t === p?.currentTier && (
                      <span className="block text-[10px] text-muted-foreground/80 font-semibold tracking-wider uppercase mt-0.5">
                        Current
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(p?.comparison ?? []).map((row, i) => (
                <tr key={i} className="border-b border-border/55 last:border-0 hover:bg-slate-50/20">
                  <td className="py-3 px-4 text-muted-foreground font-medium">{row.label}</td>
                  {row.values.map((val, j) => (
                    <td key={j} className="text-center py-3 px-4">
                      {typeof val === "boolean" ? (
                        val ? (
                          <Check className="h-4 w-4 text-magenta mx-auto" />
                        ) : (
                          <Minus className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                        )
                      ) : (
                        <span className="font-semibold text-foreground">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
    </div>
  );
};

export default CollegePartnership;
