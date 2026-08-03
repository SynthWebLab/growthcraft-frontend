"use client";

import React, { useState } from "react";
import {
  useAdminMentors,
  useAdminMentorDetails,
  useVerifyCheckIn,
  useRecordPayout,
  useApprovePayout,
  useAdminBatches,
  useAssignMentorToBatch,
} from "@/hooks/queries/useAdmin";
import { useCourses } from "@/hooks/queries/useCourses";
import { useTrainingPrograms } from "@/hooks/queries/useTrainingPrograms";
import { useBootcamps } from "@/hooks/queries/useBootcamps";
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
import { Calendar, CreditCard, Clock, CheckCircle, ShieldAlert, Award, FileText, Users, Link as LinkIcon, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const approvePayoutMutation = useApprovePayout(selectedMentorId || "");

  // Batch Assignment States
  const [assignOpen, setAssignOpen] = useState(false);
  const [programType, setProgramType] = useState<"Course" | "TrainingProgram" | "Bootcamp">("Course");
  const [programId, setProgramId] = useState("");
  const [batchId, setBatchId] = useState("");

  // Assign mutation
  const assignMentorMutation = useAssignMentorToBatch();

  // Load programs data
  const { data: coursesData } = useCourses();
  const { data: programsData } = useTrainingPrograms();
  const { data: bootcampsData } = useBootcamps();

  const coursesList = coursesData?.data || [];
  const trainingProgramsList = programsData?.data || [];
  const bootcampsList = bootcampsData?.items || [];

  // Filter programs based on selected type
  const activePrograms = programType === "Course" 
    ? coursesList.map((c: any) => ({ id: c._id || c.id, title: c.title }))
    : programType === "TrainingProgram"
    ? trainingProgramsList.map((p: any) => ({ id: p._id || p.id, title: p.title }))
    : bootcampsList.map((b: any) => ({ id: b._id || b.id, title: b.title }));

  // Load batches of the selected program type & ID
  const { data: programBatchesData, isLoading: batchesLoading } = useAdminBatches({
    batchType: programType,
    courseId: programType === "Course" ? programId : undefined,
    trainingProgramId: programType === "TrainingProgram" ? programId : undefined,
    bootcampId: programType === "Bootcamp" ? programId : undefined,
  });

  const availableBatchesList = programBatchesData?.data || [];

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
      key: "areaOfExpertise",
      label: "Expertise",
      render: (val: any) => val || "N/A",
    },
    {
      key: "experienceYears",
      label: "Exp (Yrs)",
      render: (val: any) => `${val || 0} yrs`,
    },
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

                  {/* Tabs for check-ins, payouts and assignments */}
                  <Tabs defaultValue="checkins" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="checkins">Check-ins</TabsTrigger>
                      <TabsTrigger value="payouts">Payouts</TabsTrigger>
                      <TabsTrigger value="assignments">Cohorts</TabsTrigger>
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
                            <div key={po._id} className="p-3 bg-muted/40 rounded-lg border border-border text-xs space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">{po.period}</span>
                                <span className="font-bold text-foreground">
                                  INR {po.amount.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-muted-foreground text-[10px]">
                                <span>Rate: INR {po.hourlyRate}/hr</span>
                                <span>Date: {new Date(po.processedAt || po.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
                                <Badge variant={po.status === "processed" || po.status === "completed" ? "default" : "secondary"}>
                                  {po.status === "processed" || po.status === "completed" ? "Paid" : "Pending"}
                                </Badge>
                                {(po.status === "pending" || po.status === "requested") && (
                                  <Button
                                    size="sm"
                                    className="h-6 text-[10px] px-2 py-0 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => approvePayoutMutation.mutate(po._id)}
                                    disabled={approvePayoutMutation.isPending}
                                  >
                                    {approvePayoutMutation.isPending ? "Approving..." : "Approve Disbursal"}
                                  </Button>
                                )}
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

                    <TabsContent value="assignments" className="space-y-3 pt-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          Assigned Cohorts
                        </h4>
                        
                        {/* Assign to Cohort Dialog */}
                        <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" className="h-7 text-xs px-2.5">
                              + Assign
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Mentor to Batch</DialogTitle>
                              <DialogDescription>
                                Assign {detailData?.data?.user?.fullName} to an existing cohort batch.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-3">
                              {/* Program Type Selection */}
                              <div className="space-y-2">
                                <Label>Program Type</Label>
                                <Select
                                  value={programType}
                                  onValueChange={(val: any) => {
                                    setProgramType(val);
                                    setProgramId("");
                                    setBatchId("");
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Course">Course</SelectItem>
                                    <SelectItem value="TrainingProgram">Training Program</SelectItem>
                                    <SelectItem value="Bootcamp">Bootcamp / Event</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Program Selection */}
                              <div className="space-y-2">
                                <Label>Select {programType}</Label>
                                <Select
                                  value={programId}
                                  onValueChange={(val) => {
                                    setProgramId(val);
                                    setBatchId("");
                                  }}
                                  disabled={activePrograms.length === 0}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={`Select ${programType}`} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {activePrograms.map((p: any) => (
                                      <SelectItem key={p.id} value={p.id}>
                                        {p.title}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Batch Selection */}
                              <div className="space-y-2">
                                <Label>Select Batch</Label>
                                <Select
                                  value={batchId}
                                  onValueChange={setBatchId}
                                  disabled={!programId || availableBatchesList.length === 0 || batchesLoading}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder={batchesLoading ? "Loading..." : "Select batch"} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {availableBatchesList.map((b: any) => (
                                      <SelectItem key={b._id} value={b._id}>
                                        {b.code} ({b.mode})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                {programId && availableBatchesList.length === 0 && !batchesLoading && (
                                  <p className="text-xs text-muted-foreground italic text-red-500">
                                    No active/draft batches found for this program.
                                  </p>
                                )}
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="ghost" onClick={() => setAssignOpen(false)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={() => {
                                  if (!batchId) return;
                                  assignMentorMutation.mutate(
                                    { batchId, mentorId: selectedMentorId! },
                                    {
                                      onSuccess: () => {
                                        setAssignOpen(false);
                                        setProgramId("");
                                        setBatchId("");
                                      },
                                    }
                                  );
                                }}
                                disabled={!batchId || assignMentorMutation.isPending}
                              >
                                {assignMentorMutation.isPending ? "Assigning..." : "Assign Mentor"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1">
                        {detailData?.data?.batches?.length > 0 ? (
                          detailData.data.batches.map((b: any) => (
                            <div key={b._id} className="p-3 bg-muted/40 rounded-lg border border-border text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-semibold">{b.code}</span>
                                <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4 uppercase">
                                  {b.status}
                                </Badge>
                              </div>
                              <p className="text-[11px] font-medium text-foreground">
                                {b.courseId?.title || b.trainingProgramId?.title || b.bootcampId?.title || "Assigned Batch"}
                              </p>
                              <div className="text-muted-foreground text-[10px] flex justify-between">
                                <span>Type: {b.batchType} ({b.mode})</span>
                                <span>Date: {new Date(b.startDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-xs text-muted-foreground py-8">
                            No cohorts/batches assigned to this mentor.
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
