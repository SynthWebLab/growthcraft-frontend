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

  return (
    <div className="space-y-8">
      <PageHeader
        title="Partnership"
        description="Manage your campus partnership tier and benefits"
      />

      <div className="grid lg:grid-cols-3 gap-6">
        <DataCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Tier</p>
              <div className="flex items-center gap-3">
                <StatusPill
                  variant="active"
                  label={p?.currentTier ?? "—"}
                  className="text-sm px-3 py-1"
                />
                {startDate && (
                  <span className="text-xs text-muted-foreground">since {startDate}</span>
                )}
              </div>
            </div>
          </div>

          <h4 className="text-sm font-semibold mb-3">Your Benefits</h4>
          <ul className="space-y-2">
            {(p?.benefits ?? []).map((b, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-magenta flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </DataCard>

        <DataCard>
          <h4 className="text-sm font-semibold mb-4">Your SPOC</h4>
          {spocName ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-lavender/10 text-lavender flex items-center justify-center font-bold text-sm">
                  {spocName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium">{spocName}</p>
                  <p className="text-xs text-muted-foreground">
                    {p?.spoc?.designation || "Partnership Manager"}
                  </p>
                </div>
              </div>
              {p?.spoc?.email && (
                <div>
                  <p className="text-muted-foreground text-xs">Email</p>
                  <p className="font-medium">{p.spoc.email}</p>
                </div>
              )}
              {p?.spoc?.phone && (
                <div>
                  <p className="text-muted-foreground text-xs">Phone</p>
                  <p className="font-medium">{p.spoc.phone}</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading…" : "A dedicated SPOC is assigned on Gold and Platinum tiers."}
            </p>
          )}
        </DataCard>
      </div>

      <DataCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold font-display">Tier Comparison</h3>
          {p && <UpgradeTierButton currentTier={p.currentTier} nextTier={p.nextTier} />}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 font-medium text-muted-foreground">Benefit</th>
                {(p?.tiers ?? []).map((t) => (
                  <th
                    key={t}
                    className={`text-center py-3 px-4 font-semibold ${tierColor[t] ?? ""}`}
                  >
                    {t}
                    {t === p?.currentTier && (
                      <span className="block text-[10px] text-muted-foreground font-normal">
                        Current
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(p?.comparison ?? []).map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-3 pr-4 text-muted-foreground">{row.label}</td>
                  {row.values.map((val, j) => (
                    <td key={j} className="text-center py-3 px-4">
                      {typeof val === "boolean" ? (
                        val ? (
                          <Check className="h-4 w-4 text-magenta mx-auto" />
                        ) : (
                          <Minus className="h-4 w-4 text-muted-foreground/40 mx-auto" />
                        )
                      ) : (
                        <span className="text-sm">{val}</span>
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
