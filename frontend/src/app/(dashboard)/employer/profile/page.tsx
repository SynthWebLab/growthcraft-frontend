"use client";

import { Save } from "lucide-react";
import { toast } from "sonner";
import DataCard from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EmployerProfile = () => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated", { description: "Your company profile has been saved." });
  };

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
            <div className="space-y-2"><Label>Company Name</Label><Input defaultValue="Acme Technologies" /></div>
            <div className="space-y-2"><Label>Industry</Label><Input defaultValue="IT / Software" /></div>
            <div className="space-y-2"><Label>Contact Person</Label><Input defaultValue="Jane Doe" /></div>
            <div className="space-y-2"><Label>Designation</Label><Input defaultValue="HR Manager" /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" defaultValue="hr@acmetech.com" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+91 98765 43210" /></div>
            <div className="space-y-2"><Label>Website</Label><Input defaultValue="https://acmetech.com" /></div>
            <div className="space-y-2"><Label>Company Size</Label><Input defaultValue="201-500" /></div>
          </div>
          <div className="space-y-2 mt-4">
            <Label>Company Description</Label>
            <Textarea
              defaultValue="Acme Technologies is a leading software company specializing in enterprise solutions and digital transformation."
              rows={3}
            />
          </div>
        </DataCard>

        <DataCard>
          <h3 className="text-base font-semibold font-display mb-4">Hiring Preferences</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Skills We&apos;re Looking For</Label>
              <Textarea defaultValue="React, Node.js, Python, AWS, Docker, PostgreSQL, TypeScript" rows={2} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Typical Roles</Label>
                <Input defaultValue="Software Developer, Data Analyst, DevOps" />
              </div>
              <div className="space-y-2">
                <Label>Hiring Frequency</Label>
                <Input defaultValue="Quarterly" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                defaultValue="We prefer candidates with project experience and good communication skills."
                rows={2}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" className="bg-magenta hover:bg-magenta/90">
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          </div>
        </DataCard>
      </form>
    </div>
  );
};

export default EmployerProfile;
