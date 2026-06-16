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

  const fullName = user?.fullName ?? "Student";
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="My Profile"
        description="Manage your personal information and preferences"
      />

      {/* Avatar Header */}
      <DataCard>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-magenta text-white text-2xl font-bold">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
            <p className="text-sm text-muted-foreground">{user?.email ?? ""}</p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              {profile?.enrolledCourses?.length ? (
                <Badge variant="secondary">
                  {profile.enrolledCourses.length} Courses
                </Badge>
              ) : null}
              {profile?.createdAt && (
                <Badge variant="outline">
                  Member since {formatDate(profile.createdAt)}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DataCard>

      {/* Education */}
      <DataCard>
        <h3 className="font-bold text-foreground mb-4">Education</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>College Name</Label>
            <Input
              value={form.collegeName}
              onChange={(e) => setField("collegeName", e.target.value)}
              placeholder="Your college"
              className="mt-1.5"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Degree</Label>
            <Input
              value={form.degree}
              onChange={(e) => setField("degree", e.target.value)}
              placeholder="e.g. B.Tech"
              className="mt-1.5"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Branch</Label>
            <Input
              value={form.branch}
              onChange={(e) => setField("branch", e.target.value)}
              placeholder="e.g. Computer Science"
              className="mt-1.5"
              disabled={isLoading}
            />
          </div>
        </div>
      </DataCard>

      {/* Skills */}
      <DataCard>
        <h3 className="font-bold text-foreground mb-4">Skills</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1 pr-1.5">
              {skill}
              <button
                onClick={() => setSkills(skills.filter((s) => s !== skill))}
                className="ml-1 hover:text-danger"
                aria-label={`Remove ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {skills.length === 0 && (
            <p className="text-sm text-muted-foreground">No skills added yet.</p>
          )}
        </div>
        <div className="flex gap-2">
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
            className="max-w-xs"
          />
          <Button variant="outline" size="sm" onClick={addSkill}>
            Add
          </Button>
        </div>
      </DataCard>

      {/* Links */}
      <DataCard>
        <h3 className="font-bold text-foreground mb-4">Links & Resume</h3>
        <div className="space-y-4">
          <div>
            <Label>LinkedIn URL</Label>
            <Input
              value={form.linkedIn}
              onChange={(e) => setField("linkedIn", e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="mt-1.5"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>GitHub URL</Label>
            <Input
              value={form.github}
              onChange={(e) => setField("github", e.target.value)}
              placeholder="https://github.com/..."
              className="mt-1.5"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Portfolio URL</Label>
            <Input
              value={form.portfolio}
              onChange={(e) => setField("portfolio", e.target.value)}
              placeholder="https://..."
              className="mt-1.5"
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Resume URL</Label>
            <Input
              value={form.resume}
              onChange={(e) => setField("resume", e.target.value)}
              placeholder="https://... (link to your resume)"
              className="mt-1.5"
              disabled={isLoading}
            />
          </div>
        </div>
      </DataCard>

      <Button
        className="bg-magenta text-white hover:bg-magenta/90"
        onClick={handleSave}
        disabled={isLoading || updateProfile.isPending}
      >
        {updateProfile.isPending ? "Saving..." : "Save Profile"}
      </Button>
    </div>
  );
}
