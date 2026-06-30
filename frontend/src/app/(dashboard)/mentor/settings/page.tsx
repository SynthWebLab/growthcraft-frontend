"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { useMentorProfile, useUpdateMentorAccount, useChangeMentorPassword } from "@/hooks/queries/useMentor";
import { toast } from "sonner";

const notificationPrefs = [
  { label: "Session requests", desc: "New session booking requests from students" },
  { label: "Session reminders", desc: "Upcoming scheduled mentoring sessions" },
  { label: "Payout updates", desc: "Earnings and monthly payout notifications" },
  { label: "Marketing emails", desc: "Platform news, features, and offers" },
];

const SettingsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-2">
      <div className="h-8 w-48 bg-muted/40 rounded" />
      <div className="h-4 w-80 bg-muted/40 rounded" />
    </div>
    <div className="h-96 bg-muted/40 rounded-xl" />
  </div>
);

export default function MentorSettingsPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: profileResponse, isLoading, error } = useMentorProfile();
  const { mutate: updateAccount, isPending: isSavingProfile } = useUpdateMentorAccount();
  const { mutate: changePassword, isPending: isSavingPassword } = useChangeMentorPassword();

  const profile = profileResponse?.data?.profile;

  useEffect(() => {
    if (profile) {
      const userDoc = profile.userId && typeof profile.userId === "object" ? profile.userId : {};
      setFullName(userDoc.fullName || profile.fullName || "");
      setPhone(userDoc.phone || profile.phone || "");
    }
  }, [profile]);

  const handleSaveAccount = () => {
    if (!fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    updateAccount({ fullName, phone });
  };

  const handleUpdatePassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "New password and confirmation must be the same.",
      });
      return;
    }
    changePassword(
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
    return <SettingsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <p className="text-red-500 font-medium">Failed to load settings</p>
        <p className="text-sm text-muted-foreground">
          {(error as any)?.message || "Please check your connection to the server."}
        </p>
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
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={(profile?.userId as any)?.email || profile?.email || ""}
                    type="email"
                    className="mt-1.5"
                    disabled
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed here.</p>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    className="mt-1.5"
                  />
                </div>
              </div>
              <Button
                className="bg-magenta text-white hover:bg-magenta/90"
                onClick={handleSaveAccount}
                disabled={isSavingProfile}
              >
                {isSavingProfile ? "Saving..." : "Save Changes"}
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
                  <Label htmlFor="currPass">Current Password</Label>
                  <Input
                    id="currPass"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="newPass">New Password</Label>
                  <Input
                    id="newPass"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="confPass">Confirm New Password</Label>
                  <Input
                    id="confPass"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1.5"
                  />
                </div>
              </div>
              <Button
                className="bg-magenta text-white hover:bg-magenta/90"
                onClick={handleUpdatePassword}
                disabled={isSavingPassword || !currentPassword || !newPassword || !confirmPassword}
              >
                {isSavingPassword ? "Updating Password..." : "Update Password"}
              </Button>
            </div>
          </DataCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

