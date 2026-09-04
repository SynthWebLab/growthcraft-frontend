"use client";

import { useState, useEffect, useRef } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DataCard from "@/components/ui/data-card";
import { useMentorProfile, useUpdateMentorProfile, useUploadMentorAvatar } from "@/hooks/queries/useMentor";
import { Camera, Loader2 } from "lucide-react";
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
  const { mutate: uploadAvatar, isPending: isUploadingAvatar } = useUploadMentorAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = profileResponse?.data?.profile;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be under 5MB");
      return;
    }
    uploadAvatar(file);
  };

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

  const avatarUrl = profile?.avatar || (profile as any)?.userId?.avatar;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mentor Profile"
        description="Manage your public profile and preferences"
      />

      <DataCard>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="relative group flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profile?.fullName || "Mentor"}
                className="h-20 w-20 rounded-full object-cover border-2 border-primary/20 shadow-sm"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold border-2 border-primary/20 shadow-sm">
                {profile?.fullName
                  ? profile.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                  : "M"}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
              title="Upload profile picture"
            >
              {isUploadingAvatar ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <Camera className="h-6 w-6 text-white" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-foreground truncate">{profile?.fullName}</h3>
              {profile?.isVerified && (
                <span className="bg-success/15 text-success text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0">
                  Verified Mentor
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">{profile?.email}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 text-xs h-8"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
            >
              {isUploadingAvatar ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Uploading Photo...
                </>
              ) : (
                <>
                  <Camera className="h-3.5 w-3.5 mr-1.5" />
                  Upload Profile Picture
                </>
              )}
            </Button>
          </div>
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

