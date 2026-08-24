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
import { HackathonCard } from "@/components/events/HackathonCard";
import { useHackathons } from "@/hooks/queries/useHackathons";
import { useDirectCheckout } from "@/hooks/useDirectCheckout";
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

const ITEMS_PER_PAGE = 9;
const HACKATHON_MODES = ["Online", "Offline", "Hybrid"] as const;
const HACKATHON_STATUSES = ["Open", "Closed", "Completed"] as const;

export function HackathonEvents({ onOpenForm }: HackathonEventsProps) {
  const { checkout, isProcessing, processingItemId } = useDirectCheckout();
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
      onOpenForm("callback", `${ctaText} - ${hackathon.title}`, hackathon.id, hackathon.title, "hackathon", hackathon.price ?? 0);
      return;
    }

    if (ctaText.toLowerCase().includes("interest")) {
      onOpenForm("register-interest", `${ctaText} - ${hackathon.title}`, hackathon.id, hackathon.title, "hackathon", hackathon.price ?? 0);
      return;
    }

    checkout({
      itemId: hackathon.id,
      itemType: "hackathon",
      itemTitle: hackathon.title,
      price: hackathon.price ?? 0,
    });
  };

  const handleHackathonSecondaryCTA = (hackathon: Hackathon) => {
    const ctaText = hackathon.secondaryCTA || "Request Callback";
    onOpenForm("callback", `${ctaText} - ${hackathon.title}`, hackathon.id, hackathon.title, "hackathon", hackathon.price ?? 0);
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
          <p className="text-danger mb-4">Failed to load hackathons. Please try again.</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section variant="white" className="!py-4 sm:!py-6">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground mb-2">
          Live Hackathons
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
          Competitive, project-driven events where teams build, ship, and showcase ideas fast.
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-6">
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
        {totalItems > 0 && (
          <div className="text-sm text-muted-foreground">
            Showing {pageItems.length} of {totalItems} hackathon{totalItems !== 1 ? "s" : ""}
            {totalPages > 1 && ` - Page ${currentPage} of ${totalPages}`}
          </div>
        )}
      </div>

      {pageItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {pageItems.map((hackathon) => (
            <HackathonCard
              key={hackathon.id}
              hackathon={hackathon}
              onCTAClick={handleHackathonCTA}
              onSecondaryCTAClick={handleHackathonSecondaryCTA}
              isProcessing={isProcessing && processingItemId === hackathon.id}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">
            No upcoming hackathons match the current filters.
          </p>
          <Button variant="outline" onClick={clearHackathonFilters}>
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
