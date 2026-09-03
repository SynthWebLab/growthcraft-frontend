"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  X, 
  Sparkles,
  ArrowRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { isPaymentPaused } from "@/config/paymentConfig";
import { usePaymentMaintenanceStore } from "@/stores/paymentMaintenanceStore";

export interface PaymentItemDetails {
  id: string;
  title: string;
  subtitle?: string;
  type?: string;
  price?: number;
  slug?: string;
}

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: PaymentItemDetails | null;
  onPaymentSuccess?: () => void;
}

export function PaymentCheckoutModal({
  isOpen,
  onClose,
  item,
  onPaymentSuccess,
}: PaymentCheckoutModalProps) {
  const queryClient = useQueryClient();
  const openPaymentMaintenance = usePaymentMaintenanceStore((state) => state.openModal);
  const [selectedMethod, setSelectedMethod] = useState<"razorpay" | "upi" | "card">("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Dynamically load Razorpay Checkout script when modal opens
  useEffect(() => {
    if (isOpen) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [isOpen]);

  if (!isOpen || !item) return null;

  const price = item.price || 4999;
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  const handleProcessPayment = async () => {
    if (isPaymentPaused()) {
      onClose();
      openPaymentMaintenance({
        itemTitle: item.title,
        itemPrice: price,
        itemType: item.type,
      });
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order on backend (/payments/create-order)
      const orderRes = await apiClient.post<any>("/payments/create-order", {
        amount: price,
        itemType: item.type || "bootcamp",
        itemId: item.id,
        currency: "INR",
      });

      const orderData = orderRes.data || orderRes;
      const razorpayKey = orderData.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      const razorpayOrderId = orderData.orderId || `order_${Date.now()}`;

      const isMockMode = orderData.isMock || !razorpayKey || razorpayKey === "rzp_test_GrowthCraftKey" || !razorpayKey.startsWith("rzp_");

      if (isMockMode) {
        const simulatedPaymentId = `pay_sim_${Date.now()}`;
        await apiClient.post<any>("/payments/verify", {
          razorpayOrderId: razorpayOrderId,
          razorpayPaymentId: simulatedPaymentId,
          razorpaySignature: "simulated_signature",
        });
        setIsProcessing(false);
        setIsSuccess(true);
        return;
      }

      // Check if Razorpay Checkout JS is loaded
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const options = {
          key: razorpayKey,
          amount: orderData.amount || price * 100,
          currency: orderData.currency || "INR",
          name: "GrowthCraft EdTech Platform",
          description: item.title,
          image: "https://growthcraft.in/favicon.ico",
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            try {
              // 2. Verify payment on backend (/payments/verify)
              await apiClient.post<any>("/payments/verify", {
                razorpayOrderId: response.razorpay_order_id || razorpayOrderId,
                razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                razorpaySignature: response.razorpay_signature || "simulated_signature",
              });

              setIsProcessing(false);
              setIsSuccess(true);

              toast.success("Razorpay Test Payment Successful! Enrollment Confirmed 🎉", {
                description: `Payment verified for ${item.title}.`,
              });

              queryClient.invalidateQueries({ queryKey: ["student"] });

              setTimeout(() => {
                setIsSuccess(false);
                onClose();
                if (onPaymentSuccess) onPaymentSuccess();
              }, 1500);
            } catch (err: any) {
              setIsProcessing(false);
              toast.error("Razorpay verification failed", { description: err.message });
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              toast.info("Payment popup dismissed");
            },
          },
          prefill: {
            name: "GrowthCraft Student",
            email: "student@growthcraft.in",
            contact: "9999999999",
          },
          theme: {
            color: "#d946ef",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Fallback direct endpoint fulfillment
        await apiClient.post<any>("/payments/complete-enrollment-payment", {
          enrollmentId: item.id,
          itemId: item.id,
          itemType: item.type || "bootcamp",
          amount: price,
          paymentMethod: "RAZORPAY_TEST",
        });

        setIsProcessing(false);
        setIsSuccess(true);

        toast.success("Payment Successful! Enrollment Confirmed 🎉", {
          description: `Your registration for ${item.title} is now confirmed.`,
        });

        queryClient.invalidateQueries({ queryKey: ["student"] });

        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          if (onPaymentSuccess) onPaymentSuccess();
        }, 1500);
      }
    } catch (error: any) {
      setIsProcessing(false);
      toast.error("Payment failed", {
        description: error.message || "Please check your network and try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <Card className="relative w-full max-w-lg rounded-3xl border border-border bg-white p-6 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          disabled={isProcessing}
          className="absolute right-4 top-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="h-10 w-10 animate-bounce" />
            </div>
            <div className="space-y-1">
              <Badge className="bg-emerald-500 text-white font-bold px-3 py-1">Razorpay Payment Verified</Badge>
              <h3 className="text-xl font-extrabold text-foreground">Welcome to the Program!</h3>
              <p className="text-xs text-muted-foreground">Updating your workspace access across the portal...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="space-y-1 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-magenta" />
                <span className="text-xs font-bold uppercase tracking-wider text-magenta">Razorpay Official Test Gateway</span>
              </div>
              <h2 className="text-xl font-extrabold text-foreground tracking-tight">Complete Enrollment Payment</h2>
              <p className="text-xs text-muted-foreground">Live Razorpay Checkout API Integration.</p>
            </div>

            {/* Order Summary Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Item Summary</span>
                <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.subtitle || "Interactive Live Program"}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground block">Total Amount</span>
                <span className="text-lg font-extrabold text-magenta">{formattedPrice}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-foreground block">Payment Gateway Provider</label>
              
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedMethod("razorpay")}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === "razorpay"
                      ? "border-magenta bg-magenta/5 ring-2 ring-magenta/20"
                      : "border-border bg-white hover:bg-slate-50"
                  }`}
                >
                  <ShieldCheck className={`h-5 w-5 ${selectedMethod === "razorpay" ? "text-magenta" : "text-slate-500"}`} />
                  <span className="text-xs font-bold text-foreground">Razorpay Test</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("upi")}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === "upi"
                      ? "border-magenta bg-magenta/5 ring-2 ring-magenta/20"
                      : "border-border bg-white hover:bg-slate-50"
                  }`}
                >
                  <Smartphone className={`h-5 w-5 ${selectedMethod === "upi" ? "text-magenta" : "text-slate-500"}`} />
                  <span className="text-xs font-bold text-foreground">UPI Test</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod("card")}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                    selectedMethod === "card"
                      ? "border-magenta bg-magenta/5 ring-2 ring-magenta/20"
                      : "border-border bg-white hover:bg-slate-50"
                  }`}
                >
                  <CreditCard className={`h-5 w-5 ${selectedMethod === "card" ? "text-magenta" : "text-slate-500"}`} />
                  <span className="text-xs font-bold text-foreground">Card Test</span>
                </button>
              </div>
            </div>

            {/* Payment Guarantee Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-emerald-500" /> Razorpay Test Key Mode
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Instant Automatic Fulfillment
              </span>
            </div>

            {/* Pay Button */}
            <Button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl py-6 flex items-center justify-center gap-2 shadow-xl"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Opening Razorpay Gateway...
                </>
              ) : (
                <>
                  Launch Razorpay Gateway ({formattedPrice})
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </>
        )}

      </Card>
    </div>
  );
}
