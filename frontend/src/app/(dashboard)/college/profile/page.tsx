"use client";

import PageHeader from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CollegeProfile() {
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile updated!",
      description: "Your institution profile has been saved.",
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Institution Profile"
        description="Manage your college details"
      />

      <form onSubmit={handleSave} className="space-y-6">
        <DataCard>
          <h3 className="text-base font-semibold font-display mb-4">
            Institution Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Institution Name</Label>
              <Input defaultValue="ABC Engineering College" />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input defaultValue="Guwahati" />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input defaultValue="Assam" />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input defaultValue="https://abcengg.edu" />
            </div>
          </div>
        </DataCard>

        <DataCard>
          <h3 className="text-base font-semibold font-display mb-4">
            Point of Contact
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>POC Name</Label>
              <Input defaultValue="Dr. R. Sharma" />
            </div>
            <div className="space-y-2">
              <Label>POC Phone</Label>
              <Input defaultValue="+91 98765 43210" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>SPOC Email</Label>
              <Input type="email" defaultValue="tpo@abcengg.edu" />
            </div>
          </div>
        </DataCard>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-magenta hover:bg-magenta/90 text-white"
          >
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
