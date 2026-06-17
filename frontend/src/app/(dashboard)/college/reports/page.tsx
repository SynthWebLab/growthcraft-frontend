"use client";

import { useState } from "react";
import PageHeader from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import PanelDataTable, { Column } from "@/components/panel/PanelDataTable";
import { Button } from "@/components/ui/button";
import { Download, FileText, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface Report {
  month: string;
  enrollments: number;
  completionRate: string;
}

const reports: Report[] = [
  { month: "March 2026", enrollments: 58, completionRate: "82%" },
  { month: "February 2026", enrollments: 62, completionRate: "79%" },
  { month: "January 2026", enrollments: 55, completionRate: "76%" },
  { month: "December 2025", enrollments: 38, completionRate: "84%" },
  { month: "November 2025", enrollments: 41, completionRate: "71%" },
  { month: "October 2025", enrollments: 32, completionRate: "68%" },
];

const columns: Column<Report>[] = [
  {
    key: "month",
    label: "Month",
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium text-sm">{row.month}</span>
      </div>
    ),
  },
  { key: "enrollments", label: "Total Enrollments", sortable: true },
  { key: "completionRate", label: "Completion Rate", sortable: true },
  {
    key: "actions",
    label: "",
    render: () => (
      <Button variant="ghost" size="sm">
        <Download className="h-4 w-4 mr-1" /> PDF
      </Button>
    ),
  },
];

const metrics = [
  "Enrollments",
  "Completion Rate",
  "Student Progress",
  "Placement Stats",
  "Mentor Sessions",
];

export default function CollegeReports() {
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="View and download reports for your campus programs"
        action={
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-magenta hover:bg-magenta/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" /> Generate Custom Report
          </Button>
        }
      />

      <PanelDataTable columns={columns} data={reports} pageSize={10} />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Custom Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>To</Label>
                <Input type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Metrics to include</Label>
              <div className="space-y-2">
                {metrics.map((m) => (
                  <div key={m} className="flex items-center gap-2">
                    <Checkbox id={m} defaultChecked />
                    <label htmlFor={m} className="text-sm">
                      {m}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-magenta hover:bg-magenta/90 text-white"
                onClick={() => {
                  toast({
                    title: "Report generated",
                    description: "Your custom report will be ready to download shortly.",
                  });
                  setModalOpen(false);
                }}
              >
                Generate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
