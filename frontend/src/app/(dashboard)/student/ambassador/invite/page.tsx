"use client";

import { useInviteFriends } from "@/hooks/queries/useAmbassador";
import { useCourses } from "@/hooks/queries/useCourses";
import { useEvents } from "@/hooks/queries/useEvents";
import { useTrainingPrograms } from "@/hooks/queries/useTrainingPrograms";
import DataCard from "@/components/ui/data-card";
import { Loader2, Mail, Megaphone, HelpCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AmbassadorInvitePage() {
  const [emailsText, setEmailText] = useState("");
  const [programType, setProgramType] = useState<string>("");
  const [programId, setProgramId] = useState<string>("");

  const { data: coursesData } = useCourses({ limit: 50 });
  const { data: eventsData } = useEvents({ limit: 50 });
  const { data: programsData } = useTrainingPrograms({ limit: 50 });
  const { mutate: sendInvites, isPending } = useInviteFriends();

  const handleSendInvites = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = emailsText
      .split(/[,\n]/)
      .map((email) => email.trim())
      .filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (emails.length === 0) {
      toast.error("Please enter at least one valid email address.");
      return;
    }

    const apiProgramType = (programType === "Workshop" || programType === "Hackathon" || programType === "Bootcamp")
      ? "Bootcamp"
      : programType;

    sendInvites(
      {
        emails,
        programType: apiProgramType || undefined,
        programId: programId || undefined,
      },
      {
        onSuccess: () => {
          setEmailText("");
          setProgramType("");
          setProgramId("");
        },
      }
    );
  };

  const courses = coursesData?.data || [];
  const events = (eventsData as any)?.items || (eventsData as any)?.data || [];
  const trainingPrograms = programsData?.data || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">Invite Friends</h1>
        <p className="text-muted-foreground mt-1">Send invites to college friends and earn rewards when they join.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Form Card */}
        <DataCard className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Mail className="h-5 w-5 text-magenta" /> Send Email Invites
          </h2>

          <form onSubmit={handleSendInvites} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Friend's Email Addresses
              </label>
              <textarea
                value={emailsText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="friend1@college.edu, friend2@gmail.com (Separate with commas or newlines)"
                rows={5}
                disabled={isPending}
                className="w-full rounded-xl border border-slate-200 p-4 text-sm focus:outline-none focus:border-magenta focus:ring-1 focus:ring-magenta font-mono resize-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Recommend Program Type (Optional)
                </label>
                <select
                  value={programType}
                  onChange={(e) => {
                    setProgramType(e.target.value);
                    setProgramId("");
                  }}
                  disabled={isPending}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:border-magenta transition-all bg-white"
                >
                  <option value="">Any Course/Program/Event</option>
                  <option value="Course">Course</option>
                  <option value="TrainingProgram">Training Program</option>
                  <option value="Bootcamp">Bootcamp</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Select Program Name (Optional)
                </label>
                <select
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  disabled={isPending || !programType}
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:border-magenta transition-all bg-white disabled:opacity-50"
                >
                  <option value="">Select recommended program</option>
                  {programType === "Course" &&
                    courses.map((c: any) => (
                      <option key={c._id || c.id} value={c._id || c.id}>
                        {c.title}
                      </option>
                    ))}
                  {programType === "TrainingProgram" &&
                    trainingPrograms.map((p: any) => (
                      <option key={p._id || p.id} value={p._id || p.id}>
                        {p.title}
                      </option>
                    ))}
                  {(programType === "Bootcamp" || programType === "Workshop" || programType === "Hackathon") &&
                    events
                      .filter((b: any) => b.type?.toLowerCase() === programType.toLowerCase())
                      .map((b: any) => (
                        <option key={b.id || b._id || b._id} value={b.id || b._id || b._id}>
                          {b.title}
                        </option>
                      ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="bg-magenta hover:bg-magenta/90 text-white rounded-xl px-6 py-3 font-semibold transition-all flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50 w-full sm:w-auto"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Sending Invites...
                </>
              ) : (
                "Send Invites"
              )}
            </button>
          </form>
        </DataCard>

        {/* Right Info Box */}
        <DataCard variant="dark" className="relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-0 top-0 w-32 h-32 bg-magenta/10 rounded-full blur-2xl -z-10" />
          
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2 text-white">
              <Megaphone className="h-5 w-5 text-magenta" /> How it Works
            </h3>
            
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-magenta/20 text-magenta font-bold shrink-0 text-xs">
                  1
                </span>
                <span>Enter your friends' emails and send them a customized link.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-magenta/20 text-magenta font-bold shrink-0 text-xs">
                  2
                </span>
                <span>Your friends register for free and join their college cohort.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-magenta/20 text-magenta font-bold shrink-0 text-xs">
                  3
                </span>
                <span>Once they enroll in any program, you get a <strong>5% cash commission</strong> directly!</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-slate-400">
            <HelpCircle className="h-4 w-4 text-magenta" /> Need support? Contact campus admin.
          </div>
        </DataCard>
      </div>
    </div>
  );
}
