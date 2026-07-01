"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { KpiCard, PanelEmptyState } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import { PageHeader } from "@/components/ui/page-header";
import { useActivateAmbassador } from "@/hooks/queries/useAmbassador";
import Link from "next/link";
import { useStudentDashboard } from "@/hooks/queries/useStudent";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatDate, resolveRef, statusBadge } from "@/lib/student-dashboard.utils";

const StudentDashboard = () => {
  const { data, isLoading, isError } = useStudentDashboard();
  const { data: user } = useCurrentUser();

  const dashboard = data?.data;
  const counts = dashboard?.counts;
  const recentCourses = dashboard?.recent?.courses ?? [];
  const recentEvents = dashboard?.recent?.events ?? [];

  const firstName = user?.fullName ? user.fullName.split(" ")[0] : "";
  const title = firstName ? `Welcome back, ${firstName}! 👋` : "Welcome back! 👋";

  const totalEvents =
    (counts?.bootcamps ?? 0) + (counts?.workshops ?? 0) + (counts?.hackathons ?? 0);

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Your learning overview" />
        <PanelEmptyState
          icon={<BookOpen className="h-12 w-12" />}
          title="Couldn't load your dashboard"
          description="Something went wrong. Please refresh and try again."
        />
      </div>
    );
  }

  const { mutate: activateAmbassador, isPending: isActivating } = useActivateAmbassador();

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title={title}
        description="Track your enrollments and recent activity"
        suppressHydrationWarning
      />

      {!user?.isAmbassador && (
        <Card className="p-6 border-none bg-gradient-to-r from-graphite to-slate-900 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="absolute right-0 top-0 w-48 h-48 bg-magenta/10 rounded-full blur-2xl -z-10" />
          <div>
            <h2 className="text-xl font-bold font-display">Become a GrowthCraft Ambassador! 🚀</h2>
            <p className="text-sm text-slate-300 mt-1">Refer your friends to GrowthCraft and earn 5% cash commission on their enrollment fees.</p>
          </div>
          <Button
            onClick={() => activateAmbassador()}
            disabled={isActivating}
            className="bg-magenta hover:bg-magenta/90 text-white font-semibold rounded-xl px-5 py-2.5 h-auto self-start sm:self-auto hover:scale-[1.02] transition-all shrink-0"
          >
            {isActivating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" /> Activating...
              </>
            ) : (
              "Activate Ambassador Mode"
            )}
          </Button>
        </Card>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl border border-border bg-white animate-pulse"
            />
          ))
        ) : (
          <>
            <KpiCard label="Enrolled Courses" value={counts?.courses ?? 0} />
            <KpiCard label="Events" value={totalEvents} />
            <KpiCard label="Training Programs" value={counts?.trainingPrograms ?? 0} />
            <KpiCard label="Certificates" value={counts?.certificates ?? 0} />
          </>
        )}
      </div>

      {/* Recent Courses */}
      <DataCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground font-display">Recent Courses</h2>
          <Link href="/student/courses">
            <Button variant="ghost" size="sm" className="text-xs">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 rounded-xl border border-border bg-white animate-pulse" />
            ))}
          </div>
        ) : recentCourses.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No course enrollments yet.{" "}
            <Link href="/courses" className="text-magenta font-medium">
              Browse courses
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {recentCourses.map((enrollment) => {
              const course = resolveRef(enrollment.courseId);
              const badge = statusBadge(enrollment.status);
              return (
                <div key={enrollment._id} className="rounded-xl border border-border bg-white p-4">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">📘</span>
                    <Badge variant="secondary" className={badge.className}>
                      {badge.label}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-1">
                    {course?.title ?? enrollment.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Enrolled {formatDate(enrollment.enrollmentDate)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </DataCard>

      {/* Recent Events */}
      <DataCard>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-foreground font-display">Recent Events</h2>
          <Link href="/student/bootcamps">
            <Button variant="ghost" size="sm" className="text-xs">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-16 rounded-lg border border-border bg-white animate-pulse" />
            ))}
          </div>
        ) : recentEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No event registrations yet.{" "}
            <Link href="/events" className="text-magenta font-medium">
              Explore events
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-3">
            {recentEvents.map((enrollment) => {
              const event = resolveRef(enrollment.eventId);
              const badge = statusBadge(enrollment.status);
              return (
                <div
                  key={enrollment._id}
                  className="flex items-center gap-4 rounded-lg border border-border bg-white p-4"
                >
                  <CalendarDays className="h-5 w-5 text-magenta shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-foreground truncate">
                      {event?.title ?? enrollment.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {enrollment.eventType} · Enrolled {formatDate(enrollment.enrollmentDate)}
                    </p>
                  </div>
                  <Badge variant="secondary" className={badge.className}>
                    {badge.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </DataCard>
    </div>
  );
};

export default StudentDashboard;
