"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Clock, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  Github, 
  ExternalLink, 
  ArrowLeft, 
  Send, 
  Users, 
  Sparkles, 
  Download, 
  Code2, 
  AlertCircle,
  MessageSquare,
  Award,
  ShieldCheck,
  Video,
  Lock,
  Hourglass,
  CheckCircle,
  CreditCard,
  Layers,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useStudentCourseWorkspace, useSubmitCourseProject } from "@/hooks/queries/useStudent";
import { PaymentCheckoutModal } from "@/components/dashboard/payment-checkout-modal";

export default function StudentCourseWorkspacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // Fetch dynamic course workspace data from API
  const { data: workspaceRes, isLoading } = useStudentCourseWorkspace(slug);
  const submitMutation = useSubmitCourseProject(slug);

  const workspaceData = workspaceRes?.data || workspaceRes;
  const course = workspaceData?.course;
  const enrollment = workspaceData?.enrollment;
  const instructors = workspaceData?.instructors || [];
  
  const DEFAULT_COURSE_MODULES = [
    { moduleNumber: 1, title: "Foundations & Environment Architecture", lessonsCount: 6, status: "Completed", description: "Core concepts setup, environment configuration, and architectural paradigms." },
    { moduleNumber: 2, title: "Advanced Technical Deep-Dive", lessonsCount: 8, status: "Completed", description: "Advanced patterns, performance optimization, and database integration." },
    { moduleNumber: 3, title: "Production Build & Hands-on Labs", lessonsCount: 6, status: "In Progress", description: "Building end-to-end applications with mentor code reviews." },
    { moduleNumber: 4, title: "Final Evaluation & Project Sign-off", lessonsCount: 4, status: "Upcoming", description: "Capstone review by instructors and course completion certificate." },
  ];

  const modules = (workspaceData?.modules && workspaceData.modules.length > 0) ? workspaceData.modules : DEFAULT_COURSE_MODULES;

  // Form & Modal state
  const [projectTitle, setProjectTitle] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [techStack, setTechStack] = useState("");
  const [notes, setNotes] = useState("");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isAdminApproved, setIsAdminApproved] = useState(false);

  useEffect(() => {
    if (enrollment?.projectSubmission) {
      const sub = enrollment.projectSubmission;
      if (sub.projectTitle) setProjectTitle(sub.projectTitle);
      if (sub.repoUrl) setRepoUrl(sub.repoUrl);
      if (sub.demoUrl) setDemoUrl(sub.demoUrl);
      if (sub.techStack) setTechStack(sub.techStack);
      if (sub.notes) setNotes(sub.notes);
    }
    if (enrollment?.certificateStatus === "approved") {
      setIsAdminApproved(true);
    }
  }, [enrollment]);

  const handleSaveSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate({
      projectTitle,
      repoUrl,
      demoUrl,
      techStack,
      notes,
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 animate-pulse">
        <div className="h-6 w-36 bg-slate-200 rounded-lg mb-4" />
        <div className="h-44 w-full bg-slate-200 rounded-3xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-32 bg-slate-200 rounded-2xl" />
            <div className="h-64 bg-slate-200 rounded-2xl" />
          </div>
          <div className="h-64 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Payment Gate Check
  const isPendingPayment = enrollment?.paymentStatus === "pending";
  if (isPendingPayment) {
    const pageTitle = course?.title || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-12 text-center space-y-6 my-12">
        <PaymentCheckoutModal
          isOpen={showCheckoutModal}
          onClose={() => setShowCheckoutModal(false)}
          item={{
            id: enrollment?._id || slug,
            title: pageTitle,
            subtitle: "Course Learning Program",
            type: "course",
          }}
        />
        <Card className="p-8 rounded-3xl border-2 border-amber-500/30 bg-gradient-to-b from-amber-500/5 via-white to-amber-500/5 shadow-xl space-y-6">
          <div className="h-16 w-16 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20">
            <Lock className="h-8 w-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 font-bold px-3 py-1">
              Payment Pending
            </Badge>
            <h2 className="text-2xl font-extrabold text-foreground">Payment Required to Access Course Workspace</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have registered for <strong className="text-foreground">{pageTitle}</strong>, but your course enrollment payment is currently pending. Please complete the registration payment to unlock access to instructors, course modules, and project submissions.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button 
              size="lg" 
              onClick={() => setShowCheckoutModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl px-8 shadow-lg shadow-amber-600/20 flex items-center gap-2"
            >
              <CreditCard className="h-5 w-5" /> Pay Now & Unlock Workspace
            </Button>
            <Link href="/student/courses">
              <Button size="lg" variant="outline" className="rounded-xl">
                Back to My Courses
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const title = course?.title || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const category = course?.category || "Software Development";
  const level = course?.level || "Intermediate";
  const durationHours = course?.durationHours || 40;
  const totalLessons = course?.totalLessons || 24;
  const venue = course?.venue || "GrowthCraft Campus Hub • Tech Lab 101";
  
  const isSubmitted = !!(enrollment?.projectSubmission?.submittedAt || repoUrl);
  const hasAttended = enrollment?.isAttended !== false;

  const canUnlockCert = hasAttended && isSubmitted;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-16">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link 
          href="/student/courses" 
          className="inline-flex items-center text-xs sm:text-sm font-medium text-muted-foreground hover:text-magenta transition-colors gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Courses
        </Link>
        <Badge variant="outline" className="w-fit bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 font-semibold text-[10px] sm:text-xs">
          Confirmed Course Enrollment
        </Badge>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-gradient-to-br from-graphite via-slate-900 to-graphite p-5 sm:p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-magenta/15 rounded-full blur-3xl -z-10" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center text-[9px] sm:text-xs font-bold tracking-wider uppercase text-magenta bg-magenta/15 border border-magenta/25 px-2.5 py-1 rounded-full">
                📚 Course Workspace
              </span>
              <span className="inline-flex items-center text-[9px] sm:text-xs font-bold uppercase text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                {category}
              </span>
              <span className="inline-flex items-center text-[9px] sm:text-xs font-bold uppercase text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                Level: {level}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">{title}</h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Track offline campus course modules, collaborate with assigned instructors, complete hands-on technical labs, and submit your final course project.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 text-xs text-slate-300 pt-1.5">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 w-fit">
                <Clock className="h-4 w-4 text-magenta shrink-0" />
                <span>{durationHours} Hours • {totalLessons} Lessons</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 w-fit">
                <MapPin className="h-4 w-4 text-magenta shrink-0" />
                <span className="truncate max-w-[280px] sm:max-w-none">{venue}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
            <a href="#course-project-form" className="w-full">
              <Button size="lg" className="w-full bg-magenta hover:bg-magenta/90 text-white font-medium rounded-xl shadow-lg shadow-magenta/20 flex items-center justify-center gap-2 text-xs sm:text-sm h-11 sm:h-12">
                <Code2 className="h-4 w-4" />
                Jump to Project
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Main Grid: Modules & Form + Instructors & Cert */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Left 2 Columns: Status, Module Curriculum & Project Submission */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          
          {/* Course Progress Card */}
          <Card className="p-4 sm:p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-foreground">Course Status & Record</h2>
              </div>
              <Badge variant="secondary" className="w-fit bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 text-[10px] sm:text-xs">
                Verified Student
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100/80">
                <span className="text-[10px] sm:text-xs text-muted-foreground block font-medium">Instruction Mode</span>
                <span className="text-xs sm:text-sm font-bold text-foreground mt-0.5 block">Campus Labs</span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100/80">
                <span className="text-[10px] sm:text-xs text-muted-foreground block font-medium">Lead Instructor</span>
                <span className="text-xs sm:text-sm font-bold text-foreground mt-0.5 block truncate">
                  {instructors[0]?.name || "Dr. Vikram Sethi"}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100/80">
                <span className="text-[10px] sm:text-xs text-muted-foreground block font-medium">Modules Completed</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600 mt-0.5 block">2 of 4 Modules</span>
              </div>
            </div>
          </Card>

          {/* Module Curriculum Breakdown */}
          <Card className="p-4 sm:p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-magenta shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-foreground">Curriculum Breakdown</h2>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground">Logged by Mentor</span>
            </div>

            <div className="space-y-3 pt-1">
              {modules.map((m: any, idx: number) => {
                const isCompleted = m.status === "Completed";
                const isInProgress = m.status === "In Progress";

                return (
                  <div key={idx} className="p-3 sm:p-4 rounded-xl border border-border bg-slate-50 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <h3 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                        <span className="h-5.5 w-5.5 rounded-full bg-magenta/10 text-magenta font-bold flex items-center justify-center text-[10px] sm:text-xs shrink-0 p-1">
                          {m.moduleNumber}
                        </span>
                        <span>{m.title}</span>
                      </h3>
                      <div className="flex items-center text-[11px] sm:text-xs">
                        {isCompleted ? (
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Completed ({m.lessonsCount} lessons)
                          </span>
                        ) : isInProgress ? (
                          <Badge variant="outline" className="bg-magenta/10 text-magenta border-magenta/20 text-[9px] sm:text-[10px] py-0.5 px-2 font-semibold">
                            IN PROGRESS
                          </Badge>
                        ) : (
                          <span className="text-slate-500 font-medium">Upcoming ({m.lessonsCount} lessons)</span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{m.description}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Course Project Submission Form */}
          <Card id="course-project-form" className="p-4 sm:p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-magenta shrink-0" />
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">Course Project Submission</h2>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Submit your repository link and live app demo for instructor evaluation.</p>
                </div>
              </div>
              {isSubmitted && (
                <Badge className="w-fit bg-emerald-500 text-white font-medium flex items-center gap-1 text-[10px] sm:text-xs px-2.5 py-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Submitted
                </Badge>
              )}
            </div>

            <form onSubmit={handleSaveSubmission} className="space-y-4 pt-1">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Course Project Title</label>
                <input 
                  type="text" 
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Production Application Architecture" 
                  className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-border bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    <span className="flex items-center gap-1"><Github className="h-3.5 w-3.5 text-slate-500" /> GitHub Repository URL</span>
                  </label>
                  <input 
                    type="url" 
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/org/course-project" 
                    className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-border bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    <span className="flex items-center gap-1"><ExternalLink className="h-3.5 w-3.5 text-slate-500" /> Live Demo URL (Optional)</span>
                  </label>
                  <input 
                    type="url" 
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://course-demo.vercel.app" 
                    className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-border bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Technologies Used</label>
                <input 
                  type="text" 
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. React, TypeScript, Express, MongoDB" 
                  className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-border bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Project Overview / Instructor Notes</label>
                <textarea 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Briefly describe what your course project implements..." 
                  className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-border bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  Project submission is required for course certificate approval.
                </p>
                <Button 
                  type="submit" 
                  disabled={submitMutation.isPending}
                  className="w-full sm:w-auto bg-magenta hover:bg-magenta/90 text-white font-medium rounded-xl px-6 flex items-center justify-center gap-2 h-10 text-xs sm:text-sm"
                >
                  <Send className="h-4 w-4" />
                  {submitMutation.isPending ? "Saving..." : "Update Submission"}
                </Button>
              </div>
            </form>
          </Card>

        </div>

        {/* Right Column: Instructors & Certificate Workflow */}
        <div className="space-y-5 sm:space-y-6">
          
          {/* Admin-Assigned Instructors Card */}
          <Card className="p-4 sm:p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-magenta shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-foreground">Instructors</h2>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[9px] sm:text-[10px] flex items-center gap-1 font-semibold px-2 py-0.5">
                <ShieldCheck className="h-3 w-3" /> Admin Assigned
              </Badge>
            </div>
            
            <div className="space-y-2.5">
              {instructors.map((ins: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/80 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-magenta/10 text-magenta font-bold flex items-center justify-center text-xs border border-magenta/20 shrink-0">
                      {ins.name ? ins.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "I"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{ins.name}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{ins.designation || "Lead Instructor"}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => toast.info(`Doubt query sent to ${ins.name}`)}
                    className="h-7 text-[10px] sm:text-xs rounded-lg border-magenta/30 text-magenta hover:bg-magenta/10 px-2.5 shrink-0"
                  >
                    <MessageSquare className="h-3 w-3 mr-1" /> Ask
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Certificate Verification Card */}
          <Card className="p-4 sm:p-6 rounded-2xl border border-border bg-gradient-to-br from-amber-500/5 via-slate-50 to-magenta/5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500 shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-foreground">Course Certificate</h2>
              </div>
              
              {!canUnlockCert ? (
                <Badge variant="outline" className="w-fit bg-slate-100 text-slate-600 border-slate-200 text-[9px] sm:text-[10px] flex items-center gap-1 font-medium py-0.5 px-2">
                  <Lock className="h-3 w-3" /> Locked
                </Badge>
              ) : !isAdminApproved ? (
                <Badge variant="outline" className="w-fit bg-amber-100 text-amber-800 border-amber-300 text-[9px] sm:text-[10px] flex items-center gap-1 font-medium py-0.5 px-2">
                  <Hourglass className="h-3 w-3" /> Awaiting Review
                </Badge>
              ) : (
                <Badge className="w-fit bg-emerald-500 text-white text-[9px] sm:text-[10px] flex items-center gap-1 font-medium py-0.5 px-2">
                  <CheckCircle className="h-3 w-3" /> Verified by Admin
                </Badge>
              )}
            </div>

            {!canUnlockCert ? (
              <div className="space-y-3">
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  Certificate download will unlock once you have <strong className="text-foreground">completed course attendance</strong> and <strong className="text-foreground">submitted your course project</strong>.
                </p>
                <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 bg-white p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-2">
                    {hasAttended ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> : <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />}
                    <span>Attendance: <strong>{hasAttended ? "Verified" : "Pending"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSubmitted ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> : <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />}
                    <span>Course Project: <strong>{isSubmitted ? "Submitted" : "Not Submitted"}</strong></span>
                  </div>
                </div>
                <Button 
                  disabled
                  className="w-full bg-slate-200 text-slate-500 font-medium rounded-xl flex items-center justify-center gap-2 cursor-not-allowed h-10 text-xs sm:text-sm"
                >
                  <Lock className="h-4 w-4" />
                  Submit Project to Unlock
                </Button>
              </div>
            ) : !isAdminApproved ? (
              <div className="space-y-3">
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  Your project submission has been logged. GrowthCraft Admins are verifying your submission before issuing your official course certificate.
                </p>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-900 space-y-1.5">
                  <div className="text-xs font-semibold flex items-center gap-1">
                    <Hourglass className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Details Submitted for Admin Review
                  </div>
                  <p className="text-[10px] text-amber-800 leading-relaxed">
                    Admin verification ensures valid project code repository and course attendance proof.
                  </p>
                </div>

                <Button 
                  disabled
                  className="w-full bg-amber-500/20 text-amber-800 border border-amber-500/30 font-medium rounded-xl flex items-center justify-center gap-2 cursor-not-allowed h-10 text-xs sm:text-sm"
                >
                  <Hourglass className="h-4 w-4 animate-spin" />
                  Awaiting Admin Approval
                </Button>

                <button
                  onClick={() => {
                    setIsAdminApproved(true);
                    toast.success("Admin verification simulated! Certificate unlocked.");
                  }}
                  className="text-[10px] text-magenta underline hover:text-magenta/80 block mx-auto pt-1 font-medium"
                >
                  [Simulate Admin Approval for Testing]
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  Congratulations! Your course project has been verified and approved by GrowthCraft Admin. Download your course certificate below.
                </p>
                
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] sm:text-xs">Verified by Admin • Serial No: GC-CRS-2026-3391</span>
                </div>

                <Button 
                  onClick={() => {
                    toast.success("Certificate download started!", {
                      description: "Your verified PDF course certificate is downloading."
                    });
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-md h-10 text-xs sm:text-sm"
                >
                  <Download className="h-4 w-4 text-emerald-400" />
                  Download Official Certificate
                </Button>
              </div>
            )}
          </Card>

        </div>

      </div>
    </div>
  );
}
