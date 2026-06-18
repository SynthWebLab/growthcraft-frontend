"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import DataCard from "@/components/ui/data-card";
import { toast } from "sonner";

const MentorProfile = () => {
  const [expertise, setExpertise] = useState(["React", "Node.js", "TypeScript", "System Design"]);
  const [newSkill, setNewSkill] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !expertise.includes(s)) {
      setExpertise((prev) => [...prev, s]);
      setNewSkill("");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mentor Profile"
        description="Manage your public profile and preferences"
      />

      <DataCard>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
            MS
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Mentor Sharma</h3>
            <p className="text-sm text-muted-foreground">mentor@growthcraft.in</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Label htmlFor="available" className="text-sm">
              Available for sessions
            </Label>
            <Switch id="available" checked={isAvailable} onCheckedChange={setIsAvailable} />
          </div>
        </div>

        <div className="grid gap-5">
          <div>
            <Label className="text-sm font-medium">Bio</Label>
            <Textarea
              className="mt-1.5"
              rows={4}
              defaultValue="Senior software engineer with 8+ years of experience in React, Node.js, and cloud architecture. Passionate about mentoring the next generation of developers."
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Expertise</Label>
            <div className="flex flex-wrap gap-2 mt-1.5 mb-2">
              {expertise.map((s) => (
                <Badge key={s} variant="secondary" className="gap-1">
                  {s}
                  <button
                    type="button"
                    onClick={() => setExpertise((prev) => prev.filter((x) => x !== s))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 max-w-xs">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Add expertise…"
                className="h-8 text-sm"
              />
              <Button size="sm" variant="outline" onClick={addSkill}>
                Add
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">LinkedIn</Label>
              <Input className="mt-1.5" defaultValue="https://linkedin.com/in/mentor-sharma" />
            </div>
            <div>
              <Label className="text-sm font-medium">Session Rate (₹/hr)</Label>
              <Input className="mt-1.5" type="number" defaultValue="1500" />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            className="bg-magenta hover:bg-magenta/90 text-white"
            onClick={() => toast.success("Profile saved!")}
          >
            Save Profile
          </Button>
        </div>
      </DataCard>
    </div>
  );
};

export default MentorProfile;
