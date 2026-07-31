"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EventSection } from "@/components/events/EventSection";
import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { EventFilters } from "@/components/events/EventFilters";
import { HackathonCard } from "@/components/events/HackathonCard";
import { useHackathons } from "@/hooks/queries/useHackathons";
import { FormType } from "@/lib/ctaPolicy";
import type { Hackathon, HackathonMode, HackathonStatus } from "@/types/hackathon";

interface HackathonEventsProps {
  onOpenForm: (
    type: FormType | "enquiry" | "mentor" | "partner",
    title?: string,
    courseIdParam?: string,
    courseTitleParam?: string,
    itemTypeParam?: "course" | "workshop" | "hackathon",
    priceParam?: number
  ) => void;
}

const ITEMS_PER_PAGE = 10;
const HACKATHON_MODES = ["Online", "Offline", "Hybrid"] as const;
const HACKATHON_STATUSES = ["Open", "Closed", "Completed"] as const;

export function HackathonEvents({ onOpenForm }: HackathonEventsProps) {
  const [hackathonMode, setHackathonMode] = useState<typeof HACKATHON_MODES[number] | null>(null);
  const [hackathonStatus, setHackathonStatus] = useState<typeof HACKATHON_STATUSES[number] | null>("Open");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, refetch } = useHackathons({
    limit: ITEMS_PER_PAGE,
    page: currentPage,
    mode: hackathonMode as HackathonMode | undefined,
    status: hackathonStatus as HackathonStatus | undefined,
  });

  const rawItems = data?.items || [];
  const pageItems = [...rawItems].sort((a: any, b: any) => {
    const aFeatured = a.isFeatured || a.is_featured ? 1 : 0;
    const bFeatured = b.isFeatured || b.is_featured ? 1 : 0;
    if (bFeatured !== aFeatured) {
      return bFeatured - aFeatured;
    }
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
  const totalItems = data?.pagination.total || 0;
  const totalPages = data?.pagination.totalPages || 1;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const handleHackathonCTA = (hackathon: Hackathon) => {
    const ctaText = hackathon.primaryCTA || "Register Now";

    if (ctaText.toLowerCase().includes("callback")) {
      onOpenForm("callback", `${ctaText} - ${hackathon.title}`, hackathon.id, hackathon.title, "hackathon", hackathon.price || 499);
      return;
    }

    if (ctaText.toLowerCase().includes("interest")) {
      onOpenForm("register-interest", `${ctaText} - ${hackathon.title}`, hackathon.id, hackathon.title, "hackathon", hackathon.price || 499);
      return;
    }

    onOpenForm("reserve-seat", `${ctaText} - ${hackathon.title}`, hackathon.id, hackathon.title, "hackathon", hackathon.price || 499);
  };

  const handleHackathonSecondaryCTA = (hackathon: Hackathon) => {
    const ctaText = hackathon.secondaryCTA || "Request Callback";
    onOpenForm("callback", `${ctaText} - ${hackathon.title}`, hackathon.id, hackathon.title, "hackathon", hackathon.price || 499);
  };

  const clearHackathonFilters = () => {
    setHackathonMode(null);
    setHackathonStatus("Open");
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading && !pageItems.length) {
    return (
      <EventSection variant="white">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-magenta" />
        </div>
      </EventSection>
    );
  }

  if (error) {
    return (
      <EventSection variant="white">
        <div className="text-center py-16">
          <p className="text-danger mb-4">Failed to load hackathons. Please try again.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </EventSection>
    );
  }

  return (
    <>
      <EventSection variant="white">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">
            Live Hackathons
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Competitive, project-driven events where teams build, ship, and showcase ideas fast.
          </p>
        </div>

        <EventFilters
          groups={[
            {
              selected: hackathonMode,
              options: HACKATHON_MODES.map((mode) => ({
                value: mode,
                label: mode,
              })),
              onChange: (value) => {
                setHackathonMode(value as typeof HACKATHON_MODES[number] | null);
                setCurrentPage(1);
              },
            },
            {
              selected: hackathonStatus,
              options: HACKATHON_STATUSES.map((status) => ({
                value: status,
                label: status,
              })),
              onChange: (value) => {
                setHackathonStatus(value as typeof HACKATHON_STATUSES[number] | null);
                setCurrentPage(1);
              },
            },
          ]}
          onClearAll={clearHackathonFilters}
        />
        <div className="text-sm text-muted-foreground">
          Showing {pageItems.length} of {totalItems} hackathons
          {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
        </div>
      </EventSection>

      {pageItems.length > 0 ? (
        pageItems.map((hackathon, i) => (
          <EventSection key={hackathon.id} variant={i % 2 === 0 ? "white" : "marble"}>
            <HackathonCard
              hackathon={hackathon}
              onCTAClick={handleHackathonCTA}
              onSecondaryCTAClick={handleHackathonSecondaryCTA}
            />
          </EventSection>
        ))
      ) : (
        <EventSection variant="white">
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              No upcoming hackathons match the current filters.
            </p>
            <Button variant="outline" onClick={clearHackathonFilters}>
              Clear Filters
            </Button>
          </div>
        </EventSection>
      )}

      {totalPages > 1 && (
        <EventSection variant="white" className="pt-8 pb-12 md:pt-10 md:pb-16">
          <Pagination>
            <PaginationContent>
              {hasPreviousPage && (
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePreviousPage();
                    }}
                  />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {hasNextPage && (
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNextPage();
                    }}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </EventSection>
      )}
    </>
  );
}
