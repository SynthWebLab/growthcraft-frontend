"use client";

import { useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { useRequestUpgrade } from "@/hooks/queries/useCollege";
import type { PartnershipTier } from "@/types/college";

interface UpgradeTierButtonProps {
  currentTier: string;
  nextTier: PartnershipTier | null;
}

const UpgradeTierButton = ({ currentTier, nextTier }: UpgradeTierButtonProps) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useRequestUpgrade();

  if (!nextTier) {
    return (
      <Button size="sm" variant="outline" disabled className="w-fit h-10 rounded-xl font-semibold px-5">
        <Sparkles className="h-4 w-4 mr-1" /> Highest Tier
      </Button>
    );
  }

  const handleConfirm = () => {
    mutate(
      { requestedTier: nextTier },
      { onSuccess: () => setOpen(false) }
    );
  };

  return (
    <>
      <Button
        className="bg-magenta hover:bg-magenta/90 text-white w-fit h-10 rounded-xl font-semibold px-5"
        size="sm"
        onClick={() => setOpen(true)}
      >
        <ArrowUpRight className="h-4 w-4 mr-1.5" /> Upgrade Tier
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
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button
              className="bg-magenta hover:bg-magenta/90 text-white"
              onClick={handleConfirm}
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Confirm Request"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpgradeTierButton;
