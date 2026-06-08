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
} from "lucide-react";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { toast } from "sonner";
import type { CohortDate } from "@/types/training-program";
import { format } from "date-fns";
import { getTrainingProgramDetailBySlug } from "@/data/training-programs-detail.mock";

export default function TrainingProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { isOpen, formType, formTitle, courseId, courseTitle, openForm, closeForm } =
    usePopupForm();
  const { data: user } = useCurrentUser();

  const { slug } = use(params);

  // Fetch training program from mock data
  const programData = useMemo(() => getTrainingProgramDetailBySlug(slug), [slug]);
  const program = programData?.data?.program;
  const overview = programData?.data?.overview;
  const syllabus = programData?.data?.syllabus || [];
  const mentorDetails = programData?.data?.mentorDetails;
  const faqs = programData?.data?.faqs || [];

  // Not found
  if (!program) {
    notFound();
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  // Check if user is logged in and verified
  const isAuthenticated = user && user.isEmailVerified;
  const isStudent = user?.role === "student";

  // Use backend-provided CTAs
  const primaryCTA = program.primaryCTA || "Enroll Now";
  const secondaryCTA = program.secondaryCTA;
  const displayRating = (value: number) => value.toFixed(1);

  // Determine CTA behavior
  const isPrimaryCallback = primaryCTA.toLowerCase().includes("callback");
  const isPrimaryEnrollment = primaryCTA.toLowerCase().includes("enroll");
  const isPrimaryRegisterInterest =
    primaryCTA.toLowerCase().includes("register") ||
    primaryCTA.toLowerCase().includes("interest");

  // Handle primary CTA click
  const handlePrimaryCTAClick = async () => {
    // For "Request Callback" - no login required
    if (isPrimaryCallback) {
      if (!isAuthenticated) {
        openForm(
          "callback",
          `${primaryCTA} - ${program.title}`,
          program._id,
          program.title
        );
        return;
      }

      toast.success("Callback request submitted! We'll contact you soon.");
      return;
    }

    // For "Register Interest" - no login required
    if (isPrimaryRegisterInterest) {
      if (!isAuthenticated) {
        openForm(
          "register-interest",
          `${primaryCTA} - ${program.title}`,
          program._id,
          program.title
        );
        return;
      }

      // Logged in - show success message
      toast.success("Interest registered successfully! We'll contact you soon.");
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

    // Show success message
    toast.success("Enrollment successful! Check your email for next steps.");
  };

  // Handle secondary CTA click
  const handleSecondaryCTAClick = async () => {
    if (!isAuthenticated) {
      if (secondaryCTA) {
        openForm(
          "callback",
          `${secondaryCTA} - ${program.title}`,
          program._id,
          program.title
        );
      }
      return;
    }

    // Show success message
    toast.success("Callback request submitted! We'll contact you soon.");
  };

  // Button states
  const isPrimaryButtonDisabled = false;
  const isSecondaryButtonDisabled = false;
  const primaryButtonClasses = isPrimaryCallback
    ? ""
    : "bg-magenta text-white hover:bg-magenta/90 disabled:bg-magenta disabled:text-white disabled:opacity-50";

  const primaryButtonLabel = primaryCTA;
  const secondaryButtonLabel = secondaryCTA || "Request Callback";

  return (
    <>
      <PopupForm
        isOpen={isOpen}
        onClose={closeForm}
        type={formType}
        title={formTitle}
        courseId={courseId}
        courseTitle={courseTitle}
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
              <div className="flex items-center gap-2 mb-3">
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

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-warning" />
                  {displayRating(program.rating)}
                </span>
                <span>{program.enrollmentCount.toLocaleString()} enrolled</span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start bg-muted overflow-x-auto">
                <TabsTrigger value="overview" className="flex-shrink-0">Overview</TabsTrigger>
                <TabsTrigger value="syllabus" className="flex-shrink-0">Syllabus</TabsTrigger>
                <TabsTrigger value="cohorts" className="flex-shrink-0">Cohorts</TabsTrigger>
                <TabsTrigger value="mentor" className="flex-shrink-0">Mentor</TabsTrigger>
                <TabsTrigger value="faq" className="flex-shrink-0">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8 pt-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">About this program</h2>
                  <p className="text-muted-foreground">
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

              <TabsContent value="mentor" className="pt-6">
                <DataCard>
                  <div className="flex items-start gap-4">
                    <img
                      src={mentorDetails?.avatar}
                      alt={mentorDetails?.name}
                      className="h-16 w-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-bold">
                        {mentorDetails?.name || program.mentorName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {mentorDetails?.bio ||
                          "Industry expert with extensive experience in training and mentorship."}
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-warning" />
                          {(mentorDetails?.rating || program.rating).toFixed(1)} rating
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {mentorDetails?.studentsCount ||
                            program.enrollmentCount}{" "}
                          students
                        </span>
                      </div>
                      {mentorDetails?.expertise && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {mentorDetails.expertise.map((exp, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 rounded text-xs bg-muted"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </DataCard>
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
                  className={`${primaryButtonClasses} mb-3`}
                  size="lg"
                  variant={isPrimaryCallback ? "outline" : "default"}
                  onClick={handlePrimaryCTAClick}
                  disabled={isPrimaryButtonDisabled}
                >
                  {primaryButtonLabel}
                </Button>

                {/* Secondary CTA */}
                {secondaryCTA && (
                  <Button
                    variant="outline"
                    onClick={handleSecondaryCTAClick}
                    disabled={isSecondaryButtonDisabled}
                  >
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
              {primaryButtonLabel}{" "}
              {!isPrimaryButtonDisabled && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
