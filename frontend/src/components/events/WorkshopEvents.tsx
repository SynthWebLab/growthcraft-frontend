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
import { WorkshopCard } from "@/components/events/WorkshopCard";
import { useWorkshops } from "@/hooks/queries/useWorkshops";
import { FormType } from "@/lib/ctaPolicy";
import type { Workshop, WorkshopMode, WorkshopStatus } from "@/types/workshop";

interface WorkshopEventsProps {
  onOpenForm: (
    type: FormType | "enquiry" | "mentor" | "partner",
    title?: string,
    courseIdParam?: string,
    courseTitleParam?: string,
    itemTypeParam?: "course" | "workshop"
  ) => void;
}

const ITEMS_PER_PAGE = 10;
const WORKSHOP_MODES = ["Online", "Offline", "Hybrid"] as const;
const WORKSHOP_STATUSES = ["Open", "Closed", "Completed"] as const;

export function WorkshopEvents({ onOpenForm }: WorkshopEventsProps) {
  const [workshopMode, setWorkshopMode] = useState<(typeof WORKSHOP_MODES)[number] | null>(null);
  const [workshopStatus, setWorkshopStatus] = useState<(typeof WORKSHOP_STATUSES)[number] | null>("Open");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, refetch } = useWorkshops({
    limit: ITEMS_PER_PAGE,
    page: currentPage,
    mode: workshopMode as WorkshopMode | undefined,
    status: workshopStatus as WorkshopStatus | undefined,
  });

  const pageItems = data?.items || [];
  const totalItems = data?.pagination.total || 0;
  const totalPages = data?.pagination.totalPages || 1;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const handleWorkshopCTA = (workshop: Workshop) => {
    const ctaText = workshop.primaryCTA || "Reserve Seat";

    if (ctaText.toLowerCase().includes("callback")) {
      onOpenForm("callback", `${ctaText} - ${workshop.title}`, workshop.id, workshop.title, "workshop");
      return;
    }

    if (ctaText.toLowerCase().includes("interest")) {
      onOpenForm("register-interest", `${ctaText} - ${workshop.title}`, workshop.id, workshop.title, "workshop");
      return;
    }

    onOpenForm("reserve-seat", `${ctaText} - ${workshop.title}`, workshop.id, workshop.title, "workshop");
  };

  const handleWorkshopSecondaryCTA = (workshop: Workshop) => {
    const ctaText = workshop.secondaryCTA || "Request Callback";
    onOpenForm("callback", `${ctaText} - ${workshop.title}`, workshop.id, workshop.title, "workshop");
  };

  const clearWorkshopFilters = () => {
    setWorkshopMode(null);
    setWorkshopStatus("Open");
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
          <p className="text-danger mb-4">Failed to load workshops. Please try again.</p>
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
            Live Workshops
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Hands-on sessions designed to build practical skills and help you ship faster.
          </p>
        </div>

        <EventFilters
          groups={[
            {
              selected: workshopMode,
              options: WORKSHOP_MODES.map((mode) => ({
                value: mode,
                label: mode,
              })),
              onChange: (value) => {
                setWorkshopMode(value as (typeof WORKSHOP_MODES)[number] | null);
                setCurrentPage(1);
              },
            },
            {
              selected: workshopStatus,
              options: WORKSHOP_STATUSES.map((status) => ({
                value: status,
                label: status,
              })),
              onChange: (value) => {
                setWorkshopStatus(value as (typeof WORKSHOP_STATUSES)[number] | null);
                setCurrentPage(1);
              },
            },
          ]}
          onClearAll={clearWorkshopFilters}
        />
        <div className="text-sm text-muted-foreground">
          Showing {pageItems.length} of {totalItems} workshops
          {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
        </div>
      </EventSection>

      {pageItems.length > 0 ? (
        pageItems.map((workshop, i) => (
          <EventSection key={workshop.id} variant={i % 2 === 0 ? "white" : "marble"}>
            <WorkshopCard
              workshop={workshop}
              onCTAClick={handleWorkshopCTA}
              onSecondaryCTAClick={handleWorkshopSecondaryCTA}
            />
          </EventSection>
        ))
      ) : (
        <EventSection variant="white">
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              No upcoming workshops match the current filters.
            </p>
            <Button variant="outline" onClick={clearWorkshopFilters}>
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
