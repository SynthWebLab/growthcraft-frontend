"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { toast } from "sonner";
import {
  useCollegeSettings,
  useUpdateCollegeAccount,
  useUpdateCollegeNotifications,
} from "@/hooks/queries/useCollege";
import { useChangePassword } from "@/hooks/queries/useStudent";
import type { CollegeNotificationPreferences } from "@/types/college";

const NOTIFICATION_ITEMS: {
  key: keyof CollegeNotificationPreferences;
  label: string;
  desc: string;
}[] = [
  { key: "studentEnrollments", label: "Student enrollments", desc: "New student enrollments and updates" },
  { key: "programUpdates", label: "Program updates", desc: "Changes to your training programs" },
  { key: "reportsReady", label: "Reports ready", desc: "Monthly performance reports are available" },
  { key: "marketingEmails", label: "Marketing emails", desc: "Platform news, features, and offers" },
];

export default function CollegeSettingsPage() {
  const { data } = useCollegeSettings();
  const settings = data?.data;

  const updateAccount = useUpdateCollegeAccount();
  const updateNotifications = useUpdateCollegeNotifications();
  const changePassword = useChangePassword();

  const [institutionName, setInstitutionName] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (settings) {
      setInstitutionName(settings.institutionName ?? "");
      setPhone(settings.phone ?? "");
    }
  }, [settings]);

  const handleSaveAccount = () => {
    updateAccount.mutate({ institutionName, phone });
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "New password and confirmation must be the same.",
      });
      return;
    }
    changePassword.mutate(
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

  const handleToggle = (key: keyof CollegeNotificationPreferences, value: boolean) => {
    updateNotifications.mutate({ [key]: value });
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-0">
      <PageHeader title="Settings" description="Manage your account preferences" />

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto scrollbar-hide flex flex-row flex-nowrap h-11 bg-slate-100 p-1 rounded-xl gap-1">
          <TabsTrigger value="account" className="text-xs sm:text-sm shrink-0 rounded-lg font-semibold px-4">Account</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs sm:text-sm shrink-0 rounded-lg font-semibold px-4">Notifications</TabsTrigger>
          <TabsTrigger value="password" className="text-xs sm:text-sm shrink-0 rounded-lg font-semibold px-4">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-4 space-y-4">
          <DataCard className="p-4 sm:p-6 border-border/60">
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm text-slate-700 font-semibold">Institution Name</Label>
                  <Input value={institutionName} onChange={(e) => setInstitutionName(e.target.value)} className="mt-1 h-10 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm text-slate-700 font-semibold">Email</Label>
                  <Input value={settings?.email ?? ""} type="email" className="mt-1 h-10 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm bg-slate-50 border-slate-200" disabled readOnly />
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 font-medium">Email cannot be changed here.</p>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm text-slate-700 font-semibold">Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" className="mt-1 h-10 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm" />
                </div>
              </div>
              <Button
                className="bg-magenta text-white hover:bg-magenta/90 w-full sm:w-auto h-10 rounded-xl font-semibold text-xs sm:text-sm px-5"
                onClick={handleSaveAccount}
                disabled={updateAccount.isPending}
              >
                {updateAccount.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DataCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <DataCard className="p-4 sm:p-6 border-border/60">
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {NOTIFICATION_ITEMS.map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4 py-2 border-b border-border/30 last:border-0 pb-3 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">{item.label}</p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                  <Switch
                    checked={settings?.notificationPreferences?.[item.key] ?? false}
                    onCheckedChange={(v) => handleToggle(item.key, v === true)}
                    disabled={!settings || updateNotifications.isPending}
                    className="shrink-0 data-[state=checked]:bg-magenta"
                  />
                </div>
              ))}
            </div>
          </DataCard>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <DataCard className="p-4 sm:p-6 border-border/60">
            <h3 className="text-sm sm:text-base font-bold text-foreground mb-4">Change Password</h3>
            <div className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm text-slate-700 font-semibold">Current Password</Label>
                  <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="mt-1 h-10 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm text-slate-700 font-semibold">New Password</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="mt-1 h-10 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs sm:text-sm text-slate-700 font-semibold">Confirm New Password</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 h-10 focus-visible:ring-magenta rounded-xl text-xs sm:text-sm" />
                </div>
              </div>
              <Button
                className="bg-magenta text-white hover:bg-magenta/90 w-full sm:w-auto h-10 rounded-xl font-semibold text-xs sm:text-sm px-5"
                onClick={handleUpdatePassword}
                disabled={!currentPassword || !newPassword || !confirmPassword || changePassword.isPending}
              >
                {changePassword.isPending ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </DataCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
