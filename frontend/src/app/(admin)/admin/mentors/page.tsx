"use client";

import React, { useState } from "react";
import {
  useAdminMentors,
  useAdminMentorDetails,
  useVerifyCheckIn,
  useRecordPayout,
} from "@/hooks/queries/useAdmin";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CreditCard, Clock, CheckCircle, ShieldAlert, Award, FileText, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminMentorsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
  const [payoutOpen, setPayoutOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutPeriod, setPayoutPeriod] = useState("");
  const [payoutNotes, setPayoutNotes] = useState("");

  // Queries & Mutations
  const { data: mentorsData, isLoading: mentorsLoading } = useAdminMentors({ search, page, limit: 10 });
  const { data: detailData, isLoading: detailLoading } = useAdminMentorDetails(selectedMentorId || "");
  const verifyCheckInMutation = useVerifyCheckIn(selectedMentorId || "");
  const recordPayoutMutation = useRecordPayout(selectedMentorId || "");

  const mentorsList = mentorsData?.data || [];
  const selectedMentor = mentorsList.find((m: any) => m._id === selectedMentorId);

  // Handlers
  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleProcessPayout = () => {
    if (!selectedMentorId || !payoutAmount || !payoutPeriod) return;
    recordPayoutMutation.mutate(
      {
        amount: parseFloat(payoutAmount),
        period: payoutPeriod,
        notes: payoutNotes,
      },
      {
        onSuccess: () => {
          setPayoutOpen(false);
          setPayoutAmount("");
          setPayoutPeriod("");
          setPayoutNotes("");
        },
      }
    );
  };

  const handleVerifyCheckIn = (checkInId: string) => {
    verifyCheckInMutation.mutate(checkInId);
  };

  // Columns for main mentors table
  const columns = [
    { key: "name", label: "Mentor Name" },
    { key: "email", label: "Email" },
    {
      key: "hourlyRate",
      label: "Hourly Rate",
      render: (val: any) => `INR ${val || 0}/hr`,
    },
    {
      key: "totalHoursThisMonth",
      label: "Hours (This Month)",
      render: (val: any) => `${val || 0} hrs`,
    },
    {
      key: "pendingPayout",
      label: "Pending Payout",
      render: (val: any) => `INR ${(val || 0).toLocaleString()}`,
    },
    {
      key: "totalPaid",
      label: "Total Paid",
      render: (val: any) => `INR ${(val || 0).toLocaleString()}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mentor Payout Management</h1>
        <p className="text-muted-foreground">
          Track hours, verify mentor check-ins, and process monthly payouts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mentor List Section */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mentors</CardTitle>
              <CardDescription>Select a mentor to manage check-ins and process payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={mentorsList}
                isLoading={mentorsLoading}
                onSearch={handleSearch}
                onView={(row) => setSelectedMentorId(row._id)}
                searchPlaceholder="Search mentors by name or email..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Mentor Detail Pane */}
        <div className="lg:col-span-1">
          {selectedMentorId ? (
            detailLoading ? (
              <Card className="h-full flex items-center justify-center p-8">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <span className="text-sm text-muted-foreground">Loading details...</span>
                </div>
              </Card>
            ) : (
              <Card className="h-full">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {detailData?.data?.user?.fullName || selectedMentor?.name}
                      </CardTitle>
                      <CardDescription>
                        {detailData?.data?.user?.email || selectedMentor?.email}
                      </CardDescription>
                    </div>
                    <Badge variant={detailData?.data?.profile?.isVerified ? "default" : "secondary"}>
                      {detailData?.data?.profile?.isVerified ? "Verified" : "Pending"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Quick stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/40 p-3 rounded-lg border border-border">
                      <Label className="text-xs text-muted-foreground">Pending Payout</Label>
                      <div className="text-lg font-bold text-primary mt-1">
                        INR {(detailData?.data?.profile?.pendingPayout || 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-muted/40 p-3 rounded-lg border border-border">
                      <Label className="text-xs text-muted-foreground">Hourly Rate</Label>
                      <div className="text-lg font-bold mt-1">
                        INR {detailData?.data?.profile?.hourlyRate || 0}
                      </div>
                    </div>
                  </div>

                  {/* Process Payout Button */}
                  <Dialog open={payoutOpen} onOpenChange={setPayoutOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full gap-2">
                        <CreditCard className="h-4 w-4" />
                        Process Payout
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Process Mentor Payout</DialogTitle>
                        <DialogDescription>
                          Record an offline payout for {detailData?.data?.user?.fullName}. This reduces their pending balance.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="amount">Payout Amount (INR)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="Enter amount"
                            value={payoutAmount}
                            onChange={(e) => setPayoutAmount(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground">
                            Max pending balance: INR {(detailData?.data?.profile?.pendingPayout || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="period">Payout Period</Label>
                          <Input
                            id="period"
                            placeholder="e.g. June 2026"
                            value={payoutPeriod}
                            onChange={(e) => setPayoutPeriod(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes / Receipt Ref</Label>
                          <Textarea
                            id="notes"
                            placeholder="Bank transaction ID, details..."
                            value={payoutNotes}
                            onChange={(e) => setPayoutNotes(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="ghost" onClick={() => setPayoutOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleProcessPayout}
                          disabled={!payoutAmount || !payoutPeriod || recordPayoutMutation.isPending}
                        >
                          {recordPayoutMutation.isPending ? "Saving..." : "Confirm Payout"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Tabs for check-ins and payouts */}
                  <Tabs defaultValue="checkins" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="checkins">Check-ins</TabsTrigger>
                      <TabsTrigger value="payouts">Payout History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="checkins" className="space-y-3 pt-3">
                      <h4 className="text-sm font-semibold flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Check-in Records (Last 10)
                      </h4>
                      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                        {detailData?.data?.checkIns?.length > 0 ? (
                          detailData.data.checkIns.map((ci: any) => (
                            <div key={ci._id} className="p-3 bg-muted/40 rounded-lg border border-border text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">Batch {ci.batchId?.code}</span>
                                <span className="text-muted-foreground">
                                  {new Date(ci.sessionDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-muted-foreground">
                                <span>Hours: {ci.hoursWorked} hrs</span>
                                {ci.verifiedBy ? (
                                  <Badge variant="outline" className="text-green-600 bg-green-50/50 border-green-200">
                                    Verified
                                  </Badge>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 text-[10px] px-2 py-0"
                                    onClick={() => handleVerifyCheckIn(ci._id)}
                                    disabled={verifyCheckInMutation.isPending}
                                  >
                                    Verify Hours
                                  </Button>
                                )}
                              </div>
                              {ci.notes && <p className="text-[10px] text-muted-foreground italic">Note: {ci.notes}</p>}
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-xs text-muted-foreground py-8">
                            No check-in logs found.
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="payouts" className="space-y-3 pt-3">
                      <h4 className="text-sm font-semibold flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        Payout History (Last 10)
                      </h4>
                      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                        {detailData?.data?.payouts?.length > 0 ? (
                          detailData.data.payouts.map((po: any) => (
                            <div key={po._id} className="p-3 bg-muted/40 rounded-lg border border-border text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">{po.period}</span>
                                <span className="text-muted-foreground font-medium">
                                  INR {po.amount.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-muted-foreground text-[10px] flex justify-between">
                                <span>Rate: INR {po.hourlyRate}/hr</span>
                                <span>Date: {new Date(po.processedAt).toLocaleDateString()}</span>
                              </div>
                              {po.notes && <p className="text-[10px] text-muted-foreground italic">Notes: {po.notes}</p>}
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-xs text-muted-foreground py-8">
                            No payouts recorded yet.
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )
          ) : (
            <Card className="h-full flex items-center justify-center p-8 border-dashed">
              <div className="flex flex-col items-center gap-2 text-center">
                <Users className="h-10 w-10 text-muted-foreground" />
                <CardTitle className="text-base">No Mentor Selected</CardTitle>
                <CardDescription className="max-w-xs">
                  Click on the "Actions" dropdown or selection triggers to view full logs and process payments.
                </CardDescription>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
