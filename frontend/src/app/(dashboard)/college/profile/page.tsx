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
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-0">
      <PageHeader title="Institution Profile" description="Manage your college details" />

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <DataCard className="p-4 sm:p-6 border-border/60">
          <h3 className="text-sm sm:text-base font-bold font-display text-foreground mb-4">Institution Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">Institution Name</Label>
              <Input value={form.collegeName} onChange={set("collegeName")} className="text-xs sm:text-sm h-10 focus-visible:ring-magenta rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">City</Label>
              <Input value={form.city} onChange={set("city")} className="text-xs sm:text-sm h-10 focus-visible:ring-magenta rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">State</Label>
              <Input value={form.state} onChange={set("state")} className="text-xs sm:text-sm h-10 focus-visible:ring-magenta rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">Website URL</Label>
              <Input value={form.website} onChange={set("website")} className="text-xs sm:text-sm h-10 focus-visible:ring-magenta rounded-xl" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-magenta hover:bg-magenta/90 text-white w-full sm:w-auto h-10 rounded-xl font-semibold px-5"
            >
              <Save className="h-4 w-4 mr-2 inline" /> {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DataCard>

        <DataCard className="p-4 sm:p-6 border-border/60">
          <h3 className="text-sm sm:text-base font-bold font-display text-foreground mb-4">Point of Contact</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">POC Name</Label>
              <Input value={form.pocName} onChange={set("pocName")} className="text-xs sm:text-sm h-10 focus-visible:ring-magenta rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">POC Phone</Label>
              <Input value={form.pocPhone} onChange={set("pocPhone")} className="text-xs sm:text-sm h-10 focus-visible:ring-magenta rounded-xl" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs sm:text-sm text-slate-700 font-semibold">SPOC Email</Label>
              <Input type="email" value={form.pocEmail} onChange={set("pocEmail")} className="text-xs sm:text-sm h-10 focus-visible:ring-magenta rounded-xl" />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-magenta hover:bg-magenta/90 text-white w-full sm:w-auto h-10 rounded-xl font-semibold px-5"
            >
              <Save className="h-4 w-4 mr-2 inline" /> {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DataCard>
      </form>
    </div>
  );
};

export default CollegeProfile;
