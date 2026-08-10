"use client";

import { useState } from "react";
import { useStudentJobs, useStudentApplications, useApplyJob, useUploadResume } from "@/hooks/queries/useStudentJobs";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PanelEmptyState } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import {
  Search,
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  X,
  FileText,
  ExternalLink,
  CheckCircle,
  Loader2,
  Clock,
  Upload,
  Paperclip
} from "lucide-react";

type Job = {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  skillsRequired: string[];
  location: string;
  locationType: "Onsite" | "Remote" | "Hybrid";
  salaryRange?: { min?: number; max?: number };
  jobType: "Full-time" | "Part-time" | "Internship" | "Contract";
  companyName: string;
  companyWebsite?: string;
  applicationDeadline?: string;
  postedAt: string;
  hasApplied: boolean;
  applicationStatus: string | null;
};

type Application = {
  id: string;
  status: "Applied" | "Shortlisted" | "Interview" | "Hired" | "Rejected";
  appliedAt: string;
  resumeUrl: string;
  coverLetter?: string;
  job: {
    id: string;
    title: string;
    location: string;
    locationType: string;
    salaryRange?: { min?: number; max?: number };
    jobType: string;
    companyName: string;
    companyWebsite?: string;
  } | null;
};

const getStatusBadge = (status: string) => {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case "applied":
      return <Badge className="bg-slate-500/10 text-slate-600 border border-slate-500/20 hover:bg-slate-500/10 shadow-none">Applied</Badge>;
    case "shortlisted":
      return <Badge className="bg-info/10 text-info border border-info/20 hover:bg-info/10 shadow-none">Shortlisted</Badge>;
    case "interview":
      return <Badge className="bg-warning/10 text-warning border border-warning/20 hover:bg-warning/10 shadow-none">Interviewing</Badge>;
    case "hired":
      return <Badge className="bg-success/10 text-success border border-success/20 hover:bg-success/10 shadow-none">Hired 🚀</Badge>;
    case "rejected":
      return <Badge className="bg-danger/10 text-danger border border-danger/20 hover:bg-danger/10 shadow-none">Rejected</Badge>;
    default:
      return <Badge className="bg-slate-500/10 text-slate-600 border border-slate-500/20 hover:bg-slate-500/10 shadow-none">{status}</Badge>;
  }
};

export default function StudentJobsPage() {
  const [activeTab, setActiveTab] = useState<"available" | "applied">("available");
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  // Selected job for detail view or application form
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [uploadedFileName, setUploadedFileName] = useState("");

  const { data: jobs = [], isLoading: loadingJobs } = useStudentJobs();
  const { data: applications = [], isLoading: loadingApps } = useStudentApplications();
  const { mutate: applyJob, isPending: submittingApplication } = useApplyJob();
  const { mutate: uploadResume, isPending: uploadingFile } = useUploadResume();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size cannot exceed 5MB.");
      return;
    }

    setUploadedFileName(file.name);

    uploadResume(file, {
      onSuccess: (res) => {
        setResumeUrl(res.resumeUrl);
      },
      onError: () => {
        setUploadedFileName("");
        setResumeUrl("");
      }
    });
  };

  // Filters
  const filteredJobs = jobs.filter((job: Job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skillsRequired.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLocation = locationFilter === "all" || job.locationType === locationFilter;
    const matchesType = typeFilter === "all" || job.jobType === typeFilter;

    return matchesSearch && matchesLocation && matchesType;
  });

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplying(true);
  };

  const handleDetailClick = (job: Job) => {
    setSelectedJob(job);
    setIsApplying(false);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    if (!resumeUrl.trim()) {
      toast.error("Please upload a resume file or paste a resume URL.");
      return;
    }

    applyJob(
      { jobId: selectedJob.id, resumeUrl, coverLetter },
      {
        onSuccess: () => {
          setResumeUrl("");
          setCoverLetter("");
          setSelectedJob(null);
          setIsApplying(false);
          setUploadedFileName("");
        },
      }
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-0">
      <PageHeader
        title="Careers & Jobs"
        description="Find and apply to matching roles from GrowthCraft hiring partners"
      />

      {/* Tabs Layout */}
      <div className="flex border-b border-border gap-4 sm:gap-6 overflow-x-auto scrollbar-hide pb-0.5">
        <button
          onClick={() => setActiveTab("available")}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-wide transition-colors relative whitespace-nowrap ${
            activeTab === "available" ? "text-magenta" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Available Positions
          {activeTab === "available" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-magenta rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("applied")}
          className={`pb-3 text-xs sm:text-sm font-semibold tracking-wide transition-colors relative whitespace-nowrap ${
            activeTab === "applied" ? "text-magenta" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          My Applications ({applications.length})
          {activeTab === "applied" && (
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-magenta rounded-t-full" />
          )}
        </button>
      </div>

      {activeTab === "available" ? (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search job title, company name, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-background border-border text-foreground rounded-xl placeholder:text-muted-foreground focus-visible:ring-magenta text-xs sm:text-sm"
              />
            </div>
            <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="flex-1 md:flex-none h-11 px-3 sm:px-4 rounded-xl border border-border bg-background text-foreground text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-magenta cursor-pointer"
              >
                <option value="all">All Locations</option>
                <option value="Remote">Remote</option>
                <option value="Onsite">Onsite</option>
                <option value="Hybrid">Hybrid</option>
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex-1 md:flex-none h-11 px-3 sm:px-4 rounded-xl border border-border bg-background text-foreground text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-magenta cursor-pointer"
              >
                <option value="all">All Job Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          {/* Job listings grid */}
          {loadingJobs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-xl border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <PanelEmptyState
              icon={<Briefcase className="h-12 w-12 text-muted-foreground" />}
              title="No jobs found"
              description="Check back soon or adjust your search filters."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredJobs.map((job: Job) => (
                <DataCard
                  key={job.id}
                  className="flex flex-col justify-between hover:border-magenta/40 transition-all duration-300 p-4 sm:p-6"
                >
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm sm:text-base text-foreground font-display leading-snug truncate">
                          {job.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-magenta mt-0.5">{job.companyName}</p>
                      </div>
                      <Badge className="w-fit bg-magenta/10 text-magenta font-semibold border-none hover:bg-magenta/10 px-2.5 py-0.5 text-[10px] sm:text-xs shadow-none shrink-0">
                        {job.jobType}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] sm:text-xs text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                        <span>
                          {job.location} ({job.locationType})
                        </span>
                      </div>
                      {job.salaryRange && (job.salaryRange.min || job.salaryRange.max) && (
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                          <span>
                            {job.salaryRange.min ? `₹${(job.salaryRange.min / 100000).toFixed(1)}L` : "0"} -{" "}
                            {job.salaryRange.max ? `₹${(job.salaryRange.max / 100000).toFixed(1)}L` : "N/A"}{" "}
                            PA
                          </span>
                        </div>
                      )}
                      {job.applicationDeadline && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
                          <span>
                            Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {job.skillsRequired.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="bg-muted border-none text-[9px] sm:text-[10px] text-muted-foreground hover:bg-muted shadow-none py-0.5 px-2">
                          {skill}
                        </Badge>
                      ))}
                      {job.skillsRequired.length > 3 && (
                        <Badge variant="secondary" className="bg-muted border-none text-[9px] sm:text-[10px] text-muted-foreground/80 hover:bg-muted shadow-none py-0.5 px-2">
                          +{job.skillsRequired.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 mt-5 pt-3.5 border-t border-border justify-end w-full">
                    <Button
                      variant="outline"
                      onClick={() => handleDetailClick(job)}
                      className="border-border text-foreground hover:bg-muted rounded-xl text-xs font-semibold px-4 h-9 w-full sm:w-auto"
                    >
                      View Details
                    </Button>

                    {job.hasApplied ? (
                      <div className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-500/10 border border-slate-500/20 rounded-xl w-full sm:w-auto">
                        <CheckCircle className="h-4 w-4 text-slate-500" />
                        <span>Applied ({job.applicationStatus})</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleApplyClick(job)}
                        className="bg-magenta hover:bg-magenta/90 text-white font-semibold rounded-xl text-xs px-4 h-9 w-full sm:w-auto"
                      >
                        Apply Now
                      </Button>
                    )}
                  </div>
                </DataCard>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Applications submitted list */
        <div className="space-y-6">
          {loadingApps ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-20 bg-card border border-border animate-pulse rounded-xl" />
              ))}
            </div>
          ) : applications.length === 0 ? (
            <PanelEmptyState
              icon={<FileText className="h-12 w-12 text-muted-foreground" />}
              title="No applications yet"
              description="Apply to listed job openings to view your application stages here."
            />
          ) : (
            <DataCard className="hover:translate-y-0 p-4 sm:p-6">
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border text-[10px] sm:text-xs text-muted-foreground font-semibold tracking-wider text-left">
                        <th className="pb-4 pt-1 px-3 sm:px-4 font-afacad uppercase">Job details</th>
                        <th className="pb-4 pt-1 px-3 sm:px-4 font-afacad uppercase">Company</th>
                        <th className="pb-4 pt-1 px-3 sm:px-4 font-afacad uppercase">Applied Date</th>
                        <th className="pb-4 pt-1 px-3 sm:px-4 font-afacad uppercase">Resume Link</th>
                        <th className="pb-4 pt-1 px-3 sm:px-4 font-afacad uppercase text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {applications.map((app: Application) => (
                        <tr key={app.id} className="text-xs sm:text-sm font-medium hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-3 sm:px-4">
                            <div className="font-semibold text-foreground whitespace-nowrap">{app.job?.title || "Deleted Role"}</div>
                            <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 whitespace-nowrap">
                              {app.job?.location} ({app.job?.locationType}) • {app.job?.jobType}
                            </div>
                          </td>
                          <td className="py-4 px-3 sm:px-4">
                            <div className="text-foreground whitespace-nowrap">{app.job?.companyName}</div>
                            {app.job?.companyWebsite && (
                              <a
                                href={app.job.companyWebsite}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] sm:text-xs text-magenta hover:underline flex items-center gap-1 mt-0.5 font-semibold"
                              >
                                Visit website <ExternalLink className="h-3 w-3 inline" />
                              </a>
                            )}
                          </td>
                          <td className="py-4 px-3 sm:px-4 text-muted-foreground text-[10px] sm:text-xs whitespace-nowrap">
                            {new Date(app.appliedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                          <td className="py-4 px-3 sm:px-4">
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs text-magenta hover:underline bg-magenta/5 border border-magenta/10 px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap"
                            >
                              <FileText className="h-3.5 w-3.5" />
                              <span>View Resume</span>
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </td>
                          <td className="py-4 px-3 sm:px-4 text-right whitespace-nowrap">{getStatusBadge(app.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </DataCard>
          )}
        </div>
      )}

      {/* Modal Backdrop / Overlay */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all duration-200">
          <div className="bg-background border border-border shadow-2xl w-full max-w-2xl rounded-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-foreground max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border flex items-start justify-between bg-muted/20 shrink-0">
              <div className="min-w-0 pr-4">
                <Badge className="bg-magenta/10 text-magenta font-semibold border-none hover:bg-magenta/10 px-2.5 py-0.5 text-[9px] sm:text-[10px] mb-2 shadow-none w-fit">
                  {selectedJob.jobType}
                </Badge>
                <h2 className="text-base sm:text-lg font-bold text-foreground font-display leading-tight truncate">
                  {selectedJob.title}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-magenta mt-1">{selectedJob.companyName}</p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/80 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto scrollbar-hide text-xs sm:text-sm flex-1">
              {isApplying ? (
                /* Submit application view */
                <form onSubmit={handleSubmitApplication} className="space-y-4">
                  {/* Selector for upload method */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Resume Document <span className="text-magenta">*</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMethod(uploadMethod === "file" ? "url" : "file");
                        setResumeUrl("");
                        setUploadedFileName("");
                      }}
                      className="text-[10px] sm:text-xs text-magenta hover:underline font-semibold"
                    >
                      {uploadMethod === "file" ? "Paste a link instead" : "Upload file instead"}
                    </button>
                  </div>

                  {uploadMethod === "file" ? (
                    <div className="space-y-1.5">
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-5 sm:p-6 bg-muted/10 hover:bg-muted/20 transition-colors relative cursor-pointer group">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          disabled={uploadingFile}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        
                        {uploadingFile ? (
                          <div className="flex flex-col items-center gap-2 text-center text-xs font-semibold text-muted-foreground">
                            <Loader2 className="h-8 w-8 animate-spin text-magenta" />
                            <span>Uploading document to server...</span>
                          </div>
                        ) : resumeUrl ? (
                          <div className="flex flex-col items-center gap-2 text-center text-xs font-semibold text-success">
                            <CheckCircle className="h-8 w-8 text-success" />
                            <span className="font-bold truncate max-w-[250px]">{uploadedFileName}</span>
                            <span className="text-[10px] text-muted-foreground">File uploaded successfully! Click or drag to replace.</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-center text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                            <Upload className="h-8 w-8 text-muted-foreground group-hover:text-magenta transition-colors" />
                            <span>Upload PDF, DOC, or DOCX</span>
                            <span className="text-[10px] text-muted-foreground/80 font-normal">Max size: 5MB</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Input
                        required
                        type="url"
                        placeholder="e.g. https://drive.google.com/file/d/.../view?usp=sharing"
                        value={resumeUrl}
                        onChange={(e) => setResumeUrl(e.target.value)}
                        className="h-11 bg-background border-border text-foreground rounded-xl focus-visible:ring-magenta text-xs sm:text-sm"
                      />
                      <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-1 leading-normal">
                        Upload your resume to Google Drive, Dropbox, or OneDrive and paste the shared link here. Ensure permissions are set to public view.
                      </p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Cover Letter / Why should we hire you?
                    </label>
                    <textarea
                      placeholder="Briefly introduce yourself and outline why your background matches this role..."
                      rows={4}
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full p-3 sm:p-4 bg-background border border-border text-foreground rounded-xl focus:outline-none focus:ring-1 focus:ring-magenta focus:border-magenta text-xs sm:text-sm resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 pt-4 justify-end border-t border-border shrink-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsApplying(false)}
                      className="border-border text-foreground hover:bg-muted rounded-xl text-xs font-semibold px-4 h-9"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={submittingApplication || uploadingFile}
                      className="bg-magenta hover:bg-magenta/90 text-white font-semibold rounded-xl text-xs px-5 h-9"
                    >
                      {submittingApplication ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                /* Role details view */
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/30 border border-border p-3.5 sm:p-4 rounded-xl text-xs font-semibold text-muted-foreground">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="truncate">Location: {selectedJob.location} ({selectedJob.locationType})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span>Job Type: {selectedJob.jobType}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {selectedJob.salaryRange && (selectedJob.salaryRange.min || selectedJob.salaryRange.max) && (
                        <div className="flex items-center gap-1.5">
                          <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>
                            Salary: {selectedJob.salaryRange.min ? `₹${(selectedJob.salaryRange.min / 100000).toFixed(1)}L` : "0"} -{" "}
                            {selectedJob.salaryRange.max ? `₹${(selectedJob.salaryRange.max / 100000).toFixed(1)}L` : "N/A"}{" "}
                            PA
                          </span>
                        </div>
                      )}
                      {selectedJob.applicationDeadline && (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>Deadline: {new Date(selectedJob.applicationDeadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-foreground text-xs sm:text-sm uppercase tracking-wider font-display">Job Description</h4>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-xs sm:text-sm">{selectedJob.description}</p>
                  </div>

                  {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-foreground text-xs sm:text-sm uppercase tracking-wider font-display">Requirements</h4>
                      <ul className="list-disc pl-5 space-y-1 text-muted-foreground text-xs sm:text-sm">
                        {selectedJob.requirements.map((req, idx) => (
                          <li key={idx} className="leading-relaxed">{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedJob.skillsRequired && selectedJob.skillsRequired.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-foreground text-xs sm:text-sm uppercase tracking-wider font-display">Key Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedJob.skillsRequired.map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-muted border-none text-[10px] sm:text-xs px-2.5 py-1 hover:bg-muted shadow-none">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2.5 pt-6 justify-end border-t border-border shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedJob(null)}
                      className="border-border text-foreground hover:bg-muted rounded-xl text-xs font-semibold px-4 h-9"
                    >
                      Close
                    </Button>
                    {!selectedJob.hasApplied ? (
                      <Button
                        onClick={() => setIsApplying(true)}
                        className="bg-magenta hover:bg-magenta/90 text-white font-semibold rounded-xl text-xs px-5 h-9"
                      >
                        Apply for this Role
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 bg-slate-500/10 border border-slate-500/20 rounded-xl">
                        <CheckCircle className="h-4 w-4 text-slate-500" />
                        <span>Applied ({selectedJob.applicationStatus})</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
