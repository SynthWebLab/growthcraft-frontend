"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import PageHeader from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { useState } from "react";
import { X } from "lucide-react";

export default function StudentProfilePage() {
  const [skills, setSkills] = useState([
    "React",
    "TypeScript",
    "Node.js",
    "Python",
  ]);
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput("");
    }
  };

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
              S
            </AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-xl font-bold text-foreground">Student User</h2>
            <p className="text-sm text-muted-foreground">
              student@example.com
            </p>
            <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
              <Badge variant="secondary">3 Courses</Badge>
              <Badge variant="outline">Member since Mar 2026</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Change Photo
          </Button>
        </div>
      </DataCard>

      {/* Bio & About */}
      <DataCard>
        <h3 className="font-bold text-foreground mb-4">About</h3>
        <div className="space-y-4">
          <div>
            <Label>Bio</Label>
            <Textarea
              defaultValue="Aspiring full-stack developer passionate about building scalable web applications."
              rows={3}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label>Current Job Title</Label>
            <Input
              defaultValue="Computer Science Student"
              className="mt-1.5"
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
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
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
            <Input placeholder="https://linkedin.com/in/..." className="mt-1.5" />
          </div>
          <div>
            <Label>GitHub URL</Label>
            <Input placeholder="https://github.com/..." className="mt-1.5" />
          </div>
          <div>
            <Label>Resume</Label>
            <div className="mt-1.5 border border-dashed border-border rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Drag & drop your resume or click to upload
              </p>
              <Button variant="outline" size="sm">
                Upload PDF
              </Button>
            </div>
          </div>
        </div>
      </DataCard>

      <Button className="bg-magenta text-white hover:bg-magenta/90">
        Save Profile
      </Button>
    </div>
  );
}
