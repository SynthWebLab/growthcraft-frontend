"use client";

import React, { useState } from "react";
import { useRazorpayCheckout, CheckoutOptions } from "@/hooks/useRazorpayCheckout";
import { Loader2, CreditCard, CheckCircle, AlertCircle } from "lucide-react";

interface RazorpayPayButtonProps extends CheckoutOptions {
  buttonText?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "accent";
}

export const RazorpayPayButton: React.FC<RazorpayPayButtonProps> = ({
  amount,
  itemType,
  itemId,
  title,
  description,
  prefill,
  onSuccess,
  onError,
  buttonText,
  className = "",
  variant = "primary",
}) => {
  const { openCheckout, isLoading } = useRazorpayCheckout();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePay = () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    openCheckout({
      amount,
      itemType,
      itemId,
      title,
      description,
      prefill,
      onSuccess: (paymentId) => {
        setSuccessMsg(`Payment successful! ID: ${paymentId}`);
        if (onSuccess) onSuccess(paymentId);
      },
      onError: (msg) => {
        setErrorMsg(msg || "Payment failed");
        if (onError) onError(msg);
      },
    });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return "bg-slate-800 hover:bg-slate-900 text-white shadow-md hover:shadow-lg";
      case "outline":
        return "border border-slate-700 hover:border-slate-500 text-slate-200 bg-transparent";
      case "accent":
        return "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-md shadow-emerald-500/20";
      case "primary":
      default:
        return "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20";
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        type="button"
        onClick={handlePay}
        disabled={isLoading}
        className={`relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${getVariantStyles()} ${className}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-current" />
            <span>Processing Order...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            <span>{buttonText || `Pay ₹${amount.toLocaleString("en-IN")}`}</span>
          </>
        )}
      </button>

      {successMsg && (
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 p-2.5 rounded-lg animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs font-medium text-rose-400 bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-lg animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
