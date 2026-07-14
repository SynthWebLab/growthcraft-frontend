"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import PanelDataTable, { type Column } from "@/components/panel/PanelDataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  useMentorBatches,
  useMentorCheckInStatus,
  useMentorCheckIn,
  useMentorCheckOut,
} from "@/hooks/queries/useMentor";
import { Play, Square, Timer, MapPin, Users, Calendar } from "lucide-react";
import { toast } from "sonner";

interface BatchItem {
  id: string;
  code: string;
  batchType: string;
  mode: string;
  startDate: string;
  endDate: string;
  status: string;
  title: string;
  description: string;
  studentCount: number;
}

export default function MentorBatchesPage() {
  const { data: batchesResponse, isLoading: isBatchesLoading } = useMentorBatches();
  const { data: statusResponse, isLoading: isStatusLoading } = useMentorCheckInStatus();
  
  const checkInMutation = useMentorCheckIn();
  const checkOutMutation = useMentorCheckOut();

  const [checkoutBatchId, setCheckoutBatchId] = useState<string | null>(null);
  const [checkoutNotes, setCheckoutNotes] = useState("");

  const batches: BatchItem[] = batchesResponse?.data?.batches ?? [];
  const activeCheckIn = statusResponse?.data?.activeCheckIn;
  const isCurrentlyCheckedIn = !!activeCheckIn;

  const handleCheckIn = (batchId: string) => {
    checkInMutation.mutate(batchId);
  };

  const handleOpenCheckout = (batchId: string) => {
    setCheckoutBatchId(batchId);
    setCheckoutNotes("");
  };

  const handleCheckOutSubmit = () => {
    if (!checkoutBatchId) return;
    checkOutMutation.mutate(
      {
        batchId: checkoutBatchId,
        notes: checkoutNotes.trim() || undefined,
      },
      {
        onSuccess: () => {
          setCheckoutBatchId(null);
          setCheckoutNotes("");
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

  const columns: Column<BatchItem>[] = [
    {
      key: "code",
      label: "Batch Code",
      sortable: true,
      render: (row) => <span className="font-mono text-sm font-semibold">{row.code}</span>,
    },
    {
      key: "title",
      label: "Course/Program",
      sortable: true,
      render: (row) => (
        <div className="max-w-[220px]">
          <p className="font-semibold text-sm text-foreground truncate">{row.title}</p>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            {row.batchType === "TrainingProgram" ? "Training Program" : row.batchType}
          </span>
        </div>
      ),
    },
    {
      key: "timeline",
      label: "Timeline",
      render: (row) => (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>
            {new Date(row.startDate).toLocaleDateString([], { month: "short", day: "numeric" })} -{" "}
            {new Date(row.endDate).toLocaleDateString([], { month: "short", day: "numeric", year: "2-digit" })}
          </span>
        </div>
      ),
    },
    {
      key: "students",
      label: "Students",
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          <span>{row.studentCount} enrolled</span>
        </div>
      ),
    },
    {
      key: "mode",
      label: "Mode",
      sortable: true,
      render: (row) => <span className="text-xs font-semibold">{row.mode}</span>,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row) => getStatusBadge(row.status),
    },
    {
      key: "actions",
      label: "Check-In Action",
      render: (row) => {
        const isActiveBatch = ["Open", "Filling", "Full", "InProgress"].includes(row.status);
        const isSelfCheckedIn = activeCheckIn?.batchId?._id === row.id;

        if (!isActiveBatch) {
          return <span className="text-xs text-muted-foreground">Unavailable</span>;
        }

        if (isSelfCheckedIn) {
          return (
            <Button
              size="sm"
              onClick={() => handleOpenCheckout(row.id)}
              disabled={checkOutMutation.isPending}
              className="bg-magenta hover:bg-magenta/90 text-white gap-1"
            >
              Check Out <Square className="h-3 w-3" />
            </Button>
          );
        }

        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleCheckIn(row.id)}
            disabled={isCurrentlyCheckedIn || checkInMutation.isPending}
            className="hover:text-magenta hover:border-magenta gap-1"
          >
            Check In <Play className="h-3 w-3" />
          </Button>
        );
      },
    },
  ];

  if (isBatchesLoading || isStatusLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted/40 rounded" />
          <div className="h-4 w-80 bg-muted/40 rounded" />
        </div>
        <div className="h-96 bg-muted/40 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Cohorts & Batches"
        description="View your assigned training runs, student sizes, and manage check-ins directly from here."
      />

      {isCurrentlyCheckedIn && (
        <div className="p-4 rounded-xl border border-magenta/20 bg-magenta/5 text-magenta-foreground flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 animate-pulse text-magenta" />
            <span className="text-sm font-semibold">
              Currently checked in to batch:{" "}
              <span className="font-mono underline">
                {activeCheckIn?.batchId?.code || activeCheckIn?.batchId?.batchName}
              </span>
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => handleOpenCheckout(activeCheckIn?.batchId?._id)}
            className="bg-magenta text-white hover:bg-magenta/90"
          >
            Finish & Check Out
          </Button>
        </div>
      )}

      <PanelDataTable columns={columns} data={batches} searchKey="code" />

      {/* CHECKOUT NOTES DIALOG */}
      <Dialog open={!!checkoutBatchId} onOpenChange={(open) => !open && setCheckoutBatchId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Mentoring Session</DialogTitle>
            <DialogDescription>
              Write optional session progress summaries, attendance highlights, or topics covered today.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              placeholder="E.g., Covered basics of TypeScript generics and conducted offline lab checks."
              value={checkoutNotes}
              onChange={(e) => setCheckoutNotes(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutBatchId(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleCheckOutSubmit}
              disabled={checkOutMutation.isPending}
              className="bg-magenta text-white hover:bg-magenta/90"
            >
              {checkOutMutation.isPending ? "Logging check-out..." : "Log Check Out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
