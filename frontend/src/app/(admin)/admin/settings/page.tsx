"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAdminRole } from "@/hooks/useAdminRole";
import { AccessDenied } from "@/components/admin/AccessDenied";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, Mail, Bell, Shield } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: any;
  description: string | null;
}

const defaultSettings = {
  site_name: "GrowthCraft",
  site_tagline: "Transform Your Career with Industry-Ready Skills",
  contact_email: "info@growthcraft.in",
  contact_phone: "+91-9395303089",
  contact_address: "43, JB Road, Kanwachal, Silpukhuri, Guwahati, Assam, India (781005)",
  social_linkedin: "",
  social_twitter: "",
  social_instagram: "",
  social_youtube: "",
  notifications_email: true,
  notifications_sms: false,
  maintenance_mode: false,
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { isSuperAdmin } = useAdminRole();

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API fetch delay
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSettings(defaultSettings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setSettings(defaultSettings);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (key: string, value: any) => {
    setIsSaving(true);
    try {
      // Simulate API save delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      setSettings((prev) => ({ ...prev, [key]: value }));
      toast.success("Setting saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Error saving setting");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMultiple = async (items: Record<string, any>) => {
    setIsSaving(true);
    try {
      // Simulate API save delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSettings((prev) => ({ ...prev, ...items }));
      toast.success("Settings saved successfully");
    } catch (error: any) {
      toast.error(error.message || "Error saving settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <AccessDenied
        title="Settings — Restricted"
        description="Platform settings control critical system behaviour and are only accessible to Super Administrators."
      />
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage platform settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4 md:space-y-6">
        <div className="w-full overflow-x-auto pb-1">
          <TabsList className="inline-flex w-max md:w-auto">
            <TabsTrigger value="general" className="gap-2">
              <Settings className="h-4 w-4" />
              General
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Globe className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="advanced" className="gap-2">
              <Shield className="h-4 w-4" />
              Advanced
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic site configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  value={settings.site_name || ""}
                  onChange={(e) => handleChange("site_name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_tagline">Tagline</Label>
                <Textarea
                  id="site_tagline"
                  value={settings.site_tagline || ""}
                  onChange={(e) => handleChange("site_tagline", e.target.value)}
                  rows={2}
                />
              </div>
              <Button
                onClick={() => {
                  handleSaveMultiple({
                    site_name: settings.site_name,
                    site_tagline: settings.site_tagline,
                  });
                }}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Public contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={settings.contact_email || ""}
                    onChange={(e) => handleChange("contact_email", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Phone</Label>
                  <Input
                    id="contact_phone"
                    value={settings.contact_phone || ""}
                    onChange={(e) => handleChange("contact_phone", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_address">Address</Label>
                <Textarea
                  id="contact_address"
                  value={settings.contact_address || ""}
                  onChange={(e) => handleChange("contact_address", e.target.value)}
                  rows={2}
                />
              </div>
              <Button
                onClick={() => {
                  handleSaveMultiple({
                    contact_email: settings.contact_email,
                    contact_phone: settings.contact_phone,
                    contact_address: settings.contact_address,
                  });
                }}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>Social media profile links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                  <Input
                    id="social_linkedin"
                    value={settings.social_linkedin || ""}
                    onChange={(e) => handleChange("social_linkedin", e.target.value)}
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter URL</Label>
                  <Input
                    id="social_twitter"
                    value={settings.social_twitter || ""}
                    onChange={(e) => handleChange("social_twitter", e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram URL</Label>
                  <Input
                    id="social_instagram"
                    value={settings.social_instagram || ""}
                    onChange={(e) => handleChange("social_instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_youtube">YouTube URL</Label>
                  <Input
                    id="social_youtube"
                    value={settings.social_youtube || ""}
                    onChange={(e) => handleChange("social_youtube", e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  handleSaveMultiple({
                    social_linkedin: settings.social_linkedin,
                    social_twitter: settings.social_twitter,
                    social_instagram: settings.social_instagram,
                    social_youtube: settings.social_youtube,
                  });
                }}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.notifications_email}
                  onCheckedChange={(checked) => {
                    handleChange("notifications_email", checked);
                    handleSave("notifications_email", checked);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch
                  checked={settings.notifications_sms}
                  onCheckedChange={(checked) => {
                    handleChange("notifications_sms", checked);
                    handleSave("notifications_sms", checked);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Advanced configuration options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable to show maintenance page to visitors</p>
                </div>
                <Switch
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => {
                    handleChange("maintenance_mode", checked);
                    handleSave("maintenance_mode", checked);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
