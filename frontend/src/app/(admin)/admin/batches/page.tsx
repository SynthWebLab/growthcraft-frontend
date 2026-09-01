"use client";

import React, { useState } from "react";
import { useCourses } from "@/hooks/queries/useCourses";
import { useTrainingPrograms } from "@/hooks/queries/useTrainingPrograms";
import { useBootcamps } from "@/hooks/queries/useBootcamps";
import {
  useAdminBatches,
  useCreateBatch,
  useUpdateBatch,
  useAdminMentors,
  useAssignMentorToBatch,
} from "@/hooks/queries/useAdmin";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layers, Calendar, MapPin, Users, Plus, Award } from "lucide-react";

interface BatchRow {
  id: string;
  code: string;
  batchType: string;
  parentTitle: string;
  parentId: string;
  startDate: string;
  endDate: string;
  mode: string;
  status: string;
  capacity: number;
  enrolledCount: number;
  venue: string;
  fee: number;
  mentorName: string;
  mentorId: string | null;
}

const EMPTY_FORM = {
  batchType: "Course" as "Course" | "TrainingProgram" | "Bootcamp",
  parentId: "",
  startDate: "",
  endDate: "",
  capacity: "30",
  fee: "0",
  venue: "",
  mode: "Offline" as "Online" | "Offline" | "Hybrid",
  code: "",
};

export default function AdminBatchesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isMentorOpen, setIsMentorOpen] = useState(false);
  
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingBatch, setEditingBatch] = useState<BatchRow | null>(null);
  const [editingStatus, setEditingStatus] = useState("");
  const [editingCapacity, setEditingCapacity] = useState("");
  const [editingFee, setEditingFee] = useState("");
  const [editingVenue, setEditingVenue] = useState("");
  const [selectedMentorId, setSelectedMentorId] = useState("");

  // Queries
  const { data: batchesData, isLoading } = useAdminBatches({ page, limit: 100 });
  const { data: coursesData } = useCourses();
  const { data: programsData } = useTrainingPrograms();
  const { data: bootcampsData } = useBootcamps();
  const { data: mentorsData } = useAdminMentors({ limit: 100 });

  // Mutations
  const createMutation = useCreateBatch();
  const updateMutation = useUpdateBatch();
  const assignMentorMutation = useAssignMentorToBatch();

  const rawBatches = batchesData?.data || [];
  const courses = coursesData?.data || [];
  const programs = programsData?.data || [];
  const bootcamps = bootcampsData?.items || [];
  const mentors = mentorsData?.data || [];

  // Map backend batch object to flat BatchRow layout
  const mappedBatches: BatchRow[] = rawBatches.map((b: any) => {
    let parentTitle = "N/A";
    let parentId = "";
    if (b.courseId) {
      parentTitle = b.courseId.title || "Course";
      parentId = b.courseId._id || b.courseId.id || "";
    } else if (b.trainingProgramId) {
      parentTitle = b.trainingProgramId.title || "Training Program";
      parentId = b.trainingProgramId._id || b.trainingProgramId.id || "";
    } else if (b.bootcampId) {
      parentTitle = b.bootcampId.title || "Bootcamp";
      parentId = b.bootcampId._id || b.bootcampId.id || "";
    }

    let mentorName = "Unassigned";
    let mentorId = null;
    if (b.assignedMentorId) {
      const assignedObj = typeof b.assignedMentorId === "object" ? b.assignedMentorId : null;
      const populatedUser = assignedObj?.userId && typeof assignedObj.userId === "object" ? assignedObj.userId : null;
      const mentorObj = mentors.find(
        (m: any) =>
          m._id === b.assignedMentorId ||
          m._id === assignedObj?._id ||
          m.mentorId === assignedObj?._id ||
          m.userId === populatedUser?._id ||
          m.userId === assignedObj?.userId
      );
      mentorName =
        populatedUser?.fullName ||
        assignedObj?.fullName ||
        assignedObj?.name ||
        mentorObj?.name ||
        "Assigned";
      mentorId = assignedObj?._id || String(b.assignedMentorId);
    }

    return {
      id: b._id || b.id,
      code: b.code || "",
      batchType: b.batchType || "",
      parentTitle,
      parentId,
      startDate: b.startDate ? new Date(b.startDate).toISOString().split("T")[0] : "",
      endDate: b.endDate ? new Date(b.endDate).toISOString().split("T")[0] : "",
      mode: b.mode || "Offline",
      status: b.status || "Draft",
      capacity: b.capacity || 0,
      enrolledCount: b.enrolledCount || 0,
      venue: b.venue || "",
      fee: b.fee ? parseFloat(b.fee.toString()) : 0,
      mentorName,
      mentorId,
    };
  });

  // Filter based on selected programType
  const selectedParentList =
    formData.batchType === "Course"
      ? courses.map((c: any) => ({ id: c._id || c.id, title: c.title }))
      : formData.batchType === "TrainingProgram"
      ? programs.map((p: any) => ({ id: p._id || p.id, title: p.title }))
      : bootcamps.map((b: any) => ({ id: b._id || b.id, title: b.title }));

  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM);
    setIsCreateOpen(true);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.parentId || !formData.startDate || !formData.endDate) {
      return;
    }

    createMutation.mutate(
      {
        batchType: formData.batchType,
        parentId: formData.parentId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        capacity: parseInt(formData.capacity, 10),
        fee: parseFloat(formData.fee),
        venue: formData.venue || undefined,
        mode: formData.mode,
        code: formData.code || undefined,
      },
      {
        onSuccess: () => {
          setIsCreateOpen(false);
        },
      }
    );
  };

  const handleOpenEdit = (batch: BatchRow) => {
    setEditingBatch(batch);
    setEditingStatus(batch.status);
    setEditingCapacity(String(batch.capacity));
    setEditingFee(String(batch.fee));
    setEditingVenue(batch.venue);
    setIsEditOpen(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;

    updateMutation.mutate(
      {
        id: editingBatch.id,
        data: {
          status: editingStatus,
          capacity: parseInt(editingCapacity, 10),
          fee: parseFloat(editingFee),
          venue: editingVenue || undefined,
        },
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
        },
      }
    );
  };

  const handleOpenMentor = (batch: BatchRow) => {
    setEditingBatch(batch);
    setSelectedMentorId(batch.mentorId || "");
    setIsMentorOpen(true);
  };

  const handleAssignMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch || !selectedMentorId) return;

    assignMentorMutation.mutate(
      {
        batchId: editingBatch.id,
        mentorId: selectedMentorId,
      },
      {
        onSuccess: () => {
          setIsMentorOpen(false);
        },
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Draft":
        return <Badge variant="secondary">{status}</Badge>;
      case "Open":
      case "Filling":
        return <Badge variant="default" className="bg-green-600 text-white hover:bg-green-700">{status}</Badge>;
      case "Full":
        return <Badge variant="outline" className="border-amber-500 text-amber-600">{status}</Badge>;
      case "InProgress":
        return <Badge variant="default" className="bg-blue-600 text-white hover:bg-blue-700">In Progress</Badge>;
      case "Completed":
        return <Badge variant="secondary" className="bg-gray-200 text-gray-700">{status}</Badge>;
      default:
        return <Badge variant="destructive">{status}</Badge>;
    }
  };

  const columns = [
    { key: "code", label: "Batch Code" },
    { key: "parentTitle", label: "Program/Course" },
    {
      key: "batchType",
      label: "Type",
      render: (val: string) => (
        <Badge variant="outline" className="capitalize">
          {val === "TrainingProgram" ? "Training Program" : val}
        </Badge>
      ),
    },
    {
      key: "mode",
      label: "Mode",
      render: (val: string) => (
        <span className="text-xs font-semibold">{val}</span>
      ),
    },
    {
      key: "capacity",
      label: "Enrolled / Seats",
      render: (val: number, row: BatchRow) => (
        <span className="text-xs">
          {row.enrolledCount} / {val}
        </span>
      ),
    },
    {
      key: "startDate",
      label: "Timeline",
      render: (val: string, row: BatchRow) => (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {val} to {row.endDate}
        </span>
      ),
    },
    {
      key: "mentorName",
      label: "Assigned Mentor",
      render: (val: string) => (
        <span className="text-xs font-medium text-foreground">{val}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val: string) => getStatusBadge(val),
    },
    {
      key: "id",
      label: "Actions",
      render: (val: string, row: BatchRow) => (
        <div className="flex gap-1.5 justify-end">
          <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => handleOpenMentor(row)}>
            Mentor
          </Button>
          <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => handleOpenEdit(row)}>
            Edit
          </Button>
        </div>
      ),
    },
  ];

  const filteredBatches = search
    ? mappedBatches.filter(
        (b) =>
          b.code.toLowerCase().includes(search.toLowerCase()) ||
          b.parentTitle.toLowerCase().includes(search.toLowerCase()) ||
          b.mentorName.toLowerCase().includes(search.toLowerCase())
      )
    : mappedBatches;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Cohorts & Batches</h1>
          <p className="text-muted-foreground mt-1">
            Create and schedule offline and online cohorts, set venue capacity, fees, and assign course mentors.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="w-full sm:w-auto gap-2">
          <Plus className="h-4 w-4" />
          Create Batch
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Cohort Batches</CardTitle>
          <CardDescription>
            Search batches by program title, mentor name, or custom batch code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredBatches}
            isLoading={isLoading}
            onSearch={setSearch}
            searchPlaceholder="Search batches..."
          />
        </CardContent>
      </Card>

      {/* CREATE BATCH DIALOG */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Cohort Batch</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label>Program Type</Label>
              <Select
                value={formData.batchType}
                onValueChange={(val: any) =>
                  setFormData((prev) => ({ ...prev, batchType: val, parentId: "" }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Course">Individual Course</SelectItem>
                  <SelectItem value="TrainingProgram">Training Program</SelectItem>
                  <SelectItem value="Bootcamp">Bootcamp / Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Course/Program</Label>
              <Select
                value={formData.parentId}
                onValueChange={(val) => setFormData((prev) => ({ ...prev, parentId: val }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose program" />
                </SelectTrigger>
                <SelectContent>
                  {selectedParentList.length > 0 ? (
                    selectedParentList.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.title}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="_empty" disabled>
                      No programs found of this type.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Mode</Label>
                <Select
                  value={formData.mode}
                  onValueChange={(val: any) => setFormData((prev) => ({ ...prev, mode: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Offline">Offline</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input
                  type="number"
                  required
                  min="1"
                  value={formData.capacity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, capacity: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Fee (INR)</Label>
                <Input
                  type="number"
                  required
                  min="0"
                  value={formData.fee}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fee: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Custom Batch Code (Optional)</Label>
                <Input
                  placeholder="e.g. B1-JUL26"
                  value={formData.code}
                  onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Venue / Campus Location (Optional)</Label>
              <Input
                placeholder="e.g. Silpukhuri Campus Classroom A"
                value={formData.venue}
                onChange={(e) => setFormData((prev) => ({ ...prev, venue: e.target.value }))}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || !formData.parentId}>
                {createMutation.isPending ? "Creating..." : "Create Batch"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT BATCH DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Batch - {editingBatch?.code}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label>Batch Status</Label>
              <Select value={editingStatus} onValueChange={setEditingStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Open">Open (Registration Open)</SelectItem>
                  <SelectItem value="Filling">Filling</SelectItem>
                  <SelectItem value="Full">Full (Registration Closed)</SelectItem>
                  <SelectItem value="InProgress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input
                  type="number"
                  required
                  min="1"
                  value={editingCapacity}
                  onChange={(e) => setEditingCapacity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Fee (INR)</Label>
                <Input
                  type="number"
                  required
                  min="0"
                  value={editingFee}
                  onChange={(e) => setEditingFee(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Venue / Campus Location</Label>
              <Input
                placeholder="e.g. Silpukhuri Campus Classroom A"
                value={editingVenue}
                onChange={(e) => setEditingVenue(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ASSIGN MENTOR DIALOG */}
      <Dialog open={isMentorOpen} onOpenChange={setIsMentorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Mentor to {editingBatch?.code}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignMentor} className="space-y-4">
            <div className="space-y-2">
              <Label>Select Mentor</Label>
              <Select value={selectedMentorId} onValueChange={setSelectedMentorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a mentor" />
                </SelectTrigger>
                <SelectContent>
                  {mentors.length > 0 ? (
                    mentors.map((m: any) => (
                      <SelectItem key={m._id} value={m._id}>
                        {m.name} ({m.areaOfExpertise || "No expertise area"})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="_empty" disabled>
                      No mentors found.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsMentorOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={assignMentorMutation.isPending || !selectedMentorId}>
                {assignMentorMutation.isPending ? "Assigning..." : "Assign Mentor"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
