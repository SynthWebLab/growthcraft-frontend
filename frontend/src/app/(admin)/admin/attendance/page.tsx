"use client";

import React, { useState, useEffect } from "react";
import {
  useAdminBatches,
  useAdminAttendanceSummary,
  useMarkAttendance,
} from "@/hooks/queries/useAdmin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { CheckCircle2, UserCheck, Calendar, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Let's import standard select components safely:
import {
  Select as ShadcnSelect,
  SelectContent as ShadcnSelectContent,
  SelectItem as ShadcnSelectItem,
  SelectTrigger as ShadcnSelectTrigger,
  SelectValue as ShadcnSelectValue,
} from "@/components/ui/select";

export default function AdminAttendancePage() {
  const [selectedBatchId, setSelectedBatchId] = useState<string>("");
  const [sessionDate, setSessionDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [records, setRecords] = useState<Record<string, { status: "Present" | "Absent" | "Late" | "Excused"; remarks: string }>>({});

  // Queries & Mutations
  const { data: batchesData, isLoading: batchesLoading } = useAdminBatches({ limit: 100 });
  const { data: summaryData, isLoading: summaryLoading } = useAdminAttendanceSummary(selectedBatchId);
  const markAttendanceMutation = useMarkAttendance();

  const batches = batchesData?.data || [];
  const studentsSummary = summaryData?.data?.summary || [];
  const totalSessions = summaryData?.data?.totalSessions || 0;

  // Initialize records map when students list changes
  useEffect(() => {
    if (studentsSummary.length > 0) {
      const initialRecords: typeof records = {};
      studentsSummary.forEach((item: any) => {
        initialRecords[item.student._id] = {
          status: "Present", // default to Present
          remarks: "",
        };
      });
      setRecords(initialRecords);
    }
  }, [studentsSummary]);

  const handleStatusChange = (studentId: string, status: "Present" | "Absent" | "Late" | "Excused") => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks,
      },
    }));
  };

  const handleSubmit = () => {
    if (!selectedBatchId || !sessionDate) {
      toast.error("Please select a batch and session date");
      return;
    }

    const payloadRecords = Object.entries(records).map(([studentUserId, val]) => ({
      studentUserId,
      status: val.status,
      remarks: val.remarks,
    }));

    if (payloadRecords.length === 0) {
      toast.error("No student records to submit");
      return;
    }

    markAttendanceMutation.mutate({
      batchId: selectedBatchId,
      sessionDate,
      records: payloadRecords,
    });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
        <p className="text-muted-foreground">
          Select a cohort batch, view summary analytics, and log student attendance records.
        </p>
      </div>

      {/* Selectors section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Batch & Date Selector</CardTitle>
            <CardDescription>Choose target cohort and log date.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="batch">Select Batch</Label>
              {batchesLoading ? (
                <div className="text-sm text-muted-foreground">Loading batches...</div>
              ) : (
                <ShadcnSelect value={selectedBatchId} onValueChange={setSelectedBatchId}>
                  <ShadcnSelectTrigger id="batch">
                    <ShadcnSelectValue placeholder="Choose a batch..." />
                  </ShadcnSelectTrigger>
                  <ShadcnSelectContent>
                    {batches.map((b: any) => (
                      <ShadcnSelectItem key={b._id} value={b._id}>
                        {b.code} ({b.batchType})
                      </ShadcnSelectItem>
                    ))}
                  </ShadcnSelectContent>
                </ShadcnSelect>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Session Date</Label>
              <Input
                id="date"
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Analytics Summary Widget */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Batch Attendance Stats</CardTitle>
            <CardDescription>Historical attendance summary for the selected batch.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-center min-h-[120px] py-4">
            {selectedBatchId ? (
              summaryLoading ? (
                <div className="text-sm text-muted-foreground text-center">Loading summary...</div>
              ) : (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="border-r border-border">
                    <Label className="text-xs text-muted-foreground">Total Logged Sessions</Label>
                    <div className="text-2xl font-bold mt-1">{totalSessions}</div>
                  </div>
                  <div className="border-r border-border">
                    <Label className="text-xs text-muted-foreground">Enrolled Students</Label>
                    <div className="text-2xl font-bold mt-1">{studentsSummary.length}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Avg. Attendance</Label>
                    <div className="text-2xl font-bold text-green-600 mt-1">
                      {studentsSummary.length > 0
                        ? Math.round(
                            studentsSummary.reduce((sum: number, item: any) => sum + item.attendancePercent, 0) /
                              studentsSummary.length
                          )
                        : 0}
                      %
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-sm text-muted-foreground text-center">
                Select a batch above to display attendance statistics.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Student list card */}
      {selectedBatchId && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Mark Student Attendance</CardTitle>
              <CardDescription>Verify status and optionally add remarks for each student.</CardDescription>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={markAttendanceMutation.isPending || studentsSummary.length === 0}
              className="gap-2"
            >
              <ClipboardCheck className="h-4 w-4" />
              {markAttendanceMutation.isPending ? "Submitting..." : "Submit Attendance"}
            </Button>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            ) : studentsSummary.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No students enrolled in this batch.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-border">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-muted text-muted-foreground text-xs uppercase font-medium">
                    <tr>
                      <th className="px-6 py-3">Student Name</th>
                      <th className="px-6 py-3">Email / Phone</th>
                      <th className="px-6 py-3 text-center">Current Month %</th>
                      <th className="px-6 py-3">Attendance Status</th>
                      <th className="px-6 py-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {studentsSummary.map((item: any) => {
                      const studentId = item.student._id;
                      const record = records[studentId] || { status: "Present", remarks: "" };
                      return (
                        <tr key={studentId} className="hover:bg-muted/40 transition-colors">
                          <td className="px-6 py-4 font-medium">{item.student.fullName}</td>
                          <td className="px-6 py-4 text-xs text-muted-foreground">
                            <div>{item.student.email}</div>
                            <div>{item.student.phone}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Badge variant={item.attendancePercent >= 75 ? "default" : "destructive"}>
                              {item.attendancePercent}%
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1.5">
                              {["Present", "Absent", "Late", "Excused"].map((statusOption) => (
                                <Button
                                  key={statusOption}
                                  size="sm"
                                  variant={record.status === statusOption ? "default" : "outline"}
                                  className="h-8 text-xs px-2.5"
                                  onClick={() =>
                                    handleStatusChange(studentId, statusOption as any)
                                  }
                                >
                                  {statusOption}
                                </Button>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Input
                              placeholder="Remarks (e.g. medical excuse)"
                              value={record.remarks}
                              onChange={(e) => handleRemarksChange(studentId, e.target.value)}
                              className="h-8 text-xs max-w-[240px]"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
