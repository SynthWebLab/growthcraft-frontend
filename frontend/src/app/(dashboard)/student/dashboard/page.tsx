"use client";

import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { KpiCard, PanelEmptyState } from "@/components/panel";
import DataCard from "@/components/ui/data-card";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { useStudentDashboard } from "@/hooks/queries/useStudent";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatDate, resolveRef, statusBadge } from "@/lib/student-dashboard.utils";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";
import { toast } from "sonner";

const CountdownTimer = ({ targetDate, labelPrefix }: { targetDate: string | Date; labelPrefix: string }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference <= 0) {
        return "Expired/Started";
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0 || days > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);

      return `${labelPrefix} ${parts.join(" ")}`;
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [targetDate, labelPrefix]);

  if (!timeLeft || timeLeft === "Expired/Started") return null;

  return (
    <span className="inline-flex items-center text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md mt-1 animate-pulse">
      {timeLeft}
    </span>
  );
};

const StudentDashboard = () => {
  const { data, isLoading, isError, refetch } = useStudentDashboard();
  const { data: user } = useCurrentUser();
  const { openCheckout } = useRazorpayCheckout();

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

  const handlePayNow = (
    enrollment: any,
    itemTitle: string,
    itemType: "course" | "bootcamp" | "training-program" | "workshop" | "hackathon"
  ) => {
    let amount = 4999;
    if (itemType === "course") amount = 4999;
    else if (itemType === "training-program") amount = 9999;
    else if (itemType === "workshop") amount = 999;
    else if (itemType === "bootcamp") amount = 4999;

    openCheckout({
      amount,
      itemType: itemType === "course" ? "course" : "bootcamp",
      itemId: enrollment._id,
      title: itemTitle,
      description: `Complete enrollment for ${itemTitle}`,
      prefill: {
        name: user?.fullName || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      onSuccess: (paymentId) => {
        toast.success("Payment completed successfully!");
        refetch();
      },
      onError: (err) => {
        toast.error(err || "Payment failed. Please try again.");
      },
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-0">
      <PageHeader
        title={title}
        description="Track your enrollments and recent activity"
        suppressHydrationWarning
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
      <DataCard className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base sm:text-lg font-bold text-foreground font-display">Recent Courses</h2>
          <Link href="/student/courses">
            <Button variant="ghost" size="sm" className="text-xs">
              View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
        {isLoading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 rounded-xl border border-border bg-white animate-pulse" />
            ))}
          </div>
        ) : recentCourses.length === 0 ? (
          <p className="text-xs sm:text-sm text-muted-foreground">
            No course enrollments yet.{" "}
            <Link href="/courses" className="text-magenta font-medium">
              Browse courses
            </Link>
            .
          </p>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {recentCourses.map((enrollment) => {
              const course = resolveRef(enrollment.courseId);
              const badge = statusBadge(enrollment.status);
              const expiryDate = enrollment.status === "pending"
                ? new Date(new Date(enrollment.enrollmentDate || enrollment.createdAt).getTime() + 24 * 60 * 60 * 1000)
                : null;

              return (
                <div key={enrollment._id} className="flex flex-col justify-between rounded-xl border border-border bg-white p-4">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">📘</span>
                      <Badge variant="secondary" className={`text-[10px] sm:text-xs ${badge.className}`}>
                        {badge.label}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-foreground text-xs sm:text-sm mb-1 leading-snug truncate">
                      {course?.title ?? enrollment.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Enrolled {formatDate(enrollment.enrollmentDate)}
                    </p>
                  </div>
                  {expiryDate && (
                    <div className="mt-3 flex flex-col gap-2">
                      <CountdownTimer targetDate={expiryDate} labelPrefix="Hold expires in" />
                      <button
                        type="button"
                        className="w-full bg-magenta text-white hover:bg-magenta/90 text-[10px] py-1.5 rounded-lg font-bold transition-colors"
                        onClick={() => handlePayNow(enrollment, course?.title ?? enrollment.title, "course")}
                      >
                        Pay Now
                      </button>
                    </div>
                  )}
                  {enrollment.status === "confirmed" && course?.slug && (
                    <div className="mt-3">
                      <Link href={`/student/courses/${course.slug}`}>
                        <button
                          type="button"
                          className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] py-1.5 rounded-lg font-bold transition-colors"
                        >
                          View Workspace
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </DataCard>

      {/* Recent Events */}
      <DataCard className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base sm:text-lg font-bold text-foreground font-display">Recent Events</h2>
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
          <p className="text-xs sm:text-sm text-muted-foreground">
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
              
              const expiryDate = enrollment.status === "pending"
                ? new Date(new Date(enrollment.enrollmentDate || enrollment.createdAt).getTime() + 24 * 60 * 60 * 1000)
                : null;
              
              const eventStartDate = enrollment.status === "confirmed" && (event as any)?.startDate
                ? new Date((event as any).startDate)
                : null;
 
              return (
                <div
                  key={enrollment._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border bg-white p-4"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <CalendarDays className="h-5 w-5 text-magenta shrink-0 mt-0.5 sm:mt-0" />
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                        {event?.title ?? enrollment.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                        {enrollment.eventType} · Enrolled {formatDate(enrollment.enrollmentDate)}
                      </p>
                      {expiryDate && (
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <CountdownTimer targetDate={expiryDate} labelPrefix="Hold expires in" />
                          <button
                            type="button"
                            className="bg-magenta text-white hover:bg-magenta/90 text-[10px] px-2.5 py-1 rounded-md font-bold transition-colors"
                            onClick={() => handlePayNow(enrollment, event?.title ?? enrollment.title, enrollment.eventType.toLowerCase() as any)}
                          >
                            Pay Now
                          </button>
                        </div>
                      )}
                      {eventStartDate && eventStartDate.getTime() > Date.now() && (
                        <CountdownTimer targetDate={eventStartDate} labelPrefix="Starts in" />
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className={`w-fit text-[10px] sm:text-xs shrink-0 ${badge.className}`}>
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
