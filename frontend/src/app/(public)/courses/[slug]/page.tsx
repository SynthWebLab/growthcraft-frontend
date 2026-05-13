"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { DataCard } from "@/components/ui/data-card";
import { coursesMock } from "@/data/courses.mock";
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
} from "lucide-react";
import { PopupForm, usePopupForm } from "@/components/common/PopupForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { getPrimaryCta, ctaTypeToFormType } from "@/lib/ctaPolicy";
import { toast } from "sonner";

const curriculumMock = [
  {
    title: "Getting Started",
    lessons: [
      { name: "Introduction & Setup", duration: "15 min", free: true },
      { name: "Environment Configuration", duration: "20 min", free: true },
    ],
  },
  {
    title: "Core Fundamentals",
    lessons: [
      { name: "Key Concepts Deep Dive", duration: "45 min", free: false },
      { name: "Hands-on Exercise 1", duration: "30 min", free: false },
    ],
  },
  {
    title: "Advanced Patterns",
    lessons: [
      { name: "Architecture & Design", duration: "40 min", free: false },
      { name: "Real-World Project", duration: "60 min", free: false },
    ],
  },
  {
    title: "Deployment & Production",
    lessons: [
      { name: "CI/CD Pipeline", duration: "35 min", free: false },
      { name: "Final Capstone", duration: "90 min", free: false },
    ],
  },
];

const faqMock = [
  {
    q: "Is this course suitable for beginners?",
    a: "The prerequisites section above outlines what you need. If you meet those, you're good to go.",
  },
  {
    q: "Do I get lifetime access?",
    a: "Yes. Once enrolled, you have lifetime access to all course materials and future updates.",
  },
  {
    q: "Is there a certificate?",
    a: "Yes, you receive a verifiable certificate of completion.",
  },
  {
    q: "Can I get a refund?",
    a: "We offer a 7-day no-questions-asked refund policy.",
  },
];

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { isOpen, formType, formTitle, openForm, closeForm } = usePopupForm();
  const { data: user, isLoading } = useCurrentUser();

  const { slug } = use(params);
  const course = coursesMock.find((c) => c.slug === slug);

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
  const isAuthenticated = user && user.isEmailVerified;
  const isStudent = user?.role === "student";

  // Get CTA configuration based on course status
  const cta = getPrimaryCta({
    type: "course",
    status: course.status || "active",
  });

  // Handle primary CTA click
  const handlePrimaryCTAClick = () => {
    if (isAuthenticated && isStudent && cta.primary.type === "enroll-now") {
      // Logged in as student and enrolling - redirect to payment
      toast.success("Redirecting to payment...");
      // TODO: Redirect to actual payment/enrollment page
    } else if (isAuthenticated && cta.primary.type === "enroll-now") {
      // Logged in but not a student
      toast.error("Please login as a student to enroll");
    } else {
      // Show popup form with dynamic type based on CTA
      const formType = ctaTypeToFormType(cta.primary.type);
      openForm(formType, `${cta.primary.label} - ${course.title}`);
    }
  };

  // Handle secondary CTA click
  const handleSecondaryCTAClick = () => {
    if (cta.secondary) {
      const formType = ctaTypeToFormType(cta.secondary.type);
      openForm(formType, `${cta.secondary.label} - ${course.title}`);
    }
  };

  return (
    <>
      <PopupForm isOpen={isOpen} onClose={closeForm} type={formType} title={formTitle} />
      
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
                  {course.level}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                {course.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorName}`}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
                <span>{course.instructorName}</span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-warning" />
                  {course.avgRating}
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
                  <p className="text-muted-foreground">{course.description}</p>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {[
                      "Build production-ready applications",
                      "Master core concepts and patterns",
                      "Write clean, maintainable code",
                      "Deploy and scale applications",
                      "Implement best practices",
                      "Pass technical interviews",
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-magenta mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">Prerequisites</h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-lavender mt-0.5" />
                      Basic programming knowledge
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-lavender mt-0.5" />
                      Familiarity with HTML/CSS
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-lavender mt-0.5" />A
                      laptop with internet access
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="pt-6">
                <h2 className="text-xl font-bold mb-4">Course Curriculum</h2>
                <Accordion type="multiple" className="space-y-2">
                  {curriculumMock.map((section, i) => (
                    <AccordionItem
                      key={i}
                      value={`section-${i}`}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-sm font-semibold">
                        Section {i + 1}: {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {section.lessons.map((lesson, j) => (
                            <li
                              key={j}
                              className="flex items-center justify-between text-sm py-1"
                            >
                              <div className="flex items-center gap-2">
                                {lesson.free ? (
                                  <PlayCircle className="h-4 w-4 text-lavender" />
                                ) : (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span
                                  className={
                                    lesson.free
                                      ? "text-foreground"
                                      : "text-muted-foreground"
                                  }
                                >
                                  {lesson.name}
                                </span>
                                {lesson.free && (
                                  <span className="text-[10px] px-1.5 py-0.5 bg-success/10 text-success rounded">
                                    Free
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {lesson.duration}
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
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructorName}`}
                      alt=""
                      className="h-16 w-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-bold">
                        {course.instructorName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Senior Engineer with 8+ years of industry experience.
                        Previously at top tech companies, now dedicated to
                        training the next wave of developers.
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-warning" />
                          {course.avgRating} rating
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.enrollmentCount} students
                        </span>
                      </div>
                    </div>
                  </div>
                </DataCard>
              </TabsContent>

              <TabsContent value="faq" className="pt-6">
                <Accordion type="single" collapsible className="space-y-2">
                  {faqMock.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`faq-${i}`}
                      className="border rounded-lg px-4"
                    >
                      <AccordionTrigger className="text-sm font-semibold">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {item.a}
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
                    ₹{course.discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-base text-muted-foreground line-through ml-2">
                    ₹{course.price.toLocaleString()}
                  </span>
                </div>

                {/* Primary CTA */}
                <Button
                  className="w-full bg-magenta text-white hover:bg-magenta/90 mb-3"
                  size="lg"
                  onClick={handlePrimaryCTAClick}
                >
                  {cta.primary.label}
                </Button>

                {/* Secondary CTA */}
                {cta.secondary && (
                  <Button
                    variant="outline"
                    className="w-full border-lavender text-lavender hover:bg-lavender hover:text-white"
                    onClick={handleSecondaryCTAClick}
                  >
                    {cta.secondary.label}
                  </Button>
                )}

                <div className="mt-6 space-y-3 text-sm">
                  <h4 className="font-semibold">What's included</h4>
                  {[
                    `${course.durationHours} hours of video`,
                    `${course.totalLessons} lessons`,
                    "Certificate of completion",
                    "Mentor sessions",
                    "Lifetime access",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <Check className="h-4 w-4 text-magenta flex-shrink-0" />
                      <span>{item}</span>
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
          >
            {cta.primary.label} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Section>
    </>
  );
}
