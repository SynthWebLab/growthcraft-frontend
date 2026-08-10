"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { PanelEmptyState } from "@/components/panel";
import { Award, Download } from "lucide-react";
import { useStudentCertificates } from "@/hooks/queries/useStudent";
import { formatDate } from "@/lib/student-dashboard.utils";

export default function StudentCertificatesPage() {
  const { data, isLoading, isError } = useStudentCertificates();
  const certificates = data?.data?.certificates ?? [];

  return (
    <div className="space-y-6 p-4 sm:p-0">
      <PageHeader
        title="Certificates"
        description="Your earned certifications and achievements"
      />

      {isLoading ? (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl border border-border bg-white animate-pulse"
            />
          ))}
        </div>
      ) : isError ? (
        <PanelEmptyState
          icon={<Award className="h-12 w-12" />}
          title="Couldn't load certificates"
          description="Something went wrong. Please refresh and try again."
        />
      ) : certificates.length === 0 ? (
        <PanelEmptyState
          icon={<Award className="h-12 w-12" />}
          title="No certificates yet"
          description="Complete a course to earn your first certificate!"
          action={
            <Link href="/courses">
              <Button className="bg-magenta text-white hover:bg-magenta/90">
                Browse Courses
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {certificates.map((cert, i) => (
            <DataCard key={`${cert.name}-${i}`} className="p-4 sm:p-6 border-border/60 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 rounded-xl bg-magenta/10 shrink-0">
                  <Award className="h-6 w-6 sm:h-8 sm:w-8 text-magenta" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-foreground truncate">{cert.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Issued by {cert.issuedBy}
                  </p>
                  {cert.issuedDate && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(cert.issuedDate)}
                    </p>
                  )}
                  {cert.certificateUrl && (
                    <div className="flex gap-2 mt-4">
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto"
                      >
                        <Button
                          size="sm"
                          className="bg-magenta text-white hover:bg-magenta/90 text-xs py-1.5 h-8 w-full sm:w-auto"
                        >
                          <Download className="h-3.5 w-3.5 mr-1.5" /> View Certificate
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </DataCard>
          ))}
        </div>
      )}
    </div>
  );
}
