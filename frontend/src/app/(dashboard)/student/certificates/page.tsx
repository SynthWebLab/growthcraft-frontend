"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { PanelEmptyState } from "@/components/panel";
import { Award, Download, Linkedin } from "lucide-react";

const certificates = [
  {
    id: "1",
    courseTitle: "UI/UX Design Fundamentals",
    completionDate: "Mar 15, 2026",
    credentialId: "GC-UX-2026-001",
    grade: "A+",
  },
  {
    id: "2",
    courseTitle: "HTML & CSS Mastery",
    completionDate: "Jan 28, 2026",
    credentialId: "GC-HTML-2026-002",
    grade: "A",
  },
];

export default function StudentCertificatesPage() {
  if (certificates.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Certificates"
          description="Your earned certifications and achievements"
        />
        <PanelEmptyState
          icon={<Award className="h-12 w-12" />}
          title="No certificates yet"
          description="Complete a course to earn your first certificate!"
          action={
            <Button className="bg-magenta text-white hover:bg-magenta/90">
              Browse Courses
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Certificates"
        description="Your earned certifications and achievements"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {certificates.map((cert) => (
          <DataCard key={cert.id}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-magenta/10 shrink-0">
                <Award className="h-8 w-8 text-magenta" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-foreground">
                  {cert.courseTitle}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Completed: {cert.completionDate}
                </p>
                <p className="text-xs text-muted-foreground">
                  ID: {cert.credentialId}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="secondary"
                    className="bg-success/10 text-success"
                  >
                    Grade: {cert.grade}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    className="bg-magenta text-white hover:bg-magenta/90"
                  >
                    <Download className="h-3.5 w-3.5 mr-1.5" /> Download PDF
                  </Button>
                  <Button size="sm" variant="outline">
                    <Linkedin className="h-3.5 w-3.5 mr-1.5" /> Share
                  </Button>
                </div>
              </div>
            </div>
          </DataCard>
        ))}
      </div>
    </div>
  );
}
