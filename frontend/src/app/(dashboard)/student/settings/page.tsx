"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageHeader from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";

export default function StudentSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Settings"
        description="Manage your account preferences"
      />

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-4 space-y-4">
          <DataCard>
            <h3 className="font-bold text-foreground mb-4">
              Account Information
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input defaultValue="Student User" className="mt-1.5" />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  defaultValue="student@example.com"
                  type="email"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  defaultValue="+91 98765 43210"
                  type="tel"
                  className="mt-1.5"
                />
              </div>
              <Button className="bg-magenta text-white hover:bg-magenta/90">
                Save Changes
              </Button>
            </div>
          </DataCard>

          <DataCard>
            <h3 className="font-bold text-foreground mb-4">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Permanently delete your account and all associated data.
            </p>
            <Button variant="destructive" size="sm">
              Delete Account
            </Button>
          </DataCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <DataCard>
            <h3 className="font-bold text-foreground mb-4">
              Notification Preferences
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Course updates",
                  desc: "New lessons and content updates",
                },
                {
                  label: "Session reminders",
                  desc: "Upcoming bootcamp and mentor sessions",
                },
                {
                  label: "Marketing emails",
                  desc: "New courses, offers, and events",
                },
                {
                  label: "Weekly progress report",
                  desc: "Summary of your learning activity",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
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
                <Input type="password" className="mt-1.5" />
              </div>
              <div>
                <Label>New Password</Label>
                <Input type="password" className="mt-1.5" />
              </div>
              <div>
                <Label>Confirm New Password</Label>
                <Input type="password" className="mt-1.5" />
              </div>
              <Button className="bg-magenta text-white hover:bg-magenta/90">
                Update Password
              </Button>
            </div>
          </DataCard>
        </TabsContent>

        <TabsContent value="billing" className="mt-4">
          <DataCard>
            <h3 className="font-bold text-foreground mb-4">Current Plan</h3>
            <div className="p-4 rounded-lg border border-border bg-marble">
              <p className="font-semibold text-foreground">Free Plan</p>
              <p className="text-sm text-muted-foreground mt-1">
                Access to free courses and limited bootcamp previews.
              </p>
            </div>
            <Button variant="outline" className="mt-4">
              Upgrade Plan
            </Button>
          </DataCard>

          <DataCard className="mt-4">
            <h3 className="font-bold text-foreground mb-4">Payment History</h3>
            <p className="text-sm text-muted-foreground">
              No payments recorded yet.
            </p>
          </DataCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
