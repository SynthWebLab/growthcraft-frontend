"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import DataCard from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Stage = "Applied" | "Shortlisted" | "Interview" | "Hired" | "Rejected";

interface Application {
  id: number;
  name: string;
  role: string;
  appliedDate: string;
  stage: Stage;
}

const stages: Stage[] = ["Applied", "Shortlisted", "Interview", "Hired", "Rejected"];

const stageColors: Record<Stage, string> = {
  Applied: "border-t-lavender",
  Shortlisted: "border-t-info",
  Interview: "border-t-warning",
  Hired: "border-t-success",
  Rejected: "border-t-danger",
};

const initialApps: Application[] = [
  { id: 1, name: "Rahul Sharma", role: "Junior React Developer", appliedDate: "Apr 8", stage: "Applied" },
  { id: 2, name: "Karan Mehta", role: "Backend Engineer", appliedDate: "Apr 8", stage: "Applied" },
  { id: 3, name: "Vikram Iyer", role: "Data Analyst Intern", appliedDate: "Apr 7", stage: "Applied" },
  { id: 4, name: "Priya Devi", role: "Data Analyst Intern", appliedDate: "Apr 7", stage: "Shortlisted" },
  { id: 5, name: "Sneha Gupta", role: "Junior React Developer", appliedDate: "Apr 5", stage: "Shortlisted" },
  { id: 6, name: "Amit Kumar", role: "Full Stack Developer", appliedDate: "Apr 6", stage: "Interview" },
  { id: 7, name: "Anjali Roy", role: "UI/UX Designer", appliedDate: "Apr 1", stage: "Interview" },
  { id: 8, name: "Meera Singh", role: "Junior React Developer", appliedDate: "Apr 3", stage: "Hired" },
  { id: 9, name: "Nisha Kapoor", role: "Frontend Developer", appliedDate: "Mar 30", stage: "Hired" },
  { id: 10, name: "Ravi Patel", role: "Full Stack Developer", appliedDate: "Apr 4", stage: "Rejected" },
];

const EmployerApplications = () => {
  const [apps, setApps] = useState(initialApps);

  const move = (id: number, direction: 1 | -1) => {
    setApps((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const idx = stages.indexOf(a.stage);
        const next = idx + direction;
        if (next < 0 || next >= stages.length) return a;
        const newStage = stages[next];
        toast(`Moved to ${newStage}`, { description: `${a.name} → ${newStage}` });
        return { ...a, stage: newStage };
      })
    );
  };

  const grouped = stages.reduce((acc, s) => {
    acc[s] = apps.filter((a) => a.stage === s);
    return acc;
  }, {} as Record<Stage, Application[]>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display">Applications</h1>
        <p className="text-muted-foreground mt-1 text-sm">Move candidates through your hiring pipeline</p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-5 gap-3 min-w-[1000px]">
          {stages.map((stage) => (
            <div key={stage} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
                <Badge variant="outline" className="text-[10px]">{grouped[stage].length}</Badge>
              </div>

              <div className="space-y-2 min-h-[200px]">
                {grouped[stage].map((app) => {
                  const idx = stages.indexOf(app.stage);
                  return (
                    <DataCard
                      key={app.id}
                      className={cn("p-3 border-t-4", stageColors[stage])}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-magenta/10 text-magenta flex items-center justify-center text-[10px] font-bold">
                          {app.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-foreground text-sm truncate">{app.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{app.role}</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-2">Applied {app.appliedDate}</p>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          disabled={idx === 0}
                          onClick={() => move(app.id, -1)}
                          title="Move left"
                        >
                          <ChevronLeft className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          disabled={idx === stages.length - 1}
                          onClick={() => move(app.id, 1)}
                          title="Move right"
                        >
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </DataCard>
                  );
                })}
                {grouped[stage].length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-6 text-center">
                    <p className="text-xs text-muted-foreground">No candidates</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployerApplications;
