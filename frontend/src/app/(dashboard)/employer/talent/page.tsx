"use client";

import { useState } from "react";
import { Search, Bookmark, MapPin } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useTalentPool } from "@/hooks/queries/useEmployer";

const FilterGroup = ({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) => (
  <div>
    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{title}</h4>
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
          <Checkbox checked={selected.includes(opt)} onCheckedChange={() => onToggle(opt)} />
          <span className="text-foreground">{opt}</span>
        </label>
      ))}
    </div>
  </div>
);

const EmployerTalent = () => {
  const { data: candidates = [], isLoading, isError } = useTalentPool();
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [shortlisted, setShortlisted] = useState<string[]>([]);

  // Dynamically extract filter lists from backend data
  const allSkills = Array.from(new Set(candidates.flatMap((c) => c.skills))).slice(0, 12);
  const allCourses = Array.from(new Set(candidates.map((c) => c.course)));
  const allAvailability = ["Available", "Interviewing", "Hired"];

  const toggle = (arr: string[], setter: (v: string[]) => void, value: string) => {
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const filtered = candidates.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchSkills = selectedSkills.length === 0 || selectedSkills.some((s) => c.skills.includes(s));
    const matchCourse = selectedCourses.length === 0 || selectedCourses.includes(c.course);
    const matchAvail = selectedAvailability.length === 0 || selectedAvailability.includes(c.availability);
    return matchSearch && matchSkills && matchCourse && matchAvail;
  });

  const handleShortlist = (c: any) => {
    if (shortlisted.includes(c.id)) {
      setShortlisted((p) => p.filter((id) => id !== c.id));
      toast("Removed from shortlist");
    } else {
      setShortlisted((p) => [...p, c.id]);
      toast.success("Shortlisted!", { description: `${c.name} added to your shortlist.` });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Talent Pool"
        description="Browse job-ready candidates from GrowthCraft programs"
      />

      {isError && (
        <p className="text-sm text-destructive">Couldn&apos;t load talent pool. Please try again.</p>
      )}

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Filters sidebar */}
        <DataCard className="h-fit space-y-6">
          {isLoading ? (
            <p className="text-xs text-muted-foreground">Loading filters...</p>
          ) : (
            <>
              <FilterGroup
                title="Skills"
                options={allSkills.length > 0 ? allSkills : ["React", "Node.js", "Python"]}
                selected={selectedSkills}
                onToggle={(v) => toggle(selectedSkills, setSelectedSkills, v)}
              />
              <FilterGroup
                title="Course Completed"
                options={allCourses.length > 0 ? allCourses : ["Full Stack Dev"]}
                selected={selectedCourses}
                onToggle={(v) => toggle(selectedCourses, setSelectedCourses, v)}
              />
              <FilterGroup
                title="Availability"
                options={allAvailability}
                selected={selectedAvailability}
                onToggle={(v) => toggle(selectedAvailability, setSelectedAvailability, v)}
              />
            </>
          )}
        </DataCard>

        {/* Candidate grid */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or skill…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {isLoading ? (
            <DataCard className="text-center py-12">
              <p className="text-muted-foreground">Loading candidates...</p>
            </DataCard>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filtered.map((c) => {
                const isShortlisted = shortlisted.includes(c.id);
                return (
                  <DataCard key={c.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-magenta/10 text-magenta flex items-center justify-center font-bold text-sm shrink-0">
                        {c.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {c.location} · {c.course}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-[10px]">{c.availability}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {c.skills.map((s: string) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Latest Project</p>
                      <p className="text-xs text-foreground line-clamp-2">{c.latestProject}</p>
                    </div>

                    <Button
                      size="sm"
                      variant={isShortlisted ? "default" : "outline"}
                      className={isShortlisted ? "w-full bg-magenta hover:bg-magenta/90" : "w-full"}
                      onClick={() => handleShortlist(c)}
                    >
                      <Bookmark className={`h-3.5 w-3.5 mr-1 ${isShortlisted ? "fill-current" : ""}`} />
                      {isShortlisted ? "Shortlisted" : "Shortlist"}
                    </Button>
                  </DataCard>
                );
              })}
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <DataCard className="text-center py-12">
              <p className="text-muted-foreground">No candidates match your filters.</p>
            </DataCard>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployerTalent;
