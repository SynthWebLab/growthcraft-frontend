"use client";

import { Save } from "lucide-react";
import { useEffect } from "react";
import DataCard from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useEmployerProfile, useUpdateEmployerProfile } from "@/hooks/queries/useEmployer";

const EmployerProfilePage = () => {
  const { data: profile, isLoading } = useEmployerProfile();
  const updateProfileMutation = useUpdateProfile();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);

    const payload = {
      companyName: fd.get("companyName") as string,
      industry: fd.get("industry") as any,
      companySize: fd.get("companySize") as any,
      website: fd.get("website") as string,
      hiringNeeds: fd.get("hiringNeeds") as string,
      contactPerson: {
        name: fd.get("contactPersonName") as string,
        email: fd.get("contactPersonEmail") as string,
        phone: fd.get("contactPersonPhone") as string,
      },
    };

    updateProfileMutation.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display">Company Profile</h1>
          <p className="text-muted-foreground mt-1 text-sm">Loading profile details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground font-display">Company Profile</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your company details and hiring preferences</p>
      </div>

      <form onSubmit={handleSave} className="grid lg:grid-cols-2 gap-6 items-start">
        <DataCard>
          <h3 className="text-base font-semibold font-display mb-4">Company Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input name="companyName" defaultValue={profile?.companyName} required />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Select name="industry" defaultValue={profile?.industry || "IT/Software"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT/Software">IT/Software</SelectItem>
                  <SelectItem value="Fintech">Fintech</SelectItem>
                  <SelectItem value="E-Commerce">E-Commerce</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="EdTech">EdTech</SelectItem>
                  <SelectItem value="Startup">Startup</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contact Person</Label>
              <Input name="contactPersonName" defaultValue={profile?.contactPerson?.name} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" name="contactPersonEmail" defaultValue={profile?.contactPerson?.email} required />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input name="contactPersonPhone" defaultValue={profile?.contactPerson?.phone} required />
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input name="website" defaultValue={profile?.website} />
            </div>
            <div className="space-y-2">
              <Label>Company Size</Label>
              <Select name="companySize" defaultValue={profile?.companySize || "1-50"}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-50">1-50</SelectItem>
                  <SelectItem value="51-200">51-200</SelectItem>
                  <SelectItem value="201-500">201-500</SelectItem>
                  <SelectItem value="500+">500+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DataCard>

        <DataCard>
          <h3 className="text-base font-semibold font-display mb-4">Hiring Preferences</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Skills We&apos;re Looking For / Hiring Needs</Label>
              <Textarea
                name="hiringNeeds"
                defaultValue={profile?.hiringNeeds || ""}
                placeholder="e.g. React, Node.js, Python, AWS, Docker"
                rows={5}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="bg-magenta hover:bg-magenta/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DataCard>
      </form>
    </div>
  );
};

// Helper hook local alias or import
function useUpdateProfile() {
  return useUpdateEmployerProfile();
}

export default EmployerProfilePage;
