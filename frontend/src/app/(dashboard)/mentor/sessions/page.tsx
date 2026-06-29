"use client";

import { useState } from "react";
import { Users, Clock, CheckSquare, ClipboardList, CheckCircle, HelpCircle, Loader2, Star, Calendar, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DataCard from "@/components/ui/data-card";
import { useSearchParams } from "next/navigation";
import {
  useMentorBatches,
  useMentorBatchDetail,
  useMentorMarkAttendance,
  useMentorCreateProgressNote,
  useMentorCheckInsHistory,
} from "@/hooks/queries/useMentor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function MentorCohortsPage() {
  const searchParams = useSearchParams();
  const initialBatchId = searchParams ? (searchParams.get("batchId") || "") : "";

  const [activeBatchId, setActiveBatchId] = useState<string>(initialBatchId);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  
  // Progress Note Form States
  const [noteOpen, setNoteOpen] = useState(false);
  const [rubricScore, setRubricScore] = useState(8);
  const [feedback, setFeedback] = useState("");
  const [strengths, setStrengths] = useState("");
  const [areasForImprovement, setAreasForImprovement] = useState("");

  // Attendance Form States
  const [attendanceDate, setAttendanceDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, { status: string; remarks: string }>>({});

  const { data: batchesResponse, isLoading: isBatchesLoading } = useMentorBatches();
  const { data: batchDetailResponse, isLoading: isDetailLoading, refetch: refetchDetail } = useMentorBatchDetail(activeBatchId);
  const { data: historyResponse, isLoading: isHistoryLoading } = useMentorCheckInsHistory(activeBatchId ? { batchId: activeBatchId } : undefined);

  const markAttendanceMutation = useMentorMarkAttendance();
  const createProgressNoteMutation = useMentorCreateProgressNote();

  const batches = batchesResponse?.data?.batches ?? [];
  const batchDetail = batchDetailResponse?.data?.batch;
  const students = batchDetailResponse?.data?.students ?? [];
  const checkIns = historyResponse?.data?.checkIns ?? [];

  const handleSelectBatch = (id: string) => {
    setActiveBatchId(id);
    setAttendanceRecords({});
  };

  const handleOpenNoteDialog = (student: any) => {
    setSelectedStudent(student);
    setRubricScore(8);
    setFeedback("");
    setStrengths("");
    setAreasForImprovement("");
    setNoteOpen(true);
  };

  const handleSaveProgressNote = () => {
    if (!selectedStudent || !activeBatchId) return;
    if (!feedback.trim()) {
      toast.error("Feedback text is required");
      return;
    }

    createProgressNoteMutation.mutate(
      {
        studentUserId: selectedStudent.userId?._id || selectedStudent.userId,
        batchId: activeBatchId,
        rubricScore,
        feedback: feedback.trim(),
        strengths: strengths.trim() || undefined,
        areasForImprovement: areasForImprovement.trim() || undefined,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setNoteOpen(false);
            refetchDetail();
          }
        },
      }
    );
  };

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { remarks: "" }),
        status,
      },
    }));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: "Present" }),
        remarks,
      },
    }));
  };

  const handleSaveAttendance = () => {
    if (!activeBatchId) return;

    // Build records list for all students
    const records = students.map((s: any) => {
      const studentId = s._id;
      const record = attendanceRecords[studentId] || { status: "Present", remarks: "" };
      return {
        studentUserId: s.userId?._id || s.userId,
        status: record.status as any,
        remarks: record.remarks || undefined,
      };
    });

    markAttendanceMutation.mutate(
      {
        batchId: activeBatchId,
        date: attendanceDate,
        records,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            refetchDetail();
          }
        },
      }
    );
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Assigned Cohorts"
        description="Monitor cohort progress, mark offline attendance registries, and log student mentoring feedback."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Batches List */}
        <div>
          <DataCard className="p-4">
            <h3 className="font-bold text-foreground text-sm font-display mb-4 flex items-center gap-2">
              <Users className="h-4.5 w-4.5 text-magenta" /> Select Cohort
            </h3>
            {isBatchesLoading ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 rounded bg-marble animate-pulse" />
                ))}
              </div>
            ) : batches.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No cohorts assigned yet.</p>
            ) : (
              <div className="space-y-2">
                {batches.map((b: any) => (
                  <button
                    key={b._id}
                    onClick={() => handleSelectBatch(b._id)}
                    className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex justify-between items-center ${
                      activeBatchId === b._id
                        ? "bg-magenta/5 border-magenta text-magenta font-semibold"
                        : "border-border bg-white hover:bg-marble text-foreground"
                    }`}
                  >
                    <div>
                      <p className="truncate max-w-[180px]">{b.batchName}</p>
                      <p className="text-xs text-muted-foreground font-normal mt-0.5">
                        {b.collegeId?.collegeName || b.collegeName || "Offline Partner"}
                      </p>
                    </div>
                    <Badge variant={activeBatchId === b._id ? "default" : "outline"} className={activeBatchId === b._id ? "bg-magenta hover:bg-magenta" : ""}>
                      {b.studentsCount || 0} stds
                    </Badge>
                  </button>
                ))}
              </div>
            )}
          </DataCard>
        </div>

        {/* Right 2 Columns: Selected Batch Details */}
        <div className="lg:col-span-2">
          {!activeBatchId ? (
            <DataCard className="text-center py-16">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-base font-bold text-foreground mb-1">No cohort selected</h3>
              <p className="text-sm text-muted-foreground">Select a cohort from the list on the left to view details and mark attendance.</p>
            </DataCard>
          ) : isDetailLoading ? (
            <div className="h-96 rounded-xl border border-border bg-white animate-pulse flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-magenta animate-spin" />
            </div>
          ) : !batchDetail ? (
            <p className="text-sm text-red-500 font-medium p-4 bg-red-50 rounded border border-red-100">Cohort data could not be fetched.</p>
          ) : (
            <div className="space-y-6">
              {/* Batch General Overview Card */}
              <DataCard>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-foreground font-display">{batchDetail.batchName}</h2>
                    <p className="text-sm text-muted-foreground">{batchDetail.collegeId?.collegeName || batchDetail.collegeName || "Partner Campus"}</p>
                  </div>
                  <Badge className="bg-success text-white self-start sm:self-auto uppercase tracking-wider text-xs">
                    {batchDetail.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="font-semibold text-foreground mt-0.5">{new Date(batchDetail.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End Date</p>
                    <p className="font-semibold text-foreground mt-0.5">{new Date(batchDetail.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Mentors Assigned</p>
                    <p className="font-semibold text-foreground mt-0.5">{batchDetail.assignedMentorIds?.length || 1}</p>
                  </div>
                </div>
              </DataCard>

              {/* Functional tabs */}
              <Tabs defaultValue="students">
                <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 gap-4">
                  <TabsTrigger value="students" className="border-b-2 border-transparent data-[state=active]:border-magenta data-[state=active]:text-magenta rounded-none px-4 py-2 text-sm font-semibold bg-transparent">
                    <ClipboardList className="h-4 w-4 mr-2" /> Students & Grading
                  </TabsTrigger>
                  <TabsTrigger value="attendance" className="border-b-2 border-transparent data-[state=active]:border-magenta data-[state=active]:text-magenta rounded-none px-4 py-2 text-sm font-semibold bg-transparent">
                    <CheckSquare className="h-4 w-4 mr-2" /> Daily Attendance
                  </TabsTrigger>
                  <TabsTrigger value="checkins" className="border-b-2 border-transparent data-[state=active]:border-magenta data-[state=active]:text-magenta rounded-none px-4 py-2 text-sm font-semibold bg-transparent">
                    <Clock className="h-4 w-4 mr-2" /> Check-in logs
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Students List & Rubric Rating */}
                <TabsContent value="students" className="pt-4">
                  <DataCard className="p-0 overflow-hidden">
                    <div className="divide-y divide-border">
                      {students.length === 0 ? (
                        <p className="text-sm text-muted-foreground p-8 text-center">No students registered in this batch.</p>
                      ) : (
                        students.map((student: any) => (
                          <div key={student._id} className="flex items-center justify-between p-4 hover:bg-marble/40 transition-colors">
                            <div>
                              <p className="font-semibold text-sm text-foreground">
                                {student.userId?.fullName || `${student.userId?.firstName} ${student.userId?.lastName}` || "Registered Student"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">{student.userId?.email} · Branch: {student.branch || "N/A"}</p>
                            </div>
                            <Button size="sm" variant="outline" className="text-xs text-magenta hover:bg-magenta/5 border-magenta/30 hover:border-magenta" onClick={() => handleOpenNoteDialog(student)}>
                              <Star className="h-3.5 w-3.5 mr-1" /> Log Rubric
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </DataCard>
                </TabsContent>

                {/* Tab 2: Attendance Registry */}
                <TabsContent value="attendance" className="pt-4">
                  <DataCard>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-border/50 pb-4">
                      <div>
                        <h4 className="font-bold text-foreground text-sm">Attendance registry sheet</h4>
                        <p className="text-xs text-muted-foreground">Select date and select attendance for each enrolled student.</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="att-date" className="text-xs shrink-0">Session Date</Label>
                        <Input
                          id="att-date"
                          type="date"
                          value={attendanceDate}
                          onChange={(e) => setAttendanceDate(e.target.value)}
                          className="w-36 h-9 text-xs"
                        />
                      </div>
                    </div>

                    <div className="divide-y divide-border/60 max-h-[350px] overflow-y-auto pr-2 mb-6">
                      {students.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-6 text-center">No students to mark.</p>
                      ) : (
                        students.map((student: any) => {
                          const studentId = student._id;
                          const currentRecord = attendanceRecords[studentId] || { status: "Present", remarks: "" };

                          return (
                            <div key={studentId} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2">
                              <div className="min-w-[180px]">
                                <p className="text-sm font-medium text-foreground">
                                  {student.userId?.fullName || "Student"}
                                </p>
                                <p className="text-[10px] text-muted-foreground">{student.userId?.email}</p>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="flex rounded-md border border-border overflow-hidden bg-marble">
                                  {["Present", "Absent", "Late", "Excused"].map((status) => (
                                    <button
                                      key={status}
                                      onClick={() => handleStatusChange(studentId, status)}
                                      className={`text-xs px-2.5 py-1.5 font-medium border-r border-border last:border-0 transition-colors ${
                                        currentRecord.status === status
                                          ? "bg-magenta text-white"
                                          : "text-muted-foreground hover:bg-marble-dark"
                                      }`}
                                    >
                                      {status}
                                    </button>
                                  ))}
                                </div>
                                <Input
                                  placeholder="Remarks..."
                                  value={currentRecord.remarks}
                                  onChange={(e) => handleRemarksChange(studentId, e.target.value)}
                                  className="h-8 text-xs max-w-[120px]"
                                />
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <Button onClick={handleSaveAttendance} disabled={markAttendanceMutation.isPending || students.length === 0} className="bg-magenta hover:bg-magenta/90 text-white w-full sm:w-auto">
                      {markAttendanceMutation.isPending ? "Saving Attendance..." : "Save Registry Sheet"}
                    </Button>
                  </DataCard>
                </TabsContent>

                {/* Tab 3: Check-in Logs History */}
                <TabsContent value="checkins" className="pt-4">
                  <DataCard className="p-0 overflow-hidden">
                    {isHistoryLoading ? (
                      <div className="h-40 flex items-center justify-center">
                        <Loader2 className="h-6 w-6 text-magenta animate-spin" />
                      </div>
                    ) : checkIns.length === 0 ? (
                      <p className="text-sm text-muted-foreground p-8 text-center">No check-in logs recorded for this batch.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm text-left">
                          <thead>
                            <tr className="bg-marble border-b border-border">
                              <th className="p-3 font-semibold text-muted-foreground text-xs uppercase">Checked In</th>
                              <th className="p-3 font-semibold text-muted-foreground text-xs uppercase">Checked Out</th>
                              <th className="p-3 font-semibold text-muted-foreground text-xs uppercase">Duration</th>
                              <th className="p-3 font-semibold text-muted-foreground text-xs uppercase">Payout</th>
                              <th className="p-3 font-semibold text-muted-foreground text-xs uppercase">Session notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {checkIns.map((log: any, idx: number) => (
                              <tr key={idx} className="hover:bg-marble/25">
                                <td className="p-3 whitespace-nowrap text-xs text-foreground">
                                  {new Date(log.checkedInAt).toLocaleString()}
                                </td>
                                <td className="p-3 whitespace-nowrap text-xs text-foreground">
                                  {log.checkedOutAt ? new Date(log.checkedOutAt).toLocaleString() : <Badge variant="secondary" className="bg-magenta/10 text-magenta border-none">Active</Badge>}
                                </td>
                                <td className="p-3 whitespace-nowrap text-xs text-foreground">
                                  {log.hoursBilled ? `${log.hoursBilled.toFixed(2)} hrs` : "-"}
                                </td>
                                <td className="p-3 whitespace-nowrap text-xs text-foreground font-semibold">
                                  {log.payoutAmount ? `₹${log.payoutAmount}` : "-"}
                                </td>
                                <td className="p-3 text-xs text-muted-foreground max-w-[200px] truncate" title={log.sessionNotes}>
                                  {log.sessionNotes || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </DataCard>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* Log Rubric Progress Note Dialog */}
      <Dialog open={noteOpen} onOpenChange={setNoteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Rubric Progress Note</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 pt-2">
              <div>
                <p className="text-xs text-muted-foreground">Student Name</p>
                <p className="text-sm font-bold text-foreground">
                  {selectedStudent.userId?.fullName || "Student"}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rubric-score" className="text-xs">Session Rubric Score (1 to 10)</Label>
                <Input
                  id="rubric-score"
                  type="number"
                  min={1}
                  max={10}
                  value={rubricScore}
                  onChange={(e) => setRubricScore(Math.min(10, Math.max(1, Number(e.target.value))))}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="feedback" className="text-xs">Mentorship Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Summarize the student's progress and focus areas..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="h-20"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="strengths" className="text-xs">Strengths (Optional)</Label>
                <Input
                  id="strengths"
                  placeholder="Key strengths observed..."
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="improvement" className="text-xs">Areas for Improvement (Optional)</Label>
                <Input
                  id="improvement"
                  placeholder="Topics requiring attention..."
                  value={areasForImprovement}
                  onChange={(e) => setAreasForImprovement(e.target.value)}
                />
              </div>

              <Button
                onClick={handleSaveProgressNote}
                disabled={createProgressNoteMutation.isPending}
                className="bg-magenta hover:bg-magenta/90 text-white w-full"
              >
                {createProgressNoteMutation.isPending ? "Saving..." : "Save Progress Note"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
