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
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useChangePassword, useUpdateAccount } from "@/hooks/queries/useStudent";

export default function StudentSettingsPage() {
  const { data: user, isLoading } = useCurrentUser();
  const userId = (user as any)?.id || (user as any)?._id;
  const updateAccount = useUpdateAccount(userId);
  const changePassword = useChangePassword();

  // Account form
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? "");
      setPhone(user.phone ?? "");
    }
  }, [user]);

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveAccount = () => {
    updateAccount.mutate({ fullName: fullName || undefined, phone: phone || undefined });
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
        onSuccess: (res) => {
          if (res.success) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-3xl">
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
              <div>
                <Label>Full Name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1.5"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={user?.email ?? ""}
                  type="email"
                  className="mt-1.5"
                  disabled
                  readOnly
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Email cannot be changed here.
                </p>
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  className="mt-1.5"
                  disabled={isLoading}
                />
              </div>
              <Button
                className="bg-magenta text-white hover:bg-magenta/90"
                onClick={handleSaveAccount}
                disabled={isLoading || updateAccount.isPending}
              >
                {updateAccount.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DataCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <DataCard>
            <h3 className="font-bold text-foreground mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { label: "Course updates", desc: "New lessons and content updates" },
                { label: "Session reminders", desc: "Upcoming bootcamp and mentor sessions" },
                { label: "Marketing emails", desc: "New courses, offers, and events" },
                { label: "Weekly progress report", desc: "Summary of your learning activity" },
              ].map((item) => (
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
            <div className="space-y-4 max-w-md">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <Button
                className="bg-magenta text-white hover:bg-magenta/90"
                onClick={handleUpdatePassword}
                disabled={
                  changePassword.isPending ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
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
