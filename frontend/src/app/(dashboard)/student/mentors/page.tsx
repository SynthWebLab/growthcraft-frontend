"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/ui/page-header";
import DataCard from "@/components/ui/data-card";
import Link from "next/link";
import { Users, Star, Linkedin, Globe, MessageSquare } from "lucide-react";
import { useStudentMentors } from "@/hooks/queries/useStudent";
import { PanelEmptyState } from "@/components/panel";

export default function StudentMentorsPage() {
  const { data: mentorsData, isLoading: mentorsLoading } = useStudentMentors();

  const mentors = useMemo(
    () => mentorsData?.data?.mentors ?? [],
    [mentorsData]
  );

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-0">
      <PageHeader
        title="Cohort Mentors"
        description="View the expert mentors assigned to your enrolled batches. All mentor sessions are conducted offline during scheduled batch timings."
      />

      {/* Available mentors */}
      <DataCard className="p-4 sm:p-6">
        <h3 className="font-bold text-sm sm:text-base text-foreground mb-5 flex items-center gap-2">
          <Users className="h-5 w-5 text-magenta" /> Assigned Mentors
        </h3>
        
        {mentorsLoading ? (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
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
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {mentors.map((mentor: any) => {
              const name = mentor.userId?.fullName || "Mentor";
              const initials = name.split(" ").map((n: any) => n[0]).join("").slice(0, 2).toUpperCase();

              return (
                <div key={mentor._id} className="rounded-lg border border-border bg-white p-4 sm:p-5 flex flex-col justify-between h-full">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-magenta/10 flex items-center justify-center text-xs sm:text-sm font-bold text-magenta shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs sm:text-sm font-semibold text-foreground truncate">
                            {name}
                          </h4>
                          <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                            {mentor.areaOfExpertise}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-[10px] sm:text-xs text-muted-foreground font-medium">
                      <span>{mentor.experienceYears}+ years exp</span>
                      {mentor.currentOrganization && (
                        <span className="truncate">· {mentor.currentOrganization}</span>
                      )}
                    </div>

                    {mentor.bio && (
                      <p className="text-[11px] sm:text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                        {mentor.bio}
                      </p>
                    )}

                    {mentor.specializations && mentor.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {mentor.specializations.map((spec: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-[9px] sm:text-[10px] py-0.5 px-2 hover:bg-muted shadow-none bg-muted text-muted-foreground border-none font-medium">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2.5 pt-3 border-t border-border/50 mt-auto items-center">
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
                    {mentor.userId?._id && (
                      <Link
                        href={`/student/doubt-sessions?userId=${mentor.userId._id}`}
                        className="text-muted-foreground hover:text-magenta transition-colors ml-auto flex items-center gap-1 text-xs font-semibold bg-lavender/35 hover:bg-lavender/50 px-2.5 py-1 rounded-md"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        Chat
                      </Link>
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
