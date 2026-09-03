"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  ShieldAlert,
} from "lucide-react";
import { usePaymentMaintenanceStore } from "@/stores/paymentMaintenanceStore";

export const PaymentMaintenanceModal: React.FC = () => {
  const { isOpen, closeModal, itemTitle, itemPrice } = usePaymentMaintenanceStore();

  const formattedPrice = itemPrice
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(itemPrice)
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-lg bg-card border border-border shadow-2xl p-6 sm:p-7 rounded-2xl">
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0 shadow-inner">
              <ShieldAlert className="h-7 w-7 text-amber-500 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-[11px] font-semibold px-2.5 py-0.5"
                >
                  Scheduled Gateway Maintenance
                </Badge>
              </div>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                Online Payments Temporarily Paused
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                We are currently upgrading our payment processing systems to bring you a faster and more secure checkout experience. Direct online card/UPI payments are temporarily offline while maintenance is underway.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Selected Item Summary (if applicable) */}
        {itemTitle && (
          <div className="p-3.5 rounded-xl bg-muted/60 border border-border/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Selected Program
              </span>
              <p className="font-semibold text-foreground truncate max-w-[240px] sm:max-w-[280px]">
                {itemTitle}
              </p>
            </div>
            {formattedPrice && (
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                  Amount
                </span>
                <span className="font-bold text-primary text-sm">{formattedPrice}</span>
              </div>
            )}
          </div>
        )}

        {/* Ways to Proceed */}
        <div className="space-y-3 pt-1">
          <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
            How to secure your seat right now:
          </p>

          <div className="grid gap-2.5">
            {/* Campus offline option */}
            <div className="p-3.5 rounded-xl border border-border bg-background/50 flex items-start gap-3 hover:border-primary/40 transition-colors">
              <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="space-y-0.5 text-left">
                <h4 className="text-xs font-bold text-foreground">Pay Offline on Campus</h4>
                <p className="text-[11px] text-muted-foreground leading-normal">
                  Connect with your GrowthCraft campus representative or mentor to complete registration via offline campus receipt or cash/cheque.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-border flex flex-col-reverse sm:flex-row gap-2.5 justify-end">
          <Button
            type="button"
            variant="default"
            onClick={closeModal}
            className="w-full sm:w-auto px-6 py-2 rounded-xl text-xs font-semibold"
          >
            Understood
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

