"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, Phone, GraduationCap, Briefcase, School, UserCheck, CreditCard, Landmark, CheckCircle2, Clock, Copy, RefreshCw } from "lucide-react";
import { z } from "zod";
import { FormType } from "@/lib/ctaPolicy";
import { useEnrollCourse, useRequestCallback } from "@/hooks/queries/useCourses";
import { useRegisterBootcamp, useRequestBootcampCallback } from "@/hooks/queries/useBootcamps";
import { useRegisterWorkshop, useRequestWorkshopCallback } from "@/hooks/queries/useWorkshops";
import { useRegisterHackathon, useRequestHackathonCallback } from "@/hooks/queries/useHackathons";
import { useEnrollInTrainingProgram, useRequestTrainingProgramCallback } from "@/hooks/queries/useTrainingPrograms";
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";

// Validation schemas
const enrollmentSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15),
});

const callbackSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15),
});

const enquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15),
  message: z.string().trim().min(1, "Message is required").max(1000),
  organization: z.string().optional(),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;
type CallbackFormData = z.infer<typeof callbackSchema>;
type EnquiryFormData = z.infer<typeof enquirySchema>;

interface PopupFormProps {
  isOpen: boolean;
  onClose: () => void;
  type: FormType | "enquiry" | "mentor" | "partner";
  title?: string;
  courseId?: string; // Optional: pre-select a course
  courseTitle?: string; // Optional: course title for enrollment
  itemType?: "course" | "workshop" | "bootcamp" | "hackathon" | "training-program";
  price?: number; // Actual price of the item (used for Razorpay order)
}

// Confetti burst on successful checkout
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
      p.vy += 0.5; // gravity
      p.vx *= 0.98; // drag
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

// Live expiry timer
const PopupCountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTime = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return "Hold Expired";
      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    setTimeLeft(calculateTime());
    const interval = setInterval(() => {
      setTimeLeft(calculateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return <span className="font-mono text-2xl text-amber-500 font-bold tracking-wider">{timeLeft}</span>;
};

export const PopupForm = ({ isOpen, onClose, type, title, courseId, courseTitle, itemType = "course", price }: PopupFormProps) => {
  const { data: user } = useCurrentUser();
  const isMentor = user?.role === "mentor";
  const isEmployer = user?.role === "employer";
  const isRestrictedRole = isMentor || isEmployer;
  const isStudentAction = ["enrollment", "reserve-seat", "callback", "register-interest"].includes(type);
  const isEnrollmentAction = type === "enrollment" || type === "reserve-seat";

  // Multi-step State
  const [step, setStep] = useState(1); // 1: Attendee Info, 2: Payment Choice, 3: Success/Hold screen
  const [paymentMethod, setPaymentMethod] = useState<"online" | "offline">("online");
  const [tempData, setTempData] = useState<EnrollmentFormData | null>(null);
  const [enrollmentResult, setEnrollmentResult] = useState<any>(null);
  const [isMutating, setIsMutating] = useState(false);

  const { openCheckout } = useRazorpayCheckout();

  // Reset steps on close or open
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setTempData(null);
      setEnrollmentResult(null);
      setIsMutating(false);
    }
  }, [isOpen]);

  // Mutations for enroll and callback
  const enrollMutation = useEnrollCourse();
  const bootcampRegisterMutation = useRegisterBootcamp();
  const bootcampCallbackMutation = useRequestBootcampCallback();
  const workshopRegisterMutation = useRegisterWorkshop();
  const workshopCallbackMutation = useRequestWorkshopCallback();
  const hackathonRegisterMutation = useRegisterHackathon();
  const hackathonCallbackMutation = useRequestHackathonCallback();
  const trainingProgramEnrollMutation = useEnrollInTrainingProgram();
  const trainingProgramCallbackMutation = useRequestTrainingProgramCallback();
  
  const callbackContext = type === "register-interest" ? "register-interest" : "callback";
  const callbackMutation = useRequestCallback(callbackContext);

  const getSchema = () => {
    if (isEnrollmentAction) return enrollmentSchema;
    if (type === "callback" || type === "register-interest") return callbackSchema;
    return enquirySchema;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EnrollmentFormData | CallbackFormData | EnquiryFormData>({
    resolver: zodResolver(getSchema()),
    mode: "onChange",
  });

  const getIcon = () => {
    switch (type) {
      case "enrollment": 
      case "reserve-seat":
        return <GraduationCap className="h-6 w-6" />;
      case "mentor": return <UserCheck className="h-6 w-6" />;
      case "partner": return <School className="h-6 w-6" />;
      case "callback": 
      case "register-interest":
        return <Phone className="h-6 w-6" />;
      default: return <Briefcase className="h-6 w-6" />;
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case "enrollment": return "Enroll Now";
      case "enquiry": return "Quick Enquiry";
      case "callback": return "Request Callback";
      case "register-interest": return "Register Interest";
      case "reserve-seat": return "Reserve Your Seat";
      case "mentor": return "Apply as Mentor";
      case "partner": return "Partner With Us";
      default: return "Get in Touch";
    }
  };

  const getDescription = () => {
    if (step === 2) return "Choose how you'd like to pay your program fee.";
    if (step === 3) return "Your reservation status and next steps.";
    switch (type) {
      case "enrollment": return "Fill in your details to enroll in your preferred course or bootcamp.";
      case "enquiry": return "Have questions? Send us a quick message and we'll get back to you.";
      case "callback": return "Leave your number and we'll call you back within 24 hours.";
      case "register-interest": return "Register your interest and we'll notify you when this becomes available.";
      case "reserve-seat": return "Reserve your seat now. Limited spots available!";
      case "mentor": return "Join our team of mentors and inspire the next generation.";
      case "partner": return "Let's discuss how we can collaborate with your institution.";
      default: return "";
    }
  };

  const triggerRazorpayCheckout = (enrollRes: any, contactData: EnrollmentFormData) => {
    const enrollment = enrollRes?.data?.enrollment;
    if (!enrollment?._id) return;

    // For item with price explicitly set to 0: skip Razorpay, confirm immediately
    if (price === 0) {
      triggerConfetti();
      toast.success("Registration confirmed!", {
        description: "You're registered for this event. Check your email for details.",
      });
      setEnrollmentResult({
        ...enrollRes,
        data: {
          ...enrollRes.data,
          enrollment: { ...enrollment, status: "confirmed", paymentStatus: "completed" },
        },
      });
      setStep(3);
      return;
    }

    // Determine the actual amount
    const defaultAmounts: Record<string, number> = {
      course: 4999,
      "training-program": 9999,
      workshop: 999,
      bootcamp: 4999,
      hackathon: 499,
    };
    const amount = price && price > 0 ? price : (defaultAmounts[itemType] ?? 4999);

    // Map frontend itemType to the Razorpay checkout itemType (matches backend PaymentItemType enum values)
    const razorpayItemType = itemType as "course" | "bootcamp" | "workshop" | "hackathon" | "training-program" | "enrollment" | "reservation";

    openCheckout({
      amount,
      itemType: razorpayItemType,
      itemId: enrollment._id,
      title: courseTitle || "Enrollment Fee",
      description: `Complete enrollment for ${courseTitle || "your selected program"}`,
      prefill: {
        name: contactData.name,
        email: contactData.email,
        contact: contactData.phone,
      },
      onSuccess: (paymentId) => {
        triggerConfetti();
        toast.success("Payment completed successfully!");
        setEnrollmentResult({
          ...enrollRes,
          data: {
            ...enrollRes.data,
            enrollment: {
              ...enrollment,
              status: "confirmed",
              paymentStatus: "completed",
            },
          },
        });
        setStep(3);
      },
      onError: (err) => {
        toast.error(err || "Payment cancelled or failed.");
        setEnrollmentResult(enrollRes);
        setStep(3);
      },
    });
  };

  const executeEnrollmentMutation = async (contactData: EnrollmentFormData) => {
    if (itemType === "training-program") {
      return await trainingProgramEnrollMutation.mutateAsync({
        programId: courseId!,
        data: {
          fullName: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
        },
      });
    } else if (itemType === "bootcamp") {
      return await bootcampRegisterMutation.mutateAsync({
        bootcampId: courseId!,
        data: {
          fullName: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
        },
      });
    } else if (itemType === "workshop") {
      return await workshopRegisterMutation.mutateAsync({
        workshopId: courseId!,
        data: {
          fullName: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
        },
      });
    } else if (itemType === "hackathon") {
      return await hackathonRegisterMutation.mutateAsync({
        hackathonId: courseId!,
        data: {
          fullName: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
        },
      });
    } else {
      return await enrollMutation.mutateAsync({
        courseId: courseId!,
        data: {
          fullName: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          collegeName: courseTitle || "",
        },
      });
    }
  };

  const handlePaymentConfirm = async () => {
    if (!tempData) return;
    setIsMutating(true);
    try {
      const res = await executeEnrollmentMutation(tempData);
      if (paymentMethod === "offline") {
        setEnrollmentResult(res);
        setStep(3);
      } else {
        triggerRazorpayCheckout(res, tempData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsMutating(false);
    }
  };

  const onSubmit = async (data: EnrollmentFormData | CallbackFormData | EnquiryFormData) => {
    if (isEnrollmentAction) {
      if (!courseId) {
        toast.error("Program or Course not selected. Please try again.");
        return;
      }
      setTempData(data as EnrollmentFormData);
      setStep(2);
      return;
    }

    try {
      if (type === "callback" || type === "register-interest") {
        if (!courseId) {
          toast.error("Selection missing. Please try again.");
          return;
        }

        if (itemType === "training-program") {
          await trainingProgramCallbackMutation.mutateAsync({
            programId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });
        } else if (itemType === "bootcamp") {
          await bootcampCallbackMutation.mutateAsync({
            bootcampId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });
        } else if (itemType === "workshop") {
          await workshopCallbackMutation.mutateAsync({
            workshopId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });
        } else if (itemType === "hackathon") {
          await hackathonCallbackMutation.mutateAsync({
            hackathonId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });
        } else {
          await callbackMutation.mutateAsync({
            courseId: courseId,
            data: {
              fullName: data.name,
              email: data.email,
              phone: data.phone,
            },
          });
        }
      } else {
        const payload: Record<string, any> = {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: (data as EnquiryFormData).message,
        };

        if (type === "mentor") {
          payload.source = "about_mentor";
          payload.role = "Mentor";
          payload.organization = (data as EnquiryFormData).organization;
        } else if (type === "partner") {
          payload.source = "about_partner";
          payload.role = "HiringPartner";
          payload.organization = (data as EnquiryFormData).organization;
        } else {
          payload.source = "about_enquiry";
        }

        await apiClient.post(API_ENDPOINTS.leads.create, payload);
        const msg = type === "mentor" ? "Application submitted!" : type === "partner" ? "Partnership request received!" : "Enquiry submitted!";
        toast.success(msg);
      }
      reset();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const copyReservationCode = () => {
    const id = enrollmentResult?.data?.enrollment?._id;
    if (id) {
      navigator.clipboard.writeText(id);
      toast.success("Code copied!");
    }
  };

  const retryOnlineCheckout = () => {
    if (enrollmentResult && tempData) {
      triggerRazorpayCheckout(enrollmentResult, tempData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border border-border shadow-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary text-primary-foreground">
              {getIcon()}
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight">{getTitle()}</DialogTitle>
              <DialogDescription className="mt-1">
                {getDescription()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isRestrictedRole && isStudentAction ? (
          <div className="py-6 text-center space-y-4">
            <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-semibold">
              This feature is reserved for students only. As a logged-in {user?.role === "mentor" ? "Mentor" : "Employer"}, you cannot perform this action.
            </div>
            <Button type="button" onClick={onClose} className="w-full py-5 rounded-xl">
              Close
            </Button>
          </div>
        ) : (
          <div>
            {step === 1 && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div>
                  <Input
                    placeholder="Your Name *"
                    {...register("name")}
                    className={errors.name ? "border-destructive rounded-xl" : "rounded-xl"}
                  />
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <Input
                    type="email"
                    placeholder="Email Address *"
                    {...register("email")}
                    className={errors.email ? "border-destructive rounded-xl" : "rounded-xl"}
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <Input
                    type="tel"
                    placeholder="Phone Number *"
                    {...register("phone")}
                    className={errors.phone ? "border-destructive rounded-xl" : "rounded-xl"}
                  />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                </div>

                {(type === "enquiry" || type === "mentor" || type === "partner") && (
                  <>
                    {(type === "partner" || type === "mentor") && (
                      <div>
                        <Input
                          placeholder={type === "partner" ? "Organization Name" : "Current Role/Company"}
                          {...register("organization")}
                          className="rounded-xl"
                        />
                      </div>
                    )}
                    
                    <div>
                      <Textarea
                        placeholder={type === "enquiry" ? "Your Message *" : "Tell us about yourself and your expertise"}
                        {...register("message")}
                        rows={4}
                        className={"message" in errors && errors.message ? "border-destructive rounded-xl" : "rounded-xl"}
                      />
                      {"message" in errors && errors.message && (
                        <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={onClose} className="flex-1 py-5 rounded-xl">
                    Cancel
                  </Button>
                  <Button type="submit" variant="default" className="flex-1 py-5 rounded-xl" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : isEnrollmentAction ? "Next" : "Submit"}
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-6 mt-4">
                <div className="space-y-3">
                  <div
                    onClick={() => setPaymentMethod("online")}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "online"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className={`h-5 w-5 ${paymentMethod === "online" ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">Pay Online Now</p>
                        <p className="text-xs text-muted-foreground">Instant confirmation via credit/debit card, UPI, or NetBanking</p>
                      </div>
                    </div>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === "online" ? "border-primary bg-primary" : "border-border"}`}>
                      {paymentMethod === "online" && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("offline")}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "offline"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Landmark className={`h-5 w-5 ${paymentMethod === "offline" ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">Pay Offline on Campus</p>
                        <p className="text-xs text-muted-foreground">Reserve seat now & pay cash/cheque to campus mentor within 24 hrs</p>
                      </div>
                    </div>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${paymentMethod === "offline" ? "border-primary bg-primary" : "border-border"}`}>
                      {paymentMethod === "offline" && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 py-5 rounded-xl">
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={handlePaymentConfirm}
                    disabled={isMutating}
                    className="flex-1 py-5 bg-gradient-to-r from-magenta to-indigo-600 hover:from-magenta/90 hover:to-indigo-600/90 border-0 text-white rounded-xl shadow-lg"
                  >
                    {isMutating ? "Reserving..." : paymentMethod === "online" ? "Confirm & Pay" : "Confirm Reservation"}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && enrollmentResult && (
              <div className="space-y-6 mt-4 text-center">
                {/* 3.1: Confirmed State */}
                {(enrollmentResult.data?.enrollment?.status === "confirmed" ||
                  enrollmentResult.data?.enrollment?.paymentStatus === "completed") && (
                  <div className="space-y-4 py-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mx-auto mb-2 animate-bounce">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground font-sans">Seat Confirmed!</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                      Your seat is officially secured and active. A registration invoice and course confirmation details have been sent to <strong>{tempData?.email || user?.email}</strong>.
                    </p>
                  </div>
                )}

                {/* 3.2: Pending State */}
                {enrollmentResult.data?.enrollment?.status === "pending" && (
                  <div className="space-y-4 py-2">
                    {paymentMethod === "offline" ? (
                      <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mx-auto mb-2">
                          <Clock className="h-10 w-10 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground font-sans">Seat Reserved!</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                          Please complete your cash/cheque fee payment to any GrowthCraft coordinator on your campus within 24 hours to active this seat.
                        </p>
                        
                        <div className="bg-muted p-4 rounded-xl border border-border flex items-center justify-between text-left max-w-sm mx-auto">
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reservation ID</span>
                            <p className="text-sm font-mono font-semibold text-foreground truncate max-w-[200px]">{enrollmentResult.data.enrollment._id}</p>
                          </div>
                          <Button size="icon" variant="ghost" onClick={copyReservationCode}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mx-auto mb-2">
                          <Clock className="h-10 w-10 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground font-sans">Payment Awaiting</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                          Complete your checkout before the hold expires to secure your seat.
                        </p>

                        <div className="py-2">
                          <PopupCountdownTimer targetDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} />
                          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-1">Hold Expiry Countdown</p>
                        </div>

                        <div className="pt-2">
                          <Button
                            type="button"
                            onClick={retryOnlineCheckout}
                            className="w-full bg-gradient-to-r from-magenta to-indigo-600 hover:from-magenta/90 hover:to-indigo-600/90 border-0 text-white rounded-xl shadow-lg py-5"
                          >
                            <RefreshCw className="mr-2 h-4 w-4" /> Complete Payment Now
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-4 border-t flex justify-end">
                  <Button type="button" onClick={onClose} className="w-full py-4 rounded-xl">
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Export hook for managing popup state
export const usePopupForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<FormType | "enquiry" | "mentor" | "partner">("enquiry");
  const [formTitle, setFormTitle] = useState<string | undefined>();
  const [courseId, setCourseId] = useState<string | undefined>();
  const [courseTitle, setCourseTitle] = useState<string | undefined>();
  const [itemType, setItemType] = useState<"course" | "workshop" | "bootcamp" | "hackathon" | "training-program">("course");
  const [price, setPrice] = useState<number | undefined>();

  const openForm = (
    type: typeof formType,
    title?: string,
    courseIdParam?: string,
    courseTitleParam?: string,
    itemTypeParam: "course" | "workshop" | "bootcamp" | "hackathon" | "training-program" = "course",
    priceParam?: number
  ) => {
    setFormType(type);
    setFormTitle(title);
    setCourseId(courseIdParam);
    setCourseTitle(courseTitleParam);
    setItemType(itemTypeParam);
    setPrice(priceParam);
    setIsOpen(true);
  };

  const closeForm = () => setIsOpen(false);

  return { isOpen, formType, formTitle, courseId, courseTitle, itemType, price, openForm, closeForm };
};
