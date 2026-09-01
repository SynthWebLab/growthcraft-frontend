"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { X } from "lucide-react";
import { useStudentProfile, useUpdateStudentProfile } from "@/hooks/queries/useStudent";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatDate } from "@/lib/student-dashboard.utils";
import type { UpdateStudentProfileData } from "@/types/student";

const EMPTY_FORM: UpdateStudentProfileData = {
  collegeName: "",
  degree: "",
  branch: "",
  linkedIn: "",
  github: "",
  portfolio: "",
  resume: "",
};

export default function StudentProfilePage() {
  const { data, isLoading } = useStudentProfile();
  const { data: user } = useCurrentUser();
  const updateProfile = useUpdateStudentProfile();

  const profile = data?.data?.profile ?? null;

  const [form, setForm] = useState<UpdateStudentProfileData>(EMPTY_FORM);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  // Hydrate the form once the profile loads.
  useEffect(() => {
    if (profile) {
      setForm({
        collegeName: profile.collegeName ?? "",
        degree: profile.degree ?? "",
        branch: profile.branch ?? "",
        linkedIn: profile.linkedIn ?? "",
        github: profile.github ?? "",
        portfolio: profile.portfolio ?? "",
        resume: profile.resume ?? "",
      });
      setSkills(profile.skills ?? []);
    }
  }, [profile]);

  const setField = (key: keyof UpdateStudentProfileData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

  const handleSave = () => {
    // Only send non-empty optional URLs to avoid failing URL validation on "".
    const payload: UpdateStudentProfileData = {
      collegeName: form.collegeName || undefined,
      degree: form.degree || undefined,
      branch: form.branch || undefined,
      linkedIn: form.linkedIn || undefined,
      github: form.github || undefined,
      portfolio: form.portfolio || undefined,
      resume: form.resume || undefined,
      skills,
    };
    updateProfile.mutate(payload);
  };

  const fullName = user?.fullName ?? "";
  const email = user?.email ?? "";
  const initial = fullName ? fullName.charAt(0).toUpperCase() : "U";

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-0">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and preferences"
      />

      {/* Avatar Header */}
      <DataCard className="p-4 sm:p-6 border-border/60">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
            <AvatarFallback suppressHydrationWarning className="bg-magenta text-white text-xl sm:text-2xl font-bold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-1 min-h-[4rem] flex flex-col justify-center">
            {user ? (
              <>
                <h2 suppressHydrationWarning className="text-lg sm:text-xl font-bold text-foreground">{fullName}</h2>
                <p suppressHydrationWarning className="text-xs sm:text-sm text-muted-foreground mt-0.5">{email}</p>
              </>
            ) : (
              <div className="space-y-2 animate-pulse py-1">
                <div className="h-6 w-40 bg-marble border border-border rounded" />
                <div className="h-4 w-52 bg-marble border border-border rounded" />
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {profile?.enrolledCourses?.length ? (
                <Badge variant="secondary" className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 shadow-none border-none">
                  {profile.enrolledCourses.length} Courses
                </Badge>
              ) : null}
              {profile?.createdAt && (
                <Badge variant="outline" className="text-[10px] sm:text-xs font-medium px-2.5 py-0.5 bg-background border-border/60">
                  Member since {formatDate(profile.createdAt)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DataCard>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-start">
        <div className="space-y-6">
          {/* Education */}
          <DataCard className="p-4 sm:p-6 border-border/60">
            <h3 className="font-bold text-sm sm:text-base text-foreground mb-4">Education</h3>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm text-slate-700 font-semibold">College Name</Label>
                <Input
                  value={form.collegeName}
                  onChange={(e) => setField("collegeName", e.target.value)}
                  placeholder="Your college"
                  className="mt-1 h-10 sm:h-11 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs sm:text-sm text-slate-700 font-semibold">Degree</Label>
                <Input
                  value={form.degree}
                  onChange={(e) => setField("degree", e.target.value)}
                  placeholder="e.g. B.Tech"
                  className="mt-1 h-10 sm:h-11 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs sm:text-sm text-slate-700 font-semibold">Branch</Label>
                <Input
                  value={form.branch}
                  onChange={(e) => setField("branch", e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="mt-1 h-10 sm:h-11 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm"
                  disabled={isLoading}
                />
              </div>
            </div>
          </DataCard>

          {/* Skills */}
          <DataCard className="p-4 sm:p-6 border-border/60">
            <h3 className="font-bold text-sm sm:text-base text-foreground mb-4">Skills</h3>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1 pr-1.5 text-[10px] sm:text-xs font-semibold py-0.5 px-2 bg-muted text-muted-foreground border-none shadow-none">
                  {skill}
                  <button
                    onClick={() => setSkills(skills.filter((s) => s !== skill))}
                    className="ml-1 hover:text-danger hover:scale-110 transition-all shrink-0"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {skills.length === 0 && (
                <p className="text-xs sm:text-sm text-muted-foreground">No skills added yet.</p>
              )}
            </div>
            <div className="flex gap-2 w-full">
              <Input
                placeholder="Add a skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                className="flex-1 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm h-10 max-w-xs"
              />
              <Button variant="outline" size="sm" onClick={addSkill} className="h-10 rounded-xl px-4 text-xs font-semibold shrink-0">
                Add
              </Button>
            </div>
          </DataCard>
        </div>

        {/* Links */}
        <DataCard className="p-4 sm:p-6 border-border/60">
          <h3 className="font-bold text-sm sm:text-base text-foreground mb-4">Links & Resume</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">LinkedIn URL</Label>
              <Input
                value={form.linkedIn}
                onChange={(e) => setField("linkedIn", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="mt-1 h-10 sm:h-11 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">GitHub URL</Label>
              <Input
                value={form.github}
                onChange={(e) => setField("github", e.target.value)}
                placeholder="https://github.com/..."
                className="mt-1 h-10 sm:h-11 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">Portfolio URL</Label>
              <Input
                value={form.portfolio}
                onChange={(e) => setField("portfolio", e.target.value)}
                placeholder="https://..."
                className="mt-1 h-10 sm:h-11 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">Resume URL</Label>
              <Input
                value={form.resume}
                onChange={(e) => setField("resume", e.target.value)}
                placeholder="https://... (link to your resume)"
                className="mt-1 h-10 sm:h-11 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm"
                disabled={isLoading}
              />
            </div>
          </div>
        </DataCard>
      </div>

      <Button
        className="w-full sm:w-auto bg-magenta hover:bg-magenta/90 text-white font-semibold text-xs sm:text-sm h-11 sm:h-12 rounded-xl px-6"
        onClick={handleSave}
        disabled={isLoading || updateProfile.isPending}
      >
        {updateProfile.isPending ? "Saving..." : "Save Profile"}
      </Button>
    </div>
  );
}
