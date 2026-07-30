"use client";

import { use, useState } from "react";
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
  FileText,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { getEventDetailBySlug } from "@/data/events-detail.mock";

export default function StudentHackathonWorkspacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  
  // Try fetching event details from mock/store (fallback if needed)
  const detail = getEventDetailBySlug(slug);
  const event = detail?.data?.event;

  // State for project submission form
  const [projectTitle, setProjectTitle] = useState("AI Workspace Builder");
  const [repoUrl, setRepoUrl] = useState("https://github.com/growthcraft/hackathon-submission");
  const [demoUrl, setDemoUrl] = useState("https://hackathon-demo.growthcraft.in");
  const [techStack, setTechStack] = useState("Next.js, TypeScript, Tailwind, MongoDB");
  const [notes, setNotes] = useState("Building an offline-first workspace dashboard for campus students.");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(true);

  // State for check-in modal/pass
  const [showPassModal, setShowPassModal] = useState(false);

  const title = event?.title || (slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
  const startDate = event?.startDate ? new Date(event.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "June 25, 2026 • 09:00 AM";
  const endDate = event?.endDate ? new Date(event.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "June 26, 2026 • 06:00 PM";
  const venue = event?.venue?.name || "GrowthCraft Campus Hub • Lab 402";

  const handleSaveSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast.success("Project submission updated successfully!", {
        description: "Your hackathon submission has been logged for mentor evaluation."
      });
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-3 md:p-6 pb-16">
      {/* Navigation & Header */}
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
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full animate-pulse">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Live / In-Progress
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">{title}</h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              Welcome to your hackathon workspace. Track event timeline, verify campus attendance, collaborate with mentors, and submit your final project demo.
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
                <MapPin className="h-4 w-4 text-magenta" />
                <span>{venue}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[200px]">
            <Button 
              onClick={() => setShowPassModal(!showPassModal)}
              className="bg-magenta hover:bg-magenta/90 text-white font-medium rounded-xl shadow-lg shadow-magenta/20 transition-all flex items-center gap-2"
            >
              <QrCode className="h-4 w-4" />
              Campus Pass & Check-in
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

      {/* Campus Check-in Pass Modal / Alert Card */}
      {showPassModal && (
        <Card className="p-6 border-2 border-magenta/40 bg-gradient-to-r from-magenta/5 to-purple-500/5 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-magenta/10 rounded-2xl text-magenta border border-magenta/20">
                <QrCode className="h-8 w-8" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                  Campus Check-in QR Token
                  <Badge className="bg-emerald-500 text-white text-[10px]">VERIFIED PRESENT</Badge>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Show this pass to your GrowthCraft Campus Mentor for offline check-in and attendance verification.
                </p>
                <div className="mt-2 font-mono text-sm font-bold tracking-widest text-magenta bg-white border border-border px-3 py-1 rounded-lg inline-block shadow-sm">
                  GC-HACK-2026-8942
                </div>
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

      {/* Main Grid: Status & Submission + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Attendance Status, Schedule & Submission Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Attendance & Student Participation Card */}
          <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-500" />
                <h2 className="text-lg font-bold text-foreground">Attendance & Participation Status</h2>
              </div>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-0.5">
                Attended (Day 1 & Day 2)
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-muted-foreground block font-medium">Attendance Record</span>
                <span className="text-sm font-bold text-emerald-600 flex items-center gap-1 mt-1">
                  <CheckCircle2 className="h-4 w-4" /> Marked Present
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-muted-foreground block font-medium">Campus Mentor</span>
                <span className="text-sm font-bold text-foreground mt-1 block">Prof. R. Sharma</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xs text-muted-foreground block font-medium">Team Role</span>
                <span className="text-sm font-bold text-foreground mt-1 block">Lead Developer</span>
              </div>
            </div>
          </Card>

          {/* Hackathon Milestones & Phase Schedule */}
          <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-magenta" />
                <h2 className="text-lg font-bold text-foreground">Hackathon Timeline & Milestones</h2>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">Phase 3 of 5 Active</span>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pt-2 pb-1">
              
              {/* Phase 1 */}
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100" />
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Phase 1: Student Check-in & Orientation</h3>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Completed
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Venue check-in, team formation, and welcome address by mentors.</p>
              </div>

              {/* Phase 2 */}
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-0.5 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100" />
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Phase 2: Problem Statement & Track Announcement</h3>
                  <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Released
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Tracks: EdTech Innovation, Smart Campus AI, and Sustainability Tech.</p>
              </div>

              {/* Phase 3 */}
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-0.5 h-4 w-4 rounded-full bg-magenta border-2 border-white ring-4 ring-magenta/20 animate-pulse" />
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-magenta">Phase 3: Mentorship Checkpoints & Build Phase</h3>
                  <Badge variant="outline" className="bg-magenta/10 text-magenta border-magenta/20 text-[10px]">
                    IN PROGRESS
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">1:1 mentor code reviews, architecture guidance, and mid-way check.</p>
              </div>

              {/* Phase 4 */}
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-0.5 h-4 w-4 rounded-full bg-slate-300 border-2 border-white" />
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700">Phase 4: Code & Demo Submission</h3>
                  <span className="text-xs text-slate-500 font-medium">Due June 26, 04:00 PM</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Submit your GitHub link, live demo URL, and project summary below.</p>
              </div>

              {/* Phase 5 */}
              <div className="relative pl-6">
                <span className="absolute -left-[9px] top-0.5 h-4 w-4 rounded-full bg-slate-300 border-2 border-white" />
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700">Phase 5: Final Evaluation & Winners Announcement</h3>
                  <span className="text-xs text-slate-500 font-medium">June 26, 05:30 PM</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Campus jury evaluation, live team pitches, and prize distribution.</p>
              </div>

            </div>
          </Card>

          {/* Project Submission Workspace Form */}
          <Card id="submission-form" className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-magenta" />
                <div>
                  <h2 className="text-lg font-bold text-foreground">Project Submission Workspace</h2>
                  <p className="text-xs text-muted-foreground">Keep your team repository and demo URL updated for mentor review.</p>
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
                  You can update your submission details anytime before the final deadline.
                </p>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-magenta hover:bg-magenta/90 text-white font-medium rounded-xl px-6 flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? "Saving..." : "Update Submission"}
                </Button>
              </div>
            </form>
          </Card>

        </div>

        {/* Right Column: Mentors, Resources & Certificate */}
        <div className="space-y-6">
          
          {/* Assigned Campus Mentors */}
          <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-magenta" />
              <h2 className="text-lg font-bold text-foreground">Assigned Hackathon Mentors</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-magenta/10 text-magenta font-bold flex items-center justify-center text-sm border border-magenta/20">
                    RS
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Prof. R. Sharma</h4>
                    <p className="text-xs text-muted-foreground">Full-Stack & Cloud Mentor</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg border-magenta/30 text-magenta hover:bg-magenta/10">
                  <MessageSquare className="h-3.5 w-3.5 mr-1" /> Ask
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/10 text-indigo-600 font-bold flex items-center justify-center text-sm border border-indigo-500/20">
                    AK
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Ananya Kapoor</h4>
                    <p className="text-xs text-muted-foreground">AI & System Design Specialist</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg border-magenta/30 text-magenta hover:bg-magenta/10">
                  <MessageSquare className="h-3.5 w-3.5 mr-1" /> Ask
                </Button>
              </div>
            </div>
          </Card>

          {/* Hackathon Resources & Starter Kits */}
          <Card className="p-6 rounded-2xl border border-border bg-white shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-magenta" />
              <h2 className="text-lg font-bold text-foreground">Event Resources & Links</h2>
            </div>
            
            <div className="space-y-2 text-sm">
              <a 
                href="https://github.com/growthcraft-template" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-magenta/40 hover:bg-slate-50 transition-all text-foreground group"
              >
                <span className="flex items-center gap-2 font-medium">
                  <Github className="h-4 w-4 text-slate-600 group-hover:text-magenta" />
                  GrowthCraft Starter Template
                </span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-magenta" />
              </a>

              <a 
                href="#rules" 
                onClick={(e) => { e.preventDefault(); toast.info("Rules & judging criteria: Innovation (30%), Code Quality (30%), UX (20%), Pitch (20%)"); }}
                className="flex items-center justify-between p-3 rounded-xl border border-border hover:border-magenta/40 hover:bg-slate-50 transition-all text-foreground group"
              >
                <span className="flex items-center gap-2 font-medium">
                  <HelpCircle className="h-4 w-4 text-slate-600 group-hover:text-magenta" />
                  Judging Criteria & Rules
                </span>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-magenta" />
              </a>
            </div>
          </Card>

          {/* Certificate of Participation */}
          <Card className="p-6 rounded-2xl border border-border bg-gradient-to-br from-amber-500/5 to-magenta/5 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-foreground">Event Certificate</h2>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your official Certificate of Participation will be issued automatically upon final project submission and mentor check-in.
            </p>
            <Button 
              onClick={() => toast.success("Certificate will be downloadable upon event conclusion!")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 mt-2"
            >
              <Download className="h-4 w-4" />
              Download Certificate
            </Button>
          </Card>

        </div>

      </div>
    </div>
  );
}
