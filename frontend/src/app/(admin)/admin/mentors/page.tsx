"use client";

import { toast } from "sonner";

import React, { useState } from "react";
import {
  useAdminMentors,
  useAdminMentorDetails,
  useVerifyCheckIn,
  useRecordPayout,
  useApprovePayout,
  useConfirmPayout,
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
import { Calendar, CreditCard, Clock, CheckCircle, ShieldAlert, Award, FileText, Users, Link as LinkIcon, BookOpen, ExternalLink, AlertCircle, Copy } from "lucide-react";
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

  // Razorpay disbursal modal state
  const [razorpayModal, setRazorpayModal] = useState<{
    open: boolean;
    payoutId: string;
    amount: number;
    notes?: string;
    razorpayLinkId?: string;
    razorpayLinkUrl?: string;
    expiresAt?: string;
  } | null>(null);
  const [confirmPaymentId, setConfirmPaymentId] = useState("");

  // Queries & Mutations
  const { data: mentorsData, isLoading: mentorsLoading } = useAdminMentors({ search, page, limit: 10 });
  const { data: detailData, isLoading: detailLoading } = useAdminMentorDetails(selectedMentorId || "");
  const verifyCheckInMutation = useVerifyCheckIn(selectedMentorId || "");
  const recordPayoutMutation = useRecordPayout(selectedMentorId || "");
  const approvePayoutMutation = useApprovePayout(selectedMentorId || "");
  const confirmPayoutMutation = useConfirmPayout(selectedMentorId || "");

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
        onSuccess: (res: any) => {
          setPayoutOpen(false);
          setPayoutAmount("");
          setPayoutPeriod("");
          setPayoutNotes("");

          setRazorpayModal({
            open: true,
            payoutId: res.data?.payout?._id || "",
            amount: res.data?.payout?.amount || parseFloat(payoutAmount),
            notes: res.data?.payout?.notes || payoutNotes,
            razorpayLinkId: res.data?.razorpayLinkId || "",
            razorpayLinkUrl: res.data?.razorpayLinkUrl || "",
            expiresAt: res.data?.expiresAt,
          });
          setConfirmPaymentId("");
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
    <div className="space-y-4 md:space-y-6">
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
                <CardContent className="pt-6 space-y-4 md:space-y-6">
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
                           Generate a Razorpay Payment Link to pay {detailData?.data?.user?.fullName}.
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
                                <span>
                                  Hours: {ci.hoursWorked} hrs
                                  {ci.verifiedBy && ` | Payout: INR ${(ci.hoursWorked * (detailData?.data?.profile?.hourlyRate || 1500)).toLocaleString()}`}
                                </span>
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
                                  ₹{po.amount.toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-muted-foreground text-[10px]">
                                <span>Rate: ₹{po.hourlyRate}/hr</span>
                                <span>Date: {new Date(po.processedAt || po.createdAt).toLocaleDateString()}</span>
                              </div>

                              {/* Razorpay payment ID if confirmed */}
                              {po.razorpayPaymentId && (
                                <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-green-500/10 rounded px-2 py-1">
                                  <CheckCircle className="h-3 w-3 text-green-500 shrink-0" />
                                  <span className="font-mono">{po.razorpayPaymentId}</span>
                                </div>
                              )}

                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
                                <Badge
                                  variant={
                                    po.status === "processed" ? "default"
                                    : po.status === "processing" ? "outline"
                                    : "secondary"
                                  }
                                  className={po.status === "processing" ? "border-yellow-500 text-yellow-600" : ""}
                                >
                                  {po.status === "processed" ? "Paid"
                                    : po.status === "processing" ? "Processing…"
                                    : "Pending"}
                                </Badge>

                                {/* Pending → Generate Razorpay link */}
                                {po.status === "pending" && (
                                  <Button
                                    size="sm"
                                    className="h-6 text-[10px] px-2 py-0 bg-blue-600 hover:bg-blue-700 text-white gap-1"
                                    onClick={() =>
                                      approvePayoutMutation.mutate(po._id, {
                                        onSuccess: (res: any) => {
                                          setRazorpayModal({
                                            open: true,
                                            payoutId: po._id,
                                            amount: po.amount,
                                            notes: po.notes,
                                            razorpayLinkId: res.data?.razorpayLinkId || "",
                                            razorpayLinkUrl: res.data?.razorpayLinkUrl || "",
                                            expiresAt: res.data?.expiresAt,
                                          });
                                          setConfirmPaymentId("");
                                        },
                                      })
                                    }
                                    disabled={approvePayoutMutation.isPending}
                                  >
                                    {approvePayoutMutation.isPending ? "Generating…" : "Pay via Razorpay"}
                                  </Button>
                                )}

                                {/* Processing → Reopen link or confirm */}
                                {po.status === "processing" && po.razorpayLinkUrl && (
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 text-[10px] px-2 py-0 gap-0.5"
                                      onClick={() => window.open(po.razorpayLinkUrl, "_blank")}
                                    >
                                      <ExternalLink className="h-3 w-3" /> Open Link
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="h-6 text-[10px] px-2 py-0 bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => {
                                        setRazorpayModal({
                                          open: true,
                                          payoutId: po._id,
                                          amount: po.amount,
                                          notes: po.notes,
                                          razorpayLinkId: po.razorpayLinkId || "",
                                          razorpayLinkUrl: po.razorpayLinkUrl || "",
                                        });
                                        setConfirmPaymentId("");
                                      }}
                                    >
                                      Confirm Paid
                                    </Button>
                                  </div>
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

      {/* ── Mentor Payout Disbursal Modal ── */}
      <Dialog open={!!razorpayModal?.open} onOpenChange={(open) => { if (!open) setRazorpayModal(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              Process Mentor Disbursal
            </DialogTitle>
            <DialogDescription>
              Disburse ₹{razorpayModal?.amount?.toLocaleString()} to {detailData?.data?.user?.fullName || selectedMentor?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Beneficiary Details Box */}
            {(() => {
              const notesText = razorpayModal?.notes || "";
              const match = notesText.match(/([a-zA-Z0-9.\-_]+@[a-zA-Z0-9.\-_]+)/);
              const upiAddress = match ? match[1] : "";
              const mentorName = detailData?.data?.user?.fullName || selectedMentor?.name || "Mentor";
              const amount = razorpayModal?.amount || 0;
              const upiUri = upiAddress
                ? `upi://pay?pa=${encodeURIComponent(upiAddress)}&pn=${encodeURIComponent(mentorName)}&am=${amount}&cu=INR&tn=${encodeURIComponent("GrowthCraft Mentor Payout")}`
                : "";

              return (
                <>
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-3.5 space-y-2.5">
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                      Beneficiary Payout Details
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Mentor Name:</span>
                      <span className="font-medium text-foreground">{mentorName}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Amount to Disburse:</span>
                      <span className="font-bold text-foreground">₹{amount.toLocaleString()}</span>
                    </div>
                    {notesText && (
                      <div className="flex justify-between items-center text-xs pt-1.5 border-t border-border/50">
                        <span className="text-muted-foreground">UPI / Bank Details:</span>
                        <div className="flex items-center gap-1 font-mono text-foreground font-semibold bg-background px-2 py-0.5 rounded border text-[11px]">
                          {notesText}
                          {upiAddress && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-5 w-5 text-muted-foreground hover:text-foreground ml-1"
                              onClick={() => {
                                navigator.clipboard.writeText(upiAddress);
                                toast.success("UPI ID copied to clipboard!");
                              }}
                              title="Copy UPI ID"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {upiUri && (
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2 text-xs py-2"
                      onClick={() => window.open(upiUri, "_self")}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Pay via UPI App (GPay / PhonePe / Paytm)
                    </Button>
                  )}
                </>
              );
            })()}

            {/* Info Banner */}
            <div className="flex items-start gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 text-xs text-blue-700 dark:text-blue-300">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>
                Disburse <strong>₹{razorpayModal?.amount?.toLocaleString()}</strong> to the mentor's UPI ID via Razorpay X API, NetBanking, or UPI app, then paste the UTR / Ref ID below to confirm.
              </span>
            </div>

            {/* Payment ID input */}
            <div className="space-y-1.5">
              <Label htmlFor="rzpPaymentId" className="text-sm font-medium">
                Razorpay X / UTR Transaction Ref ID
              </Label>
              <Input
                id="rzpPaymentId"
                placeholder="pay_xxx... or UTR / Ref Number"
                value={confirmPaymentId}
                onChange={(e) => setConfirmPaymentId(e.target.value)}
                className="font-mono text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Enter the Razorpay X Payout ID or bank UTR reference code to confirm payment.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 flex-row">
            <Button variant="outline" className="flex-1" onClick={() => setRazorpayModal(null)}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white gap-2"
              disabled={confirmPayoutMutation.isPending}
              onClick={() => {
                if (!razorpayModal?.payoutId) return;
                confirmPayoutMutation.mutate(
                  { payoutId: razorpayModal.payoutId, razorpayPaymentId: confirmPaymentId.trim() },
                  { onSuccess: () => setRazorpayModal(null) }
                );
              }}
            >
              <CheckCircle className="h-4 w-4" />
              {confirmPayoutMutation.isPending ? "Confirming…" : "Confirm Paid"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
