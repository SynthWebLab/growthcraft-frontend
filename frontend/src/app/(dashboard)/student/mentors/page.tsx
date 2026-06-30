"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import { Users, Star, Linkedin, Globe } from "lucide-react";
import { useStudentMentors } from "@/hooks/queries/useStudent";
import { PanelEmptyState } from "@/components/panel";

export default function StudentMentorsPage() {
  const { data: mentorsData, isLoading: mentorsLoading } = useStudentMentors();

  const mentors = useMemo(
    () => mentorsData?.data?.mentors ?? [],
    [mentorsData]
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <PageHeader
        title="Cohort Mentors"
        description="View the expert mentors assigned to your enrolled batches. All mentor sessions are conducted offline during scheduled batch timings."
      />

      {/* Available mentors */}
      <DataCard>
        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-magenta" /> Assigned Mentors
        </h3>
        
        {mentorsLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-40 rounded-lg border border-border bg-white animate-pulse" />
            ))}
          </div>
        ) : mentors.length === 0 ? (
          <PanelEmptyState
            icon={<Users className="h-12 w-12 text-muted-foreground" />}
            title="No assigned mentors"
            description="You will see assigned mentors once your cohorts start."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor: any) => {
              const name = mentor.userId?.fullName || "Mentor";
              const initials = name.split(" ").map((n: any) => n[0]).join("").slice(0, 2).toUpperCase();

              return (
                <div key={mentor._id} className="rounded-lg border border-border bg-white p-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-magenta/10 flex items-center justify-center text-sm font-bold text-magenta shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-semibold text-foreground truncate">
                            {name}
                          </h4>
                          <p className="text-xs text-muted-foreground truncate">
                            {mentor.areaOfExpertise}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                      <span>{mentor.experienceYears}+ years exp</span>
                      {mentor.currentOrganization && (
                        <span className="truncate">· {mentor.currentOrganization}</span>
                      )}
                    </div>

                    {mentor.bio && (
                      <p className="text-xs text-muted-foreground line-clamp-3 mb-4">
                        {mentor.bio}
                      </p>
                    )}

                    {mentor.specializations && mentor.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {mentor.specializations.map((spec: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-[10px] py-0 px-1.5">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-border/50 mt-auto">
                    {mentor.linkedinUrl && (
                      <a
                        href={mentor.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-blue-600 transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {mentor.portfolioUrl && (
                      <a
                        href={mentor.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-magenta transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DataCard>
    </div>
  );
}
