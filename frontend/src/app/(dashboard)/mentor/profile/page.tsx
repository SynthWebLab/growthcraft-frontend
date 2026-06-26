"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DataCard from "@/components/ui/data-card";
import { useMentorProfile, useUpdateMentorProfile } from "@/hooks/queries/useMentor";
import { toast } from "sonner";

const EXPERTISE_OPTIONS = [
  "Web Development",
  "Data Science & AI",
  "Mobile Development",
  "DevOps & Cloud",
  "UI/UX Design",
  "Cybersecurity",
  "Other",
];

const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <div className="h-8 w-48 bg-muted/40 rounded" />
      <div className="h-4 w-80 bg-muted/40 rounded" />
    </div>
    <div className="h-[600px] bg-muted/40 rounded-xl" />
  </div>
);

const MentorProfile = () => {
  const [bio, setBio] = useState("");
  const [areaOfExpertise, setAreaOfExpertise] = useState("Other");
  const [experienceYears, setExperienceYears] = useState(0);
  const [currentOrganization, setCurrentOrganization] = useState("");
  const [linkedIn, setLinkedIn] = useState("");
  const [website, setWebsite] = useState("");
  const [rate, setRate] = useState("1500");

  const { data: profileResponse, isLoading, error } = useMentorProfile();
  const { mutate: updateProfile, isPending: isSaving } = useUpdateMentorProfile();

  const profile = profileResponse?.data?.profile;

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setAreaOfExpertise(profile.areaOfExpertise || "Other");
      setExperienceYears(profile.experienceYears || 0);
      setCurrentOrganization(profile.currentOrganization || "");
      setLinkedIn(profile.linkedIn || "");
      setWebsite(profile.website || "");
      setRate(profile.hourlyRate?.toString() || "1500");
    }
  }, [profile]);

  const handleSave = () => {
    const hourlyRate = parseFloat(rate);
    if (isNaN(hourlyRate) || hourlyRate < 0) {
      toast.error("Invalid hourly rate");
      return;
    }

    updateProfile({
      bio,
      areaOfExpertise,
      experienceYears: Number(experienceYears),
      currentOrganization,
      linkedIn,
      website,
      hourlyRate,
    });
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <p className="text-red-500 font-medium">Failed to load profile details</p>
        <p className="text-sm text-muted-foreground">
          {(error as any)?.message || "Please check your connection to the server."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mentor Profile"
        description="Manage your public profile and preferences"
      />

      <DataCard>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
            {profile?.fullName
              ? profile.fullName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
              : "M"}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{profile?.fullName}</h3>
            <p className="text-sm text-muted-foreground">{profile?.email}</p>
          </div>
          {profile?.isVerified && (
            <span className="ml-auto bg-success/15 text-success text-xs font-semibold px-2.5 py-1 rounded-full">
              Verified Mentor
            </span>
          )}
        </div>

        <div className="grid gap-5">
          <div>
            <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
            <Textarea
              id="bio"
              className="mt-1.5"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell students about your professional background and coaching style..."
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expertise" className="text-sm font-medium">Area of Expertise</Label>
              <select
                id="expertise"
                className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                value={areaOfExpertise}
                onChange={(e) => setAreaOfExpertise(e.target.value)}
              >
                {EXPERTISE_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="experienceYears" className="text-sm font-medium">Years of Experience</Label>
              <Input
                id="experienceYears"
                type="number"
                className="mt-1.5"
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="org" className="text-sm font-medium">Current Organization</Label>
              <Input
                id="org"
                className="mt-1.5"
                value={currentOrganization}
                onChange={(e) => setCurrentOrganization(e.target.value)}
                placeholder="e.g. Google, Stripe"
              />
            </div>
            <div>
              <Label htmlFor="rate" className="text-sm font-medium">Session Rate (₹/hr)</Label>
              <Input
                id="rate"
                className="mt-1.5"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin" className="text-sm font-medium">LinkedIn URL</Label>
              <Input
                id="linkedin"
                className="mt-1.5"
                value={linkedIn}
                onChange={(e) => setLinkedIn(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div>
              <Label htmlFor="website" className="text-sm font-medium">Personal Website</Label>
              <Input
                id="website"
                className="mt-1.5"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-magenta hover:bg-magenta/90 text-white"
          >
            {isSaving ? "Saving Profile..." : "Save Profile"}
          </Button>
        </div>
      </DataCard>
    </div>
  );
};

export default MentorProfile;

