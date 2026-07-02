"use client";

import { useState } from "react";
import { Plus, Pencil, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import PanelDataTable, { type Column } from "@/components/panel/PanelDataTable";
import { StatusPill } from "@/components/panel";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  useEmployerJobs,
  useCreateJob,
  useUpdateJob,
  useUpdateJobStatus,
  useDeleteJob,
} from "@/hooks/queries/useEmployer";
import type { Job } from "@/types/employer";

const FormFields = ({ defaults }: { defaults?: Job }) => (
  <>
    <div className="space-y-2">
      <Label>Job Title</Label>
      <Input name="title" defaultValue={defaults?.title} required />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <Label>Job Type</Label>
        <Select name="type" defaultValue={defaults?.jobType || "Full-time"}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Full-time">Full-time</SelectItem>
            <SelectItem value="Part-time">Part-time</SelectItem>
            <SelectItem value="Internship">Internship</SelectItem>
            <SelectItem value="Contract">Contract</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Location</Label>
        <Input name="location" defaultValue={defaults?.location} required />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <Label>Location Type</Label>
        <Select name="locationType" defaultValue={defaults?.locationType || "Remote"}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Onsite">Onsite</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Expires At</Label>
        <Input
          name="expires"
          type="date"
          defaultValue={
            defaults?.applicationDeadline
              ? new Date(defaults.applicationDeadline).toISOString().split("T")[0]
              : ""
          }
        />
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <Label>Min Salary (LPA / Monthly stipend)</Label>
        <Input name="salaryMin" type="number" defaultValue={defaults?.salaryRange?.min} placeholder="e.g. 4" />
      </div>
      <div className="space-y-2">
        <Label>Max Salary (LPA / Monthly stipend)</Label>
        <Input name="salaryMax" type="number" defaultValue={defaults?.salaryRange?.max} placeholder="e.g. 6" />
      </div>
    </div>
    <div className="space-y-2">
      <Label>Required Skills (comma-separated)</Label>
      <Input name="skills" defaultValue={defaults?.skillsRequired?.join(", ")} placeholder="React, TypeScript, Node.js" />
    </div>
    <div className="space-y-2">
      <Label>Description</Label>
      <Textarea name="description" defaultValue={defaults?.description} rows={4} required />
    </div>
  </>
);

const EmployerJobs = () => {
  const { data: jobs = [], isLoading } = useEmployerJobs();
  const createJobMutation = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const updateJobStatusMutation = useUpdateJobStatus();
  const deleteJobMutation = useDeleteJob();

  const [editJob, setEditJob] = useState<Job | null>(null);
  const [postOpen, setPostOpen] = useState(false);

  const handleClose = (id: string) => {
    updateJobStatusMutation.mutate({ id, status: "Closed" });
  };

  const handleDelete = (id: string) => {
    deleteJobMutation.mutate(id);
  };

  const handleSubmit = (e: React.FormEvent, isEdit: boolean) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const submitter = (e.nativeEvent as any).submitter as HTMLButtonElement | null;
    const publish = submitter?.value === "publish";

    const title = fd.get("title") as string;
    const jobType = fd.get("type") as Job["jobType"];
    const location = fd.get("location") as string;
    const locationType = fd.get("locationType") as Job["locationType"];
    const description = fd.get("description") as string;
    const skillsRequired = (fd.get("skills") as string)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    
    const salaryMin = fd.get("salaryMin") ? Number(fd.get("salaryMin")) : undefined;
    const salaryMax = fd.get("salaryMax") ? Number(fd.get("salaryMax")) : undefined;
    const expires = fd.get("expires") as string;

    const payload: Job = {
      title,
      jobType,
      location,
      locationType,
      description,
      skillsRequired,
      requirements: [],
      salaryRange: {
        min: salaryMin,
        max: salaryMax,
      },
      applicationDeadline: expires ? new Date(expires).toISOString() : undefined,
      status: isEdit ? (editJob?.status || "Draft") : (publish ? "Active" : "Draft"),
    };

    if (isEdit && editJob) {
      updateJobMutation.mutate(
        { id: editJob._id || editJob.id || "", jobData: payload },
        {
          onSuccess: () => {
            setEditJob(null);
          },
        }
      );
    } else {
      createJobMutation.mutate(payload, {
        onSuccess: () => {
          setPostOpen(false);
        },
      });
    }
  };

  const columns: Column<Job>[] = [
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (j) => <span className="font-medium text-foreground">{j.title}</span>,
    },
    { key: "jobType", label: "Type", render: (j) => <span className="text-xs text-muted-foreground">{j.jobType}</span> },
    { key: "location", label: "Location", render: (j) => <span className="text-xs text-muted-foreground">{j.location}</span> },
    {
      key: "status",
      label: "Status",
      render: (j) => (
        <StatusPill
          variant={j.status === "Active" ? "active" : j.status === "Draft" ? "pending" : "cancelled"}
          label={j.status}
        />
      ),
    },
    {
      key: "applicantsCount",
      label: "Applicants",
      sortable: true,
      render: (j) => <span className="font-medium">{j.applicantsCount ?? 0}</span>,
    },
    {
      key: "createdAt",
      label: "Posted",
      render: (j) => (
        <span>
          {j.createdAt
            ? new Date(j.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (j) => {
        const jobId = j._id || j.id || "";
        return (
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditJob(j)} title="Edit">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            {j.status === "Active" && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleClose(jobId)} title="Close">
                <X className="h-3.5 w-3.5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-8 w-8 text-danger" onClick={() => handleDelete(jobId)} title="Delete">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Postings"
        description="Manage your active and closed job listings"
        action={
          <Button onClick={() => setPostOpen(true)} className="bg-magenta hover:bg-magenta/90">
            <Plus className="h-4 w-4 mr-2" /> Post New Job
          </Button>
        }
      />

      <PanelDataTable columns={columns} data={jobs} searchKey="title" />

      <Dialog open={postOpen} onOpenChange={setPostOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Post New Job</DialogTitle></DialogHeader>
          <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
            <FormFields />
            <div className="flex justify-end gap-2">
              <Button type="submit" name="publish" value="draft" variant="outline">Save as Draft</Button>
              <Button type="submit" name="publish" value="publish" className="bg-magenta hover:bg-magenta/90">Publish</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editJob} onOpenChange={() => setEditJob(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Edit: {editJob?.title}</DialogTitle></DialogHeader>
          <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-4">
            {editJob && <FormFields defaults={editJob} />}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditJob(null)}>Cancel</Button>
              <Button type="submit" className="bg-magenta hover:bg-magenta/90">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerJobs;
