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
import { WorkshopCard } from "@/components/events/WorkshopCard";
import { useWorkshops } from "@/hooks/queries/useWorkshops";
import { useDirectCheckout } from "@/hooks/useDirectCheckout";
import { FormType } from "@/lib/ctaPolicy";
import type { Workshop, WorkshopMode, WorkshopStatus } from "@/types/workshop";

interface WorkshopEventsProps {
  onOpenForm: (
    type: FormType | "enquiry" | "mentor" | "partner",
    title?: string,
    courseIdParam?: string,
    courseTitleParam?: string,
    itemTypeParam?: "course" | "workshop",
    priceParam?: number
  ) => void;
}

const ITEMS_PER_PAGE = 9;
const WORKSHOP_MODES = ["Online", "Offline", "Hybrid"] as const;
const WORKSHOP_STATUSES = ["Open", "Closed", "Completed"] as const;

export function WorkshopEvents({ onOpenForm }: WorkshopEventsProps) {
  const { checkout, isProcessing, processingItemId } = useDirectCheckout();
  const [workshopMode, setWorkshopMode] = useState<(typeof WORKSHOP_MODES)[number] | null>(null);
  const [workshopStatus, setWorkshopStatus] = useState<(typeof WORKSHOP_STATUSES)[number] | null>("Open");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, refetch } = useWorkshops({
    limit: ITEMS_PER_PAGE,
    page: currentPage,
    mode: workshopMode as WorkshopMode | undefined,
    status: workshopStatus as WorkshopStatus | undefined,
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

  const handleWorkshopCTA = (workshop: Workshop) => {
    const ctaText = workshop.primaryCTA || "Reserve Seat";

    if (ctaText.toLowerCase().includes("callback")) {
      onOpenForm("callback", `${ctaText} - ${workshop.title}`, workshop.id, workshop.title, "workshop", workshop.price ?? 0);
      return;
    }

    if (ctaText.toLowerCase().includes("interest")) {
      onOpenForm("register-interest", `${ctaText} - ${workshop.title}`, workshop.id, workshop.title, "workshop", workshop.price ?? 0);
      return;
    }

    checkout({
      itemId: workshop.id,
      itemType: "workshop",
      itemTitle: workshop.title,
      price: workshop.price ?? 0,
    });
  };

  const handleWorkshopSecondaryCTA = (workshop: Workshop) => {
    const ctaText = workshop.secondaryCTA || "Request Callback";
    onOpenForm("callback", `${ctaText} - ${workshop.title}`, workshop.id, workshop.title, "workshop", workshop.price ?? 0);
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
          <p className="text-danger mb-4">Failed to load workshops. Please try again.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section variant="white" className="!py-4 sm:!py-6">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
          Live Workshops
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
          Hands-on sessions designed to build practical skills and help you ship faster.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
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
        {totalItems > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {pageItems.length} of {totalItems} workshop{totalItems !== 1 ? "s" : ""}
            {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
          </div>
        )}
      </div>

      {pageItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pageItems.map((workshop) => (
            <WorkshopCard
              key={workshop.id}
              workshop={workshop}
              onCTAClick={handleWorkshopCTA}
              onSecondaryCTAClick={handleWorkshopSecondaryCTA}
              isProcessing={isProcessing && processingItemId === workshop.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">
            No upcoming workshops match the current filters.
          </p>
          <Button variant="outline" onClick={clearWorkshopFilters}>
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
