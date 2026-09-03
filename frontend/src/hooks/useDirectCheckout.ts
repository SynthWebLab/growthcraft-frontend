"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { useRegisterBootcamp } from "@/hooks/queries/useBootcamps";
import { useRegisterWorkshop } from "@/hooks/queries/useWorkshops";
import { useRegisterHackathon } from "@/hooks/queries/useHackathons";
import { useEnrollCourse } from "@/hooks/queries/useCourses";
import { useEnrollInTrainingProgram } from "@/hooks/queries/useTrainingPrograms";
import { isPaymentPaused } from "@/config/paymentConfig";
import { usePaymentMaintenanceStore } from "@/stores/paymentMaintenanceStore";

export type DirectCheckoutItemType =
  | "course"
  | "bootcamp"
  | "workshop"
  | "hackathon"
  | "training-program";

interface DirectCheckoutParams {
  itemId: string;
  itemType: DirectCheckoutItemType;
  itemTitle: string;
  price: number;
  onEnrolled?: () => void;
}

// Confetti burst for successful checkout
function triggerConfetti() {
  if (typeof window === "undefined") return;
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "9999";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d")!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ["#EC4899", "#8B5CF6", "#3B82F6", "#10B981", "#F59E0B"];
  const particles = Array.from({ length: 120 }, () => ({
    x: canvas.width / 2,
    y: canvas.height - 20,
    vx: (Math.random() - 0.5) * 22,
    vy: -Math.random() * 22 - 12,
    r: Math.random() * 6 + 4,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));

  let frames = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.5;
      p.vx *= 0.98;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    frames++;
    if (frames < 140) {
      requestAnimationFrame(animate);
    } else {
      document.body.removeChild(canvas);
    }
  }
  animate();
}

/**
 * Hook for direct checkout flow — skips the popup form.
 *
 * Flow:
 * 1. If user is NOT logged in → redirect to /register/student?callbackUrl=...
 * 2. If user IS logged in → enroll via API, then:
 *    a. price > 0 → open Razorpay checkout (or maintenance modal if payments are paused)
 *    b. price === 0 → show success toast + confetti
 */
export function useDirectCheckout() {
  const { data: user } = useCurrentUser();
  const { openCheckout } = useRazorpayCheckout();
  const openPaymentMaintenance = usePaymentMaintenanceStore((state) => state.openModal);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingItemId, setProcessingItemId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["student"] });
    queryClient.invalidateQueries({ queryKey: ["bootcamps"] });
    queryClient.invalidateQueries({ queryKey: ["workshops"] });
    queryClient.invalidateQueries({ queryKey: ["hackathons"] });
    queryClient.invalidateQueries({ queryKey: ["courses"] });
    queryClient.invalidateQueries({ queryKey: ["events"] });
  };

  // Registration mutations
  const bootcampRegister = useRegisterBootcamp();
  const workshopRegister = useRegisterWorkshop();
  const hackathonRegister = useRegisterHackathon();
  const courseEnroll = useEnrollCourse();
  const trainingProgramEnroll = useEnrollInTrainingProgram();

  const checkout = async ({ itemId, itemType, itemTitle, price, onEnrolled }: DirectCheckoutParams) => {
    // If online payments are paused and this is a paid item, open maintenance modal
    if (isPaymentPaused() && price > 0) {
      openPaymentMaintenance({
        itemTitle,
        itemPrice: price,
        itemType,
      });
      return;
    }

    // 1. Not logged in → redirect to registration
    if (!user || !user.isEmailVerified) {
      if (typeof window !== "undefined") {
        const currentUrl = window.location.pathname + window.location.search;
        toast.info("Please register or login to continue");
        window.location.href = `/register/student?callbackUrl=${encodeURIComponent(currentUrl)}`;
      }
      return;
    }

    // 2. Restricted roles check
    if (user.role === "mentor" || user.role === "employer") {
      toast.error("This feature is reserved for students only.");
      return;
    }

    // 3. Build enrollment data from the logged-in user's profile
    const fullName = user.fullName || "Student";
    const email = user.email || "";
    const phone = user.phone || "";

    if (!email) {
      toast.error("Your profile is missing an email address. Please update your profile first.");
      return;
    }

    setIsProcessing(true);
    setProcessingItemId(itemId);

    try {
      // 4. Call the appropriate enrollment API
      let enrollRes: any;

      if (itemType === "bootcamp") {
        enrollRes = await bootcampRegister.mutateAsync({
          bootcampId: itemId,
          data: { fullName, email, phone },
        });
      } else if (itemType === "workshop") {
        enrollRes = await workshopRegister.mutateAsync({
          workshopId: itemId,
          data: { fullName, email, phone },
        });
      } else if (itemType === "hackathon") {
        enrollRes = await hackathonRegister.mutateAsync({
          hackathonId: itemId,
          data: { fullName, email, phone },
        });
      } else if (itemType === "training-program") {
        enrollRes = await trainingProgramEnroll.mutateAsync({
          programId: itemId,
          data: { fullName, email, phone },
        });
      } else {
        // course
        enrollRes = await courseEnroll.mutateAsync({
          courseId: itemId,
          data: { fullName, email, phone, collegeName: "" },
        });
      }

      invalidateQueries();

      const enrollmentObj = enrollRes?.data?.enrollment || enrollRes?.data || enrollRes;
      const status = enrollmentObj?.status || enrollmentObj?.paymentStatus;
      const isConfirmedFreeEvent = (price === 0 || !price) && (status === "confirmed" || status === "completed");

      // 5. If free event AND confirmed, confirm directly
      if (isConfirmedFreeEvent) {
        triggerConfetti();
        toast.success("Seat Reserved!", {
          description: "Your seat has been reserved. Check your email for details.",
        });
        onEnrolled?.();
        setIsProcessing(false);
        setProcessingItemId(null);
        return;
      }

      // 6. Open Razorpay checkout for paid/pending events
      const enrollmentId = enrollmentObj?._id || enrollmentObj?.id || itemId;

      openCheckout({
        amount: price,
        itemType: itemType as any,
        itemId: enrollmentId,
        title: itemTitle || "GrowthCraft",
        description: `Payment for ${itemTitle}`,
        prefill: {
          name: fullName,
          email,
          contact: phone,
        },
        onSuccess: (_paymentId) => {
          setIsProcessing(false);
          setProcessingItemId(null);
          triggerConfetti();
          onEnrolled?.();
          toast.success("Payment completed successfully!", {
            description: "Your seat is confirmed. Check your email for details.",
          });
          invalidateQueries();
        },
        onError: (err) => {
          setIsProcessing(false);
          setProcessingItemId(null);
          toast.error(err || "Payment cancelled or failed.");
          invalidateQueries();
        },
      });
    } catch (err: any) {
      setIsProcessing(false);
      setProcessingItemId(null);

      // Extract a human-readable message from the backend error
      const backendMsg =
        err?.response?.data?.error?.message ||
        err?.data?.error?.message ||
        err?.message ||
        "Something went wrong. Please try again.";

      // Special case: already enrolled — show info toast, not error
      const alreadyEnrolledPhrases = ["already registered", "already enrolled", "already paid"];
      const isAlreadyEnrolled = alreadyEnrolledPhrases.some((phrase) =>
        backendMsg.toLowerCase().includes(phrase)
      );

      if (isAlreadyEnrolled) {
        invalidateQueries();
        onEnrolled?.();
        toast.info("You're already registered!", {
          description: "You have already reserved a seat for this event.",
        });
      } else {
        toast.error("Checkout Failed", { description: backendMsg });
      }
    }
  };

  return { checkout, isProcessing, processingItemId };
}
