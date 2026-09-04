"use client";

import { useState, use, useMemo } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { DataCard } from "@/components/ui/data-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Check,
  Star,
  ArrowLeft,
  Users,
  Share2,
  Copy,
  PlayCircle,
  ArrowRight,
  Loader2,
  Calendar,
  Clock,
  Flame,
  Building2,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Lock,
  Shield,
  Zap,
  Award,
  TrendingUp,
  ExternalLink,
} from "lucide-react";
import { PartnerLogo } from "@/components/common/PartnerLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { format } from "date-fns";
import { formatDisplayDate } from "@/lib/dateUtils";
import { useQueryClient } from "@tanstack/react-query";
import {
  useTrainingProgramBySlug,
  useTrainingProgramEnrollmentStatus,
  useEnrollInTrainingProgram,
  useRequestTrainingProgramCallback,
} from "@/hooks/queries/useTrainingPrograms";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { isPaymentPaused } from "@/config/paymentConfig";
import { usePaymentMaintenanceStore } from "@/stores/paymentMaintenanceStore";


function safeFormatDate(dateStr?: string | Date, formatPattern: string = "MMM dd, yyyy", fallback: string = "To be announced"): string {
  if (!dateStr) return fallback;
  if (
    typeof dateStr === "string" &&
    (dateStr.toLowerCase().includes("announced") || dateStr.toLowerCase().includes("tba"))
  ) {
    return fallback;
  }
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return fallback;
  try {
    return format(dateObj, formatPattern);
  } catch (err) {
    return fallback;
  }
}

export default function TrainingProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isOpen, formType, formTitle, courseId, courseTitle, price, openForm, closeForm } =
    usePopupForm();
  const { data: user } = useCurrentUser();

  const { slug } = use(params);

  // Fetch training program detail using the React Query API hook
  const { data: programData, isLoading, error } = useTrainingProgramBySlug(slug);
  const program = programData?.data?.program;
  const overview = programData?.data?.overview;
  const syllabus = programData?.data?.syllabus || [];
  const mentors =
    (programData?.data?.mentors && programData.data.mentors.length > 0)
      ? programData.data.mentors
      : (program?.mentors && program.mentors.length > 0)
      ? program.mentors
      : [];
  const faqs = programData?.data?.faqs || [];

  // Check enrollment status (only if user is authenticated)
  const isAuthenticated = !!(user && user.isEmailVerified);
  const { data: enrollmentStatus } = useTrainingProgramEnrollmentStatus(
    program?._id || "",
    !!program?._id && !!isAuthenticated
  );

  // Mutations for enrollment and callback
  const enrollMutation = useEnrollInTrainingProgram();
  const { openCheckout, isLoading: checkoutLoading } = useRazorpayCheckout();
  const openPaymentMaintenance = usePaymentMaintenanceStore((state) => state.openModal);
  const callbackMutation = useRequestTrainingProgramCallback();


  // Modal state
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedPartnerIndex, setSelectedPartnerIndex] = useState(0);

  // Derive Internship Partners (defaults to SynthWeb and Social Stories if not configured)
  const internshipPartners = useMemo(() => {
    const partners = programData?.data?.internshipPartners || (program as any)?.internshipPartners || [];
    if (Array.isArray(partners) && partners.length > 0) return partners;
    return [
      {
        companyName: "SynthWeb",
        role: `${program?.title || "Industrial"} Software Intern`,
        duration: `${program?.duration || 60} Days Internship`,
        mode: "Hybrid / Campus Hub",
        stipend: "Performance-based Stipend + PPO Opportunity",
        description: "Work on live enterprise client software, microservices architecture, and high-performance backend systems.",
      },
      {
        companyName: "Social Stories",
        role: "Product Engineering & Growth Intern",
        duration: `${program?.duration || 60} Days Internship`,
        mode: "Hybrid / Remote",
        stipend: "Performance-based Stipend + Co-branded Certificate",
        description: "Build modern user-facing web applications, responsive workflows, and digital growth tooling.",
      },
    ];
  }, [programData, program]);

  // Derive dynamic prerequisites from program or overview
  const resolvedPrerequisites: string[] = useMemo(() => {
    const rawPrereqs = program?.prerequisites || (programData?.data as any)?.program?.prerequisites;
    if (Array.isArray(rawPrereqs) && rawPrereqs.length > 0) {
      return rawPrereqs.map((p: any) => (typeof p === "string" ? p : p.text || String(p))).filter(Boolean);
    }
    if (Array.isArray(overview?.prerequisites) && overview.prerequisites.length > 0) {
      return overview.prerequisites.map((p: any) => (typeof p === "string" ? p : p.text || String(p))).filter(Boolean);
    }
    return [];
  }, [programData, program, overview]);

  // Derive dynamic What You'll Learn
  const resolvedWhatYouWillLearn: string[] = useMemo(() => {
    if (Array.isArray(overview?.whatYouWillLearn) && overview.whatYouWillLearn.length > 0) {
      return overview.whatYouWillLearn
        .map((item: any) => (typeof item === "string" ? item : item.text || String(item)))
        .filter(Boolean);
    }
    const progAny = program as any;
    if (Array.isArray(progAny?.whatYouWillLearn) && progAny.whatYouWillLearn.length > 0) {
      return progAny.whatYouWillLearn
        .map((item: any) => (typeof item === "string" ? item : item.text || String(item)))
        .filter(Boolean);
    }
    return [
      `Hands-on practical development in ${program?.domain || "industrial software"}`,
      "Real-world enterprise client project architecture",
      "Mentored code reviews and weekly milestone reviews",
      "Industry internship completion and co-branded verification",
    ];
  }, [overview?.whatYouWillLearn, program]);

  // Loading state
  if (isLoading) {
    return (
      <Section variant="white">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-magenta" />
        </div>
      </Section>
    );
  }

  // Error state or not found
  if (error || !program) {
    notFound();
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  // Check student role
  const isStudent = user?.role === "student";
  const isRestrictedRole = user?.role === "mentor" || user?.role === "employer";
  const isEnrolled = enrollmentStatus?.data?.isEnrolled || false;
  const hasCallbackRequest = enrollmentStatus?.data?.hasCallbackRequest || false;

  // Use backend-provided CTAs
  const primaryCTA = program.primaryCTA || "Enroll Now";
  const secondaryCTA = program.secondaryCTA;
  const displayRating = (value?: number) => (value && value > 0 ? value.toFixed(1) : "New");

  // Determine CTA behavior
  const isPrimaryCallback = primaryCTA.toLowerCase().includes("callback");
  const isPrimaryEnrollment = 
    primaryCTA.toLowerCase().includes("enroll") || 
    primaryCTA.toLowerCase().includes("reserve") || 
    primaryCTA.toLowerCase().includes("seat");
  const isPrimaryRegisterInterest =
    primaryCTA.toLowerCase().includes("register") ||
    primaryCTA.toLowerCase().includes("interest");

  // Handle primary CTA click
  const handlePrimaryCTAClick = async () => {
    if (isRestrictedRole) {
      toast.error("Students Only");
      return;
    }
    // For "Request Callback"
    if (isPrimaryCallback) {
      if (!isAuthenticated) {
        openForm(
          "callback",
          `${primaryCTA} - ${program.title}`,
          program._id,
          program.title,
          "training-program",
          program.price || 0
        );
        return;
      }

      if (hasCallbackRequest) {
        toast.info("You already have a pending callback request");
        return;
      }

      try {
        await callbackMutation.mutateAsync({
          programId: program._id,
          data: {
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || "",
          },
        });
      } catch (err) {
        console.error("Callback request error:", err);
      }
      return;
    }

    // For "Register Interest"
    if (isPrimaryRegisterInterest) {
      if (!isAuthenticated) {
        openForm(
          "register-interest",
          `${primaryCTA} - ${program.title}`,
          program._id,
          program.title,
          "training-program",
          program.price || 0
        );
        return;
      }

      try {
        await callbackMutation.mutateAsync({
          programId: program._id,
          data: {
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || "",
          },
        });
      } catch (err) {
        console.error("Register interest error:", err);
      }
      return;
    }

    // For "Enroll Now" - require login
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        const currentUrl = window.location.pathname;
        toast.info("Please register to enroll in this program");
        router.push(`/register/student?callbackUrl=${encodeURIComponent(
          currentUrl
        )}`);
      }
      return;
    }

    if (!isStudent) {
      toast.error("Please login as a student to enroll");
      return;
    }

    if (isEnrolled) {
      toast.info("You are already enrolled in this program");
      return;
    }

    // Open Company Selection Modal so the student chooses their internship partner company!
    setIsCompanyModalOpen(true);
  };

  // Handle confirming company selection and launching Razorpay checkout
  const handleConfirmCompanyAndPay = async () => {
    if (!user) {
      toast.error("Please login to complete your enrollment");
      return;
    }

    if (isPaymentPaused() && (program.price || 9999) > 0) {
      setIsCompanyModalOpen(false);
      openPaymentMaintenance({
        itemTitle: program.title,
        itemPrice: program.price || 9999,
        itemType: "training-program",
      });
      return;
    }

    const chosenPartner = internshipPartners[selectedPartnerIndex] || internshipPartners[0];
    try {
      const response = await enrollMutation.mutateAsync({
        programId: program._id,
        data: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || "",
          selectedCompany: {
            companyName: chosenPartner.companyName,
            role: chosenPartner.role,
            duration: chosenPartner.duration,
            stipend: chosenPartner.stipend,
            mode: chosenPartner.mode,
          },
        },
      });

      setIsCompanyModalOpen(false);

      if (response?.data?.enrollment?._id) {
        openCheckout({
          amount: program.price || 9999,
          itemType: "training-program",
          itemId: response.data.enrollment._id,
          title: program.title,
          description: `Enrollment fee for ${program.title} • Internship Partner: ${chosenPartner.companyName}`,
          prefill: {
            name: user.fullName,
            email: user.email,
            contact: user.phone,
          },
          onSuccess: (paymentId) => {
            toast.success("Payment completed!", {
              description: `Payment ID: ${paymentId}. You are now enrolled under ${chosenPartner.companyName}!`,
            });
            // Invalidate queries to immediately show active enrollment status
            queryClient.invalidateQueries({ queryKey: ["training-program", program._id] });
            queryClient.invalidateQueries({ queryKey: ["training-program-enrollment-status", program._id] });
            queryClient.invalidateQueries({ queryKey: ["training-programs"] });
          },
          onError: (err) => {
            toast.error(err || "Payment cancelled or failed. You can click Enroll Now to try again anytime.");
            queryClient.invalidateQueries({ queryKey: ["training-program", program._id] });
            queryClient.invalidateQueries({ queryKey: ["training-program-enrollment-status", program._id] });
            queryClient.invalidateQueries({ queryKey: ["training-programs"] });
          },
        });
      }
    } catch (err) {
      console.error("Enrollment error:", err);
    }
  };

  // Handle secondary CTA click
  const handleSecondaryCTAClick = async () => {
    if (isRestrictedRole) {
      toast.error("Students Only");
      return;
    }
    if (!isAuthenticated) {
      if (secondaryCTA) {
        openForm(
          "callback",
          `${secondaryCTA} - ${program.title}`,
          program._id,
          program.title,
          "training-program"
        );
      }
      return;
    }

    if (hasCallbackRequest) {
      toast.info("You already have a pending callback request");
      return;
    }

    try {
      await callbackMutation.mutateAsync({
        programId: program._id,
        data: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || "",
        },
      });
    } catch (err) {
      console.error("Callback error:", err);
    }
  };

  // Button states and labels
  const isPrimaryButtonDisabled =
    (isAuthenticated && isRestrictedRole) ||
    checkoutLoading ||
    (isPrimaryEnrollment
      ? (isAuthenticated && !isStudent) || isEnrolled || enrollMutation.isPending
      : isPrimaryCallback
      ? hasCallbackRequest || callbackMutation.isPending
      : isPrimaryRegisterInterest
      ? hasCallbackRequest || callbackMutation.isPending
      : callbackMutation.isPending);


  const isSecondaryButtonDisabled = hasCallbackRequest || callbackMutation.isPending || (isAuthenticated && isRestrictedRole);
  const primaryButtonClasses = isPrimaryCallback
    ? ""
    : "bg-magenta text-white hover:bg-magenta/90 disabled:bg-magenta disabled:text-white disabled:opacity-50";

  const primaryButtonLabel = (isAuthenticated && isRestrictedRole)
    ? "Students Only"
    : isPrimaryEnrollment
    ? (isAuthenticated && !isStudent)
      ? "Students Only"
      : isEnrolled
      ? "Already Enrolled"
      : enrollMutation.isPending
      ? "Enrolling..."
      : primaryCTA
    : isPrimaryCallback
    ? hasCallbackRequest
      ? "Callback Requested"
      : callbackMutation.isPending
      ? "Requesting..."
      : primaryCTA
    : isPrimaryRegisterInterest
    ? hasCallbackRequest
      ? "Interest Registered"
      : callbackMutation.isPending
      ? "Submitting..."
      : primaryCTA
    : primaryCTA;

  const secondaryButtonLabel = (isAuthenticated && isRestrictedRole)
    ? "Students Only"
    : hasCallbackRequest
    ? "Callback Requested"
    : callbackMutation.isPending
    ? "Requesting..."
    : secondaryCTA || "Request Callback";

  return (
    <>
      <PopupForm
        isOpen={isOpen}
        onClose={closeForm}
        type={formType}
        title={formTitle}
        courseId={courseId}
        courseTitle={courseTitle}
        itemType="training-program"
        price={price}
      />

      <Section variant="white" className="overflow-hidden">
        <Link
          href="/training-programs"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-magenta mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Training Programs
        </Link>

        <div className="grid lg:grid-cols-12 gap-8 overflow-hidden">
          {/* Main content */}
          <div className="lg:col-span-8 space-y-8 min-w-0">
            {/* Program Preview Section */}
            <div className="aspect-video bg-graphite rounded-2xl flex items-center justify-center overflow-hidden relative shadow-md group">
              {program.thumbnail ? (
                <img
                  src={program.thumbnail}
                  alt={program.programName || program.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-white/50 group-hover:text-white/70 transition-colors">
                  <PlayCircle className="h-16 w-16 mx-auto mb-2 text-white/40 group-hover:text-magenta transition-colors" />
                  <p className="text-sm font-medium">Program Preview</p>
                </div>
              )}
            </div>
            

            {/* Title area */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {(program.isFeatured || program.is_featured) && (
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-400/30 flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5" /> Trending Now
                  </span>
                )}
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-magenta/10 text-magenta">
                  {program.domain}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-lavender/10 text-lavender">
                  {program.level}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-graphite/10 text-graphite">
                  {program.duration} days
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-primary/10 text-primary flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {formatDisplayDate(program.startDate, program.endDate, program.isDateTBA, program.durationDays || program.duration)}
                </span>
                {internshipPartners.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center gap-1.5 max-w-full">
                    <Building2 className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Internship Partners: {internshipPartners.map((p: any) => p.companyName).join(", ")}</span>
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 break-words">
                {program.programName || program.title}
              </h1>

              {program.fullTitle && (
                <p className="text-lg md:text-xl font-medium text-muted-foreground mb-4">
                  {program.fullTitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {mentors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2 overflow-hidden">
                      {mentors.map((mentor: any, index: number) => (
                        <Avatar key={index} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={mentor.avatar} alt={mentor.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {(mentor.name || mentor.fullName || "M").charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="font-medium text-foreground">
                      {mentors.map((m: any) => m.name || m.fullName).filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
                <span className="flex items-center gap-1 font-medium">
                  <Star className="h-4 w-4 text-warning fill-warning" />
                  {displayRating(program.rating)}
                </span>
                <span className="font-medium">{(program.enrollmentCount || 0).toLocaleString()} enrolled</span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start bg-muted overflow-x-auto">
                <TabsTrigger value="overview" className="flex-shrink-0">Overview</TabsTrigger>
                <TabsTrigger value="internships" className="flex-shrink-0 flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-magenta" />
                  <span>Internship Partners ({internshipPartners.length})</span>
                </TabsTrigger>
                <TabsTrigger value="syllabus" className="flex-shrink-0">Syllabus</TabsTrigger>
                <TabsTrigger value="cohorts" className="flex-shrink-0">Cohorts</TabsTrigger>
                <TabsTrigger value="mentor" className="flex-shrink-0">{mentors.length > 1 ? "Mentors" : "Mentor"}</TabsTrigger>
                <TabsTrigger value="faq" className="flex-shrink-0">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8 pt-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">About this program</h2>
                  <p className="text-muted-foreground whitespace-pre-line">
                    {overview?.aboutProgram || program.description}
                  </p>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {resolvedWhatYouWillLearn.map((item: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-magenta mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">Tools & Technologies</h2>
                  <div className="flex flex-wrap gap-2">
                    {program.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-lavender/10 text-lavender"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">Prerequisites</h2>
                  {resolvedPrerequisites.length > 0 ? (
                    <ul className="space-y-2.5 text-sm text-muted-foreground">
                      {resolvedPrerequisites.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-lavender mt-0.5 shrink-0" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-lavender mt-0.5 shrink-0" />
                        <span className="text-foreground">Basic computer and internet literacy; no prior coding experience required.</span>
                      </li>
                    </ul>
                  )}
                </div>
              </TabsContent>

              {/* Internship Partners Tab */}
              <TabsContent value="internships" className="pt-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 rounded-lg bg-magenta text-white">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <h2 className="text-xl font-bold">Industry Internship Partners</h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All students enrolled in this training program will undergo hands-on practical project internship with one of our certified partner companies:
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {internshipPartners.map((partner: any, idx: number) => (
                    <DataCard key={idx} className="space-y-4 hover:border-magenta/40 transition-all border shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <PartnerLogo
                            companyName={partner.companyName}
                            logoUrl={partner.logoUrl}
                            size="lg"
                          />
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{partner.companyName}</h3>
                            <p className="text-xs font-semibold text-magenta">{partner.role}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-500/20 text-[10px] font-bold uppercase">
                          Certified Partner
                        </Badge>
                      </div>

                      {partner.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {partner.description}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs">
                        <div className="bg-muted/50 p-2 rounded-lg">
                          <span className="text-[10px] font-medium text-muted-foreground block">Internship Mode</span>
                          <span className="font-semibold text-foreground">{partner.mode || "Hybrid / Campus Hub"}</span>
                        </div>
                        <div className="bg-muted/50 p-2 rounded-lg">
                          <span className="text-[10px] font-medium text-muted-foreground block">Duration</span>
                          <span className="font-semibold text-foreground">{partner.duration || `${program.duration || 60} Days`}</span>
                        </div>
                      </div>
                    </DataCard>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="syllabus" className="pt-6">
                <h2 className="text-xl font-bold mb-4">Program Syllabus</h2>
                <Accordion type="multiple" className="space-y-2">
                  {syllabus.map((week) => (
                    <AccordionItem
                      key={week._id}
                      value={`week-${week.weekNumber}`}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-sm font-semibold">
                        Week {week.weekNumber}: {week.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {week.topics.map((topic) => (
                            <li
                              key={topic._id}
                              className="flex items-start gap-2 text-sm py-1"
                            >
                              <Check className="h-4 w-4 text-magenta mt-0.5 flex-shrink-0" />
                              <span>{topic.text}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="cohorts" className="pt-6">
                <h2 className="text-xl font-bold mb-4">Available Cohort Start Dates</h2>
                {program.cohorts && program.cohorts.length > 0 && !program.isDateTBA ? (
                  <div className="space-y-3">
                    {program.cohorts.map((cohort) => (
                      <DataCard key={cohort._id}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold mb-1">
                              Cohort {cohort.cohortNumber}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {safeFormatDate(cohort.startDate, "MMM dd, yyyy")}
                              </span>
                              <span>
                                {cohort.maxSeats - cohort.enrolledCount} seats left
                              </span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              cohort.status === "Open"
                                ? "bg-success/10 text-success"
                                : cohort.status === "Closed"
                                ? "bg-danger/10 text-danger"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {cohort.status}
                          </span>
                        </div>
                      </DataCard>
                    ))}
                  </div>
                ) : (
                  <DataCard>
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <h3 className="font-semibold mb-2">No cohorts scheduled</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        New cohorts will be announced soon. Request a callback to get
                        notified.
                      </p>
                      <Button variant="outline" onClick={handleSecondaryCTAClick}>
                        Request Callback
                      </Button>
                    </div>
                  </DataCard>
                )}
              </TabsContent>

              <TabsContent value="mentor" className="pt-6 space-y-4">
                {mentors.length > 0 ? (
                  mentors.map((mentor: any, index: number) => {
                    const mentorName = mentor.name || mentor.fullName || "Mentor";
                    const designation = mentor.designation || mentor.areaOfExpertise || "Industry Mentor";
                    const company = mentor.company || mentor.currentOrganization;
                    const expertiseList = Array.isArray(mentor.expertise)
                      ? mentor.expertise
                      : typeof mentor.areaOfExpertise === "string"
                      ? [mentor.areaOfExpertise]
                      : [];

                    return (
                      <DataCard key={index}>
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16 border">
                            <AvatarImage src={mentor.avatar} alt={mentorName} />
                            <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
                              {mentorName.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold">{mentorName}</h3>
                            <p className="text-sm font-medium text-magenta mb-1">
                              {designation} {company ? `at ${company}` : ""}
                            </p>
                            {mentor.bio && (
                              <p className="text-sm text-muted-foreground mb-3">
                                {mentor.bio}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                              {mentor.rating != null && (
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-warning fill-warning" />
                                  {Number(mentor.rating).toFixed(1)} rating
                                </span>
                              )}
                              {mentor.studentsCount != null && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {Number(mentor.studentsCount).toLocaleString()} students mentored
                                </span>
                              )}
                            </div>
                            {expertiseList.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {expertiseList.map((exp: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-1 rounded text-xs bg-muted font-medium text-muted-foreground"
                                  >
                                    {exp}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </DataCard>
                    );
                  })
                ) : (
                  <DataCard>
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No mentors assigned yet for this training program.</p>
                    </div>
                  </DataCard>
                )}
              </TabsContent>

              <TabsContent value="faq" className="pt-6">
                <Accordion type="single" collapsible className="space-y-2">
                  {faqs.map((item) => (
                    <AccordionItem
                      key={item._id}
                      value={`faq-${item._id}`}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-sm font-semibold">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sticky sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <DataCard>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-magenta">
                    ₹{program.price.toLocaleString()}
                  </span>
                  {program.originalPrice && program.originalPrice > program.price && (
                    <span className="text-base text-muted-foreground line-through ml-2">
                      ₹{program.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  <span><strong className="font-semibold text-foreground">{formatDisplayDate(program.startDate, program.endDate, program.isDateTBA, program.durationDays || program.duration)}</strong></span>
                </div>

                {/* Primary CTA */}
                <Button
                  className={`${primaryButtonClasses} w-full mb-3`}
                  size="lg"
                  variant={isPrimaryCallback ? "outline" : "default"}
                  onClick={handlePrimaryCTAClick}
                  disabled={isPrimaryButtonDisabled}
                >
                  {(enrollMutation.isPending || callbackMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {primaryButtonLabel}
                </Button>

                {/* Secondary CTA */}
                {secondaryCTA && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSecondaryCTAClick}
                    disabled={isSecondaryButtonDisabled}
                  >
                    {callbackMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {secondaryButtonLabel}
                  </Button>
                )}

                <div className="mt-6 space-y-3 text-sm">
                  <h4 className="font-semibold">What's included</h4>
                  {overview?.whatsIncluded?.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Check className="h-4 w-4 text-magenta flex-shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Prerequisites highlight in sidebar */}
                <div className="mt-4 pt-3.5 border-t border-border/80 text-xs space-y-1.5">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="h-4 w-4 text-magenta shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-foreground block">Prerequisites:</span>
                      <span className="text-muted-foreground leading-relaxed">
                        {resolvedPrerequisites.length > 0
                          ? resolvedPrerequisites.join("; ")
                          : "No prior coding required (Beginner friendly)"}
                      </span>
                    </div>
                  </div>
                </div>
              </DataCard>

              {/* Share */}
              <div className="flex items-center gap-2 justify-center">
                <span className="text-xs text-muted-foreground">Share:</span>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      const shareUrl = `https://wa.me/?text=${encodeURIComponent(
                        program.title + " " + window.location.href
                      )}`;
                      window.open(shareUrl, "_blank", "noopener,noreferrer");
                    }
                  }}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Share2 className="h-4 w-4 text-lavender" />
                </button>
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <Copy className="h-4 w-4 text-lavender" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Final CTA */}
      <Section variant="graphite">
        <div className="text-center py-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-white/60 mb-6">
            Join {program.enrollmentCount.toLocaleString()}+ students already enrolled.
          </p>
          <div className="flex justify-center">
            <Button
              className={primaryButtonClasses}
              size="lg"
              variant={isPrimaryCallback ? "outline" : "default"}
              onClick={handlePrimaryCTAClick}
              disabled={isPrimaryButtonDisabled}
            >
              {(enrollMutation.isPending || callbackMutation.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {primaryButtonLabel}{" "}
              {!isPrimaryButtonDisabled && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Section>

      {/* Company Selection Dialog (During Enrollment) */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl bg-card border border-border shadow-2xl rounded-2xl p-4 sm:p-6 md:p-7 overflow-hidden max-h-[90vh] flex flex-col">
          <DialogHeader className="pb-3 border-b border-border/60 shrink-0">
            <div className="flex items-start gap-3 sm:gap-3.5">
              <div className="p-2.5 sm:p-3 rounded-2xl bg-magenta/10 text-magenta shrink-0">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-foreground font-display leading-tight">
                  Choose Your Internship Partner
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Select which partner company you would like to complete your practical internship under for{" "}
                  <strong className="text-foreground">{program.title}</strong>:
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Info callout strip */}
          <div className="flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-magenta/5 border border-magenta/15 text-[11px] sm:text-xs text-foreground/80 my-1 shrink-0">
            <Sparkles className="h-4 w-4 text-magenta shrink-0" />
            <span className="leading-snug">
              <strong>Guaranteed Internship Track:</strong> Practical training, live project deliverables, and certificates are co-issued with your chosen partner.
            </span>
          </div>

          {/* Cards List */}
          <div className="space-y-2.5 sm:space-y-3 my-1 overflow-y-auto pr-1 flex-1 min-h-0">
            {internshipPartners.map((partner: any, idx: number) => {
              const isSelected = selectedPartnerIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPartnerIndex(idx)}
                  className={`p-3.5 sm:p-4.5 rounded-2xl border-2 transition-all cursor-pointer space-y-2 sm:space-y-2.5 ${
                    isSelected
                      ? "border-magenta bg-magenta/[0.04] shadow-sm ring-1 ring-magenta/40"
                      : "border-border hover:border-magenta/40 bg-card hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                      <PartnerLogo
                        companyName={partner.companyName}
                        logoUrl={partner.logoUrl}
                        size="md"
                        className={isSelected ? "ring-2 ring-magenta/40" : ""}
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-foreground leading-snug truncate">
                            {partner.companyName}
                          </h4>
                          <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Partner
                          </span>
                        </div>
                        <p className="text-[11px] sm:text-xs font-semibold text-magenta mt-0.5 truncate">
                          {partner.role}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      <div
                        className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-magenta bg-magenta text-white shadow-sm"
                            : "border-muted-foreground/30 bg-background"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>

                  {partner.description && (
                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed sm:pl-[52px]">
                      {partner.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-medium sm:pl-[52px] pt-0.5">
                    {partner.mode && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-muted text-foreground border border-border/50">
                        <MapPin className="h-3 w-3 text-muted-foreground" /> {partner.mode}
                      </span>
                    )}
                    {partner.duration && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-muted text-foreground border border-border/50">
                        <Clock className="h-3 w-3 text-muted-foreground" /> {partner.duration}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-border mt-2 shrink-0">
            <div className="text-xs text-muted-foreground w-full sm:w-auto text-left">
              Selected: <strong className="text-foreground">{internshipPartners[selectedPartnerIndex]?.companyName || "Partner"}</strong> ({internshipPartners[selectedPartnerIndex]?.role || "Internship"})
            </div>
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCompanyModalOpen(false)}
                disabled={enrollMutation.isPending}
                className="w-full sm:w-auto rounded-xl h-10 sm:h-9"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleConfirmCompanyAndPay}
                disabled={enrollMutation.isPending}
                className="bg-magenta hover:bg-magenta/90 text-white font-bold w-full sm:w-auto rounded-xl shadow-md shadow-magenta/20 h-10 sm:h-9"
              >
                {enrollMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm & Pay ₹{program.price.toLocaleString()}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
