"use client";

import { use } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Award, 
  CheckCircle, 
  MessageSquare, 
  Clock, 
  ChevronRight,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { useStudentCourseWorkspace } from "@/hooks/queries/useStudent";
import { formatDate } from "@/lib/student-dashboard.utils";
import { Progress } from "@/components/ui/progress";

export default function CourseWorkspacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: workspaceData, isLoading, isError } = useStudentCourseWorkspace(slug);

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg mb-4" />
        <div className="h-24 w-full bg-slate-200 rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-44 bg-slate-200 rounded-2xl" />
            <div className="h-64 bg-slate-200 rounded-2xl" />
          </div>
          <div className="h-96 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !workspaceData?.success) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 px-4">
        <BookOpen className="h-16 w-16 text-magenta mx-auto mb-4 opacity-70" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Workspace Unavailable</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load the workspace for this course. Please verify that your enrollment is active.
        </p>
        <Link href="/student/courses">
          <Button className="bg-magenta text-white hover:bg-magenta/90 rounded-xl px-6 py-2.5 h-auto">
            Back to My Courses
          </Button>
        </Link>
      </div>
    );
  }

  const { course, enrollment, progress, attendance } = workspaceData.data;

  // Attendance threshold colors
  const getAttendanceColor = (pct: number) => {
    if (pct >= 85) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
    if (pct >= 75) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    return "text-rose-500 bg-rose-500/10 border-rose-500/20";
  };

  const getAttendanceProgressColor = (pct: number) => {
    if (pct >= 85) return "bg-emerald-500";
    if (pct >= 75) return "bg-amber-500";
    return "bg-rose-500";
  };

  const totalCurriculumLessons = course?.totalLessons || 0;

  const lessonsCompleted = progress?.attendancePercent
    ? Math.min(totalCurriculumLessons || 24, Math.round((progress.attendancePercent / 100) * (totalCurriculumLessons || 24)))
    : 0;

  const completedPercent = (totalCurriculumLessons || 24) > 0
    ? (lessonsCompleted / (totalCurriculumLessons || 24)) * 100
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-2 md:p-6">
      {/* Back Button */}
      <Link href="/student/courses" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-magenta transition-colors gap-1.5">
        <ArrowLeft className="h-4 w-4" />
        Back to My Courses
      </Link>

      {/* Header Banner Section */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-graphite to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-magenta/10 rounded-full blur-3xl -z-10" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center text-xs font-semibold tracking-wider uppercase text-magenta bg-magenta/10 border border-magenta/20 px-3 py-1 rounded-full mb-3">
              {course.category || "Development"}
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display leading-tight">{course.title}</h1>
            <p className="text-sm text-slate-300 mt-2 flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-magenta shrink-0" />
              Cohort Batch: <span className="font-semibold text-white">{progress?.batchCode || "GC-OFFLINE-BATCH"}</span>
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-xs text-slate-400">Enrollment Status</span>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
              {enrollment.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Workspace Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Middle Column (Metrics, Logs, Remarks) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Overview KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Lessons Completion Card */}
            <Card className="p-5 border border-border bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Lesson Progress</span>
                  <BookOpen className="h-4 w-4 text-magenta" />
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-extrabold text-foreground">{lessonsCompleted}</span>
                  <span className="text-xs text-muted-foreground">/ {totalCurriculumLessons || 24} completed</span>
                </div>
              </div>
              <div className="space-y-1 mt-2">
                <Progress value={completedPercent} className="h-2 bg-slate-100" />
                <p className="text-[10px] text-muted-foreground text-right font-medium">Logged by Mentor</p>
              </div>
            </Card>

            {/* Attendance Score Card */}
            <Card className="p-5 border border-border bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Class Attendance</span>
                  <UserCheck className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-extrabold text-foreground">{progress?.attendancePercent || 0}%</span>
                  <span className="text-xs text-muted-foreground">overall rate</span>
                </div>
              </div>
              <div className="space-y-1 mt-2">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${getAttendanceProgressColor(progress?.attendancePercent || 0)}`}
                    style={{ width: `${progress?.attendancePercent || 0}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-right font-medium">Minimum required 75%</p>
              </div>
            </Card>

            {/* Rubric Score Card */}
            <Card className="p-5 border border-border bg-white shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Rubric Score</span>
                  <Award className="h-4 w-4 text-amber-500" />
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-extrabold text-foreground">{progress?.avgRubricScore || 0}</span>
                  <span className="text-xs text-muted-foreground">/ 100 avg evaluation</span>
                </div>
              </div>
              <div className="space-y-1 mt-2">
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${progress?.avgRubricScore || 0}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-right font-medium">Updated weekly</p>
              </div>
            </Card>

          </div>

          {/* Mentor Feedback remarks */}
          <Card className="p-6 border border-border bg-white shadow-sm relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-magenta/5 rounded-full blur-2xl -z-10" />
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-magenta" />
              <h2 className="text-base font-bold text-foreground font-display">Mentor Performance Feedback</h2>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-700 leading-relaxed italic">
              "{enrollment.notes || "Good work in your practical offline bootcamps! Continue maintaining high attendance levels and submitting assignments on schedule."}"
            </div>
            
            <p className="text-xs text-muted-foreground mt-3 text-right">
              Remarks logged by <span className="font-semibold text-slate-700">GrowthCraft Operations Team</span>
            </p>
          </Card>

          {/* Daily Attendance Tracker List */}
          <Card className="p-6 border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-magenta" />
                <h2 className="text-base font-bold text-foreground font-display">Attendance Log</h2>
              </div>
              <Badge variant="outline" className={`px-2 py-0.5 rounded-md text-[10px] ${getAttendanceColor(progress?.attendancePercent || 0)}`}>
                {progress?.attendancePercent || 0}% Attended
              </Badge>
            </div>

            {attendance.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center italic">
                No offline attendance sessions marked yet for this batch cohort.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
                {attendance.map((log: any) => {
                  const dateLabel = new Date(log.attendanceDate).toLocaleDateString("en-US", {
                    weekday: 'short', 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric'
                  });

                  let statusBadgeStyle = "bg-rose-500/10 text-rose-600 border-rose-500/20";
                  if (log.status === "Present") {
                    statusBadgeStyle = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
                  } else if (log.status === "Late") {
                    statusBadgeStyle = "bg-amber-500/10 text-amber-600 border-amber-500/20";
                  }

                  return (
                    <div key={log._id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2 h-2 rounded-full ${log.status === "Present" ? "bg-emerald-500" : log.status === "Late" ? "bg-amber-500" : "bg-rose-500"}`} />
                        <span className="text-sm font-medium text-slate-700">{dateLabel}</span>
                      </div>
                      <Badge variant="outline" className={`text-[10px] font-bold py-0.5 px-2 rounded-md border ${statusBadgeStyle}`}>
                        {log.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

        </div>

        {/* Right Column: Syllabus Checklist (Offline Context) */}
        <div className="space-y-6">
          <Card className="p-6 border border-border bg-white shadow-sm flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-foreground font-display">Offline Curriculum</h2>
                <Badge variant="secondary" className="bg-magenta/10 text-magenta text-[10px] font-bold">
                  Syllabus
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground mb-4">
                Verify the topics covered during your campus sessions. Keep notes updated in your physically distributed handbook.
              </p>

              {course.curriculum && Array.isArray(course.curriculum) && course.curriculum.length > 0 ? (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                  {course.curriculum.map((section: any, sIdx: number) => (
                    <div key={sIdx} className="space-y-2">
                      <h4 className="text-xs font-bold text-foreground flex items-center gap-1">
                        <span className="text-magenta font-extrabold">Section {sIdx + 1}:</span>
                        {section.sectionTitle}
                      </h4>
                      <ul className="space-y-1.5 pl-3">
                        {section.lessons && Array.isArray(section.lessons) && section.lessons.map((lesson: any, lIdx: number) => {
                          let previousLessonsCount = 0;
                          for (let i = 0; i < sIdx; i++) {
                            previousLessonsCount += course.curriculum[i].lessons?.length || 0;
                          }
                          const globalLessonIndex = previousLessonsCount + lIdx;
                          const isCompleted = globalLessonIndex < lessonsCompleted;

                          return (
                            <li key={lIdx} className="flex items-start justify-between text-xs text-slate-600 gap-2 py-1">
                              <span className="leading-snug truncate">{lesson}</span>
                              {isCompleted ? (
                                <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              ) : (
                                <div className="h-3.5 w-3.5 border border-slate-200 rounded-full shrink-0 mt-0.5" />
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-xs italic">Syllabus checklist details not loaded.</p>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold mb-2">
                <span>Curriculum Chapters</span>
                <span>{course.curriculum?.length || 0} Modules</span>
              </div>
              <p className="text-[10px] text-muted-foreground italic leading-normal">
                Note: All lessons are marked as complete in your dashboard upon attendance verification by your campus mentor.
              </p>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
