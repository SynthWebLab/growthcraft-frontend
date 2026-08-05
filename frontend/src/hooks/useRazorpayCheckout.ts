"use client";

import { useState } from "react";
import { useCreatePaymentOrder, useVerifyPayment } from "./queries/usePayment";

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export interface CheckoutOptions {
  amount: number;
  itemType: "course" | "bootcamp" | "workshop" | "hackathon" | "training-program" | "enrollment" | "reservation";
  itemId: string;
  title?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess?: (paymentId: string) => void;
  onError?: (errorMsg: string) => void;
}

export function useRazorpayCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const createOrderMutation = useCreatePaymentOrder();
  const verifyPaymentMutation = useVerifyPayment();

  const openCheckout = async (options: CheckoutOptions) => {
    try {
      setIsLoading(true);

      // 1. Load Razorpay JS SDK script
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load. Please check your internet connection.");
      }

      // 2. Create order on backend
      const order = await createOrderMutation.mutateAsync({
        amount: options.amount,
        itemType: options.itemType,
        itemId: options.itemId,
      });

      const keyId = order.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      // 3. Configure Razorpay modal options
      const razorpayOptions: any = {
        key: keyId,
        amount: order.amount,
        currency: order.currency || "INR",
        name: options.title || "GrowthCraft",
        description: options.description || `Payment for ${options.itemType}`,
        order_id: order.orderId,
        prefill: {
          name: options.prefill?.name || "",
          email: options.prefill?.email || "",
          contact: options.prefill?.contact || "",
        },
        theme: {
          color: "#0F172A", // GrowthCraft dark slate theme
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            setIsLoading(true);
            const verifyResult = await verifyPaymentMutation.mutateAsync({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyResult.success) {
              if (options.onSuccess) {
                options.onSuccess(response.razorpay_payment_id);
              }
            } else {
              if (options.onError) {
                options.onError("Payment verification failed.");
              }
            }
          } catch (err: any) {
            if (options.onError) {
              options.onError(err.message || "Payment verification failed.");
            }
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            if (options.onError) {
              options.onError("Payment was cancelled or closed.");
            }
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(razorpayOptions);
      razorpayInstance.open();
    } catch (err: any) {
      setIsLoading(false);
      if (options.onError) {
        options.onError(err.message || "Failed to initiate checkout");
      }
    }
  };

  return {
    openCheckout,
    isLoading: isLoading || createOrderMutation.isPending || verifyPaymentMutation.isPending,
  };
}
