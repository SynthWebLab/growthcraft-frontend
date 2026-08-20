"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  MapPin, 
  UserCheck, 
  CheckCircle2, 
  Github, 
  ExternalLink, 
  ArrowLeft, 
  Send, 
  Users, 
  QrCode, 
  Sparkles, 
  Download, 
  Code2, 
  AlertCircle,
  MessageSquare,
  Award,
  ShieldCheck,
  Video,
  Globe,
  Laptop,
  Check,
  Lock,
  Hourglass,
  CheckCircle,
  CreditCard,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useStudentTrainingProgramWorkspace, useSubmitTrainingProgramProject } from "@/hooks/queries/useStudent";
import { PaymentCheckoutModal } from "@/components/dashboard/payment-checkout-modal";

export default function StudentTrainingProgramWorkspacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // Fetch dynamic training program workspace data from API
  const { data: workspaceRes, isLoading } = useStudentTrainingProgramWorkspace(slug);
  const submitMutation = useSubmitTrainingProgramProject(slug);

  const workspaceData = workspaceRes?.data || workspaceRes;
  const program = workspaceData?.program;
  const enrollment = workspaceData?.enrollment;
  const mentors = workspaceData?.mentors || [];
  
  const DEFAULT_PROGRAM_PHASES = [
    { phase: 1, name: "Orientation & Architecture Setup", status: "Completed", description: "Industry onboarding, toolchains setup, and microservices architecture." },
    { phase: 2, name: "Core Domain Deep-Dive & Mentor Labs", status: "Completed", description: "Guided industrial modules, live coding sessions, and mentor reviews." },
    { phase: 3, name: "Industrial Capstone Project Build", status: "In Progress", description: "Real-world industrial capstone build under senior mentor supervision." },
    { phase: 4, name: "Jury Evaluation & Placement Sign-off", status: "Upcoming", description: "Capstone evaluation by hiring partners and certificate issuance." },
  ];

  const phases = (workspaceData?.phases && workspaceData.phases.length > 0) ? workspaceData.phases : DEFAULT_PROGRAM_PHASES;

  // Form & Modal state
  const [projectTitle, setProjectTitle] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [techStack, setTechStack] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassModal, setShowPassModal] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
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

  const handleSelfCheckin = () => {
    setIsCheckedIn(true);
    toast.success("Industrial Training Check-in confirmed!", {
      description: "Your training program attendance has been logged."
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
    const pageTitle = program?.title || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-12 text-center space-y-6 my-12">
        <PaymentCheckoutModal
          isOpen={showPassModal}
          onClose={() => setShowPassModal(false)}
          item={{
            id: enrollment?._id || slug,
            title: pageTitle,
            subtitle: "Industrial Training Program",
            type: "training-program",
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
            <h2 className="text-2xl font-extrabold text-foreground">Payment Required to Access Training Workspace</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have registered for <strong className="text-foreground">{pageTitle}</strong>, but your training program enrollment payment is currently pending. Please complete the registration payment to unlock access to industry mentors, training passes, and capstone submissions.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button 
              size="lg" 
              onClick={() => setShowPassModal(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl px-8 shadow-lg shadow-amber-600/20 flex items-center gap-2"
            >
              <CreditCard className="h-5 w-5" /> Pay Now & Unlock Workspace
            </Button>
            <Link href="/student/training-programs">
              <Button size="lg" variant="outline" className="rounded-xl">
                Back to My Training Programs
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const title = program?.title || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const domain = program?.domain || "Industrial Engineering & SaaS";
  
  // Dynamic Mode detection
  const programMode = (program?.mode || "Offline").toLowerCase();
  const isOnline = programMode === "online" || programMode.includes("online") || /online/i.test(slug);
  const venue = isOnline 
    ? "Online Training • GrowthCraft Live Enterprise Stream" 
    : (program?.venue || "GrowthCraft Campus Hub • Industrial Training Center");
  
  const checkinCode = enrollment?.checkinCode || "GC-TRN-2026-7788";
  const isSubmitted = !!(enrollment?.projectSubmission?.submittedAt || repoUrl);
  const hasAttended = isCheckedIn || (enrollment?.isAttended !== false);

  const canUnlockCert = hasAttended && isSubmitted;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto p-4 sm:p-6 pb-16">
      {/* Header Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link 
          href="/student/training-programs" 
          className="inline-flex items-center text-xs sm:text-sm font-medium text-muted-foreground hover:text-magenta transition-colors gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Training Programs
        </Link>
        <Badge variant="outline" className="w-fit bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 font-semibold text-[10px] sm:text-xs">
          Confirmed Industrial Registration
        </Badge>
      </div>

      {/* Hero Workspace Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-gradient-to-br from-graphite via-slate-900 to-graphite p-5 sm:p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-magenta/15 rounded-full blur-3xl -z-10" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="inline-flex items-center text-[9px] sm:text-xs font-bold tracking-wider uppercase text-magenta bg-magenta/15 border border-magenta/25 px-2.5 py-1 rounded-full">
                💼 Industrial Training Workspace
              </span>
              <span className="inline-flex items-center text-[9px] sm:text-xs font-bold uppercase text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                {isOnline ? "🌐 Online Stream" : "🏛️ Offline Industrial Hub"}
              </span>
              <span className="inline-flex items-center text-[9px] sm:text-xs font-bold uppercase text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                {domain}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">{title}</h1>
            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Industrial campus training workspace. Access live enterprise modules, collaborate with Admin-assigned industry mentors, build industrial capstones, and track placement readiness.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 text-xs text-slate-300 pt-1.5">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 w-fit">
                <Briefcase className="h-4 w-4 text-magenta shrink-0" />
                <span className="truncate max-w-[280px] sm:max-w-none">Industry Capstone Track</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 w-fit">
                {isOnline ? <Globe className="h-4 w-4 text-magenta shrink-0" /> : <MapPin className="h-4 w-4 text-magenta shrink-0" />}
                <span className="truncate max-w-[280px] sm:max-w-none">{venue}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px] w-full lg:w-auto">
            <Button 
              onClick={() => setShowPassModal(!showPassModal)}
              className="w-full bg-magenta hover:bg-magenta/90 text-white font-medium rounded-xl shadow-lg shadow-magenta/20 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm h-11 sm:h-12"
            >
              {isOnline ? <Video className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
              {isOnline ? "Virtual Pass & Stream" : "Campus Training Pass"}
            </Button>
            <a href="#industrial-capstone-form" className="w-full">
              <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm h-11 sm:h-12">
                <Code2 className="h-4 w-4" />
                Jump to Capstone
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Mode-Aware Pass Modal / Alert Card */}
      {showPassModal && (
        <Card className="p-4 sm:p-6 border-2 border-magenta/40 bg-gradient-to-r from-magenta/5 to-purple-500/5 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 w-full">
              <div className="p-3 bg-magenta/10 rounded-2xl text-magenta border border-magenta/20 w-fit shrink-0">
                {isOnline ? <Video className="h-6 w-6 sm:h-8 sm:w-8" /> : <QrCode className="h-6 w-6 sm:h-8 sm:w-8" />}
              </div>
              <div className="space-y-1.5 w-full min-w-0">
                <h3 className="font-bold text-sm sm:text-lg text-foreground flex flex-wrap items-center gap-2 leading-none">
                  {isOnline ? "Virtual Training Pass & Stream" : "Industrial Campus Pass Token"}
                  <Badge className="bg-emerald-500 text-white text-[9px] sm:text-[10px] px-2 py-0.5">
                    {hasAttended ? "VERIFIED PRESENT" : "INDUSTRIAL PASS"}
                  </Badge>
                </h3>
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  {isOnline 
                    ? "Click to join the virtual enterprise live stream or perform 1-click online check-in." 
                    : "Show this pass code to your GrowthCraft Industrial Mentor or click self check-in."}
                </p>
                
                {isOnline ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1.5 w-full">
                    <a 
                      href={mentors[0]?.meetingLink || "https://meet.google.com/gc-training-room"} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full sm:w-auto"
                    >
                      <Button size="sm" className="w-full bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg flex items-center justify-center gap-1.5 font-medium shadow-sm text-xs py-1.5 px-3">
                        <Video className="h-3.5 w-3.5" /> Join Live Stream
                      </Button>
                    </a>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleSelfCheckin}
                      disabled={hasAttended}
                      className="w-full sm:w-auto border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1.5 text-xs py-1.5 px-3"
                    >
                      <Check className="h-3.5 w-3.5" /> {hasAttended ? "Checked-in" : "1-Click Virtual Check-in"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1.5 w-full">
                    <div className="font-mono text-xs sm:text-sm font-bold tracking-widest text-magenta bg-white border border-border px-3.5 py-1.5 rounded-lg shadow-sm w-fit">
                      {checkinCode}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleSelfCheckin}
                      disabled={hasAttended}
                      className="w-full sm:w-auto border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center justify-center gap-1.5 text-xs py-1.5 px-3"
                    >
                      <Check className="h-3.5 w-3.5" /> {hasAttended ? "Attendance Marked" : "Self Check-in at Campus"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setShowPassModal(false)}
              className="text-xs text-muted-foreground hover:text-foreground shrink-0 w-full sm:w-auto mt-2 sm:mt-0"
            >
              Dismiss
            </Button>
          </div>
        </Card>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        
        {/* Left 2 Columns: Status, Milestones & Capstone Form */}
        <div className="lg:col-span-2 space-y-5 sm:space-y-6">
          
          {/* Status & Participation Card */}
          <Card className="p-4 sm:p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-foreground">Training Record & Participation</h2>
              </div>
              <Badge variant="secondary" className="w-fit bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 text-[10px] sm:text-xs">
                Verified Industrial Student
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100/80">
                <span className="text-[10px] sm:text-xs text-muted-foreground block font-medium">Training Center</span>
                <span className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center gap-1 mt-0.5 truncate">
                  {isOnline ? <Laptop className="h-3.5 w-3.5 shrink-0" /> : <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
                  {isOnline ? "Virtual Stream" : "Campus Hub"}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100/80">
                <span className="text-[10px] sm:text-xs text-muted-foreground block font-medium">Lead Mentor</span>
                <span className="text-xs sm:text-sm font-bold text-foreground mt-0.5 block truncate">
                  {mentors[0]?.name || "Suresh Menon"}
                </span>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-100/80">
                <span className="text-[10px] sm:text-xs text-muted-foreground block font-medium">Training Track</span>
                <span className="text-xs sm:text-sm font-bold text-foreground mt-0.5 block truncate">{domain}</span>
              </div>
            </div>
          </Card>

          {/* Program Milestones & Phases */}
          <Card className="relative overflow-hidden p-4 sm:p-6 rounded-2xl border border-border bg-white shadow-sm">
            {/* Lightly Blurred Content, text remains legible */}
            <div className="filter blur-[0.8px] opacity-75 space-y-4 select-none pointer-events-none">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-magenta shrink-0" />
                  <h2 className="text-base sm:text-lg font-bold text-foreground">Timeline & Milestones</h2>
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground">Phase 3 Active</span>
              </div>

              <div className="relative border-l-2 border-slate-200 ml-2 space-y-5 pt-2 pb-1">
                {phases.map((p: any, idx: number) => {
                  const isCompleted = p.status === "Completed";
                  const isInProgress = p.status === "In Progress";

                  return (
                    <div key={idx} className="relative pl-5">
                      <span 
                        className={`absolute -left-[9px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white ${
                          isCompleted 
                            ? "bg-emerald-500 ring-2 ring-emerald-100" 
                            : isInProgress 
                            ? "bg-magenta ring-4 ring-magenta/20 animate-pulse" 
                            : "bg-slate-300"
                        }`} 
                      />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className={`text-xs sm:text-sm font-bold ${isInProgress ? "text-magenta" : "text-foreground"}`}>
                          Phase {p.phase}: {p.name}
                        </h3>
                        <div className="flex items-center text-[10px] sm:text-xs">
                          {isCompleted ? (
                            <span className="text-emerald-600 font-medium flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                            </span>
                          ) : isInProgress ? (
                            <Badge variant="outline" className="bg-magenta/10 text-magenta border-magenta/20 text-[9px] sm:text-[10px] py-0.5 px-2 font-semibold">
                              IN PROGRESS
                            </Badge>
                          ) : (
                            <span className="text-slate-500 font-medium">Upcoming</span>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[0.5px] z-10 p-4 text-center">
              <div className="bg-slate-900/95 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-lg border border-white/10 backdrop-blur-md flex items-center gap-2">
                <Hourglass className="h-4 w-4 text-amber-400 animate-pulse" />
                <span>Coming Soon</span>
              </div>
            </div>
          </Card>

          {/* Industrial Capstone Form */}
          <Card id="industrial-capstone-form" className="p-4 sm:p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-magenta shrink-0" />
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground">Industrial Capstone Submission</h2>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">Keep your enterprise capstone repository and demo URL updated for hiring partner evaluation.</p>
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
                <label className="text-xs font-semibold text-foreground block mb-1.5">Industrial Capstone Title</label>
                <input 
                  type="text" 
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Enterprise Cloud Microservices Engine" 
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
                    placeholder="https://github.com/org/industrial-capstone" 
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
                    placeholder="https://industrial-demo.vercel.app" 
                    className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-border bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Technologies & Cloud Architecture</label>
                <input 
                  type="text" 
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. Full-Stack, Docker, Kubernetes, AWS, MongoDB" 
                  className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-border bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Capstone Overview & Industrial Notes</label>
                <textarea 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your industrial capstone implementation..." 
                  className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl border border-border bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <p className="text-[11px] sm:text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  Capstone submission is required for industrial certificate issuance.
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

        {/* Right Column: Mentors & Certificate Workflow */}
        <div className="space-y-5 sm:space-y-6">
          
          {/* Industry Mentors Card */}
          <Card className="p-4 sm:p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-magenta shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-foreground">Industry Mentors</h2>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[9px] sm:text-[10px] flex items-center gap-1 font-semibold px-2 py-0.5">
                <ShieldCheck className="h-3 w-3" /> Admin Verified
              </Badge>
            </div>
            
            <div className="space-y-2.5">
              {mentors.map((m: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100/80 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-full bg-magenta/10 text-magenta font-bold flex items-center justify-center text-xs border border-magenta/20 shrink-0">
                      {m.name ? m.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "M"}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">{m.name}</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{m.designation || "Industrial Training Lead"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button 
                      size="sm" 
                      disabled
                      className="h-7 text-[10px] sm:text-xs rounded-lg bg-slate-100 border border-slate-200 text-slate-400 font-medium flex items-center gap-1 px-2 cursor-not-allowed"
                    >
                      <MessageSquare className="h-3 w-3 text-slate-400" /> Ask
                    </Button>
                    <Button 
                      size="sm" 
                      disabled
                      className="h-7 text-[10px] sm:text-xs rounded-lg bg-slate-100 border border-slate-200 text-slate-400 font-medium flex items-center gap-1 px-2 cursor-not-allowed"
                    >
                      <Video className="h-3 w-3 text-slate-400" /> Call
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Certificate Verification Card */}
          <Card className="p-4 sm:p-6 rounded-2xl border border-border bg-gradient-to-br from-amber-500/5 via-slate-50 to-magenta/5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500 shrink-0" />
                <h2 className="text-base sm:text-lg font-bold text-foreground">Industrial Certificate</h2>
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
                  Certificate download will unlock once you have <strong className="text-foreground">completed training attendance</strong> and <strong className="text-foreground">submitted your industrial capstone</strong>.
                </p>
                <div className="space-y-1.5 text-[11px] sm:text-xs text-slate-600 bg-white p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-2">
                    {hasAttended ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> : <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />}
                    <span>Attendance Status: <strong>{hasAttended ? "Verified" : "Pending Check-in"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSubmitted ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> : <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />}
                    <span>Industrial Capstone: <strong>{isSubmitted ? "Submitted" : "Not Submitted"}</strong></span>
                  </div>
                </div>
                <Button 
                  disabled
                  className="w-full bg-slate-200 text-slate-500 font-medium rounded-xl flex items-center justify-center gap-2 cursor-not-allowed h-10 text-xs sm:text-sm"
                >
                  <Lock className="h-4 w-4" />
                  Submit Capstone to Unlock
                </Button>
              </div>
            ) : !isAdminApproved ? (
              <div className="space-y-3">
                <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">
                  Your industrial capstone has been submitted. GrowthCraft Admins and hiring partners are evaluating your submission before issuing your official industrial certificate.
                </p>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-900 space-y-1.5">
                  <div className="text-xs font-semibold flex items-center gap-1">
                    <Hourglass className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Details Submitted for Admin Review
                  </div>
                  <p className="text-[10px] text-amber-800 leading-relaxed">
                    Admin verification ensures valid capstone code repository and training attendance proof.
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
                  Congratulations! Your industrial training capstone has been verified and approved by GrowthCraft Admin. Download your official certificate below.
                </p>
                
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] sm:text-xs font-medium">Verified by Admin • Serial No: GC-TRN-2026-7788</span>
                </div>

                <Button 
                  onClick={() => {
                    toast.success("Certificate download started!", {
                      description: "Your verified PDF industrial training certificate is downloading."
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
