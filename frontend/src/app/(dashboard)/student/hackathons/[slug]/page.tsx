"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { 
  Trophy, 
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
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useStudentHackathonWorkspace, useSubmitHackathonProject } from "@/hooks/queries/useStudent";

export default function StudentHackathonWorkspacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  // Fetch dynamic workspace data from API
  const { data: workspaceRes, isLoading, isError } = useStudentHackathonWorkspace(slug);
  const submitMutation = useSubmitHackathonProject(slug);

  const workspaceData = workspaceRes?.data || workspaceRes;
  const event = workspaceData?.event;
  const enrollment = workspaceData?.enrollment;
  const mentors = workspaceData?.mentors || [];
  const DEFAULT_MENTOR_PHASES = [
    { phase: 1, name: "Mentor Orientation & Team Registration", status: "Completed", description: "Assigned Campus Mentor verifies team roster and completes student check-in." },
    { phase: 2, name: "Mentor Problem Briefing & Track Allocation", status: "Completed", description: "Mentor releases track problem statements and conducts technical brief." },
    { phase: 3, name: "Mentor Architecture Review (Checkpoint 1)", status: "Completed", description: "1:1 mentor code review, database schema evaluation, and tech stack approval." },
    { phase: 4, name: "Mentor Mid-way Demo & Code Audit (Checkpoint 2)", status: "Completed", description: "Campus mentor audits progress, reviews GitHub commits, and provides feedback." },
    { phase: 5, name: "Mentor Final Pitch & Project Evaluation", status: "Completed", description: "Campus mentor & Admin jury evaluate final submission and sign off for certificate." },
  ];

  const phases = (workspaceData?.phases && workspaceData.phases.length > 0) ? workspaceData.phases : DEFAULT_MENTOR_PHASES;

  // Form & Check-in state
  const [projectTitle, setProjectTitle] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [techStack, setTechStack] = useState("");
  const [notes, setNotes] = useState("");
  const [showPassModal, setShowPassModal] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  
  // Admin approval state for certificate
  const [isAdminApproved, setIsAdminApproved] = useState(false);

  // Sync form & certificate state when API data loads
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
    toast.success("Check-in confirmed!", {
      description: "Your attendance status has been updated and recorded."
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

  const title = event?.title || slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const rawStart = event?.startDate || "2026-06-25T09:00:00Z";
  const rawEnd = event?.endDate || "2026-06-26T18:00:00Z";
  const startObj = new Date(rawStart);
  const endObj = new Date(rawEnd);
  const now = new Date();

  const startDate = !isNaN(startObj.getTime()) ? startObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "June 25, 2026 • 09:00 AM";
  const endDate = !isNaN(endObj.getTime()) ? endObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "June 26, 2026 • 06:00 PM";
  
  // Mode detection
  const eventMode = (event?.mode || "Offline").toLowerCase();
  const isOnline = eventMode === "online";
  const venue = isOnline 
    ? "Online Event • GrowthCraft Live Stream" 
    : (event?.venue || "GrowthCraft Campus Hub • Lab 402");
  
  const checkinCode = enrollment?.checkinCode || "GC-HACK-2026-8942";
  const isSubmitted = !!(enrollment?.projectSubmission?.submittedAt || repoUrl);
  const hasAttended = isCheckedIn || (enrollment?.isAttended !== false);

  let computedStatus: "Open" | "Live" | "Closed" = "Closed";
  if (!isNaN(startObj.getTime()) && !isNaN(endObj.getTime())) {
    if (now > endObj) {
      computedStatus = "Closed";
    } else if (now >= startObj && now <= endObj) {
      computedStatus = "Live";
    } else {
      computedStatus = "Open";
    }
  }

  // Attendance Tag Status
  let attendanceTagLabel = "Check-in Pending";
  let attendanceTagClass = "bg-amber-100 text-amber-800";

  if (computedStatus === "Closed") {
    if (hasAttended) {
      attendanceTagLabel = "Attended";
      attendanceTagClass = "bg-emerald-100 text-emerald-700";
    } else {
      attendanceTagLabel = "Not Attended";
      attendanceTagClass = "bg-rose-100 text-rose-700";
    }
  } else {
    if (hasAttended) {
      attendanceTagLabel = "Present (Verified)";
      attendanceTagClass = "bg-emerald-100 text-emerald-700";
    }
  }

  // Certificate Workflow State
  const canUnlockCert = hasAttended && isSubmitted;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-3 md:p-6 pb-16">
      {/* Navigation & Status Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/student/hackathons" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-magenta transition-colors gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Hackathons
        </Link>
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 font-semibold text-xs">
          Confirmed Enrollment
        </Badge>
      </div>

      {/* Hero Workspace Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-graphite via-slate-900 to-graphite p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-magenta/15 rounded-full blur-3xl -z-10" />
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center text-xs font-bold tracking-wider uppercase text-magenta bg-magenta/15 border border-magenta/25 px-3 py-1 rounded-full">
                🏆 Hackathon Workspace
              </span>
              <span className="inline-flex items-center text-xs font-bold uppercase text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full">
                {isOnline ? "🌐 Online Event" : "🏛️ Offline Campus Event"}
              </span>
              {computedStatus === "Live" && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full animate-pulse">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Live
                </span>
              )}
              {computedStatus === "Open" && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  Open
                </span>
              )}
              {computedStatus === "Closed" && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  Closed
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{title}</h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Welcome to your hackathon workspace. Track event timeline, verify attendance, collaborate with Admin-assigned mentors, and submit your project demo.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-300 pt-2">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <Calendar className="h-4 w-4 text-magenta" />
                <span>Starts: {startDate}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <Clock className="h-4 w-4 text-magenta" />
                <span>Ends: {endDate}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                {isOnline ? <Globe className="h-4 w-4 text-magenta" /> : <MapPin className="h-4 w-4 text-magenta" />}
                <span>{venue}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
            <Button 
              onClick={() => setShowPassModal(!showPassModal)}
              className="bg-magenta hover:bg-magenta/90 text-white font-medium rounded-xl shadow-lg shadow-magenta/20 transition-all flex items-center gap-2"
            >
              {isOnline ? <Video className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
              {isOnline ? "Virtual Pass & Check-in" : "Campus Pass & Check-in"}
            </Button>
            <a href="#submission-form">
              <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium rounded-xl flex items-center gap-2">
                <Code2 className="h-4 w-4" />
                Jump to Submission
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Mode-Aware Pass Modal / Alert Card */}
      {showPassModal && (
        <Card className="p-6 border-2 border-magenta/40 bg-gradient-to-r from-magenta/5 to-purple-500/5 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-magenta/10 rounded-2xl text-magenta border border-magenta/20">
                {isOnline ? <Video className="h-8 w-8" /> : <QrCode className="h-8 w-8" />}
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  {isOnline ? "Virtual Event Pass & Meeting Link" : "Campus Check-in Token"}
                  <Badge className="bg-emerald-500 text-white text-[10px]">
                    {hasAttended ? "VERIFIED PRESENT" : "ATTENDANCE PASS"}
                  </Badge>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isOnline 
                    ? "Click to join the virtual hackathon session room or perform 1-click online check-in." 
                    : "Show this pass code to your GrowthCraft Campus Mentor or click self check-in."}
                </p>
                
                {isOnline ? (
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <a 
                      href="https://meet.growthcraft.in/live-room" 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <Button size="sm" className="bg-magenta text-white hover:bg-magenta/90 rounded-lg flex items-center gap-1.5">
                        <Video className="h-4 w-4" /> Join Virtual Room
                      </Button>
                    </a>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleSelfCheckin}
                      disabled={hasAttended}
                      className="border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1.5"
                    >
                      <Check className="h-4 w-4" /> {hasAttended ? "Checked-in" : "1-Click Virtual Check-in"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <div className="font-mono text-sm font-bold tracking-widest text-magenta bg-white border border-border px-3.5 py-1.5 rounded-lg shadow-sm">
                      {checkinCode}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleSelfCheckin}
                      disabled={hasAttended}
                      className="border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 rounded-lg flex items-center gap-1.5"
                    >
                      <Check className="h-4 w-4" /> {hasAttended ? "Attendance Marked" : "Self Check-in at Campus"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => setShowPassModal(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              Dismiss
            </Button>
          </div>
        </Card>
      )}

      {/* Main Grid: Status & Submission + Admin Mentors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Attendance Status, Timeline & Submission Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Attendance & Student Participation Card */}
          <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-foreground">Attendance & Participation Status</h2>
              </div>
              <Badge variant="secondary" className={`font-bold px-3 py-1 ${attendanceTagClass}`}>
                {attendanceTagLabel}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-muted-foreground block font-medium">Check-in Mode</span>
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-1">
                  {isOnline ? <Laptop className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  {isOnline ? "Virtual Check-in" : "Campus QR Check-in"}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-muted-foreground block font-medium">Admin-Assigned Mentor</span>
                <span className="text-sm font-bold text-foreground mt-1 block">
                  {mentors[0]?.name || "Prof. R. Sharma"}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-muted-foreground block font-medium">Team Role</span>
                <span className="text-sm font-bold text-foreground mt-1 block">Lead Developer</span>
              </div>
            </div>

            {!hasAttended && computedStatus !== "Closed" && (
              <div className="pt-1 flex items-center justify-between bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
                <span className="text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 text-emerald-600" />
                  Have you arrived at the campus lab / joined the live room?
                </span>
                <Button size="sm" onClick={handleSelfCheckin} className="bg-emerald-600 text-white hover:bg-emerald-700 h-8 text-xs px-3">
                  Check-in Now
                </Button>
              </div>
            )}
          </Card>

          {/* Hackathon Milestones & Phase Schedule */}
          <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-magenta" />
                <h2 className="text-lg font-bold text-foreground">Hackathon Timeline & Milestones</h2>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {computedStatus === "Closed" ? "All 5 Phases Concluded" : computedStatus === "Live" ? "Phase 3 of 5 Active" : "Starting Soon"}
              </span>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pt-2 pb-1">
              {phases.map((p: any, idx: number) => {
                const phaseStatus = (() => {
                  if (computedStatus === "Closed") return "Completed";
                  if (computedStatus === "Live") {
                    if (p.phase < 3) return "Completed";
                    if (p.phase === 3) return "In Progress";
                    return "Upcoming";
                  }
                  // Open status (not started yet)
                  if (p.phase === 1) return "In Progress";
                  return "Upcoming";
                })();

                const isCompleted = phaseStatus === "Completed";
                const isInProgress = phaseStatus === "In Progress";

                return (
                  <div key={idx} className="relative pl-6">
                    <span 
                      className={`absolute -left-[9px] top-0.5 h-4 w-4 rounded-full border-2 border-white ${
                        isCompleted 
                          ? "bg-emerald-500 ring-2 ring-emerald-100" 
                          : isInProgress 
                          ? "bg-magenta ring-4 ring-magenta/20 animate-pulse" 
                          : "bg-slate-300"
                      }`} 
                    />
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-bold ${isInProgress ? "text-magenta" : "text-foreground"}`}>
                        Phase {p.phase}: {p.name}
                      </h3>
                      {isCompleted ? (
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                        </span>
                      ) : isInProgress ? (
                        <Badge variant="outline" className="bg-magenta/10 text-magenta border-magenta/20 text-[10px]">
                          IN PROGRESS
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-500 font-medium">Upcoming</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.description}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Project Submission Workspace Form */}
          <Card id="submission-form" className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-magenta" />
                <div>
                  <h2 className="text-lg font-bold text-foreground">Project Submission Workspace</h2>
                  <p className="text-xs text-muted-foreground">Keep your team repository and demo URL updated for mentor & admin review.</p>
                </div>
              </div>
              {isSubmitted && (
                <Badge className="bg-emerald-500 text-white font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Submitted
                </Badge>
              )}
            </div>

            <form onSubmit={handleSaveSubmission} className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Project Title</label>
                <input 
                  type="text" 
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="e.g. Smart Campus AI Helper" 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    <span className="flex items-center gap-1"><Github className="h-3.5 w-3.5" /> GitHub Repository URL</span>
                  </label>
                  <input 
                    type="url" 
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/org/repo" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1.5">
                    <span className="flex items-center gap-1"><ExternalLink className="h-3.5 w-3.5" /> Live Demo URL (Optional)</span>
                  </label>
                  <input 
                    type="url" 
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://my-demo.vercel.app" 
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Technologies Used</label>
                <input 
                  type="text" 
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  placeholder="e.g. Next.js, Node.js, MongoDB" 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Project Overview / Mentor Notes</label>
                <textarea 
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Briefly describe what your hackathon project does..." 
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-magenta/30"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                  Your project submission is required for certificate approval.
                </p>
                <Button 
                  type="submit" 
                  disabled={submitMutation.isPending}
                  className="bg-magenta hover:bg-magenta/90 text-white font-medium rounded-xl px-6 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {submitMutation.isPending ? "Saving..." : "Update Submission"}
                </Button>
              </div>
            </form>
          </Card>

        </div>

        {/* Right Column: Admin-Assigned Mentors & Certificate Workflow */}
        <div className="space-y-6">
          
          {/* Admin-Decided / Admin-Assigned Mentors Card */}
          <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-magenta" />
                <h2 className="text-lg font-bold text-foreground">Admin-Assigned Mentors</h2>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Admin Verified
              </Badge>
            </div>
            
            <div className="space-y-3">
              {mentors.map((m: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-magenta/10 text-magenta font-bold flex items-center justify-center text-sm border border-magenta/20">
                      {m.name ? m.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "M"}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{m.name}</h4>
                      <p className="text-xs text-muted-foreground">{m.designation || m.areaOfExpertise || "Campus Mentor"}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => toast.info(`Session query sent to ${m.name}`)}
                    className="h-8 text-xs rounded-lg border-magenta/30 text-magenta hover:bg-magenta/10"
                  >
                    <MessageSquare className="h-3.5 w-3.5 mr-1" /> Ask
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Certificate Verification & Download Card */}
          <Card className="p-6 rounded-2xl border border-border bg-gradient-to-br from-amber-500/5 via-slate-50 to-magenta/5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-bold text-foreground">Event Certificate</h2>
              </div>
              
              {/* Badge based on Certificate Workflow */}
              {!canUnlockCert ? (
                <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Locked
                </Badge>
              ) : !isAdminApproved ? (
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 text-[10px] flex items-center gap-1">
                  <Hourglass className="h-3 w-3" /> Awaiting Admin Approval
                </Badge>
              ) : (
                <Badge className="bg-emerald-500 text-white text-[10px] flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Verified by Admin
                </Badge>
              )}
            </div>

            {/* Workflow Message & Actions */}
            {!canUnlockCert ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Certificate download will unlock once you have <strong className="text-foreground">attended the event</strong> and <strong className="text-foreground">submitted your project assignment</strong>.
                </p>
                <div className="space-y-1.5 text-xs text-slate-600 bg-white p-3 rounded-xl border border-border">
                  <div className="flex items-center gap-2">
                    {hasAttended ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-amber-500" />}
                    <span>Attendance Status: <strong>{hasAttended ? "Verified" : "Pending Check-in"}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSubmitted ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-amber-500" />}
                    <span>Project Assignment: <strong>{isSubmitted ? "Submitted" : "Not Submitted"}</strong></span>
                  </div>
                </div>
                <Button 
                  disabled
                  className="w-full bg-slate-200 text-slate-500 font-medium rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Lock className="h-4 w-4" />
                  Submit Project to Unlock
                </Button>
              </div>
            ) : !isAdminApproved ? (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Your attendance and project submission have been logged. GrowthCraft Admins are verifying your details before issuing your official certificate.
                </p>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-900 space-y-1">
                  <div className="font-semibold flex items-center gap-1">
                    <Hourglass className="h-3.5 w-3.5 text-amber-600" /> Details Submitted for Admin Review
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Admin verification ensures valid project repository and attendance proof.
                  </p>
                </div>

                <Button 
                  disabled
                  className="w-full bg-amber-500/20 text-amber-800 border border-amber-500/30 font-medium rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <Hourglass className="h-4 w-4 animate-spin" />
                  Awaiting Admin Approval
                </Button>

                {/* Simulation Button for Testing/Demo */}
                <button
                  onClick={() => {
                    setIsAdminApproved(true);
                    toast.success("Admin verification simulated! Certificate unlocked.");
                  }}
                  className="text-[11px] text-magenta underline hover:text-magenta/80 block mx-auto pt-1"
                >
                  [Simulate Admin Approval for Testing]
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Congratulations! Your attendance and project submission have been verified and approved by GrowthCraft Admin. Download your certificate below.
                </p>
                
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Verified by Admin • Serial No: GC-CERT-2026-8942</span>
                </div>

                <Button 
                  onClick={() => {
                    toast.success("Certificate download started!", {
                      description: "Your verified PDF certificate is downloading."
                    });
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 shadow-md"
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
