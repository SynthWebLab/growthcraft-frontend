"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
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
import { useDirectCheckout } from "@/hooks/useDirectCheckout";
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

const ITEMS_PER_PAGE = 9;

export function BootcampEvents({ onOpenForm, enabled = true }: BootcampEventsProps) {
  const { checkout, isProcessing, processingItemId } = useDirectCheckout();
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

  const openBootcampForm = (bootcamp: Bootcamp, type: "callback") => {
    const label = bootcamp.secondaryCTA || "Request Callback";
    onOpenForm(type, `${label} - ${bootcamp.title}`, bootcamp.id, bootcamp.title, "bootcamp");
  };

  const handleBootcampCTA = (bootcamp: Bootcamp) => {
    if (bootcamp.primaryCTA.toLowerCase().includes("reserve") || bootcamp.primaryCTA.toLowerCase().includes("enroll")) {
      checkout({
        itemId: bootcamp.id,
        itemType: "bootcamp",
        itemTitle: bootcamp.title,
        price: bootcamp.price ?? 0,
      });
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
      <Section variant="white">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-magenta mb-4" />
        </div>
      </Section>
    );
  }

  if (error) {
    return (
      <Section variant="white">
        <div className="text-center py-16">
          <p className="text-danger mb-4">Failed to load bootcamps. Please try again.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section variant="white" className="!py-4 sm:!py-6">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
          Live Bootcamps
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
          Intensive, mentor-led programs designed to make you job-ready in weeks.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
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
        {totalItems > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {bootcamps.length} of {totalItems} bootcamp{totalItems !== 1 ? "s" : ""}
            {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
          </div>
        )}
      </div>

      {bootcamps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {bootcamps.map((bootcamp) => (
            <BootcampEventCard
              key={bootcamp.id}
              bootcamp={bootcamp}
              onPrimaryCTAClick={handleBootcampCTA}
              onSecondaryCTAClick={() => openBootcampForm(bootcamp, "callback")}
              isProcessing={isProcessing && processingItemId === bootcamp.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">
            No upcoming bootcamps match the current filters.
          </p>
          <Button variant="outline" onClick={clearBootcampFilters}>
            Clear Filters
          </Button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pt-4 pb-8">
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
        </div>
      )}
    </Section>
  );
}
