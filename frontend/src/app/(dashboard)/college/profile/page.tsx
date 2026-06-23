"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { useCollegeProfile, useUpdateCollegeProfile } from "@/hooks/queries/useCollege";

const CollegeProfile = () => {
  const { data } = useCollegeProfile();
  const profile = data?.data?.profile;
  const { mutate, isPending } = useUpdateCollegeProfile();

  const [form, setForm] = useState({
    collegeName: "",
    city: "",
    state: "",
    website: "",
    pocName: "",
    pocPhone: "",
    pocEmail: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        collegeName: profile.collegeName ?? "",
        city: profile.address?.city ?? "",
        state: profile.address?.state ?? "",
        website: profile.website ?? "",
        pocName: profile.contactPerson?.name ?? "",
        pocPhone: profile.contactPerson?.phone ?? "",
        pocEmail: profile.contactPerson?.email ?? "",
      });
    }
  }, [profile]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      collegeName: form.collegeName,
      website: form.website || undefined,
      address: { city: form.city, state: form.state },
      contactPerson: { name: form.pocName, phone: form.pocPhone, email: form.pocEmail },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Institution Profile" description="Manage your college details" />

      <form onSubmit={handleSave} className="grid lg:grid-cols-2 gap-6 items-start">
        <DataCard>
          <h3 className="text-base font-semibold font-display mb-4">Institution Details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Institution Name</Label>
              <Input value={form.collegeName} onChange={set("collegeName")} />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input value={form.city} onChange={set("city")} />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input value={form.state} onChange={set("state")} />
            </div>
            <div className="space-y-2">
              <Label>Website URL</Label>
              <Input value={form.website} onChange={set("website")} />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-magenta hover:bg-magenta/90 text-white"
            >
              <Save className="h-4 w-4 mr-2" /> {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DataCard>

        <DataCard>
          <h3 className="text-base font-semibold font-display mb-4">Point of Contact</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>POC Name</Label>
              <Input value={form.pocName} onChange={set("pocName")} />
            </div>
            <div className="space-y-2">
              <Label>POC Phone</Label>
              <Input value={form.pocPhone} onChange={set("pocPhone")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>SPOC Email</Label>
              <Input type="email" value={form.pocEmail} onChange={set("pocEmail")} />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-magenta hover:bg-magenta/90 text-white"
            >
              <Save className="h-4 w-4 mr-2" /> {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DataCard>
      </form>
    </div>
  );
};

export default CollegeProfile;
