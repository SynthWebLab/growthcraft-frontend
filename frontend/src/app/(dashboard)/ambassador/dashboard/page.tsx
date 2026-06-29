"use client";

import { useState } from "react";
import { Copy, Check, Send, Award, Users, DollarSign, Megaphone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KpiCard, PanelEmptyState } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import { PageHeader } from "@/components/ui/page-header";
import { useAmbassadorDashboard, useAmbassadorReferrals, useCreateReferral } from "@/hooks/queries/useStudent";
import { useCourses } from "@/hooks/queries/useCourses";
import { useBootcamps } from "@/hooks/queries/useBootcamps";
import { useTrainingPrograms } from "@/hooks/queries/useTrainingPrograms";
import { toast } from "sonner";

export default function AmbassadorDashboardPage() {
  const { data: dashboardData, isLoading: isDashboardLoading } = useAmbassadorDashboard();
  const { data: referralsData, isLoading: isReferralsLoading } = useAmbassadorReferrals();
  const { data: coursesData } = useCourses({});
  const { data: bootcampsData } = useBootcamps({});
  const { data: programsData } = useTrainingPrograms({});
  const { mutate: inviteFriend, isPending: isInviting } = useCreateReferral();

  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [friendEmail, setFriendEmail] = useState("");
  const [selectedType, setSelectedType] = useState<"Course" | "Bootcamp" | "TrainingProgram">("Course");
  const [selectedItemId, setSelectedItemId] = useState("");

  const stats = dashboardData?.data ?? {
    totalReferrals: 0,
    joinedReferrals: 0,
    totalCommission: 0,
    unpaidCommission: 0,
    paidCommission: 0,
  };

  const referrals = referralsData?.data?.referrals ?? [];

  // Dropdown list based on type
  const itemsList = (() => {
    if (selectedType === "Course") {
      const courses = (coursesData?.data as any) ?? [];
      return courses.map((c: any) => ({ id: c._id, title: c.title, slug: c.slug }));
    }
    if (selectedType === "Bootcamp") {
      const bootcamps = (bootcampsData as any)?.items ?? (bootcampsData as any)?.data?.items ?? [];
      return bootcamps.map((b: any) => ({ id: b._id, title: b.title, slug: b.slug }));
    }
    if (selectedType === "TrainingProgram") {
      const programs = (programsData?.data as any) ?? [];
      return programs.map((p: any) => ({ id: p._id, title: p.title, slug: p.slug }));
    }
    return [];
  })();

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendEmail.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!selectedItemId) {
      toast.error("Please select a program or course to refer");
      return;
    }

    inviteFriend(
      {
        referredEmail: friendEmail.trim(),
        referredItemType: selectedType,
        referredItemId: selectedItemId,
      },
      {
        onSuccess: () => {
          setFriendEmail("");
        },
      }
    );
  };

  const getReferralUrl = (type: string, id: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const prefix = type === "Course" ? "courses" : type === "Bootcamp" ? "bootcamps" : "training-programs";
    
    // Find item slug
    const item = itemsList.find((item: any) => item.id === id);
    const slug = item?.slug || id;

    return `${origin}/${prefix}/${slug}?ref=${selectedItemId}`; // Wait, referral link uses item slug
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Ambassador Portal"
        description="Share courses with your network, track conversions, and earn 10% commission on enrollments."
      />

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isDashboardLoading ? (
          [0, 1, 2, 3].map((i: number) => (
            <div key={i} className="h-28 rounded-xl border border-border bg-white animate-pulse" />
          ))
        ) : (
          <>
            <KpiCard label="Total Invites" value={stats.totalReferrals} />
            <KpiCard label="Conversions" value={stats.joinedReferrals} />
            <KpiCard label="Lifetime Commission" value={stats.totalCommission} prefix="₹" />
            <KpiCard label="Unpaid Payout" value={stats.unpaidCommission} prefix="₹" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Generate and Send Invitations */}
        <div className="lg:col-span-2 space-y-6">
          <DataCard className="h-full flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold font-display mb-4 text-foreground flex items-center gap-2">
                <Plus className="h-5 w-5 text-magenta" /> Generate Referral Link
              </h2>
              <form onSubmit={handleSendInvite} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Program Type</label>
                    <select
                      value={selectedType}
                      onChange={(e) => {
                        setSelectedType(e.target.value as any);
                        setSelectedItemId("");
                      }}
                      className="w-full h-10 rounded-md border border-border bg-marble px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-magenta"
                    >
                      <option value="Course">Individual Course</option>
                      <option value="Bootcamp">Bootcamp</option>
                      <option value="TrainingProgram">Offline Training Program</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Select Item</label>
                    <select
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      className="w-full h-10 rounded-md border border-border bg-marble px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-magenta"
                    >
                      <option value="">-- Choose Option --</option>
                      {itemsList.map((item: any) => (
                        <option key={item.id} value={item.id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Friend's Email Address</label>
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="e.g. friend@college.edu"
                      value={friendEmail}
                      onChange={(e) => setFriendEmail(e.target.value)}
                      className="bg-marble"
                    />
                    <Button type="submit" className="bg-magenta hover:bg-magenta/90" disabled={isInviting || !selectedItemId}>
                      {isInviting ? "Sending..." : "Invite"} <Send className="h-4 w-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </form>
            </div>

            {selectedItemId && (
              <div className="mt-6 p-4 rounded-lg bg-lavender/10 border border-lavender/30 flex items-center justify-between gap-4">
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-magenta uppercase tracking-wider mb-1">Your Referral Link</p>
                  <p className="text-xs font-mono text-muted-foreground truncate">{getReferralUrl(selectedType, selectedItemId)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyLink(getReferralUrl(selectedType, selectedItemId))}
                  className="shrink-0"
                >
                  {copiedLink ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            )}
          </DataCard>
        </div>

        {/* Right 1 Column: Recent Referral Activity */}
        <div className="space-y-6">
          <DataCard className="h-full flex flex-col">
            <h2 className="text-lg font-bold font-display mb-4 text-foreground flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-magenta" /> Recent Activity
            </h2>
            <div className="flex-1 overflow-y-auto max-h-[300px] space-y-4">
              {isReferralsLoading ? (
                [0, 1, 2].map((i: number) => (
                  <div key={i} className="h-12 w-full rounded bg-marble animate-pulse" />
                ))
              ) : referrals.length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No referral activity logged yet.</p>
              ) : (
                referrals.slice(0, 5).map((ref: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-foreground truncate max-w-[150px]">{ref.referredEmail}</p>
                      <p className="text-xs text-muted-foreground">{new Date(ref.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          ref.status === "completed"
                            ? "bg-success/10 text-success"
                            : ref.status === "joined"
                            ? "bg-magenta/10 text-magenta"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {ref.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </DataCard>
        </div>
      </div>
    </div>
  );
}
