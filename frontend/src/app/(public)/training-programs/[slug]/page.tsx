"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  useTrainingProgramBySlug,
  useTrainingProgramEnrollmentStatus,
  useEnrollInTrainingProgram,
  useRequestTrainingProgramCallback,
} from "@/hooks/queries/useTrainingPrograms";

export default function TrainingProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { isOpen, formType, formTitle, courseId, courseTitle, openForm, closeForm } =
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
  const isAuthenticated = user && user.isEmailVerified;
  const { data: enrollmentStatus } = useTrainingProgramEnrollmentStatus(
    program?._id || "",
    !!program?._id && !!isAuthenticated
  );

  // Mutations for enrollment and callback
  const enrollMutation = useEnrollInTrainingProgram();
  const callbackMutation = useRequestTrainingProgramCallback();

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
          "training-program"
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
          "training-program"
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
        window.location.href = `/register/student?callbackUrl=${encodeURIComponent(
          currentUrl
        )}`;
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

    try {
      await enrollMutation.mutateAsync({
        programId: program._id,
        data: {
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || "",
        },
      });
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
            {/* Banner */}
            <div className="aspect-video bg-graphite rounded-xl flex items-center justify-center overflow-hidden">
              <div className="text-center text-white/50">
                <PlayCircle className="h-16 w-16 mx-auto mb-2" />
                <p className="text-sm">Program Preview</p>
              </div>
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
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 break-words">
                {program.title}
              </h1>

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
                    {overview?.whatYouWillLearn?.map((item) => (
                      <div key={item._id} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-magenta mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{item.text}</span>
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
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {overview?.prerequisites?.map((item) => (
                      <li key={item._id} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-lavender mt-0.5" />
                        {item.text}
                      </li>
                    ))}
                  </ul>
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
                {program.cohorts && program.cohorts.length > 0 ? (
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
                                {format(new Date(cohort.startDate), "MMM dd, yyyy")}
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
    </>
  );
}
