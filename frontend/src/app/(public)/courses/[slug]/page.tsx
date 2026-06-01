"use client";

import { use } from "react";
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
  Lock,
  PlayCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { AUTH_ROUTES } from "@/lib/constants/routes.constant";
import { toast } from "sonner";
import { useCourseBySlug, useEnrollmentStatus, useEnrollCourse, useRequestCallback } from "@/hooks/queries/useCourses";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { isOpen, formType, formTitle, courseId, courseTitle, openForm, closeForm } = usePopupForm();
  const { data: user, isLoading: userLoading } = useCurrentUser();

  const { slug } = use(params);
  
  // Fetch course by slug using the new API
  const { data: courseData, isLoading, error } = useCourseBySlug(slug);
  const course = courseData?.data?.course;
  const overview = courseData?.data?.overview;
  const curriculum = courseData?.data?.curriculum || [];
  const instructorDetails = courseData?.data?.instructorDetails;
  const faqs = courseData?.data?.faqs || [];

  // Check enrollment status (only if user is authenticated)
  const isAuthenticated = user && user.isEmailVerified;
  const { data: enrollmentStatus, isLoading: statusLoading } = useEnrollmentStatus(
    course?._id || "",
    !!course?._id && !!isAuthenticated
  );

  // Enrollment and callback mutations - must be called unconditionally (Rules of Hooks)
  const enrollMutation = useEnrollCourse();
  const callbackMutation = useRequestCallback("callback"); // Default context
  const registerInterestMutation = useRequestCallback("register-interest");
  const notifyBatchMutation = useRequestCallback("notify-next-batch");

  // Loading state
  if (isLoading) {
    return (
      <Section variant="white">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-magenta" />
        </div>
      </Section>
    );
  }

  // Error state
  if (error) {
    return (
      <Section variant="white">
        <div className="text-center py-16">
          <p className="text-danger mb-4">Failed to load course. Please try again.</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </Section>
    );
  }

  // Not found
  if (!course) {
    notFound();
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied!");
    }
  };

  // Check if user is logged in and verified
  const isStudent = user?.role === "student";

  // Get enrollment status flags
  const isEnrolled = enrollmentStatus?.data?.isEnrolled || false;
  const hasCallbackRequest = enrollmentStatus?.data?.hasCallbackRequest || false;

  // Use backend-provided CTAs
  const primaryCTA = course.primaryCTA || "View Details";
  const secondaryCTA = course.secondaryCTA;

  // Determine CTA behavior based on the label text
  const isPrimaryEnrollment = primaryCTA.toLowerCase().includes("enroll");
  const isPrimaryRegisterInterest = primaryCTA.toLowerCase().includes("register") || primaryCTA.toLowerCase().includes("interest");

  // Select the appropriate mutation based on CTA type
  const activeMutation = isPrimaryRegisterInterest ? registerInterestMutation : callbackMutation;

  // Handle primary CTA click (Enroll Now / Register Interest)
  const handlePrimaryCTAClick = async () => {
    // For "Register Interest" - treat like callback (no login required)
    if (isPrimaryRegisterInterest) {
      if (!isAuthenticated) {
        // Not logged in - show form popup (no authentication required)
        openForm("register-interest", `${primaryCTA} - ${course.title}`, course._id, course.title);
        return;
      }

      // Logged in - auto-submit using user data
      if (user && course) {
        try {
          await activeMutation.mutateAsync({
            courseId: course._id,
            data: {
              fullName: user.fullName,
              email: user.email,
              phone: user.phone,
            },
          });
        } catch (error) {
          console.error("Register interest error:", error);
        }
      }
      return;
    }

    // For "Enroll Now" - require login
    if (!isAuthenticated) {
      // Not logged in - redirect to registration with callback URL
      if (typeof window !== "undefined") {
        const currentUrl = window.location.pathname;
        toast.info("Please register to enroll in this course");
        window.location.href = `/register/student?callbackUrl=${encodeURIComponent(currentUrl)}`;
      }
      return;
    }

    if (!isStudent) {
      toast.error("Please login as a student to enroll");
      return;
    }

    if (isEnrolled) {
      toast.info("You are already enrolled in this course");
      return;
    }

    // Auto-enroll using user data (no form popup)
    if (user && course) {
      try {
        await enrollMutation.mutateAsync({
          courseId: course._id,
          data: {
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
          },
        });
      } catch (error) {
        // Error handling is done in the mutation hook
        console.error("Enrollment error:", error);
      }
    }
  };

  // Handle secondary CTA click (Request Callback)
  const handleSecondaryCTAClick = async () => {
    if (!isAuthenticated) {
      // Not logged in - show form popup (no authentication required for callback)
      if (secondaryCTA) {
        openForm("callback", `${secondaryCTA} - ${course.title}`, course._id, course.title);
      }
      return;
    }

    if (hasCallbackRequest) {
      toast.info("You already have a pending callback request for this course");
      return;
    }

    // Auto-submit callback request using user data (no form popup)
    if (user && course) {
      try {
        await callbackMutation.mutateAsync({
          courseId: course._id,
          data: {
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
          },
        });
      } catch (error) {
        // Error handling is done in the mutation hook
        console.error("Callback request error:", error);
      }
    }
  };

  // Determine button states
  const isPrimaryButtonDisabled = 
    isPrimaryEnrollment 
      ? isEnrolled || enrollMutation.isPending
      : isPrimaryRegisterInterest
      ? hasCallbackRequest || activeMutation.isPending
      : activeMutation.isPending;
      
  const isSecondaryButtonDisabled = hasCallbackRequest || callbackMutation.isPending;

  // Button labels
  const primaryButtonLabel = 
    isPrimaryEnrollment
      ? (isEnrolled ? "Already Enrolled" : enrollMutation.isPending ? "Enrolling..." : primaryCTA)
      : isPrimaryRegisterInterest
      ? (hasCallbackRequest ? "Interest Registered" : activeMutation.isPending ? "Submitting..." : primaryCTA)
      : (activeMutation.isPending ? "Submitting..." : primaryCTA);

  const secondaryButtonLabel = hasCallbackRequest 
    ? "Callback Requested" 
    : callbackMutation.isPending 
    ? "Requesting..." 
    : secondaryCTA || "Request Callback";

  return (
    <>
      <PopupForm isOpen={isOpen} onClose={closeForm} type={formType} title={formTitle} courseId={courseId} courseTitle={courseTitle} />
      
      <Section variant="white">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-magenta mb-6 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Courses
        </Link>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Banner */}
            <div className="aspect-video bg-graphite rounded-xl flex items-center justify-center overflow-hidden">
              <div className="text-center text-white/50">
                <PlayCircle className="h-16 w-16 mx-auto mb-2" />
                <p className="text-sm">Course Preview</p>
              </div>
            </div>

            {/* Title area */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-magenta/10 text-magenta">
                  {course.category}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-lavender/10 text-lavender">
                  {course.difficultyLevel}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                {course.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <img
                  src={course.instructor?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorName}`}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
                <span>{course.instructorName}</span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-warning" />
                  {course.rating}
                </span>
                <span>{course.enrollmentCount.toLocaleString()} enrolled</span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview">
              <TabsList className="w-full justify-start bg-muted">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8 pt-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">About this course</h2>
                  <p className="text-muted-foreground">{overview?.aboutCourse || course.description}</p>
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

              <TabsContent value="curriculum" className="pt-6">
                <h2 className="text-xl font-bold mb-4">Course Curriculum</h2>
                <Accordion type="multiple" className="space-y-2">
                  {curriculum.map((section) => (
                    <AccordionItem
                      key={section._id}
                      value={`section-${section.sectionNumber}`}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-sm font-semibold">
                        Section {section.sectionNumber}: {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {section.lessons.map((lesson) => (
                            <li
                              key={lesson._id}
                              className="flex items-center justify-between text-sm py-1"
                            >
                              <div className="flex items-center gap-2">
                                {lesson.isFree ? (
                                  <PlayCircle className="h-4 w-4 text-lavender" />
                                ) : (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span
                                  className={
                                    lesson.isFree
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }
                                >
                                  {lesson.title}
                                </span>
                                {lesson.isFree && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-success/10 text-success rounded">
                                    Free
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {lesson.duration} min
                              </span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="instructor" className="pt-6">
                <DataCard>
                  <div className="flex items-start gap-4">
                    <img
                      src={instructorDetails?.avatar || course.instructor?.avatar}
                      alt={instructorDetails?.name}
                      className="h-16 w-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-bold">
                        {instructorDetails?.name || course.instructorName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {instructorDetails?.bio || "Senior Engineer with 8+ years of industry experience. Previously at top tech companies, now dedicated to training the next wave of developers."}
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-warning" />
                          {instructorDetails?.rating || course.rating} rating
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {instructorDetails?.studentsCount || course.enrollmentCount} students
                        </span>
                        {instructorDetails?.coursesCount && (
                          <span>{instructorDetails.coursesCount} courses</span>
                        )}
                      </div>
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
                    ₹{course.price.toLocaleString()}
                  </span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <span className="text-base text-muted-foreground line-through ml-2">
                      ₹{course.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Primary CTA */}
                <Button
                  className="w-full bg-magenta text-white hover:bg-magenta/90 mb-3"
                  size="lg"
                  onClick={handlePrimaryCTAClick}
                  disabled={isPrimaryButtonDisabled}
                >
                  {enrollMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {primaryButtonLabel}
                </Button>

                {/* Secondary CTA */}
                {secondaryCTA && (
                  <Button
                    variant="outline"
                    className="w-full border-lavender text-lavender hover:bg-lavender hover:text-white"
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
                        course.title + " " + window.location.href
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
            Ready to start learning?
          </h2>
          <p className="text-white/60 mb-6">
            Join {course.enrollmentCount.toLocaleString()}+ students already
            enrolled.
          </p>
          <Button
            className="bg-magenta text-white hover:bg-magenta/90"
            size="lg"
            onClick={handlePrimaryCTAClick}
            disabled={isPrimaryButtonDisabled}
          >
            {enrollMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {primaryButtonLabel} {!isPrimaryButtonDisabled && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </Section>
    </>
  );
}
