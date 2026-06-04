"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
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
import { MOCK_HACKATHONS, type Hackathon, getHackathonCTA } from "@/data/events.mock";

interface HackathonEventsProps {
  onOpenForm: (type: string, title: string) => void;
}

const ITEMS_PER_PAGE = 10;
const HACKATHON_MODES = ["Online", "Offline", "Hybrid"] as const;
const HACKATHON_STATUSES = ["Open", "Closed", "Completed"] as const;

export function HackathonEvents({ onOpenForm }: HackathonEventsProps) {
  const [hackathonMode, setHackathonMode] = useState<typeof HACKATHON_MODES[number] | null>(null);
  const [hackathonStatus, setHackathonStatus] = useState<typeof HACKATHON_STATUSES[number] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredHackathons = MOCK_HACKATHONS.filter((hackathon) => {
    if (hackathonMode && hackathon.mode !== hackathonMode) {
      return false;
    }

    if (hackathonStatus && hackathon.status !== hackathonStatus) {
      return false;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredHackathons.length / ITEMS_PER_PAGE));
  const effectivePage = Math.min(currentPage, totalPages);
  const pageItems = filteredHackathons.slice((effectivePage - 1) * ITEMS_PER_PAGE, effectivePage * ITEMS_PER_PAGE);
  const hasNextPage = effectivePage < totalPages;
  const hasPreviousPage = effectivePage > 1;

  const handleHackathonCTA = (hackathon: Hackathon) => {
    const ctaText = getHackathonCTA(hackathon);
    if (ctaText === "Register Interest") {
      onOpenForm("register-interest", `${ctaText} — ${hackathon.title}`);
    } else {
      onOpenForm("callback", `${ctaText} — ${hackathon.title}`);
    }
  };

  const clearHackathonFilters = () => {
    setHackathonMode(null);
    setHackathonStatus(null);
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

  return (
    <>
      <Section variant="white">
        <div className="mb-8">
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
          Showing {pageItems.length} of {filteredHackathons.length} hackathons
          {totalPages > 1 && ` — Page ${effectivePage} of ${totalPages}`}
        </div>
      </Section>

      {pageItems.length > 0 ? (
        pageItems.map((hackathon, i) => (
          <Section key={hackathon.id} variant={i % 2 === 0 ? "white" : "marble"}>
            <HackathonCard hackathon={hackathon} onCTAClick={handleHackathonCTA} />
          </Section>
        ))
      ) : (
        <Section variant="white">
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              No upcoming hackathons match the current filters.
            </p>
            <Button variant="outline" onClick={clearHackathonFilters}>
              Clear Filters
            </Button>
          </div>
        </Section>
      )}

      {totalPages > 1 && (
        <Section variant="white" className="pt-8 pb-12 md:pt-10 md:pb-16">
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
                    isActive={effectivePage === i + 1}
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
        </Section>
      )}
    </>
  );
}
