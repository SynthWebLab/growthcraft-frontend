"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { toast } from "sonner";
import { useEmployerProfile, useUpdateEmployerProfile } from "@/hooks/queries/useEmployer";
import { useChangePassword } from "@/hooks/queries/useStudent";

const notificationPrefs = [
  { label: "New applications", desc: "Candidates applying to your job postings" },
  { label: "Interview reminders", desc: "Upcoming scheduled interviews" },
  { label: "Talent matches", desc: "New candidates matching your requirements" },
  { label: "Marketing emails", desc: "Platform news, features, and offers" },
];

export default function EmployerSettingsPage() {
  const { data: profile, isLoading } = useEmployerProfile();
  const updateProfileMutation = useUpdateEmployerProfile();
  const changePasswordMutation = useChangePassword();

  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");

  // Sync state with loaded profile data
  useEffect(() => {
    if (profile) {
      setCompanyName(profile.companyName || "");
      setPhone(profile.contactPerson?.phone || "");
    }
  }, [profile]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveAccount = () => {
    if (!profile) return;
    updateProfileMutation.mutate({
      companyName,
      contactPerson: {
        ...profile.contactPerson,
        phone,
      },
    });
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "New password and confirmation must be the same.",
      });
      return;
    }
    changePasswordMutation.mutate(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Settings" description="Loading settings details..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account preferences" />

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-4 space-y-4">
          <DataCard>
            <h3 className="font-bold text-foreground mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Company Name</Label>
                  <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input value={profile?.contactPerson?.email || ""} type="email" className="mt-1.5" disabled readOnly />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here.</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="mt-1.5" />
                </div>
              </div>
              <Button
                className="bg-magenta text-white hover:bg-magenta/90"
                onClick={handleSaveAccount}
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </DataCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <DataCard>
            <h3 className="font-bold text-foreground mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {notificationPrefs.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </DataCard>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <DataCard>
            <h3 className="font-bold text-foreground mb-4">Change Password</h3>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Current Password</Label>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1.5" />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1.5" />
                </div>
              </div>
              <Button
                className="bg-magenta text-white hover:bg-magenta/90"
                onClick={handleUpdatePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword || changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending ? "Updating Password..." : "Update Password"}
              </Button>
            </div>
          </DataCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
