"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Loader2,
  Layers,
} from "lucide-react";
import { useBuyCollegeEvent, useVerifyCollegeEventPayment, useCollegeCohort, useCollegeDashboard } from "@/hooks/queries/useCollege";
import { toast } from "sonner";

interface CollegeCohortReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  unitPrice: number;
  mode?: string;
}

export function CollegeCohortReservationModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  unitPrice,
  mode = "Hybrid",
}: CollegeCohortReservationModalProps) {
  const { data: cohortData } = useCollegeCohort();
  const { data: dashboardData } = useCollegeDashboard();

  const collegeName = (dashboardData as any)?.data?.collegeName || (dashboardData as any)?.collegeName || "College Partner";
  const activeStudents = (cohortData as any)?.used || (cohortData as any)?.data?.used || 0;
  const cohortLimit = (cohortData as any)?.limit || (cohortData as any)?.data?.limit || null;

  const [cohortName, setCohortName] = useState(`${collegeName} Cohort A`);
  const [seatCount, setSeatCount] = useState(activeStudents > 0 ? Math.min(activeStudents, 50) : 5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const buyCollegeEvent = useBuyCollegeEvent();
  const verifyCollegeEventPayment = useVerifyCollegeEventPayment();

  const effectiveUnitPrice = unitPrice > 0 ? unitPrice : 4999;
  const totalAmount = seatCount * effectiveUnitPrice;

  const handleSeatCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    setSeatCount(Math.max(1, Math.min(150, val)));
  };

  const handleReserveAndPay = async () => {
    if (!cohortName.trim()) {
      toast.error("Please enter a Cohort Name");
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Create order on backend
      const response = await buyCollegeEvent.mutateAsync({
        eventId,
        batchId: cohortName,
        amount: totalAmount,
      });

      const orderData = (response as any)?.data || response;
      if (!orderData || !orderData.orderId) {
        throw new Error("Failed to generate order ID from backend.");
      }

      // 2. Load Razorpay SDK
      if (typeof window === "undefined") return;
      if (!(window as any).Razorpay) {
        const loaded = await new Promise<boolean>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
        if (!loaded) {
          throw new Error("Failed to load Razorpay SDK.");
        }
      }

      // 3. Configure Razorpay modal
      const razorpayOptions: any = {
        key: orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount || totalAmount * 100,
        currency: orderData.currency || "INR",
        name: "GrowthCraft College Partner",
        description: `Reserve ${seatCount} Seats - ${eventTitle} (Cohort: ${cohortName})`,
        order_id: orderData.orderId,
        handler: async (res: any) => {
          try {
            await verifyCollegeEventPayment.mutateAsync({
              razorpayOrderId: res.razorpay_order_id,
              razorpayPaymentId: res.razorpay_payment_id,
              razorpaySignature: res.razorpay_signature,
            });
            setPaymentSuccess(true);
            toast.success("Seats Reserved Successfully!", {
              description: `${seatCount} seats unlocked for cohort "${cohortName}".`,
            });
          } catch (err: any) {
            toast.error("Verification Error", {
              description: err?.message || "Failed to confirm payment.",
            });
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info("Payment cancelled");
          },
        },
      };

      const rzp = new (window as any).Razorpay(razorpayOptions);
      rzp.open();
    } catch (error: any) {
      setIsProcessing(false);
      toast.error("Checkout Failed", {
        description: error?.message || "Could not launch payment gateway.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border border-border bg-card shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-medium text-xs uppercase tracking-wider mb-1">
            <Building2 className="h-4 w-4" />
            <span>College Partner Portal</span>
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Reserve Cohort Seats
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Select or enter cohort details and reserve seats for your students in{" "}
            <span className="font-semibold text-foreground">{eventTitle}</span>.
          </DialogDescription>
        </DialogHeader>

        {paymentSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Reservation Confirmed!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {seatCount} seats have been reserved for cohort <span className="font-medium text-foreground">"{cohortName}"</span>.
              </p>
            </div>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onClose}>
              Done & View Cohort Dashboard
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            {/* Event Summary Card */}
            <div className="p-3.5 rounded-xl bg-muted/50 border border-border/60 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Selected Event</p>
                <p className="text-sm font-semibold text-foreground line-clamp-1">{eventTitle}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] bg-background">
                    {mode}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ₹{effectiveUnitPrice.toLocaleString("en-IN")} / seat
                  </span>
                </div>
              </div>
              <Sparkles className="h-5 w-5 text-primary opacity-80" />
            </div>

            {/* Cohort Name Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span>Cohort Name / Identifier</span>
              </Label>
              <Input
                placeholder="e.g. CS 2026 Batch A"
                value={cohortName}
                onChange={(e) => setCohortName(e.target.value)}
                className="h-10 text-sm"
              />
              <p className="text-[11px] text-muted-foreground">
                Group student access under this cohort in your college portal.
              </p>
            </div>

            {/* Seat Count Input */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span>Number of Student Seats</span>
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={150}
                  value={seatCount}
                  onChange={handleSeatCountChange}
                  className="h-10 text-sm font-medium w-32"
                />
                <div className="flex gap-1.5">
                  {[5, 10, 25, 50].map((count) => (
                    <Button
                      key={count}
                      type="button"
                      variant={seatCount === count ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs px-2.5"
                      onClick={() => setSeatCount(count)}
                    >
                      {count} seats
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{seatCount} Seats × ₹{effectiveUnitPrice.toLocaleString("en-IN")}</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-foreground border-t border-primary/10 pt-2">
                <span>Total Investment</span>
                <span className="text-base text-primary font-bold">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                <span>Instant Razorpay Payment & Automatic Cohort Access</span>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                className="bg-magenta hover:bg-magenta/90 text-white font-semibold flex-1"
                onClick={handleReserveAndPay}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                    Opening Razorpay...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4 inline" />
                    Pay ₹{totalAmount.toLocaleString("en-IN")} via Razorpay
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
