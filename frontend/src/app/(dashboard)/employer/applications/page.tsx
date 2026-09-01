"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  ExternalLink,
  Mail,
  GraduationCap,
  Award,
  X
} from "lucide-react";
import { toast } from "sonner";
import DataCard from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEmployerApplications, useUpdateApplicationStatus } from "@/hooks/queries/useEmployer";

type Stage = "Applied" | "Shortlisted" | "Interview" | "Hired" | "Rejected";

interface Application {
  id: string;
  name: string;
  email: string;
  role: string;
  appliedDate: string;
  stage: Stage;
  degree: string;
  skills: string[];
  resumeUrl: string;
  coverLetter?: string;
}

const stages: Stage[] = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];

const stageColors: Record<Stage, string> = {
  Applied: "border-t-slate-500",
  Shortlisted: "border-t-info",
  Interview: "border-t-warning",
  Hired: "border-t-success",
  Rejected: "border-t-danger",
};

const EmployerApplications = () => {
  const { data: applications, isLoading } = useEmployerApplications();
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateApplicationStatus();
  
  const [apps, setApps] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [activeStage, setActiveStage] = useState<Stage>("Applied");

  // Sync React Query data to local state for instant optimistic updates
  useEffect(() => {
    if (applications) {
      setApps(applications);
    }
  }, [applications]);

  const move = (id: string, direction: 1 | -1) => {
    const app = apps.find((a) => a.id === id);
    if (!app) return;
    const idx = stages.indexOf(app.stage);
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= stages.length) return;
    const newStage = stages[nextIdx];

    // Optimistically update local state
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, stage: newStage } : a))
    );

    // Call mutation to update backend
    updateStatus(
      { id, status: newStage },
      {
        onError: () => {
          // Revert local state on error by syncing back to query data
          setApps(applications || []);
        },
      }
    );
  };

  const grouped = stages.reduce((acc, s) => {
    acc[s] = apps.filter((a) => a.stage === s);
    return acc;
  }, {} as Record<Stage, Application[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display">Applications</h1>
          <p className="text-muted-foreground mt-1 text-sm">Move candidates through your hiring pipeline</p>
        </div>
      </div>

      {/* Mobile Stage Selector */}
      <div className="block md:hidden border-b border-border">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => setActiveStage(stage)}
              className={cn(
                "pb-2.5 text-xs font-semibold tracking-wide transition-colors relative whitespace-nowrap px-3",
                activeStage === stage ? "text-magenta" : "text-muted-foreground"
              )}
            >
              {stage} ({grouped[stage]?.length ?? 0})
              {activeStage === stage && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-magenta rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Column View */}
      <div className="block md:hidden space-y-4">
        {isLoading ? (
          <p className="text-xs text-muted-foreground p-3">Loading applications...</p>
        ) : (grouped[activeStage]?.length ?? 0) === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 p-12 text-center bg-card">
            <p className="text-sm text-muted-foreground">No candidates in this stage</p>
          </div>
        ) : (
          <div className="space-y-3">
            {grouped[activeStage]?.map((app) => {
              const idx = stages.indexOf(app.stage);
              return (
                <DataCard
                  key={app.id}
                  onClick={() => setSelectedApp(app)}
                  className={cn("p-4 border-t-4 bg-card cursor-pointer relative", stageColors[activeStage])}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <h4 className="font-bold text-foreground text-sm font-display truncate">
                          {app.name}
                        </h4>
                        <p className="text-[11px] font-semibold text-magenta truncate">{app.role}</p>
                      </div>
                      <Badge className="bg-magenta/10 text-magenta font-semibold border-none hover:bg-magenta/10 px-2.5 py-0.5 text-[10px] shadow-none shrink-0 uppercase">
                        {app.stage}
                      </Badge>
                    </div>

                    <div className="space-y-1.5 text-[10px] text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5 truncate">
                        <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                        <span>{app.degree}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">Applied {app.appliedDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-magenta hover:underline font-semibold flex items-center gap-1 bg-magenta/5 px-2 py-1 rounded"
                      >
                        <FileText className="h-3 w-3" />
                        <span>Resume</span>
                      </a>
                      <div className="flex gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-lg bg-muted/50 border-border hover:bg-muted"
                          disabled={idx === 0 || updatingStatus}
                          onClick={() => move(app.id, -1)}
                          title="Move left"
                        >
                          <ChevronLeft className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 rounded-lg bg-muted/50 border-border hover:bg-muted"
                          disabled={idx === stages.length - 1 || updatingStatus}
                          onClick={() => move(app.id, 1)}
                          title="Move right"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </DataCard>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Kanban Board */}
      <div className="hidden md:block overflow-x-auto pb-6 scrollbar-hide">
        <div className="grid grid-cols-5 gap-4 min-w-[1100px]">
          {stages.map((stage) => (
            <div key={stage} className="space-y-4 bg-muted/30 p-3 rounded-2xl border border-border/80 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-foreground font-display tracking-wide uppercase">{stage}</h3>
                <Badge variant="outline" className="text-[10px] bg-muted border-none font-semibold text-muted-foreground">
                  {grouped[stage]?.length ?? 0}
                </Badge>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] scrollbar-hide">
                {isLoading ? (
                  <p className="text-xs text-muted-foreground p-3">Loading applications...</p>
                ) : grouped[stage]?.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/60 p-6 text-center bg-muted/10 mt-2">
                    <p className="text-xs text-muted-foreground">No candidates</p>
                  </div>
                ) : (
                  grouped[stage]?.map((app) => {
                    const idx = stages.indexOf(app.stage);
                    return (
                      <DataCard
                        key={app.id}
                        onClick={() => setSelectedApp(app)}
                        className={cn("p-4 border-t-4 bg-card hover:-translate-y-0.5 transition-all hover:scale-[1.01] cursor-pointer relative", stageColors[stage])}
                      >
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-bold text-foreground text-sm font-display truncate">
                              {app.name}
                            </h4>
                            <p className="text-[11px] font-semibold text-magenta truncate">{app.role}</p>
                          </div>

                          <div className="space-y-1.5 text-[10px] text-muted-foreground font-medium">
                            <div className="flex items-center gap-1.5 truncate">
                              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                              <span>{app.degree}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Award className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">Applied {app.appliedDate}</span>
                            </div>
                          </div>

                          {/* Footer Actions */}
                          <div className="flex items-center justify-between pt-2 border-t border-border/50" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-magenta hover:underline font-semibold flex items-center gap-1 bg-magenta/5 px-2 py-1 rounded"
                            >
                              <FileText className="h-3 w-3" />
                              <span>Resume</span>
                            </a>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 rounded-lg bg-muted/50 border-border hover:bg-muted"
                                disabled={idx === 0 || updatingStatus}
                                onClick={() => move(app.id, -1)}
                                title="Move left"
                              >
                                <ChevronLeft className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 rounded-lg bg-muted/50 border-border hover:bg-muted"
                                disabled={idx === stages.length - 1 || updatingStatus}
                                onClick={() => move(app.id, 1)}
                                title="Move right"
                              >
                                <ChevronRight className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DataCard>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Details View Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-200">
          <div className="bg-card border border-border shadow-2xl w-full max-w-xl rounded-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-border flex items-start justify-between bg-muted/20">
              <div>
                <Badge className="bg-magenta/10 text-magenta font-semibold border-none px-2.5 py-0.5 text-[10px] mb-2">
                  {selectedApp.stage}
                </Badge>
                <h2 className="text-xl font-bold text-foreground font-display leading-tight">
                  {selectedApp.name}
                </h2>
                <p className="text-sm font-medium text-magenta mt-1">{selectedApp.role}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="h-8 w-8 rounded-lg bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/80"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5 text-sm">
              <div className="space-y-3 bg-muted/30 border border-border p-4 rounded-xl text-xs font-medium text-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>Email: {selectedApp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>Degree: {selectedApp.degree}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>Applied Date: {selectedApp.appliedDate}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider font-display">Candidate Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.skills.map((skill, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-muted/60 border-none text-foreground text-xs px-2.5 py-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {selectedApp.coverLetter && (
                <div className="space-y-1.5">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider font-display">Cover Letter</h4>
                  <p className="text-foreground leading-relaxed whitespace-pre-line bg-muted/20 border border-border p-3.5 rounded-xl text-xs">
                    {selectedApp.coverLetter}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-6 justify-end border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedApp(null)}
                  className="border-border text-foreground hover:bg-muted rounded-xl text-xs font-semibold px-4 h-9"
                >
                  Close
                </Button>
                <a
                  href={selectedApp.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-magenta hover:bg-magenta/90 text-white font-semibold rounded-xl text-xs px-5 h-9 inline-flex items-center justify-center gap-1.5"
                >
                  <FileText className="h-4 w-4" />
                  <span>View Resume</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerApplications;
