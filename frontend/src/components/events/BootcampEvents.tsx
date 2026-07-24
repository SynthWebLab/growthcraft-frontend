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
import { BootcampEventCard } from "@/components/events/BootcampEventCard";
import { useBootcamps } from "@/hooks/queries/useBootcamps";
import {
  BOOTCAMP_FILTER_STATUSES,
  BOOTCAMP_MODES,
  type Bootcamp,
  type BootcampQueryParams,
} from "@/types/bootcamp";
import { FormType } from "@/lib/ctaPolicy";

interface BootcampEventsProps {
  onOpenForm: (
    type: FormType | "enquiry" | "mentor" | "partner",
    title?: string,
    courseIdParam?: string,
    courseTitleParam?: string,
    itemTypeParam?: "course" | "workshop" | "bootcamp"
  ) => void;
  enabled?: boolean;
}

const ITEMS_PER_PAGE = 10;

export function BootcampEvents({ onOpenForm, enabled = true }: BootcampEventsProps) {
  const [bootcampMode, setBootcampMode] = useState<(typeof BOOTCAMP_MODES)[number] | null>(null);
  const [bootcampStatus, setBootcampStatus] = useState<(typeof BOOTCAMP_FILTER_STATUSES)[number] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const queryParams: BootcampQueryParams = {
    limit: ITEMS_PER_PAGE,
    page: currentPage,
    mode: bootcampMode ?? undefined,
    status: bootcampStatus ?? undefined,
  };

  const { data: bootcampsData, isLoading, error, refetch } = useBootcamps(queryParams, enabled);

  const rawBootcamps = bootcampsData?.items || [];
  const bootcamps = [...rawBootcamps].sort((a: any, b: any) => {
    const aFeatured = a.isFeatured || a.is_featured ? 1 : 0;
    const bFeatured = b.isFeatured || b.is_featured ? 1 : 0;
    if (bFeatured !== aFeatured) {
      return bFeatured - aFeatured;
    }
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
  const pagination = bootcampsData?.pagination;
  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.total ?? 0;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  const openBootcampForm = (bootcamp: Bootcamp, type: "reserve-seat" | "callback") => {
    const label = type === "reserve-seat" ? bootcamp.primaryCTA || "Reserve Seat" : bootcamp.secondaryCTA || "Request Callback";
    onOpenForm(type, `${label} - ${bootcamp.title}`, bootcamp.id, bootcamp.title, "bootcamp");
  };

  const handleBootcampCTA = (bootcamp: Bootcamp) => {
    if (bootcamp.primaryCTA.toLowerCase().includes("reserve")) {
      openBootcampForm(bootcamp, "reserve-seat");
      return;
    }

    openBootcampForm(bootcamp, "callback");
  };

  const clearBootcampFilters = () => {
    setBootcampMode(null);
    setBootcampStatus(null);
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

  if (isLoading && !bootcamps.length) {
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
          <p className="text-danger mb-4">Failed to load bootcamps. Please try again.</p>
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
            Live Bootcamps
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            Intensive, mentor-led programs designed to make you job-ready in weeks.
          </p>
        </div>

        <EventFilters
          groups={[
            {
              selected: bootcampMode,
              options: BOOTCAMP_MODES.map((mode) => ({
                value: mode,
                label: mode,
              })),
              onChange: (value) => {
                setBootcampMode(value as (typeof BOOTCAMP_MODES)[number] | null);
                setCurrentPage(1);
              },
            },
            {
              selected: bootcampStatus,
              options: BOOTCAMP_FILTER_STATUSES.map((status) => ({
                value: status,
                label: status,
              })),
              onChange: (value) => {
                setBootcampStatus(value as (typeof BOOTCAMP_FILTER_STATUSES)[number] | null);
                setCurrentPage(1);
              },
            },
          ]}
          onClearAll={clearBootcampFilters}
        />
        <div className="text-sm text-muted-foreground">
          Showing {bootcamps.length} of {totalItems} bootcamp{totalItems !== 1 ? "s" : ""}
          {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
        </div>
      </EventSection>

      {bootcamps.length > 0 ? (
        bootcamps.map((bootcamp, i) => (
          <EventSection key={bootcamp.id} variant={i % 2 === 0 ? "white" : "marble"}>
            <BootcampEventCard
              bootcamp={bootcamp}
              onPrimaryCTAClick={handleBootcampCTA}
              onSecondaryCTAClick={() => openBootcampForm(bootcamp, "callback")}
            />
          </EventSection>
        ))
      ) : (
        <EventSection variant="white">
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              No upcoming bootcamps match the current filters.
            </p>
            <Button variant="outline" onClick={clearBootcampFilters}>
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
