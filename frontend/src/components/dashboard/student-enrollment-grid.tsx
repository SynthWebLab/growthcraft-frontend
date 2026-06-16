"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { PanelEmptyState } from "@/components/panel";
import { Calendar } from "lucide-react";
import { formatDate, statusBadge } from "@/lib/student-dashboard.utils";
import type { EnrollmentStatus } from "@/types/student";

export interface EnrollmentGridItem {
  id: string;
  title: string;
  subtitle?: string;
  status: EnrollmentStatus;
  enrollmentDate: string;
  href?: string;
  emoji?: string;
}

interface StudentEnrollmentGridProps {
  pageTitle: string;
  pageDescription: string;
  items: EnrollmentGridItem[];
  isLoading: boolean;
  isError: boolean;
  icon: React.ReactNode;
  emptyTitle: string;
  emptyDescription: string;
  browseHref?: string;
  browseLabel?: string;
}

function StudentEnrollmentGridContent({
  pageTitle,
  pageDescription,
  items,
  isLoading,
  isError,
  icon,
  emptyTitle,
  emptyDescription,
  browseHref,
  browseLabel = "Browse",
}: StudentEnrollmentGridProps) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(q.toLowerCase()) ||
    (item.subtitle && item.subtitle.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader title={pageTitle} description={pageDescription} />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl border border-border bg-white animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <PanelEmptyState
          icon={icon}
          title="Couldn't load your data"
          description="Something went wrong. Please refresh and try again."
        />
      ) : items.length === 0 ? (
        <PanelEmptyState
          icon={icon}
          title={emptyTitle}
          description={emptyDescription}
          action={
            browseHref ? (
              <Link href={browseHref}>
                <Button className="bg-magenta text-white hover:bg-magenta/90">
                  {browseLabel}
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : filteredItems.length === 0 ? (
        <PanelEmptyState
          icon={icon}
          title="No results found"
          description={`We couldn't find any matches for "${q}".`}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredItems.map((item) => {
            const badge = statusBadge(item.status);
            return (
              <DataCard key={item.id}>
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">{item.emoji ?? "🎓"}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    {item.subtitle && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                    <Badge variant="secondary" className={`mt-2 ${badge.className}`}>
                      {badge.label}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-marble border border-border">
                  <Calendar className="h-4 w-4 text-magenta" />
                  <p className="text-sm text-foreground">
                    Enrolled {formatDate(item.enrollmentDate)}
                  </p>
                  {item.href && (
                    <Link href={item.href} className="ml-auto">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </Link>
                  )}
                </div>
              </DataCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function StudentEnrollmentGrid(props: StudentEnrollmentGridProps) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <PageHeader title={props.pageTitle} description={props.pageDescription} />
          <div className="grid gap-4 md:grid-cols-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="h-32 rounded-xl border border-border bg-white animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <StudentEnrollmentGridContent {...props} />
    </Suspense>
  );
}

export default StudentEnrollmentGrid;
