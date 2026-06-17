"use client";

import { useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface UpgradeTierButtonProps {
  currentTier: string;
  nextTier: string | null;
}

const UpgradeTierButton = ({ currentTier, nextTier }: UpgradeTierButtonProps) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!nextTier) {
    return (
      <Button size="sm" variant="outline" disabled>
        <Sparkles className="h-4 w-4 mr-1" /> Highest Tier
      </Button>
    );
  }

  const handleConfirm = () => {
    setSubmitting(true);
    // No upgrade endpoint yet — acknowledge the request.
    toast.success("Upgrade request sent", {
      description: `Your request to upgrade from ${currentTier} to ${nextTier} has been sent. Your SPOC will reach out shortly.`,
    });
    setSubmitting(false);
    setOpen(false);
  };

  return (
    <>
      <Button
        className="bg-magenta hover:bg-magenta/90 text-white"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <ArrowUpRight className="h-4 w-4 mr-1" /> Upgrade Tier
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to {nextTier}</DialogTitle>
            <DialogDescription>
              You&apos;re currently on the <span className="font-medium text-foreground">{currentTier}</span> tier.
              Request an upgrade to <span className="font-medium text-foreground">{nextTier}</span> and your
              partnership manager will confirm the details and pricing with you.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button
              className="bg-magenta hover:bg-magenta/90 text-white"
              onClick={handleConfirm}
              disabled={submitting}
            >
              Confirm Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpgradeTierButton;
