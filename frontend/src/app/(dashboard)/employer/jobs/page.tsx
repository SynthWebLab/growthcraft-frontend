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

interface Job {
  id: number;
  title: string;
  type: "Full-time" | "Internship" | "Contract";
  location: string;
  status: "Active" | "Closed";
  applicants: number;
  posted: string;
  description: string;
  skills: string[];
  salary: string;
  expires: string;
}

const initialJobs: Job[] = [
  { id: 1, title: "Junior React Developer", type: "Full-time", location: "Remote", status: "Active", applicants: 18, posted: "Mar 28, 2026", description: "Build modern web apps with React + TypeScript.", skills: ["React", "TypeScript", "Node.js"], salary: "₹4-6 LPA", expires: "2026-05-28" },
  { id: 2, title: "Data Analyst Intern", type: "Internship", location: "Bangalore", status: "Active", applicants: 12, posted: "Apr 1, 2026", description: "Analyze product metrics and build dashboards.", skills: ["Python", "SQL", "Excel"], salary: "₹15K/mo", expires: "2026-06-01" },
  { id: 3, title: "Full Stack Developer", type: "Full-time", location: "Hybrid", status: "Active", applicants: 8, posted: "Apr 5, 2026", description: "Own product features end-to-end across React + Node.", skills: ["React", "Node.js", "PostgreSQL"], salary: "₹6-10 LPA", expires: "2026-06-05" },
  { id: 4, title: "UI/UX Designer", type: "Contract", location: "Remote", status: "Closed", applicants: 22, posted: "Feb 15, 2026", description: "Redesign onboarding for our SaaS product.", skills: ["Figma", "User Research"], salary: "₹3-5 LPA", expires: "2026-04-15" },
  { id: 5, title: "Backend Developer", type: "Full-time", location: "Delhi", status: "Closed", applicants: 15, posted: "Feb 20, 2026", description: "Scale our APIs to 10x traffic.", skills: ["Java", "Spring Boot", "MySQL"], salary: "₹5-8 LPA", expires: "2026-04-20" },
];

const FormFields = ({ defaults }: { defaults?: Job }) => (
  <>
    <div className="space-y-2">
      <Label>Job Title</Label>
      <Input name="title" defaultValue={defaults?.title} required />
    </div>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-2">
        <Label>Job Type</Label>
        <Select name="type" defaultValue={defaults?.type || "Full-time"}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Full-time">Full-time</SelectItem>
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
        <Label>Salary Range</Label>
        <Input name="salary" defaultValue={defaults?.salary} placeholder="e.g. ₹4-6 LPA" />
      </div>
      <div className="space-y-2">
        <Label>Expires At</Label>
        <Input name="expires" type="date" defaultValue={defaults?.expires} />
      </div>
    </div>
    <div className="space-y-2">
      <Label>Required Skills (comma-separated)</Label>
      <Input name="skills" defaultValue={defaults?.skills.join(", ")} placeholder="React, TypeScript, Node.js" />
    </div>
    <div className="space-y-2">
      <Label>Description</Label>
      <Textarea name="description" defaultValue={defaults?.description} rows={4} required />
    </div>
  </>
);

const EmployerJobs = () => {
  const [jobs, setJobs] = useState(initialJobs);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [postOpen, setPostOpen] = useState(false);

  const handleClose = (id: number) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status: "Closed" } : j)));
    toast("Job closed", { description: "The posting is no longer accepting applications." });
  };

  const handleDelete = (id: number) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    toast("Job deleted", { description: "The posting has been removed." });
  };

  const handleSubmit = (e: React.FormEvent, isEdit: boolean) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    if (isEdit && editJob) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === editJob.id
            ? {
                ...j,
                title: fd.get("title") as string,
                type: fd.get("type") as Job["type"],
                location: fd.get("location") as string,
                salary: fd.get("salary") as string,
                skills: (fd.get("skills") as string).split(",").map((s) => s.trim()).filter(Boolean),
                description: fd.get("description") as string,
                expires: fd.get("expires") as string,
              }
            : j
        )
      );
      toast.success("Job updated");
      setEditJob(null);
    } else {
      const publish = fd.get("publish") === "publish";
      const newJob: Job = {
        id: Date.now(),
        title: fd.get("title") as string,
        type: fd.get("type") as Job["type"],
        location: fd.get("location") as string,
        status: publish ? "Active" : "Closed",
        applicants: 0,
        posted: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        description: fd.get("description") as string,
        skills: (fd.get("skills") as string).split(",").map((s) => s.trim()).filter(Boolean),
        salary: fd.get("salary") as string,
        expires: fd.get("expires") as string,
      };
      setJobs((prev) => [newJob, ...prev]);
      toast.success(publish ? "Job published" : "Saved as draft");
      setPostOpen(false);
    }
  };

  const columns: Column<Job>[] = [
    { key: "title", label: "Title", sortable: true, render: (j) => <span className="font-medium text-foreground">{j.title}</span> },
    { key: "type", label: "Type", render: (j) => <span className="text-xs text-muted-foreground">{j.type}</span> },
    { key: "location", label: "Location", render: (j) => <span className="text-xs text-muted-foreground">{j.location}</span> },
    { key: "status", label: "Status", render: (j) => <StatusPill variant={j.status === "Active" ? "active" : "cancelled"} label={j.status} /> },
    { key: "applicants", label: "Applicants", sortable: true, render: (j) => <span className="font-medium">{j.applicants}</span> },
    { key: "posted", label: "Posted" },
    {
      key: "actions",
      label: "Actions",
      render: (j) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditJob(j)} title="Edit">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          {j.status === "Active" && (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleClose(j.id)} title="Close">
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-danger" onClick={() => handleDelete(j.id)} title="Delete">
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
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
