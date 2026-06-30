"use client";

import { Award, Copy, Check, Facebook, Twitter, MessageSquare, Linkedin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import DataCard from "@/components/ui/data-card";
import { PageHeader } from "@/components/ui/page-header";
import { toast } from "sonner";

export default function AmbassadorSharePage() {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://growthcraft.in/courses");
    setCopiedLink(true);
    toast.success("General catalogue link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Share & Earn"
        description="Tips and resources on how to maximize your conversions and make the most out of your Ambassador status."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Promotion tips */}
        <DataCard>
          <h2 className="text-lg font-bold font-display mb-4 text-foreground flex items-center gap-2">
            <Award className="h-5 w-5 text-magenta" /> How to Promote
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-1">1. Share in College WhatsApp Groups</h3>
              <p>Post your custom referral links in your batch or department groups when fellow students ask for training program recommendations.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">2. Publish on LinkedIn</h3>
              <p>Write about your own learning journey at GrowthCraft and attach your referral link to guide prospective students.</p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">3. Talk directly to peers</h3>
              <p>Offline EdTech delivery is word-of-mouth heavy. Recommend programs during group studies or college meetups.</p>
            </div>
          </div>
        </DataCard>

        {/* Quick Social Shares */}
        <DataCard className="flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold font-display mb-4 text-foreground">Quick Share Assets</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Use these social options to share the general course catalogue. Remember to use specific link generators from your Dashboard for tracking!
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleCopyLink}>
                {copiedLink ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />} Copy Catalogue Link
              </Button>
              <Button variant="outline" className="flex items-center gap-2 text-blue-600 hover:text-blue-700" onClick={() => toast.success("Sharing option not implemented in dev environment")}>
                <Linkedin className="h-4 w-4" /> LinkedIn
              </Button>
              <Button variant="outline" className="flex items-center gap-2 text-green-600 hover:text-green-700" onClick={() => toast.success("Sharing option not implemented in dev environment")}>
                <MessageSquare className="h-4 w-4" /> WhatsApp
              </Button>
              <Button variant="outline" className="flex items-center gap-2 text-sky-500 hover:text-sky-600" onClick={() => toast.success("Sharing option not implemented in dev environment")}>
                <Twitter className="h-4 w-4" /> Twitter
              </Button>
            </div>
          </div>
        </DataCard>
      </div>
    </div>
  );
}
