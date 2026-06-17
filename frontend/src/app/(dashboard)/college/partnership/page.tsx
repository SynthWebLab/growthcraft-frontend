import PageHeader from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { StatusPill } from "@/components/panel";
import { Button } from "@/components/ui/button";
import { Check, Minus, ArrowUpRight } from "lucide-react";

const currentTier = {
  tier: "Gold" as const,
  startDate: "Aug 15, 2025",
  spocName: "Ananya Bora",
  spocEmail: "ananya@growthcraft.in",
  spocPhone: "+91-9395303089",
};

const benefits = [
  "Up to 200 students per cohort",
  "Dedicated mentor sessions (4/month)",
  "Co-branded certificate portal",
  "Dedicated SPOC",
  "Placement support for top 50% students",
  "Monthly analytics dashboard",
];

const tiers = [
  { name: "Silver", color: "text-muted-foreground" },
  { name: "Gold", color: "text-magenta" },
  { name: "Platinum", color: "text-lavender" },
];

const comparisonRows = [
  { label: "Students per cohort", values: ["Up to 100", "Up to 200", "Unlimited"] },
  { label: "Mentor sessions / month", values: ["2", "4", "8+"] },
  { label: "Branded portal", values: [false, true, true] },
  { label: "Dedicated SPOC", values: [false, true, true] },
  { label: "Placement support", values: ["Top 20%", "Top 50%", "All students"] },
  { label: "Analytics dashboard", values: ["Basic", "Monthly", "Real-time"] },
  { label: "Custom curriculum", values: [false, false, true] },
  { label: "On-campus workshops", values: ["1/quarter", "2/quarter", "Unlimited"] },
];

export default function CollegePartnership() {
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
                  label={currentTier.tier}
                  className="text-sm px-3 py-1"
                />
                <span className="text-xs text-muted-foreground">
                  since {currentTier.startDate}
                </span>
              </div>
            </div>
          </div>

          <h4 className="text-sm font-semibold mb-3">Your Benefits</h4>
          <ul className="space-y-2">
            {benefits.map((b, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-magenta flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </DataCard>

        <DataCard>
          <h4 className="text-sm font-semibold mb-4">Your SPOC</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-lavender/10 text-lavender flex items-center justify-center font-bold text-sm">
                {currentTier.spocName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="font-medium">{currentTier.spocName}</p>
                <p className="text-xs text-muted-foreground">Partnership Manager</p>
              </div>
            </div>

            <div>
              <p className="text-muted-foreground text-xs">Email</p>
              <p className="font-medium">{currentTier.spocEmail}</p>
            </div>

            <div>
              <p className="text-muted-foreground text-xs">Phone</p>
              <p className="font-medium">{currentTier.spocPhone}</p>
            </div>
          </div>
        </DataCard>
      </div>

      <DataCard>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-semibold font-display">Tier Comparison</h3>
          <Button
            className="bg-magenta hover:bg-magenta/90 text-white"
            size="sm"
          >
            <ArrowUpRight className="h-4 w-4 mr-1" /> Upgrade Tier
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 font-medium text-muted-foreground">
                  Benefit
                </th>
                {tiers.map((t) => (
                  <th
                    key={t.name}
                    className={`text-center py-3 px-4 font-semibold ${t.color}`}
                  >
                    {t.name}
                    {t.name === currentTier.tier && (
                      <span className="block text-[10px] text-muted-foreground font-normal">
                        Current
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row, i) => (
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
}
